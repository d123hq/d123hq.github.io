export interface NotebookData {
  slug:        string;
  title:       string;
  description: string;
  date:        Date;
  tags:        string[];
  colabUrl:    string;
  htmlUrl:     string;
  cells:       any[];
  nbformat:    number;
}

interface RepoConfig {
  owner:  string;
  repo:   string;
  branch: string;
  path:   string;
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Module-level cache — Astro SSG runs in one Node process, so this persists
// across getStaticPaths and page renders, avoiding redundant API calls.
let _cache: NotebookData[] | null = null;

export async function getNotebooks(config: RepoConfig): Promise<NotebookData[]> {
  if (_cache) return _cache;

  const { owner, repo, branch, path } = config;
  const token = (import.meta as any).env?.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const dirPath = path || '';
  const apiUrl  = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;

  let files: any[];
  try {
    const res = await fetch(apiUrl, { headers });
    if (!res.ok) {
      console.warn(`[notebooks] GitHub API ${res.status} — ${apiUrl}`);
      _cache = [];
      return [];
    }
    const body = await res.json();
    files = Array.isArray(body) ? body : [];
  } catch (e) {
    console.warn('[notebooks] Failed to list notebooks:', e);
    _cache = [];
    return [];
  }

  const ipynbFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.ipynb'));

  const notebooks = await Promise.all(
    ipynbFiles.map(async (file): Promise<NotebookData | null> => {
      const slug = file.name.replace('.ipynb', '');
      try {
        const res = await fetch(file.download_url as string, { headers });
        const nb  = await res.json();
        const meta: Record<string, any> = nb.metadata ?? {};

        const filePath = dirPath ? `${dirPath}/${file.name}` : file.name;
        const colabUrl = `https://colab.research.google.com/github/${owner}/${repo}/blob/${branch}/${filePath}`;

        return {
          slug,
          title:       meta.title       ?? slugToTitle(slug),
          description: meta.description ?? '',
          date:        meta.date ? new Date(meta.date) : new Date(0),
          tags:        meta.tags         ?? [],
          colabUrl,
          htmlUrl:     file.html_url,
          cells:       nb.cells   ?? [],
          nbformat:    nb.nbformat ?? 4,
        };
      } catch (e) {
        console.warn(`[notebooks] Failed to fetch ${file.name}:`, e);
        return null;
      }
    })
  );

  _cache = notebooks
    .filter((n): n is NotebookData => n !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return _cache;
}

export function clearNotebookCache() {
  _cache = null;
}
