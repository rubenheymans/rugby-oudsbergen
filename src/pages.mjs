import { readFileSync, readdirSync } from 'node:fs';
import { url, asset, pageHead } from './layout.mjs';
import { club, ageGroups, events, trainers, board, history, documents, sponsors, photoAlbums } from './content.mjs';

const wrap = (inner, cls = '') => `<div class="mx-auto max-w-6xl px-4 ${cls}">${inner}</div>`;

const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const weekdays = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const typeColor = { Training: 'bg-navy', Club: 'bg-lime', Promo: 'bg-fur', Infosessie: 'bg-grass' };

function eventRow(e) {
  const d = new Date(e.date + 'T12:00:00');
  return `
<li class="event grid grid-cols-[4.5rem_1fr] gap-5 py-5 border-b-2 border-dashed border-navy/15" data-date="${e.date}">
  <div class="text-center">
    <span class="block text-sm font-bold uppercase text-fur">${weekdays[d.getDay()]}</span>
    <span class="block font-display text-4xl leading-none">${d.getDate()}</span>
    <span class="block text-sm">${months[d.getMonth()].slice(0, 3)}</span>
  </div>
  <div>
    <p class="flex items-center gap-2 text-sm font-bold text-fur"><span class="inline-block size-3 rounded-sm ${typeColor[e.type]}" aria-hidden="true"></span>${e.type}<span class="past-label hidden">, voorbij</span></p>
    <h3 class="mt-1 font-body font-bold text-xl">${e.title}</h3>
    ${e.details.map((t) => `<p class="text-navy-deep/80">${t}</p>`).join('')}
  </div>
</li>`;
}

// Hides or dims past events against the visitor's own clock, so a static build never goes stale
const eventScript = (mode) => `<script>
(() => {
  const today = new Date().toISOString().slice(0, 10);
  const rows = [...document.querySelectorAll('.event')];
  rows.forEach((r) => {
    if (r.dataset.date >= today) return;
    ${mode === 'hide' ? "r.remove();" : "r.querySelector('h3').classList.add('line-through', 'decoration-2'); r.querySelector('.past-label').classList.remove('hidden');"}
  });
  ${mode === 'hide' ? "document.querySelectorAll('.event').forEach((r, i) => { if (i > 2) r.remove(); }); if (!document.querySelector('.event')) document.getElementById('no-events')?.classList.remove('hidden');" : ''}
})();
</script>`;

const tryCta = (label = 'Kom 4x proberen') => `<a href="${club.tryout}" class="btn-lime">${label}</a>`;

function stampCard() {
  const slots = [1, 2, 3, 4].map((n) =>
    n === 1
      ? `<li class="slot stamped stamp-anim" aria-label="Training 1"><img src="${asset('logo.webp')}" alt="" class="w-4/5"></li>`
      : `<li class="slot" aria-label="Training ${n}">${n}</li>`).join('');
  return `
<div class="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_10px_0_var(--color-navy)] border-[3px] border-navy -rotate-1">
  <div class="flex items-baseline justify-between gap-4">
    <p class="font-display text-xl">Proefkaart</p>
    <p class="text-sm text-fur font-bold">Naam: jij</p>
  </div>
  <ol class="mt-6 grid grid-cols-4 gap-3 sm:gap-5">${slots}</ol>
  <p class="mt-6 text-sm text-navy-deep/75">Vier trainingen meedoen, zonder verplichtingen. Daarna kies je zelf of je lid wordt.</p>
</div>`;
}

function ageTable(withFees = false) {
  return `
<div class="overflow-x-auto rounded-3xl border-[3px] border-navy bg-white" tabindex="0" role="region" aria-label="${withFees ? 'Lidgeld per ploeg' : 'Trainingen en wedstrijden per ploeg'}">
<table class="w-full text-left min-w-[36rem]">
  <thead class="bg-navy text-white">
    <tr>
      <th scope="col" class="px-5 py-3">Ploeg</th>
      <th scope="col" class="px-5 py-3">Geboren in</th>
      ${withFees
        ? '<th scope="col" class="px-5 py-3">Lidgeld seizoen</th><th scope="col" class="px-5 py-3">Instap halverwege</th>'
        : '<th scope="col" class="px-5 py-3">Training</th><th scope="col" class="px-5 py-3">Wedstrijden</th>'}
    </tr>
  </thead>
  <tbody>
    ${ageGroups.map((g) => `
    <tr class="border-t-2 border-dashed border-navy/15">
      <th scope="row" class="px-5 py-4 font-display text-2xl font-normal">${g.group}</th>
      <td class="px-5 py-4">${g.born}</td>
      ${withFees
        ? `<td class="px-5 py-4">${g.fee ? `€ ${g.fee}` : 'Op aanvraag'}</td><td class="px-5 py-4">${g.feeHalf ? `€ ${g.feeHalf}` : 'Op aanvraag'}</td>`
        : `<td class="px-5 py-4">${g.training}</td><td class="px-5 py-4">${g.match}</td>`}
    </tr>`).join('')}
  </tbody>
</table>
</div>`;
}

