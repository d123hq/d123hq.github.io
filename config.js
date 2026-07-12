/**
 * Portfolio configuration
 * ─────────────────────────────────────────────────────
 * This is the only file you need to edit to update your
 * portfolio. All sections are driven from this object.
 */

const SITE = {

  // ── Identity ────────────────────────────────────────
  name:      'Your Name',
  role:      'Data Scientist & ML Engineer',
  available: true,   // set false to hide "available" badge

  // Phrases cycled in the hero typing animation
  typingPhrases: [
    'Data Scientist',
    'ML Engineer',
    'NLP Practitioner',
    'MLOps Engineer',
  ],

  tagline: 'I build machine learning systems that convert raw data into reliable decisions — across the full stack from exploration to production.',

  // ── Social / contact ────────────────────────────────
  // Leave a value empty ('') to hide that link everywhere.
  social: {
    email:    '',
    github:   'https://github.com/d123hq',
    linkedin: '',
    kaggle:   '',
  },

  // ── About ───────────────────────────────────────────
  // One string per paragraph.
  bio: [
    'Brief introduction — who you are, your background, and how you got into data science / ML.',
    'What problems you find most interesting and how you approach them.',
    'What you are currently looking for: role type, industry, or the kind of team you want to join.',
  ],

  // ── Skills ──────────────────────────────────────────
  skills: [
    { label: 'Languages',         items: ['Python', 'SQL', 'R', 'Bash'] },
    { label: 'ML / Deep Learning', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'HuggingFace', 'XGBoost', 'LightGBM'] },
    { label: 'Data & Analytics',  items: ['Pandas', 'NumPy', 'Polars', 'Spark', 'dbt', 'Airflow'] },
    { label: 'MLOps & Cloud',     items: ['Docker', 'MLflow', 'FastAPI', 'AWS', 'Git', 'GitHub Actions'] },
  ],

  // ── Projects ────────────────────────────────────────
  // demo: '' → hides the demo link
  projects: [
    {
      title:  'Project Title One',
      desc:   'What it does, the approach used, and why it matters or what impact it had.',
      tags:   ['PyTorch', 'FastAPI', 'Docker'],
      github: 'https://github.com/',
      demo:   '',
    },
    {
      title:  'Project Title Two',
      desc:   'What it does, the approach used, and why it matters or what impact it had.',
      tags:   ['scikit-learn', 'AWS Lambda', 'SQL'],
      github: 'https://github.com/',
      demo:   '',
    },
    {
      title:  'Project Title Three',
      desc:   'What it does, the approach used, and why it matters or what impact it had.',
      tags:   ['LangChain', 'FAISS', 'Streamlit'],
      github: 'https://github.com/',
      demo:   '',
    },
  ],

  // ── Experience ──────────────────────────────────────
  experience: [
    {
      role:     'Data Scientist',
      company:  'Company Name',
      period:   'Jan 2024 – Present',
      location: 'City, Country',
      bullets: [
        'What you worked on and the impact it had.',
        'Key contribution or achievement with a concrete metric.',
        'Tools, techniques, or scale worth highlighting.',
      ],
    },
    {
      role:     'ML Engineer Intern',
      company:  'Company / Lab',
      period:   'Jun 2023 – Dec 2023',
      location: 'Remote',
      bullets: [
        'What you built or contributed to.',
        'Outcome, metric, or learning.',
      ],
    },
  ],

  // ── Education ───────────────────────────────────────
  education: [
    {
      degree: 'BSc / MSc Computer Science',
      school: 'Your University',
      period: '2019 – 2023',
      notes: [
        'Dissertation: brief topic and result.',
        'Relevant modules: Statistical ML, NLP, Data Engineering.',
      ],
    },
  ],

  // ── Contact section text ────────────────────────────
  contactText: 'Open to new opportunities in data science, ML engineering, and applied AI. If you have a role, a project, or just want to talk about data — reach out.',

}
