// All club content, scraped from rugbyoudsbergen.be (Oct 2026). Obvious typos fixed.

export const club = {
  name: 'Rugbyclub Oudsbergen',
  address: 'Resedastraat 14, 3660 Oudsbergen',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Resedastraat+14+3660+Oudsbergen',
  email: 'info@rugbyoudsbergen.be',
  facebook: 'https://www.facebook.com/rugbyoudsbergen',
  instagram: 'https://www.instagram.com/rugbycluboudsbergen/',
  tryout: 'https://twizzit.com/go/RCOTryout',
  officialSite: 'https://www.rugbyoudsbergen.be/',
};

export const ageGroups = [
  { group: 'U6', born: '2021 en later', fee: 110, feeHalf: 55, training: 'Di + do, 19u00 tot 20u00', match: 'Zaterdagvoormiddag vanaf 10u' },
  { group: 'U8', born: '2019 en 2020', fee: 160, feeHalf: 80, training: 'Di + do, 19u00 tot 20u00', match: 'Zaterdagvoormiddag vanaf 10u' },
  { group: 'U10', born: '2017 en 2018', fee: 160, feeHalf: 80, training: 'Di + do, 19u00 tot 20u00', match: 'Zaterdagvoormiddag vanaf 10u' },
  { group: 'U12', born: '2015 en 2016', fee: 160, feeHalf: 80, training: 'Di + do, 19u00 tot 20u30', match: 'Zaterdagvoormiddag vanaf 10u' },
  { group: 'U14', born: '2013 en 2014', fee: 180, feeHalf: 90, training: 'Di + do, 19u00 tot 20u30', match: 'Zaterdagnamiddag' },
  { group: 'U16', born: '2011 en 2012', fee: null, feeHalf: null, training: 'Di + do, 19u00 tot 20u30', match: 'Zaterdagnamiddag' },
  { group: 'U18', born: '2009 en 2010', fee: null, feeHalf: null, training: 'Di + do, 19u00 tot 20u30', match: 'Zaterdagnamiddag' },
];

export const events = [
  { date: '2026-08-04', type: 'Training', title: 'Start conditietraining', details: ['Op de gewone trainingsdagen en -uren.'] },
  { date: '2026-08-09', type: 'Promo', title: 'Markt in Gruitrode', details: ['09u00 tot 15u00', 'Ophovenstraat 206, 3670 Oudsbergen'] },
  { date: '2026-08-22', type: 'Club', title: 'Afsluiting conditietraining', details: ['We lopen samen de Oudsberg op.', 'Samenkomst aan de club om 09u00, einde om 12u00.'] },
  { date: '2026-08-29', type: 'Club', title: 'Startdag', details: ['Sessie 1: 10u tot 12u', 'Sessie 2: 13u tot 15u'] },
  { date: '2026-10-06', type: 'Infosessie', title: 'Infosessie 1', details: ['Voorstelling van de club en uitleg over Twizzit.', '19u tot 20u'] },
  { date: '2026-10-08', type: 'Infosessie', title: 'Infosessie 2', details: ['Voorstelling van de club en uitleg over Twizzit.', '19u tot 20u'] },
  { date: '2026-10-24', type: 'Club', title: 'Halloweenwandeling', details: ['Meer info volgt.'] },
  { date: '2026-11-29', type: 'Club', title: 'Spaghettidag', details: [] },
  { date: '2026-12-03', type: 'Club', title: 'Sinterklaas', details: ['U6, U8 en U10: 19u30', 'U12 en ouder: 20u'] },
  { date: '2026-12-17', type: 'Training', title: 'Kersttraining', details: ['Met hapjes en drankjes voor spelers, ouders en supporters.'] },
  { date: '2026-12-21', type: 'Training', title: 'Winterstop', details: ['Geen training van 21/12/2026 tot 03/01/2027.'] },
  { date: '2027-01-05', type: 'Club', title: 'Nieuwjaarsreceptie', details: ['19u'] },
  { date: '2027-02-02', type: 'Promo', title: 'Wafelverkoop', details: ['Van 02/02 tot 18/02/2027'] },
  { date: '2027-06-24', type: 'Training', title: 'Laatste training', details: [] },
  { date: '2027-06-26', type: 'Club', title: 'Clubfeest', details: [] },
];