function sponsorGrid(limit) {
  const list = limit ? sponsors.slice(0, limit) : sponsors;
  return `<ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
  ${list.map((s) => {
    const img = `<img src="${asset('sponsors/' + s.logo)}" alt="${s.name}" loading="lazy" class="max-h-20 w-auto max-w-full object-contain">`;
    const box = 'grid h-32 place-items-center rounded-2xl bg-white p-5 border-2 border-navy/10';
    return `<li>${s.url ? `<a href="${s.url}" class="${box} hover:border-lime">${img}</a>` : `<div class="${box}">${img}</div>`}</li>`;
  }).join('')}
  </ul>`;
}

// ---------- pages ----------

const home = {
  path: '',
  title: 'Home',
  description: 'Rugbyclub Oudsbergen: jeugdrugby voor jongens en meisjes van 6 tot 18 jaar. Kom 4 keer vrijblijvend meetrainen.',
  body: `
<section class="relative isolate overflow-hidden bg-navy-deep text-white">
  <img src="${asset('gen/hero.webp')}" alt="Jeugdspelers in het blauw-groen van Oudsbergen lopen met de bal over het veld onder de lampen" class="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_center]">
  <div class="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/10"></div>
  <div class="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:pt-36 sm:pb-32">
    <h1 class="text-5xl sm:text-7xl max-w-[12ch]">Rugby in het hart van Oudsbergen</h1>
    <p class="mt-6 max-w-[46ch] text-lg sm:text-xl text-white/90">Plezier, teamwork en sportiviteit voor jongens en meisjes van 6 tot 18 jaar. Nooit een rugbybal vastgehad? Dan ben je net zo welkom.</p>
    <div class="mt-9 flex flex-wrap gap-3">
      ${tryCta()}
      <a href="${url('trainingsdagen/')}" class="btn-ghost text-white">Bekijk de trainingsuren</a>
    </div>
  </div>
  <div class="tryline"></div>
</section>

<section class="py-24">
  ${wrap(`
  <div class="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
    <div>
      <h2 class="text-4xl sm:text-5xl">Eerst proeven, dan beslissen</h2>
      <p class="mt-5 max-w-[52ch] text-lg leading-relaxed">Je kind mag vier keer vrijblijvend meetrainen met de eigen leeftijdsgroep. Schrijf je in via het formulier en we nemen contact met je op om af te spreken.</p>
      <p class="mt-4 max-w-[52ch] text-lg leading-relaxed">Trainen doen we op dinsdag en donderdag vanaf 19u.</p>
      <div class="mt-8">${tryCta('Inschrijven voor 4 proeftrainingen')}</div>
    </div>
    ${stampCard()}
  </div>`)}
</section>

<section class="bg-white py-24 border-y-[3px] border-navy">
  ${wrap(`
  <div class="flex flex-wrap items-end justify-between gap-6">
    <div>
      <h2 class="text-4xl sm:text-5xl">In welke ploeg speel je?</h2>
      <p class="mt-4 max-w-[56ch] text-lg">Het seizoen loopt van september tot en met juni. De trainingen starten in augustus, de wedstrijden en toernooien in september.</p>
    </div>
    <a href="${url('lid_worden/')}" class="font-bold underline decoration-lime decoration-[3px] underline-offset-4">Lidgeld en inschrijving</a>
  </div>
  <div class="mt-10">${ageTable()}</div>`)}
</section>

<section class="py-24">
  ${wrap(`
  <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
    <img src="${asset('gen/kids.webp')}" alt="Een trainster geeft een high five aan een jonge speelster tijdens een tagrugbyspel" loading="lazy" class="rounded-[2rem] border-[3px] border-navy shadow-[0_10px_0_var(--color-navy)] w-full">
    <div>
      <h2 class="text-4xl sm:text-5xl">Wat rugby je kind leert</h2>
      <ul class="mt-8 space-y-6 text-lg">
        <li><strong class="block font-display font-normal text-2xl text-navy">Sterker worden</strong>Kracht en snelheid, op een speelse manier.</li>
        <li><strong class="block font-display font-normal text-2xl text-navy">Samenwerken</strong>Zonder praten met je ploegmaats kom je nergens.</li>
        <li><strong class="block font-display font-normal text-2xl text-navy">Snel beslissen</strong>Tactisch nadenken in het heetst van de strijd.</li>
        <li><strong class="block font-display font-normal text-2xl text-navy">Respect</strong>Voor elkaar, de scheidsrechter en de tegenstander, op en naast het veld.</li>
      </ul>
      <a href="${url('wat_is_rugby/')}" class="mt-8 inline-block font-bold underline decoration-lime decoration-[3px] underline-offset-4">Meer over rugby</a>
    </div>
  </div>`)}
</section>

<section class="bg-navy text-white py-24">
  ${wrap(`
  <div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
    <div>
      <h2 class="text-4xl sm:text-5xl">Binnenkort op de club</h2>
      <p class="mt-4 text-lg text-white/85">Van infosessie tot spaghettidag. De volledige jaarkalender staat online.</p>
      <a href="${url('activiteiten/')}" class="btn-lime mt-8">Naar de kalender</a>
    </div>
    <div class="rounded-[2rem] bg-chalk p-6 sm:p-8 text-navy-deep">
      <ul>${events.map(eventRow).join('')}</ul>
      <p id="no-events" class="hidden py-5">Er staan geen activiteiten meer gepland. De nieuwe kalender volgt.</p>
    </div>
  </div>`)}
</section>
${eventScript('hide')}

<section class="py-24">
  ${wrap(`
  <div class="flex flex-wrap items-end justify-between gap-6">
    <h2 class="text-4xl sm:text-5xl">Met dank aan onze sponsors</h2>
    <a href="${url('sponsors/')}" class="font-bold underline decoration-lime decoration-[3px] underline-offset-4">Alle sponsors</a>
  </div>
  <div class="mt-10">${sponsorGrid(8)}</div>`)}
</section>`,
};

