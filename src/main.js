/* ------------------------------------------------------------------
   Set this to your deployed OmniFile Studio URL (no trailing slash).
   Every [data-app] link opens the app; [data-tool="id"] deep-links
   straight to a tool using the app's ?tool= query string.
------------------------------------------------------------------- */
const APP_URL = 'https://omnifile.bankole.xyz';

document.querySelectorAll('[data-app]').forEach((a) => {
  a.href = APP_URL;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});
document.querySelectorAll('[data-tool]').forEach((a) => {
  a.href = `${APP_URL}/?tool=${a.dataset.tool}`;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});
document.getElementById('year').textContent = new Date().getFullYear();

/* ------------------------------------------------------------------
   Mobile navigation menu toggle
------------------------------------------------------------------- */
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuBtn && mobileNav) {
  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : mobileNav.classList.contains('hidden');
    menuBtn.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      mobileNav.classList.remove('hidden');
      menuBtn.innerHTML = '<i data-lucide="x" class="h-5 w-5"></i>';
    } else {
      mobileNav.classList.add('hidden');
      menuBtn.innerHTML = '<i data-lucide="menu" class="h-5 w-5"></i>';
    }
    if (window.lucide) window.lucide.createIcons();
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav anchor link
  mobileNav.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
      toggleMenu(false);
    }
  });

  // Close when tapping outside the menu
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target) && !mobileNav.classList.contains('hidden')) {
      toggleMenu(false);
    }
  });
}

/* ------------------------------------------------------------------
   Hero demo: a miniature of the real workspace that runs a job.
------------------------------------------------------------------- */
const SCENARIOS = [
  {
    id: 'image-studio',
    tab: 'Compress images',
    icon: 'image',
    title: 'Compress & Convert Images',
    blurb: 'Optimize and convert JPG, PNG, WebP, HEIC and ICO.',
    file: { name: 'launch-banner.png', size: '4.2 MB', ext: 'png' },
    options: ['Format: WebP', 'Quality: 80%', 'Max width: 1920 px'],
    action: 'Compress',
    busy: 'Compressing…',
    out: { name: 'launch-banner.webp', note: '91% smaller. Same dimensions, a fraction of the weight.' },
    before: { label: 'Before', size: '4.2 MB', pct: 100 },
    after: { label: 'After', size: '380 KB', pct: 9 },
  },
  {
    id: 'pdf-compress',
    tab: 'Compress PDF',
    icon: 'minimize-2',
    title: 'Compress PDF',
    blurb: 'Reduce PDF size with three presets.',
    file: { name: 'board-deck-scan.pdf', size: '18.4 MB', ext: 'pdf' },
    options: ['Preset: Balanced', 'Strip metadata'],
    action: 'Compress PDF',
    busy: 'Compressing…',
    out: { name: 'board-deck-scan-compressed.pdf', note: '89% smaller. Small enough to attach to an email.' },
    before: { label: 'Before', size: '18.4 MB', pct: 100 },
    after: { label: 'After', size: '2.1 MB', pct: 11 },
  },
  {
    id: 'doc-studio',
    tab: 'DOCX ↔ PDF',
    icon: 'file-spreadsheet',
    title: 'DOCX ↔ PDF',
    blurb: 'Convert between Word and PDF.',
    file: { name: 'Q3-report.docx', size: '612 KB', ext: 'docx' },
    options: ['Word → PDF'],
    action: 'Convert to PDF',
    busy: 'Converting…',
    out: { name: 'Q3-report.pdf', note: 'Converted to a print-ready PDF.' },
    before: { label: 'DOCX', size: '612 KB', pct: 100 },
    after: { label: 'PDF', size: '288 KB', pct: 47 },
  },
  {
    id: 'ocr-studio',
    tab: 'OCR text',
    icon: 'scan-text',
    title: 'OCR Text Extractor',
    blurb: 'Pull text from images and scanned PDFs.',
    file: { name: 'receipt-scan.jpg', size: '1.8 MB', ext: 'jpg' },
    options: ['Language: English'],
    action: 'Extract text',
    busy: 'Reading…',
    out: { name: 'receipt-scan.txt', note: 'Text extracted. Edit it, copy it, or download as TXT or Word.' },
    preview: ['CORNER BAKERY  #204', '2 × Flat white      7.00', 'Almond croissant    4.50', 'TOTAL              11.50'],
  },
];

const EXT_STYLE = {
  png: 'bg-amber-400/15 text-amber-300',
  jpg: 'bg-amber-400/15 text-amber-300',
  pdf: 'bg-rose-400/15 text-rose-300',
  docx: 'bg-sky-400/15 text-sky-300',
};

const tabsEl = document.getElementById('demo-tabs');
const panelEl = document.getElementById('demo-panel');
const urlEl = document.getElementById('demo-url');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let current = 0;
let timers = [];
let autoplay = !reduceMotion;

const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const icons = () => window.lucide && window.lucide.createIcons();