export const trainers = [
  { group: 'U6, U8 en U10', people: [
    { name: 'Siegi Muls', role: 'Coaching level 2' },
    { name: 'Ellen Thijs', role: 'Coaching level 2' },
    { name: 'Dennis Lowie', role: 'Start to Coach' },
    { name: 'Ester Nietvelt', role: 'Trainer' },
  ] },
  { group: 'U12 en U14', people: [{ name: 'Bert Smeets', role: 'Hoofdtrainer' }] },
  { group: 'U16 en U18', people: [{ name: 'Frank Heyman', role: 'Hoofdtrainer' }] },
];

export const board = [
  { role: 'Voorzitter', name: 'Joke Valentini', email: 'voorzitter@rugbyoudsbergen.be' },
  { role: 'Secretaris', name: 'Stefanie Thielens', email: 'secretaris@rugbyoudsbergen.be' },
  { role: 'Penningmeester', name: 'Bert Brouns', email: 'penningmeester@rugbyoudsbergen.be' },
];

export const history = [
  { year: '2005', text: 'Bjorn Houben en Geert Maas zoeken na hun studies een nieuwe uitdaging. Tussen pot en pint beslissen ze: we starten een rugbyclub. Ze komen allebei uit het Maasland, dus wordt het RC Maasland. Na een promoactie met vrienden traint een kleine groep mannen in Neeroeteren.' },
  { year: '2006', text: 'De club krijgt een damesploeg.' },
  { year: '2008', text: 'De jeugdwerking gaat van start.' },
  { year: '2010', text: 'Verhuis naar Maaseik: een grotere kantine en meer velden.' },
  { year: '2017', text: 'De club vestigt zich in Oudsbergen, met moderne accommodatie en een centrale ligging. Omdat de club niet langer in het Maasland ligt, heet ze voortaan Rugbyclub Oudsbergen.' },
];

export const documents = [
  { title: 'Aangifte ongeval', note: 'Formulier van Rugby Vlaanderen bij een blessure tijdens training of wedstrijd.', url: 'https://rugby.vlaanderen/wp-content/uploads/2026/01/Aangifteformulier-Rugby-45519684_DYN.pdf' },
  { title: 'Medische fiche', note: 'In te vullen bij inschrijving.', url: 'https://rugby.vlaanderen/wp-content/uploads/2018/11/medische-fiche.pdf' },
  { title: 'Huurovereenkomst kantine 2026-2027', note: 'Voor wie de kantine wil huren.', url: 'https://www.rugbyoudsbergen.be/wp-content/uploads/2025/09/Huurovereenkomst_Kantine_2026_2027.pdf' },
];

export const sponsors = [
  { name: 'Energy Technics', logo: 'energy_technics-1024x249.webp', url: 'https://energytechnics.be/' },
  { name: 'Auto5 Genk', logo: 'Auto5.webp', url: 'https://autocenter.auto5.be/limburg/genk/meenweg-74' },
  { name: 'Raedschelders', logo: 'raedschelders.webp', url: 'https://www.raedscheldersnv.be/' },
  { name: "D'Angelo Valerio", logo: 'Logo-dangelo_valerio.webp' },
  { name: 'Cteso', logo: 'MENTALL_CTESO_LOGO_MR_062024_LOGO_HOR_P_ZG-1024x218.webp', url: 'https://www.cteso.com/' },
  { name: 'Brug 36', logo: 'Brug36-1024x575.webp' },
  { name: 'Garage Maasland', logo: 'GarageMaasland.webp', url: 'https://www.garage-maasland.be/' },
  { name: 'Kine4You', logo: 'Kine4You.webp' },
  { name: 'Kine Baeten Dorien', logo: 'KineBaetenDorien-1024x1024.webp' },
  { name: 'JM Cars', logo: 'JMCars-1024x1013.webp' },
  { name: 'Bij Siegi', logo: 'Logo-Bij-Siegi.webp', url: 'https://www.bijsiegi.be/' },
  { name: 'Enjoy Your Dog', logo: 'EnjoyYourDog.webp', url: 'https://www.enjoyyourdog.be/' },
  { name: 'Wenmeekers Jimmy', logo: 'Wenmeekers_Jimmy-1024x1024.webp' },
  { name: 'C. Van Mierlo', logo: 'CVanMierlo.webp' },
  { name: 'Nio Beauty', logo: 'Nio.webp', url: 'https://niobeauty.be/' },
  { name: 'Drive It', logo: 'driveit.webp' },
];

export const photoAlbums = [
  { key: 'foto', label: 'Training' },
  { key: 'fun', label: 'Fun' },
  { key: 'wedstrijd', label: 'Wedstrijden' },
  { key: 'U6_U8_U10', label: 'U6, U8, U10' },
  { key: 'u12_u14', label: 'U12, U14' },
  { key: 'clubfeest', label: 'Clubfeest 2026' },
];