const trainingsdagen = {
  path: 'trainingsdagen/',
  title: 'Trainingen',
  description: 'Trainingsuren en wedstrijddagen per leeftijdsgroep, seizoen 2026-2027.',
  body: `${pageHead('Trainingen en wedstrijden', 'Seizoen 2026-2027. We trainen op dinsdag en donderdag, wedstrijden en toernooien zijn op zaterdag.')}
  ${wrap(`<div class="py-16">${ageTable()}</div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <div class="rounded-3xl bg-white p-8 border-2 border-navy/10"><h2 class="text-2xl">Waar?</h2><p class="mt-3 text-lg">${club.address}</p><a class="mt-3 inline-block font-bold underline decoration-lime decoration-[3px] underline-offset-4" href="${club.mapsUrl}">Route plannen</a></div>
    <div class="rounded-3xl bg-white p-8 border-2 border-navy/10"><h2 class="text-2xl">Nog geen lid?</h2><p class="mt-3 text-lg">Kom eerst vier keer vrijblijvend meetrainen.</p><div class="mt-5">${tryCta()}</div></div>
  </div>`)}`,
};

const lidWorden = {
  path: 'lid_worden/',
  title: 'Lid worden',
  description: 'Leeftijdsgroepen, lidgeld en kortingen voor seizoen 2026-2027 bij Rugbyclub Oudsbergen.',
  body: `${pageHead('Lid worden', 'Het rugbyseizoen loopt van september tot en met juni. De trainingen starten in augustus.')}
  ${wrap(`
  <div class="py-16">
    <h2 class="text-3xl mb-6">Lidgeld 2026-2027</h2>
    ${ageTable(true)}
    <p class="mt-4 text-navy-deep/75">Instappen halverwege het seizoen kan aan half tarief. Voor U16 en U18 vraag je het lidgeld op via <a class="underline" href="mailto:${club.email}">${club.email}</a>.</p>
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <div class="rounded-3xl bg-lime p-8">
      <h2 class="text-2xl">Korting voor gezinnen</h2>
      <ul class="mt-4 space-y-2 text-lg"><li>€ 10 korting voor het tweede kind</li><li>€ 5 korting vanaf het derde kind</li></ul>
    </div>
    <div class="rounded-3xl bg-white p-8 border-2 border-navy/10">
      <h2 class="text-2xl">Eerst proberen?</h2>
      <p class="mt-3 text-lg">Vul het formulier in en we nemen contact met je op om vier proeftrainingen af te spreken.</p>
      <div class="mt-5">${tryCta('Naar het inschrijvingsformulier')}</div>
    </div>
  </div>`)}`,
};

