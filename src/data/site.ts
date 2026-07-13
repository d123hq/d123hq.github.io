/**
 * Portfolio content — edit this file to update your site.
 * Run `npm run build` (or push to GitHub) to publish changes.
 */
export const site = {

  // ── Identity ──────────────────────────────────────────────────
  name:      'Henry Isaac',
  role:      'Senior AI Engineer & ML Educator',
  available: false,

  typingPhrases: [
    'AI Engineer',
    'ML Educator',
    'Data Scientist',
    'GenAI Practitioner',
  ],

  tagline: 'I build and teach machine learning systems — from production ML pipelines and GenAI applications to data science education at scale.',

  // ── Social links (leave blank to hide) ────────────────────────
  social: {
    github:   'https://github.com/isac-h',
    linkedin: 'https://linkedin.com/in/henryisaac',
    x:        '',
    email:    'henryisaac617@gmail.com',
    kaggle:   '',
  },

  // ── About ─────────────────────────────────────────────────────
  bio: [
    'AI Engineer and educator based in Bengaluru with 6+ years building at the intersection of machine learning, data science, and technical education.',
    'Currently at Great Learning designing and delivering AI programmes. Previously at upGrad as a Data Scientist and later as Assistant Manager leading the DS, ML, and GenAI curriculum portfolio.',
    'Interested in applied GenAI, retrieval-augmented generation, and making complex ML concepts accessible — through writing, notebooks, and hands-on projects.',
  ],

  // ── Skills ────────────────────────────────────────────────────
  skills: [
    { label: 'Languages',          items: ['Python', 'SQL', 'R', 'Bash'] },
    { label: 'ML / Deep Learning', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'HuggingFace', 'XGBoost', 'LightGBM'] },
    { label: 'GenAI & NLP',        items: ['LangChain', 'RAG', 'OpenAI API', 'FAISS', 'Prompt Engineering'] },
    { label: 'Data & Analytics',   items: ['Pandas', 'NumPy', 'Spark', 'Marketing Mix Modeling', 'Data Visualization'] },
    { label: 'MLOps & Cloud',      items: ['Docker', 'MLflow', 'FastAPI', 'AWS', 'Git', 'GitHub Actions'] },
  ],

  // ── Projects ──────────────────────────────────────────────────
  projects: [
    {
      title:  'Project Title One',
      desc:   'What it does, the approach used, and the impact or outcome.',
      tags:   ['PyTorch', 'FastAPI', 'Docker'],
      github: 'https://github.com/',
      demo:   '',
    },
    {
      title:  'Project Title Two',
      desc:   'What it does, the approach used, and the impact or outcome.',
      tags:   ['scikit-learn', 'AWS Lambda', 'SQL'],
      github: 'https://github.com/',
      demo:   '',
    },
    {
      title:  'Project Title Three',
      desc:   'What it does, the approach used, and the impact or outcome.',
      tags:   ['LangChain', 'FAISS', 'Streamlit'],
      github: 'https://github.com/',
      demo:   '',
    },
  ],

  // ── Experience ────────────────────────────────────────────────
  experience: [
    {
      role:     'Senior AI Engineer',
      company:  'Great Learning',
      period:   'Apr 2025 – Present',
      location: 'Bengaluru, India',
      bullets: [
        'Design and deliver advanced AI and ML programmes for working professionals.',
        'Build hands-on curriculum covering LLMs, GenAI, and production ML systems.',
      ],
    },
    {
      role:     'Assistant Manager – Data Science & Machine Learning',
      company:  'upGrad',
      period:   'May 2024 – Apr 2025',
      location: 'Bengaluru, India',
      bullets: [
        'Led development of DS, ML, and GenAI programmes across the upGrad platform.',
        'Oversaw curriculum design for retrieval-augmented generation, data visualisation, and applied ML tracks.',
      ],
    },
    {
      role:     'Data Scientist',
      company:  'upGrad',
      period:   'Mar 2022 – May 2024',
      location: 'Bengaluru, India',
      bullets: [
        'Built and maintained data science models including marketing mix modelling and forecasting pipelines.',
        'Delivered data visualisation frameworks and analytics tooling used across product teams.',
      ],
    },
    {
      role:     'Senior Associate',
      company:  'BYJU\'S',
      period:   'Jul 2019 – Feb 2022',
      location: 'Bengaluru, India',
      bullets: [
        'Led instructional design and curriculum development for STEM and technology courses.',
        'Produced structured learning content at scale for one of India\'s largest edtech platforms.',
      ],
    },
  ],

  // ── Education ─────────────────────────────────────────────────
  education: [
    {
      degree: 'Postgraduate Degree, Machine Learning & AI',
      school: 'International Institute of Information Technology Bangalore',
      period: '',
      notes: [
        'Specialisation in applied ML, deep learning, and communication analytics.',
      ],
    },
    {
      degree: 'MTech, Biomedical Engineering',
      school: 'Motilal Nehru National Institute of Technology',
      period: '',
      notes: [
        'Research focus on signal processing and data analytics for biomedical systems.',
      ],
    },
  ],

  // ── Certifications ────────────────────────────────────────────
  // Add your certifications here — leave url blank until you have the credential link
  certifications: [] as Array<{ name: string; issuer: string; date: string; url: string }>,

  // ── Contact ───────────────────────────────────────────────────
  contactText: 'Open to new opportunities in data science, ML engineering, and applied AI. If you have a role, a project, or just want to talk about data — reach out.',

  // ── Notebooks source ──────────────────────────────────────────
  // .ipynb files are fetched from this GitHub repo at build time.
  // Point 'repo' at a dedicated notebooks repo if you prefer separation.
  notebooksRepo: {
    owner:  'isac-h',
    repo:   'isac-h.github.io',
    branch: 'main',
    path:   'src/content/jupyter',
  },

};

export type SiteConfig = typeof site;
