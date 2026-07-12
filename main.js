/* ── Icons ─────────────────────────────────────────────────────── */
const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,

  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,

  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>`,

  kaggle: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z"/></svg>`,

  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,

  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
}

/* ── Helpers ───────────────────────────────────────────────────── */
function el(tag, cls, html) {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html !== undefined) e.innerHTML = html
  return e
}

function socialLink(href, icon, label) {
  const a = el('a', 'text-zinc-500 hover:text-zinc-200 transition-colors flex items-center justify-center')
  a.href = href
  a.setAttribute('aria-label', label)
  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener')
  a.innerHTML = icon
  return a
}

/* ── Navigation ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
]

function buildNav(listId, itemClass) {
  const list = document.getElementById(listId)
  NAV_ITEMS.forEach(({ label, href }) => {
    const li = el('li')
    const a  = el('a', `sb-link ${itemClass} text-xs text-zinc-500 hover:text-zinc-200 transition-colors py-1 block`)
    a.href = href
    a.textContent = label
    a.dataset.section = href.slice(1)
    li.appendChild(a)
    list.appendChild(li)
  })
}

/* ── Socials ───────────────────────────────────────────────────── */
function buildSocials(containerId) {
  const wrap = document.getElementById(containerId)
  const s    = SITE.social
  if (s.github)   wrap.appendChild(socialLink(s.github,            ICONS.github,   'GitHub'))
  if (s.linkedin) wrap.appendChild(socialLink(s.linkedin,          ICONS.linkedin, 'LinkedIn'))
  if (s.kaggle)   wrap.appendChild(socialLink(s.kaggle,            ICONS.kaggle,   'Kaggle'))
  if (s.email)    wrap.appendChild(socialLink(`mailto:${s.email}`, ICONS.email,    'Email'))
}

/* ── Skills ────────────────────────────────────────────────────── */
function buildSkills() {
  const body = document.getElementById('skills-body')
  SITE.skills.forEach(cat => {
    const row = el('div', 'flex gap-3 text-sm')
    const lbl = el('span', 'mono text-[11px] text-zinc-500 w-36 shrink-0 pt-0.5 leading-relaxed', cat.label)
    const tags = el('div', 'flex flex-wrap gap-1.5')
    cat.items.forEach(item => {
      tags.appendChild(el('span',
        'px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-xs',
        item
      ))
    })
    row.appendChild(lbl)
    row.appendChild(tags)
    body.appendChild(row)
  })
}

/* ── Projects ──────────────────────────────────────────────────── */
function buildProjects() {
  const body = document.getElementById('projects-body')
  SITE.projects.forEach(p => {
    const card = el('div',
      'group p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-default'
    )

    // top row: title + links
    const top = el('div', 'flex items-start justify-between gap-4 mb-2')
    const title = el('h3', 'text-sm font-medium text-zinc-100', p.title)
    const links = el('div', 'flex gap-2 shrink-0 items-center')

    if (p.github) {
      const a = el('a', 'text-zinc-600 hover:text-zinc-300 transition-colors', ICONS.github)
      a.href = p.github
      a.target = '_blank'
      a.rel = 'noopener'
      a.setAttribute('aria-label', 'GitHub')
      links.appendChild(a)
    }
    if (p.demo) {
      const a = el('a', 'text-zinc-600 hover:text-zinc-300 transition-colors', ICONS.external)
      a.href = p.demo
      a.target = '_blank'
      a.rel = 'noopener'
      a.setAttribute('aria-label', 'Live demo')
      links.appendChild(a)
    }

    top.appendChild(title)
    top.appendChild(links)

    const desc = el('p', 'text-zinc-500 text-xs leading-relaxed mb-3', p.desc)

    const tags = el('div', 'flex flex-wrap gap-1.5')
    p.tags.forEach(t => {
      tags.appendChild(el('span', 'px-1.5 py-0.5 rounded text-[10px] mono border border-zinc-800 text-zinc-500', t))
    })

    card.appendChild(top)
    card.appendChild(desc)
    card.appendChild(tags)
    body.appendChild(card)
  })
}

/* ── Experience ────────────────────────────────────────────────── */
function buildExperience() {
  const body = document.getElementById('experience-body')
  SITE.experience.forEach(job => {
    const item = el('div')

    const header = el('div', 'flex items-baseline justify-between gap-4 flex-wrap mb-0.5')
    const left   = el('div')
    const role   = el('p', 'text-sm font-medium text-zinc-100', job.role)
    const co     = el('p', 'text-xs text-violet-400 mt-0.5', job.company)
    left.appendChild(role)
    left.appendChild(co)

    const right = el('div', 'text-right shrink-0')
    right.appendChild(el('p', 'mono text-[11px] text-zinc-500', job.period))
    if (job.location) right.appendChild(el('p', 'mono text-[11px] text-zinc-700', job.location))

    header.appendChild(left)
    header.appendChild(right)

    const bullets = el('ul', 'mt-3 space-y-1.5')
    job.bullets.forEach(b => {
      const li = el('li', 'flex gap-2.5 text-xs text-zinc-400 leading-relaxed')
      li.innerHTML = `<span class="text-zinc-700 mt-1 shrink-0">—</span>${b}`
      bullets.appendChild(li)
    })

    item.appendChild(header)
    item.appendChild(bullets)
    body.appendChild(item)
  })
}