const watIsRugby = {
  path: 'wat_is_rugby/',
  title: 'Wat is rugby?',
  description: 'Hoe rugby werkt en wat kinderen leren als ze rugby spelen.',
  body: `${pageHead('Wat is rugby?', 'Een intensieve en strategische teamsport, waarin iedereen kan bijdragen aan het succes van de ploeg.')}
  ${wrap(`
  <div class="grid grid-cols-1 gap-14 py-16 lg:grid-cols-[1.3fr_1fr]">
    <div class="prose-club">
      <h2>Hoe speel je rugby?</h2>
      <p>Twee ploegen van 15 spelers (rugby union) of 7 spelers (rugby sevens) spelen tegen elkaar. Het doel: de bal in de eindzone van de tegenstander brengen, of punten scoren. Spelers dragen, passen en schoppen de bal, en tackelen hun tegenstanders.</p>
      <p>Individuele vaardigheden en teamwerk zijn even belangrijk. Groot of klein, snel of sterk: er is een plaats voor iedereen.</p>
      <h2>Wat leer je?</h2>
      <ul>
        <li>Je wordt fysiek sterk. Je traint kracht en snelheid.</li>
        <li>Je leert samenwerken en communiceren met je ploegmaats.</li>
        <li>Je leert tactisch denken, snel schakelen en beslissingen nemen in het heetst van de strijd.</li>
        <li>Respect voor elkaar staat centraal, op het veld en ernaast.</li>
      </ul>
      <p>Fair play, respect, vriendschap, passie en discipline: de rugbywaarden beleef je op en naast het veld.</p>
      <p>Algemene info over de sport vind je bij <a href="https://rugby.vlaanderen/">Rugby Vlaanderen</a>.</p>
      <div class="mt-8">${tryCta()}</div>
    </div>
    <img src="${asset('gen/team.webp')}" alt="Modderige handen van spelers die elkaar vastgrijpen in een huddle" loading="lazy" class="rounded-[2rem] border-[3px] border-navy shadow-[0_10px_0_var(--color-navy)] w-full lg:mt-12">
  </div>`)}`,
};

const activiteiten = {
  path: 'activiteiten/',
  title: 'Kalender',
  description: 'Activiteitenkalender 2026-2027 van Rugbyclub Oudsbergen.',
  body: `${pageHead('Kalender 2026-2027', 'Trainingen, clubactiviteiten en acties. Er kunnen in de loop van het jaar nog activiteiten bijkomen.')}
  ${wrap(`
  <ul class="flex flex-wrap gap-x-6 gap-y-2 pt-10 text-sm font-bold" aria-label="Legende">
    ${Object.entries(typeColor).map(([t, c]) => `<li class="flex items-center gap-2"><span class="inline-block size-3 rounded-sm ${c}" aria-hidden="true"></span>${t}</li>`).join('')}
  </ul>
  <div class="mt-6 max-w-3xl">
  ${Object.entries(Object.groupBy(events, (e) => e.date.slice(0, 7))).map(([ym, list]) => {
    const [y, m] = ym.split('-');
    return `<h2 class="mt-10 text-2xl text-navy">${months[+m - 1]} ${y}</h2><ul>${list.map(eventRow).join('')}</ul>`;
  }).join('')}
  </div>`)}
  ${eventScript('dim')}`,
};

