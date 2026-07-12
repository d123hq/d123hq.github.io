---
title: "Inference Engineering: Making LLMs Fast on GPU"
description: "A practical deep dive into CUDA architecture, quantization schemes, FlashAttention, KV cache mechanics, and continuous batching — the techniques that separate a naive LLM deployment from a production-grade one."
date: 2026-07-12
tags: ["inference", "CUDA", "GPU", "LLMs", "quantization", "MLOps"]
---

Modern language models are expensive to serve. A naive GPT-style deployment can cost tens of thousands of dollars a month at scale. Inference engineering is the discipline of making that number as small as possible without sacrificing quality. This post is a ground-up walkthrough of the stack — from GPU silicon to serving frameworks.

## GPU Architecture: The Mental Model You Need

Before optimising anything, you need a working model of what a GPU actually is.

A modern GPU (H100, A100, RTX 4090) is a collection of **Streaming Multiprocessors (SMs)**. Each SM contains:

- Thousands of **CUDA cores** that execute arithmetic in parallel
- **Shared memory / L1 cache** (~256 KB per SM on H100) — fast, on-chip, manually managed
- A **warp scheduler** that runs groups of 32 threads in lockstep
- A register file (~65,536 registers per SM) — the fastest memory tier

Global memory (**HBM2e / HBM3**) is large (40–80 GB) but relatively slow. The fundamental tension in GPU programming is **compute vs memory bandwidth**:

| GPU | Peak Compute (BF16) | Memory Bandwidth |
|-----|---------------------|-----------------|
| H100 SXM5 | 989 TFLOP/s | 3.35 TB/s |
| A100 SXM4 | 312 TFLOP/s | 2.0 TB/s |
| RTX 4090 | 330 TFLOP/s | 1.01 TB/s |

Most transformer inference workloads are **memory-bandwidth bound**, not compute bound. Each decoding step requires loading all model weights from HBM once. At 70B parameters in FP16 that is 140 GB of data per forward pass — at 2 TB/s that is 70 ms of memory reads before a single FLOP is counted. This is exactly why quantization is so impactful.

## Quantization

Quantization maps floating-point weights to lower-precision integer representations. The core idea:

```python
def quantize_int8(tensor: torch.Tensor):
    scale = tensor.abs().max() / 127
    quantized = (tensor / scale).round().clamp(-128, 127).to(torch.int8)
    return quantized, scale

def dequantize_int8(quantized, scale):
    return quantized.float() * scale
```

INT8 halves memory bandwidth vs FP16; INT4 reduces it to a quarter. Modern schemes go much further:

**GPTQ** minimises layer-wise reconstruction error using a second-order optimisation (inverse Hessian). Calibrate on a small dataset, then quantize:

```python
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig

quant_config = BaseQuantizeConfig(
    bits=4,
    group_size=128,   # weights grouped into 128-element blocks, one scale per block
    desc_act=False,
)

model = AutoGPTQForCausalLM.from_pretrained(model_id, quant_config)
model.quantize(calibration_dataset)
model.save_quantized("./llama3-8b-gptq-4bit")
```

**AWQ** (Activation-Aware Weight Quantization) identifies which weights are most salient by examining activation magnitudes, then protects those from quantization error. AWQ generally outperforms GPTQ at the same bit-width because it preserves the weights that matter most.

**Practical rule of thumb:**

| Scenario | Recommended precision |
|---|---|
| ≤ 13B params, sufficient VRAM | FP16 / BF16 |
| 30–70B, single node | GPTQ or AWQ INT4 |
| Edge / consumer GPU | GGUF (llama.cpp) |
| Latency-critical, NVIDIA hardware | FP8 via TensorRT-LLM |

One subtlety: quantization affects *weights*, but *activations* remain in FP16 during the forward pass. Weight-only quantization (W4A16) is the sweet spot for latency — you pay the memory bandwidth win but avoid the accuracy hit of quantizing activations too.

## FlashAttention: IO-Aware Exact Attention

Standard attention has quadratic memory complexity and, worse, disastrous memory access patterns:

```python
# Standard attention — naive
def attention_naive(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)   # materialises full (seq, seq) matrix in HBM
    weights = scores.softmax(dim=-1)                      # another HBM read/write
    return weights @ V                                    # another HBM read
```

At sequence length 8,192 the attention matrix is 256 M elements per head. Reading and writing it multiple times to HBM is the bottleneck — not the FLOPs.

**FlashAttention** rewrites this computation to tile over query and key blocks that fit in SRAM, fusing softmax into a single kernel pass using the online softmax algorithm. It never materialises the full attention matrix in HBM:

```python
# PyTorch 2.x uses FlashAttention automatically via scaled_dot_product_attention
import torch.nn.functional as F

with torch.backends.cuda.sdp_kernel(enable_flash=True, enable_math=False):
    output = F.scaled_dot_product_attention(
        query, key, value,
        attn_mask=None,
        dropout_p=0.0,
        is_causal=True,
    )
```

FlashAttention 2 is typically **2–4× faster** than naive attention and uses **5–20× less HBM** on long sequences. For models with context lengths above 4K, it is not optional.

## KV Cache Mechanics

