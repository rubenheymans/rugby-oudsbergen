import { club } from './content.mjs';

export const BASE = process.env.BASE_PATH ?? '/';
export const url = (path = '') => BASE + path;
export const asset = (path) => url('assets/' + path);

const clubLinks = [
  ['trainers/', 'Trainers'],
  ['bestuur/', 'Bestuur'],
  ['geschiedenis/', 'Geschiedenis'],
  ['fotos/', "Foto's"],
  ['sponsors/', 'Sponsors'],
  ['documenten/', 'Documenten'],
  ['trooper/', 'Steun ons via Trooper'],
];

const mainLinks = [
  ['trainingsdagen/', 'Trainingen'],
  ['lid_worden/', 'Lid worden'],
  ['wat_is_rugby/', 'Wat is rugby?'],
  ['activiteiten/', 'Kalender'],
  ['verhuur/', 'Kantine huren'],
  ['contact/', 'Contact'],
];

const chevron = `<svg class="chev transition-transform" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;

function navLink([href, label], current, cls) {
  const active = current === href;
  return `<a href="${url(href)}" class="${cls} ${active ? 'text-lime' : ''}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
}

function header(current) {
  const desktopLink = 'whitespace-nowrap px-2.5 py-2 rounded-full font-bold text-[15px] hover:text-lime';
  const clubActive = clubLinks.some(([h]) => h === current);
  return `
<header class="site-nav relative z-30 bg-navy-deep text-white">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 h-24">
    <a href="${url()}" class="flex items-center gap-3" aria-label="Rugbyclub Oudsbergen, naar de startpagina">
      <img src="${asset('logo.webp')}" alt="" width="96" height="99" class="h-[76px] w-auto">
      <span class="hidden sm:block font-display text-lg leading-none">Rugbyclub<br>Oudsbergen</span>
    </a>
    <nav aria-label="Hoofdmenu" class="hidden xl:flex items-center gap-1">
      <details class="relative" data-dropdown>
        <summary class="${desktopLink} flex items-center gap-1 ${clubActive ? 'text-lime' : ''}">Club ${chevron}</summary>
        <div class="absolute left-0 top-full mt-2 w-60 rounded-2xl bg-white p-2 text-navy-deep shadow-[0_8px_0_var(--color-navy)]">
          ${clubLinks.map((l) => navLink(l, current, 'block rounded-xl px-4 py-2.5 font-bold hover:bg-lime-soft').replace('text-lime', 'bg-lime-soft')).join('')}
        </div>
      </details>
      ${mainLinks.map((l) => navLink(l, current, desktopLink)).join('')}
      <a href="${club.tryout}" class="btn-lime ml-3 whitespace-nowrap !py-2.5 !px-5 text-[15px]">Kom 4x proberen</a>
    </nav>
    <details class="xl:hidden" data-dropdown>
      <summary class="flex items-center gap-2 rounded-full border-2 border-white/40 px-4 py-2 font-bold">Menu ${chevron}</summary>
      <div class="absolute inset-x-0 top-full bg-navy-deep px-4 pb-8 pt-10 shadow-xl">
        <nav aria-label="Mobiel menu" class="grid gap-1 text-lg">
          ${mainLinks.map((l) => navLink(l, current, 'py-2 font-bold')).join('')}
          <p class="mt-4 text-sm text-white/60">Club</p>
          ${clubLinks.map((l) => navLink(l, current, 'py-1.5')).join('')}
          <a href="${club.tryout}" class="btn-lime mt-6">Kom 4x proberen</a>
        </nav>
      </div>
    </details>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `
<footer class="bg-navy-deep text-white mt-24">
  <div class="tryline"></div>
  <div class="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
    <div class="lg:col-span-2">
      <p class="font-display text-3xl">No guts, no glory.</p>
      <p class="mt-3 max-w-sm text-white/75">Jeugdrugby voor jongens en meisjes van 6 tot 18 jaar in Oudsbergen.</p>
    </div>
    <div>
      <h2 class="font-display text-lg text-lime">Adres</h2>
      <p class="mt-3 leading-relaxed">Rugbyclub Oudsbergen<br>Resedastraat 14<br>3660 Oudsbergen</p>
      <a class="mt-2 inline-block underline underline-offset-4" href="${club.mapsUrl}">Route plannen</a>
    </div>
    <div>
      <h2 class="font-display text-lg text-lime">Contact</h2>
      <ul class="mt-3 space-y-2">
        <li><a class="underline underline-offset-4" href="mailto:${club.email}">${club.email}</a></li>
        <li><a class="underline underline-offset-4" href="${club.facebook}">Facebook</a></li>
        <li><a class="underline underline-offset-4" href="${club.instagram}">Instagram</a></li>
        <li><a class="underline underline-offset-4" href="${url('privacybeleid/')}">Privacy en cookies</a></li>
      </ul>
    </div>
  </div>
  <p class="mx-auto max-w-6xl px-4 pb-10 text-sm text-white/55">© ${year} Rugbyclub Oudsbergen</p>
</footer>`;
}

export function page({ path, title, description, body }) {
  const fullTitle = path === '' ? 'Rugbyclub Oudsbergen | Jeugdrugby van 6 tot 18 jaar' : `${title} | Rugbyclub Oudsbergen`;
  return `<!doctype html>
<html lang="nl-BE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light">
<meta name="darkreader-lock">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
<link rel="icon" href="${asset('favicon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;700&family=Bowlby+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${url('styles.css')}">
</head>
<body class="min-h-screen flex flex-col">
<a href="#inhoud" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-navy-deep">Naar de inhoud</a>
${header(path)}
<main id="inhoud" class="flex-1">
${body}
</main>
${footer()}
<script>
document.addEventListener('click', (e) => {
  document.querySelectorAll('details[data-dropdown][open]').forEach((d) => { if (!d.contains(e.target)) d.open = false; });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('details[data-dropdown][open]').forEach((d) => { d.open = false; d.querySelector('summary').focus(); });
});
</script>
</body>
</html>
`;
}

// Interior page header: big title on navy, dashed try-line underneath
export function pageHead(title, intro = '') {
  return `
<section class="bg-navy text-white">
  <div class="mx-auto max-w-6xl px-4 pt-20 pb-14">
    <h1 class="text-4xl sm:text-6xl max-w-[18ch]">${title}</h1>
    ${intro ? `<p class="mt-5 max-w-[60ch] text-lg text-white/85">${intro}</p>` : ''}
  </div>
  <div class="tryline"></div>
</section>`;
}