const verhuur = {
  path: 'verhuur/',
  title: 'Kantine huren',
  description: 'Huur de kantine van Rugbyclub Oudsbergen voor je feest of vergadering.',
  body: `${pageHead('Kantine huren', 'Op zoek naar een zaal voor een feest of vergadering? Onze kantine is te huur.')}
  ${wrap(`
  <div class="grid grid-cols-1 items-start gap-12 py-16 lg:grid-cols-2">
    <img src="${asset('photos/clubfeest_03.webp')}" alt="De kantine van de club, vol leden tijdens het clubfeest" loading="lazy" class="rounded-[2rem] border-[3px] border-navy w-full">
    <div class="space-y-8">
      <div class="rounded-3xl bg-white p-8 border-2 border-navy/10">
        <h2 class="text-2xl">Reserveren</h2>
        <p class="mt-3 text-lg">Neem contact op met Joke Valentini.</p>
        <a href="tel:+32468159399" class="btn-lime mt-5">Bel +32 468 15 93 99</a>
      </div>
      <div class="rounded-3xl bg-white p-8 border-2 border-navy/10">
        <h2 class="text-2xl">Huurovereenkomst</h2>
        <p class="mt-3 text-lg">Lees de voorwaarden na voor je reserveert.</p>
        <a href="${documents[2].url}" class="mt-4 inline-block font-bold underline decoration-lime decoration-[3px] underline-offset-4">Huurovereenkomst 2026-2027 (pdf)</a>
      </div>
    </div>
  </div>`)}`,
};

const contact = {
  path: 'contact/',
  title: 'Contact',
  description: 'Contactgegevens en adres van Rugbyclub Oudsbergen.',
  body: `${pageHead('Contact', 'Vragen over trainingen, inschrijven of sponsoring? Stuur ons een bericht.')}
  ${wrap(`
  <div class="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
    <form id="contact-form" class="rounded-[2rem] bg-white p-6 sm:p-8 border-[3px] border-navy space-y-5">
      ${[['naam', 'Naam', 'text', 'name'], ['email', 'E-mail', 'email', 'email'], ['telefoon', 'Telefoon (optioneel)', 'tel', 'tel']].map(([id, label, type, ac]) => `
      <div><label for="${id}" class="block font-bold">${label}</label>
      <input id="${id}" name="${id}" type="${type}" autocomplete="${ac}" ${id !== 'telefoon' ? 'required' : ''} class="mt-2 w-full rounded-xl border-2 border-navy/25 bg-chalk px-4 py-3 focus:border-navy focus:outline-none"></div>`).join('')}
      <div><label for="bericht" class="block font-bold">Bericht</label>
      <textarea id="bericht" name="bericht" rows="5" required class="mt-2 w-full rounded-xl border-2 border-navy/25 bg-chalk px-4 py-3 focus:border-navy focus:outline-none"></textarea></div>
      <button type="submit" class="btn-lime">Bericht opstellen in je mailprogramma</button>
      <p class="text-sm text-navy-deep/70">Je mailprogramma opent met je bericht klaar om te versturen naar ${club.email}.</p>
    </form>
    <div class="space-y-8">
      <div><h2 class="text-2xl">Adres</h2><p class="mt-3 text-lg">Rugbyclub Oudsbergen<br>Resedastraat 14<br>3660 Oudsbergen</p><a class="mt-2 inline-block font-bold underline decoration-lime decoration-[3px] underline-offset-4" href="${club.mapsUrl}">Route plannen</a></div>
      <div><h2 class="text-2xl">Mail</h2><a class="mt-3 inline-block text-lg font-bold underline decoration-lime decoration-[3px] underline-offset-4" href="mailto:${club.email}">${club.email}</a></div>
      <div><h2 class="text-2xl">Volg ons</h2><p class="mt-3 flex gap-5 text-lg font-bold"><a class="underline decoration-lime decoration-[3px] underline-offset-4" href="${club.facebook}">Facebook</a><a class="underline decoration-lime decoration-[3px] underline-offset-4" href="${club.instagram}">Instagram</a></p></div>
    </div>
  </div>`)}
  <script>
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = f.get('bericht') + '\\n\\n' + f.get('naam') + '\\n' + f.get('email') + (f.get('telefoon') ? '\\n' + f.get('telefoon') : '');
    location.href = 'mailto:${club.email}?subject=' + encodeURIComponent('Vraag via de website van ' + f.get('naam')) + '&body=' + encodeURIComponent(body);
  });
  </script>`,
};