Autoregressive generation recomputes keys and values for every previous token at each step. The fix is to cache them:

```python
class KVCache:
    def __init__(self, max_len, n_heads, head_dim, dtype, device):
        shape = (1, n_heads, max_len, head_dim)
        self.k = torch.zeros(shape, dtype=dtype, device=device)
        self.v = torch.zeros(shape, dtype=dtype, device=device)
        self.pos = 0

    def update(self, k_new, v_new):
        n = k_new.shape[2]
        self.k[:, :, self.pos:self.pos + n] = k_new
        self.v[:, :, self.pos:self.pos + n] = v_new
        self.pos += n
        return self.k[:, :, :self.pos], self.v[:, :, :self.pos]
```

The memory cost is significant. For a 70B model (80 layers, 64 heads, 128 head_dim) serving 8,192 context in FP16:

```
2 × 80 × 64 × 128 × 8192 × 2 bytes ≈ 42 GB
```

That is nearly the entire A100 80 GB budget for KV cache alone — before weights. This is why context length directly competes with batch size for GPU memory, and why **quantizing the KV cache** (to INT8 or even INT4) is an active area of work.

## Continuous Batching

Static batching pads all requests to the longest sequence and processes them together. The problem: a 10-token request and a 1,000-token request must wait for each other, wasting both GPU cycles and memory.

**Continuous batching** (iteration-level batching) batches at each *forward pass* instead. When a request finishes (generates `<eos>`), it is immediately replaced by the next waiting request — no padding needed. vLLM pioneered this with **PagedAttention**, which manages KV cache memory like OS virtual memory: fixed-size pages allocated on demand and freed when the request completes.

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    quantization="awq",
    max_model_len=8192,
    gpu_memory_utilization=0.90,   # leave 10% headroom
    tensor_parallel_size=1,         # set to GPU count for multi-GPU
)

outputs = llm.generate(
    prompts,
    SamplingParams(temperature=0.7, top_p=0.9, max_tokens=512),
)
```

On a single A100, continuous batching with PagedAttention typically achieves **3–5× higher throughput** than naive static batching at the same latency budget.

## Serving Framework Comparison

| Framework | Strengths | When to Use |
|---|---|---|
| **vLLM** | PagedAttention, OpenAI-compatible API, broad model support | Default choice for OSS serving |
| **TensorRT-LLM** | Custom CUDA kernels, FP8, lowest raw latency | Latency-critical on NVIDIA hardware |
| **TGI (HuggingFace)** | HuggingFace ecosystem, simple deploy | Fast prototyping, HF Hub models |
| **llama.cpp** | CPU + quantized GPU, GGUF format | Edge, no-GPU, or consumer hardware |
| **ExLlamaV2** | Aggressive INT4, RTX series optimised | Consumer GPU, quality-conscious |

## Profiling: Find the Bottleneck Before Optimising

```bash
# Throughput benchmark (vLLM)
python -m vllm.entrypoints.benchmark_throughput \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --input-len 512 --output-len 128 --num-prompts 1000

# GPU utilisation live view
nvidia-smi --query-gpu=utilization.gpu,utilization.memory,memory.used,memory.total \
           --format=csv --loop=1

# Kernel-level profiling with Nsight Systems
nsys profile -w true -t cuda,nvtx \
    python inference_script.py
```

Key metrics:

| Metric | What It Measures |
|---|---|
| **Token throughput** (tok/s) | Overall system capacity |
| **Time to first token (TTFT)** | User-perceived latency for interactive use |
| **Time per output token (TPOT)** | Streaming feel |
| **GPU MFU** | Fraction of theoretical peak achieved; 30–50% is realistic |
| **Memory utilisation** | KV cache vs weight ratio |

Common findings: most latency in naive deployments comes not from kernel execution but from CPU-GPU data transfer (model not fully on GPU), small kernel launches with high overhead, or Python-side request queuing. Profile first — the fix is almost never "write a CUDA kernel".

## Speculative Decoding (Bonus)

One technique not covered above but worth knowing: **speculative decoding**. A small draft model generates $k$ tokens in one pass; the large target model verifies them all in parallel (because verification is cheaper than generation). Accepted tokens come for free; rejected tokens fall back to the target model's output. At low temperature (high acceptance rate), this can reduce wall-clock latency by 2–3× with zero accuracy loss.

```python
# HuggingFace implementation
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="meta-llama/Llama-3.1-70B",
    assistant_model="meta-llama/Llama-3.2-1B",  # draft model
    device_map="auto",
)
```

## Where to Go Next

- [FlashAttention paper](https://arxiv.org/abs/2205.14135) — the IO-complexity analysis is worth understanding properly
- [vLLM blog: PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html) — clear explanation of the memory management design
- [GPTQ paper](https://arxiv.org/abs/2210.17323) and [AWQ paper](https://arxiv.org/abs/2306.00978) — the quantization literature is surprisingly readable
- Nsight Systems tutorials — profiling GPU code is a skill that pays off quickly

The gap between a naive deployment and a well-engineered one is typically 10–20× in cost and latency. Most of that gap is accessible with existing open-source tooling — the hard part is knowing where to look.