function renderTabs() {
  tabsEl.innerHTML = SCENARIOS.map((s, i) => {
    const on = i === current;
    return `<button type="button" role="tab" id="tab-${s.id}" aria-selected="${on}" aria-controls="demo-panel" data-i="${i}"
      class="on-dark group flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors ${
        on ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
      }">
      <i data-lucide="${s.icon}" class="h-4 w-4 shrink-0"></i><span class="whitespace-nowrap">${s.tab}</span></button>`;
  }).join('');
  icons();
}

function renderPanel(s) {
  urlEl.textContent = `omnifile.bankole.xyz/?tool=${s.id}`;
  panelEl.setAttribute('aria-labelledby', `tab-${s.id}`);
  panelEl.innerHTML = `
    <div class="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
      <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/30">
        <i data-lucide="${s.icon}" class="h-5 w-5"></i></div>
      <div class="min-w-0">
        <h3 class="truncate font-display text-[15px] font-semibold text-slate-50">${s.title}</h3>
        <p class="truncate text-xs text-slate-400">${s.blurb}</p>
      </div>
    </div>
    <div class="space-y-4 p-5">
      <div class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/40 p-3">
        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-medium ${EXT_STYLE[s.file.ext]}">.${s.file.ext}</div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-mono text-[13px] text-slate-100">${s.file.name}</p>
          <p class="text-xs text-slate-400">${s.file.size}</p>
        </div>
        <span class="hidden rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 sm:block">Replace</span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        ${s.options.map((o) => `<span class="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">${o}</span>`).join('')}
      </div>
      <button id="demo-run" type="button" class="on-dark inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto sm:px-6">
        <i data-lucide="wand-sparkles" class="h-4 w-4"></i><span id="demo-run-label">${s.action}</span></button>
      <div id="demo-progress" class="h-1.5 overflow-hidden rounded-full bg-slate-800 opacity-0 transition-opacity">
        <div id="demo-bar" class="h-full w-0 rounded-full bg-indigo-400"></div></div>
      <div id="demo-result" aria-live="polite" class="hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 opacity-0 transition-opacity duration-300">
        <div class="flex items-start gap-2">
          <i data-lucide="circle-check" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"></i>
          <p class="min-w-0 break-words text-sm font-semibold text-slate-50">Ready: <span class="font-mono text-[13px] font-medium">${s.out.name}</span></p>
        </div>
        <p class="mt-1 pl-7 text-xs text-slate-400">${s.out.note}</p>
        ${
          s.before
            ? `<div class="mt-4 space-y-2 pl-7 text-xs text-slate-400">
          ${[s.before, s.after]
            .map(
              (r, i) => `<div class="flex items-center gap-3"><span class="w-12 shrink-0">${r.label}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div data-bar="${r.pct}" class="h-full w-0 rounded-full transition-[width] duration-700 ease-out ${i ? 'bg-emerald-400' : 'bg-slate-500'}"></div></div>
            <span class="w-16 shrink-0 text-right font-mono text-slate-200">${r.size}</span></div>`
            )
            .join('')}</div>`
            : `<div class="mt-4 ml-7 rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300">${s.preview.map((l) => `<div>${l}</div>`).join('')}</div>`
        }
        <div class="mt-4 flex flex-col gap-2 pl-0 sm:flex-row sm:pl-7">
          <span class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-slate-950">
            <i data-lucide="download" class="h-4 w-4"></i>Download</span>
          <span class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-sm text-slate-200">
            <i data-lucide="cloud" class="h-4 w-4"></i>Save to Vault</span>
        </div>
      </div>
    </div>`;
  icons();
  document.getElementById('demo-run').addEventListener('click', () => {
    autoplay = false;
    play(current);
  });
}

function play(i) {
  clearTimers();
  current = i;
  const s = SCENARIOS[i];
  renderTabs();
  renderPanel(s);

  const run = document.getElementById('demo-run');
  const label = document.getElementById('demo-run-label');
  const progress = document.getElementById('demo-progress');
  const bar = document.getElementById('demo-bar');
  const result = document.getElementById('demo-result');

  const showResult = () => {
    progress.classList.add('opacity-0');
    run.classList.remove('scale-95');
    label.textContent = s.action;
    result.classList.remove('hidden');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        result.classList.remove('opacity-0');
        result.querySelectorAll('[data-bar]').forEach((b) => (b.style.width = `${b.dataset.bar}%`));
      })
    );
  };

  if (reduceMotion) {
    showResult();
    return;
  }

  later(() => {
    run.classList.add('scale-95');
    label.textContent = s.busy;
    progress.classList.remove('opacity-0');
    bar.style.transition = 'width 1.4s linear';
    requestAnimationFrame(() => (bar.style.width = '100%'));
  }, 900);
  later(showResult, 2500);
  if (autoplay) later(() => play((i + 1) % SCENARIOS.length), 8200);
}

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-i]');
  if (!btn) return;
  autoplay = false;
  play(Number(btn.dataset.i));
});

// Only start the loop when the demo is on screen
const demoRoot = document.getElementById('demo');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        play(0);
      }
    },
    { threshold: 0.35 }
  );
  io.observe(demoRoot);
} else {
  play(0);
}

icons();