const trainersPage = {
  path: 'trainers/',
  title: 'Trainers',
  description: 'De trainers van Rugbyclub Oudsbergen per leeftijdsgroep.',
  body: `${pageHead('Trainers', 'Wie staat er op dinsdag en donderdag langs de lijn?')}
  ${wrap(`<div class="space-y-14 py-16">
  ${trainers.map((t) => `
    <section>
      <h2 class="text-3xl">${t.group}</h2>
      <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${t.people.map((p) => `<li class="rounded-3xl bg-white p-6 border-2 border-navy/10">
          <span class="grid size-14 place-items-center rounded-full bg-navy font-display text-xl text-lime" aria-hidden="true">${p.name.split(' ').map((w) => w[0]).join('')}</span>
          <p class="mt-4 font-bold text-xl">${p.name}</p><p class="text-fur">${p.role}</p></li>`).join('')}
      </ul>
    </section>`).join('<div class="tryline-navy"></div>')}
  </div>`)}`,
};

const bestuur = {
  path: 'bestuur/',
  title: 'Bestuur',
  description: 'Het bestuur van Rugbyclub Oudsbergen.',
  body: `${pageHead('Bestuur', 'De vrijwilligers die de club draaiende houden.')}
  ${wrap(`<ul class="grid grid-cols-1 gap-6 py-16 md:grid-cols-3">
    ${board.map((b) => `<li class="rounded-3xl bg-white p-8 border-2 border-navy/10">
      <p class="font-bold text-fur">${b.role}</p><p class="mt-1 font-display text-2xl">${b.name}</p>
      <a class="mt-4 inline-block break-all font-bold underline decoration-lime decoration-[3px] underline-offset-4" href="mailto:${b.email}">${b.email}</a></li>`).join('')}
  </ul>`)}`,
};

const geschiedenis = {
  path: 'geschiedenis/',
  title: 'Geschiedenis',
  description: 'Van RC Maasland in 2005 tot Rugbyclub Oudsbergen.',
  body: `${pageHead('Van RC Maasland tot Oudsbergen', 'Hoe een idee tussen pot en pint uitgroeide tot een jeugdclub.')}
  ${wrap(`<ol class="relative max-w-3xl py-16 border-l-[3px] border-dashed border-navy/30 ml-3">
    ${history.map((h) => `<li class="relative pl-10 pb-12 last:pb-0">
      <span class="absolute -left-[11px] top-2 size-5 rounded-full bg-lime border-[3px] border-navy" aria-hidden="true"></span>
      <p class="font-display text-4xl text-navy">${h.year}</p>
      <p class="mt-3 text-lg leading-relaxed max-w-[60ch]">${h.text}</p></li>`).join('')}
  </ol>`)}`,
};

function photosPage() {
  const files = readdirSync('assets/photos').filter((f) => f.endsWith('.webp')).sort();
  const albumOf = (f) => photoAlbums.find((a) => f.startsWith(a.key + '_'));
  const filterBtn = (key, label, pressed) => `<button type="button" data-filter="${key}" aria-pressed="${pressed}" class="rounded-full border-2 border-navy px-4 py-2 font-bold aria-pressed:bg-navy aria-pressed:text-white">${label}</button>`;
  return {
    path: 'fotos/',
    title: "Foto's",
    description: "Foto's van trainingen, wedstrijden en het clubfeest.",
    body: `${pageHead("Foto's", 'Trainingen, wedstrijden en feest.')}
    ${wrap(`
    <div class="flex flex-wrap gap-2 pt-10" role="group" aria-label="Kies een album">
      ${filterBtn('all', 'Alles', true)}${photoAlbums.map((a) => filterBtn(a.key, a.label, false)).join('')}
    </div>
    <ul class="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4">
      ${files.map((f) => {
        const album = albumOf(f);
        return `<li class="mb-4 break-inside-avoid" data-album="${album.key}"><button type="button" class="block w-full overflow-hidden rounded-2xl" data-full="${asset('photos/' + f)}"><img src="${asset('photos/' + f)}" alt="${album.label}" loading="lazy" class="w-full transition-transform hover:scale-[1.03]"></button></li>`;
      }).join('')}
    </ul>
    <dialog id="lightbox" class="m-auto max-h-[90vh] max-w-[92vw] bg-transparent p-0 backdrop:bg-navy-deep/90">
      <div data-slot></div>
      <form method="dialog" class="text-center mt-3"><button class="btn-lime">Sluiten</button></form>
    </dialog>`)}
    <script>
    (() => {
      const buttons = document.querySelectorAll('[data-filter]');
      buttons.forEach((b) => b.addEventListener('click', () => {
        buttons.forEach((x) => x.setAttribute('aria-pressed', x === b));
        document.querySelectorAll('[data-album]').forEach((li) => { li.hidden = b.dataset.filter !== 'all' && li.dataset.album !== b.dataset.filter; });
      }));
      const box = document.getElementById('lightbox');
      document.querySelectorAll('[data-full]').forEach((b) => b.addEventListener('click', () => {
        const img = document.createElement('img');
        img.src = b.dataset.full;
        img.alt = b.querySelector('img').alt;
        img.className = 'max-h-[85vh] w-auto rounded-xl';
        box.querySelector('[data-slot]').replaceChildren(img);
        box.showModal();
      }));
      box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
    })();
    </script>`,
  };
}

