// ──────────────────────────────────────────────
//  API Playground — Interactive Logic
//  Depends on: ../data.js (FD dataset + generators)
// ──────────────────────────────────────────────

// ── Extra generators (beyond data.js) ────────

function rndAlpha(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  return Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function genEmail()    { const u = generateUser(); return { email: u.email }; }
function genCity()     { return { city: rnd(FD.cities) }; }
function genPassword(n){ return { password: rndAlpha(n), length: n }; }

const FACTS = [
  "A group of flamingos is called a flamboyance.",
  "Honey never spoils — archaeologists found 3000-year-old honey in Egyptian tombs that was still edible.",
  "Octopuses have three hearts, and two stop beating when they swim.",
  "Bananas are technically berries, but strawberries are not.",
  "A day on Venus is longer than a year on Venus.",
  "The Eiffel Tower can be 15 cm taller during summer due to thermal expansion.",
  "Sea otters hold hands while sleeping to keep from drifting apart.",
  "Oxford University is older than the Aztec Empire.",
  "A snail can sleep for three years.",
  "Sharks are older than trees — they've existed ~450 million years.",
  "There are more trees on Earth than stars in the Milky Way galaxy.",
  "The average cloud weighs around 1.1 million pounds.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
];

const FORTUNES = [
  "Fortune favors the bold.",
  "A beautiful, smart, and loving person will be coming into your life.",
  "Curiosity is the wick in the candle of learning.",
  "Do or do not. There is no try.",
  "Every day is a new beginning. Take a deep breath and start again.",
  "It is a great piece of skill to know how to guide your luck.",
  "Great things are not done by impulse, but by small things brought together.",
  "Believe in yourself and others will too.",
  "Be direct — usually one can accomplish more that way.",
  "An upward movement initiated in time, can never be brought down.",
];

const DOG_FACTS = [
  "Dogs have a sense of smell 10,000–100,000× more acute than humans.",
  "A dog's nose print is unique, much like a human fingerprint.",
  "Dogs can understand up to 250 words and gestures.",
  "The Basenji is the only dog breed that cannot bark.",
  "Three dogs survived the sinking of the Titanic.",
  "Dogs can be trained to detect cancer and other diseases in humans.",
  "The average dog is as intelligent as a 2-year-old child.",
  "Dalmatians are born completely white and develop their spots over time.",
];

const CAT_FACTS = [
  "Cats sleep 12–16 hours a day.",
  "Cats cannot taste sweetness.",
  "A group of cats is called a clowder.",
  "The average cat has 244 bones.",
  "A cat's purr vibrates at 25–50 Hz, which can promote bone healing.",
  "Cats spend ~50% of waking hours grooming themselves.",
  "Cats have 32 muscles that control the outer ear.",
  "The technical term for a hairball is a bezoar.",
];

const ANIME_FACTS = [
  {question:"What is the best-selling manga of all time?",        answers:["One Piece"]},
  {question:"What studio produced Spirited Away?",               answers:["Studio Ghibli"]},
  {question:"What is the longest-running anime series?",         answers:["Sazae-san"]},
  {question:"What does 'Anime' literally mean in Japanese?",     answers:["Animation"]},
  {question:"Which anime features the 'Fullmetal Alchemist'?",   answers:["Fullmetal Alchemist"]},
  {question:"What is Goku's alien race in Dragon Ball?",         answers:["Saiyan"]},
  {question:"In Naruto, what is Naruto's teacher's name?",       answers:["Kakashi Hatake"]},
  {question:"In Attack on Titan, what are the giant creatures called?", answers:["Titans"]},
];

function genFact()      { return { fact:    rnd(FACTS) }; }
function genFortune()   { return { fortune: rnd(FORTUNES) }; }
function genDogFact()   { return { fact:    rnd(DOG_FACTS) }; }
function genCatFact()   { return { fact:    rnd(CAT_FACTS) }; }
function genAnimeFact() { return rnd(ANIME_FACTS); }

// ── JSON syntax highlight ─────────────────────
function syntaxHL(json) {
  return json
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      m => {
        let cls = 'c-num';
        if (/^"/.test(m)) cls = /:$/.test(m) ? 'c-prop' : 'c-str';
        else if (/true|false/.test(m)) cls = 'c-keyword';
        else if (/null/.test(m))       cls = 'c-op';
        return `<span class="${cls}">${m}</span>`;
      }
    );
}

// ── Response rendering ────────────────────────
function showLoading(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="response-loading"><div class="spinner"></div>Generating response…</div>`;
}

function showResponse(id, data) {
  const el = document.getElementById(id);
  if (!el) return;
  const json  = JSON.stringify(data, null, 2);
  const safeJ = json.replace(/\\/g,'\\\\').replace(/`/g,'\\`');
  el.innerHTML = `
    <div class="response-toolbar">
      <div class="response-status-ok">
        <div class="status-dot"></div>
        <span>200 OK</span>
        <span style="color:var(--text-muted);margin-left:6px;">application/json</span>
      </div>
      <button class="response-copy" onclick="copyResp(this,\`${safeJ}\`)">Copy JSON</button>
    </div>
    <div class="response-body"><pre>${syntaxHL(json)}</pre></div>`;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div style="padding:24px;color:#f07178;font-family:var(--mono);font-size:13px;">⚠ ${msg}</div>`;
}

window.copyResp = function(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Copied';
    btn.style.color = '#68d391';
    setTimeout(() => { btn.textContent = 'Copy JSON'; btn.style.color = ''; }, 2000);
  }).catch(() => { btn.textContent = 'Failed'; });
};

// ── Run button helper ─────────────────────────
function wireRun(btnId, resId, fn) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (btn.classList.contains('running')) return;
    btn.classList.add('running');
    btn.textContent = '⏳';
    showLoading(resId);
    setTimeout(() => {
      try       { showResponse(resId, fn()); }
      catch (e) { showError(resId, e.message); }
      btn.classList.remove('running');
      btn.textContent = '▶ Run';
    }, 280);
  });
}

// ── Wire all endpoints ─────────────────────────
wireRun('run-user',       'res-user',        () => generateUser());
wireRun('run-users',      'res-users',       () => {
  const n = Math.min(parseInt(document.getElementById('inp-users-count')?.value) || 3, 20);
  return Array.from({length: n}, () => generateUser());
});
wireRun('run-creditcard', 'res-creditcard',  () => generateUser().creditCard);
wireRun('run-email',      'res-email',       () => genEmail());
wireRun('run-city',       'res-city',        () => genCity());
wireRun('run-password',   'res-password',    () => {
  const len = Math.min(parseInt(document.getElementById('inp-pass-len')?.value) || 12, 64);
  return genPassword(len);
});
wireRun('run-pokemon',       'res-pokemon',      () => generatePokemon());
wireRun('run-pokemon-type',  'res-pokemon-type', () => {
  const type = document.getElementById('inp-poke-type')?.value;
  const hits  = FD.pokemons.filter(p => p['Type 1'] === type || p['Type 2'] === type);
  if (!hits.length) return { error: `No Pokémon found with type: ${type}` };
  return rnd(hits);
});
wireRun('run-joke',          'res-joke',         () => generateJoke());
wireRun('run-fact',          'res-fact',         () => genFact());
wireRun('run-fortune',       'res-fortune',      () => genFortune());
wireRun('run-anime-quote',   'res-anime-quote',  () => generateAnime());
wireRun('run-anime-show',    'res-anime-show',   () => {
  const show = (document.getElementById('inp-anime-show')?.value || '').toLowerCase();
  const hits  = FD.animeQuotes.filter(q => q.anime.toLowerCase().includes(show));
  if (!hits.length) return { error: `No quotes found for: "${show}"` };
  return rnd(hits);
});
wireRun('run-anime-fact',    'res-anime-fact',   () => genAnimeFact());
wireRun('run-animal',        'res-animal',       () => generateAnimal());
wireRun('run-dog-fact',      'res-dog-fact',     () => genDogFact());
wireRun('run-cat-fact',      'res-cat-fact',     () => genCatFact());

// ── Sidebar navigation ────────────────────────
const sidebarItems = document.querySelectorAll('.sidebar-item');
const sections     = document.querySelectorAll('.api-section');

function showSection(name) {
  sections.forEach(s => s.classList.remove('active'));
  const target = document.getElementById('sec-' + name);
  if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
  sidebarItems.forEach(i => i.classList.remove('active'));
  const active = document.querySelector(`.sidebar-item[data-section="${name}"]`);
  if (active) active.classList.add('active');
}

sidebarItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    showSection(item.dataset.section);
  });
});

// ── Quickstart language tabs ──────────────────
document.querySelectorAll('.lang-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const lang = tab.dataset.lang;
    document.querySelectorAll('.code-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById('qs-' + lang);
    if (panel) panel.classList.remove('hidden');
  });
});