/* ── Education ─────────────────────────────────────────────────── */
function buildEducation() {
  const body = document.getElementById('education-body')
  SITE.education.forEach(ed => {
    const item = el('div')

    const header = el('div', 'flex items-baseline justify-between gap-4 flex-wrap mb-0.5')
    const left   = el('div')
    left.appendChild(el('p', 'text-sm font-medium text-zinc-100', ed.degree))
    left.appendChild(el('p', 'text-xs text-violet-400 mt-0.5', ed.school))

    const right = el('div', 'text-right shrink-0')
    right.appendChild(el('p', 'mono text-[11px] text-zinc-500', ed.period))

    header.appendChild(left)
    header.appendChild(right)

    const notes = el('ul', 'mt-3 space-y-1.5')
    ed.notes.forEach(n => {
      const li = el('li', 'flex gap-2.5 text-xs text-zinc-400 leading-relaxed')
      li.innerHTML = `<span class="text-zinc-700 mt-1 shrink-0">—</span>${n}`
      notes.appendChild(li)
    })

    item.appendChild(header)
    item.appendChild(notes)
    body.appendChild(item)
  })
}

/* ── Typing animation ──────────────────────────────────────────── */
function startTyping() {
  const el   = document.getElementById('hero-typing')
  const list = SITE.typingPhrases
  let pi = 0, ci = 0, deleting = false

  function tick() {
    const phrase = list[pi]
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci)
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return }
    } else {
      el.textContent = phrase.slice(0, --ci)
      if (ci === 0) { deleting = false; pi = (pi + 1) % list.length }
    }
    setTimeout(tick, deleting ? 55 : 95)
  }
  tick()
}

/* ── Scroll reveal ─────────────────────────────────────────────── */
function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'))
      const i = siblings.indexOf(entry.target)
      entry.target.style.transitionDelay = `${i * 70}ms`
      entry.target.classList.add('in')
      obs.unobserve(entry.target)
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal').forEach(e => obs.observe(e))
}

/* ── Active nav on scroll ──────────────────────────────────────── */
function setupActiveNav() {
  const sections = NAV_ITEMS.map(n => document.getElementById(n.href.slice(1))).filter(Boolean)
  const allLinks = document.querySelectorAll('.sb-link')

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      allLinks.forEach(a => {
        a.classList.toggle('active', a.dataset.section === entry.target.id)
      })
    })
  }, { rootMargin: '-40% 0px -55% 0px' })

  sections.forEach(s => obs.observe(s))
}

/* ── Mobile nav ────────────────────────────────────────────────── */
function setupMobileNav() {
  const toggle   = document.getElementById('mb-toggle')
  const menu     = document.getElementById('mb-menu')
  const iconOpen  = document.getElementById('mb-open')
  const iconClose = document.getElementById('mb-close')

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden')
    iconOpen.classList.toggle('hidden', !open)
    iconClose.classList.toggle('hidden', open)
  })

  document.querySelectorAll('#mb-nav a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden')
      iconOpen.classList.remove('hidden')
      iconClose.classList.add('hidden')
    })
  })
}

/* ── Bootstrap ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const s = SITE

  // Meta
  document.getElementById('doc-title').textContent = `${s.name} | ${s.role}`
  document.getElementById('doc-desc').content = s.tagline

  // Sidebar / mobile header
  document.getElementById('sb-name').textContent  = s.name
  document.getElementById('sb-role').textContent  = s.role
  document.getElementById('mb-name').textContent  = s.name
  buildNav('sb-nav', '')
  buildNav('mb-nav', 'block py-2')
  buildSocials('sb-socials')

  // Hero
  if (s.available) document.getElementById('hero-badge').classList.remove('hidden')
  document.getElementById('hero-name').textContent    = s.name
  document.getElementById('hero-tagline').textContent = s.tagline

  const cta = document.getElementById('hero-cta')
  const btnPrimary = el('a', 'px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors', 'View Projects')
  btnPrimary.href = '#projects'
  const btnSecondary = el('a', 'px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-lg transition-colors', 'Download CV')
  btnSecondary.href = 'resume.pdf'
  btnSecondary.download = ''
  cta.appendChild(btnPrimary)
  cta.appendChild(btnSecondary)

  // About
  const aboutBody = document.getElementById('about-body')
  s.bio.forEach(para => aboutBody.appendChild(el('p', '', para)))

  // Skills / Projects / Experience / Education
  buildSkills()
  buildProjects()
  buildExperience()
  buildEducation()

  // Contact
  document.getElementById('contact-body').textContent = s.contactText
  const ctaBtn = document.getElementById('contact-cta')
  if (s.social.email) ctaBtn.href = `mailto:${s.social.email}`
  ctaBtn.innerHTML = 'Get in touch ' + ICONS.arrow
  buildSocials('contact-socials')

  // Footer
  document.getElementById('footer-txt').textContent = `${s.name} · ${new Date().getFullYear()}`

  // Behaviours
  startTyping()
  setupReveal()
  setupActiveNav()
  setupMobileNav()
})