const sponsorsPage = {
  path: 'sponsors/',
  title: 'Sponsors',
  description: 'De sponsors die Rugbyclub Oudsbergen steunen.',
  body: `${pageHead('Sponsors', 'Bedankt aan alle bedrijven die de club steunen.')}
  ${wrap(`<div class="py-16">${sponsorGrid()}</div>
  <div class="rounded-3xl bg-lime p-8 md:flex md:items-center md:justify-between gap-6">
    <div><h2 class="text-2xl">Zelf sponsor worden?</h2><p class="mt-2 text-lg">Laat het ons weten, dan bekijken we samen wat past.</p></div>
    <a href="mailto:${club.email}?subject=Sponsoring" class="btn mt-5 md:mt-0 bg-navy-deep text-white">Mail ons</a>
  </div>`)}`,
};

const documenten = {
  path: 'documenten/',
  title: 'Documenten',
  description: 'Formulieren voor leden: ongevalsaangifte, medische fiche en huurovereenkomst.',
  body: `${pageHead('Documenten', 'Formulieren die je als lid of ouder nodig kan hebben.')}
  ${wrap(`<ul class="grid grid-cols-1 gap-5 py-16 md:grid-cols-2 lg:grid-cols-3">
    ${documents.map((d) => `<li><a href="${d.url}" class="block h-full rounded-3xl bg-white p-8 border-2 border-navy/10 hover:border-lime">
      <span class="font-bold text-fur text-sm">PDF</span><p class="mt-2 font-display text-xl hyphens-auto break-words">${d.title}</p><p class="mt-3 text-navy-deep/80">${d.note}</p></a></li>`).join('')}
  </ul>`)}`,
};

const trooper = {
  path: 'trooper/',
  title: 'Steun ons via Trooper',
  description: 'Steun Rugbyclub Oudsbergen gratis bij je online aankopen via Trooper.',
  body: `${pageHead('Steun ons via Trooper', 'Doe een extra klik voor de club als je online shopt.')}
  ${wrap(`<div class="prose-club py-16">
    <p>Klik op de knop hieronder en ga van daaruit door naar de webshop waar je wil kopen. Zo steun je Rugbyclub Oudsbergen extra.</p>
    <a href="https://www.trooper.be/nl/trooperverenigingen/rugbycluboudsbergen/" class="btn-lime !no-underline">Naar onze Trooper-pagina</a>
  </div>`)}`,
};

const privacy = {
  path: 'privacybeleid/',
  title: 'Privacybeleid',
  description: 'Privacybeleid en algemene voorwaarden van Rugbyclub Oudsbergen.',
  body: `${pageHead('Privacybeleid en algemene voorwaarden')}
  ${wrap(`<div class="prose-club py-16">${readFileSync('src/privacy.html', 'utf8')}</div>`)}`,
};

const notFound = {
  path: '404.html',
  title: 'Pagina niet gevonden',
  description: 'Deze pagina bestaat niet.',
  body: `${pageHead('Buiten de lijnen', 'Deze pagina bestaat niet (meer).')}
  ${wrap(`<div class="py-16"><a href="${url()}" class="btn-lime">Terug naar de startpagina</a></div>`)}`,
};

export const pages = [home, trainingsdagen, lidWorden, watIsRugby, activiteiten, verhuur, contact, trainersPage, bestuur, geschiedenis, photosPage(), sponsorsPage, documenten, trooper, privacy, notFound];

// Old WordPress slugs that no longer have their own page
export const redirects = {
  'speel-rugby/': 'wat_is_rugby/',
  'overzicht_evenementen/': 'activiteiten/',
  'overzicht_acties/': 'activiteiten/',
};
