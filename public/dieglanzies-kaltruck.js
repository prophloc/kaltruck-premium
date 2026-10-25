// Karuzela Die Glanzies v13 przeniesiona do usług KALTRUCK.
const services = [
  { title: 'Transport<br>kontenerów', shortTitle: 'Transport kontenerów',
    label: '01 / 03', icon: '▣',
    desc: 'Odbiór, transport i ustawienie kontenera jednym zestawem z żurawiem HDS.',
    checks: ['Kontenery', 'Ustawienie', 'Rozładunek'],
    image: 'https://hdsplock.pl/zdj/realizacje/transport-kontenerow-07.jpg',
    alt: 'Transport kontenera samochodem HDS KALTRUCK',
    url: '/transport-kontenerow/' },
  { title: 'Transport<br>prefabrykatów', shortTitle: 'Transport prefabrykatów',
    label: '02 / 03', icon: '▥',
    desc: 'Przewóz, podnoszenie oraz ustawianie ciężkich elementów budowlanych.',
    checks: ['Beton', 'Konstrukcje', 'Montaż'],
    image: 'https://hdsplock.pl/zdj/realizacje/prefabrykaty-betonowe-05.jpg',
    alt: 'Rozładunek prefabrykatów betonowych HDS KALTRUCK',
    url: '/transport-prefabrykatow/' },
  { title: 'Transport<br>maszyn', shortTitle: 'Transport maszyn',
    label: '03 / 03', icon: '⚙',
    desc: 'Transport maszyn i urządzeń wraz z ich bezpiecznym rozładunkiem.',
    checks: ['Przemysł', 'Maszyny', 'Urządzenia'],
    image: 'https://hdsplock.pl/zdj/realizacje/suwnice-przemys-owe-04.jpg',
    alt: 'Prace HDS przy ciężkiej maszynie przemysłowej',
    url: '/transport-maszyn/' }
];

const stage = document.getElementById('cardsStage');
const serviceBox = document.getElementById('activeServiceBox');
const serviceTitle = document.getElementById('activeServiceTitle');
const dots = document.getElementById('dots');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');

if (stage && serviceBox && serviceTitle && dots && prev && next) {
  let active = 0;
  const mod = n => (n % services.length + services.length) % services.length;
  const escapeHtml = s => s.replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  stage.innerHTML = services.map((s, i) => `
    <article class="service-card" data-index="${i}" aria-hidden="${i !== 0}">
      <div class="card-inner">
        <div class="card-top"><span class="card-badge">${s.label}</span><span class="card-icon" aria-hidden="true">${s.icon}</span></div>
        <div class="card-body">
          <div class="card-copy"><h2>${s.title}</h2><p>${escapeHtml(s.desc)}</p>
            <div class="checks">${s.checks.map(x => `<span>${escapeHtml(x)}</span>`).join('')}</div></div>
          <div class="photo-panel"><img src="${s.image}" width="420" height="680" loading="lazy" alt="${escapeHtml(s.alt)}"></div>
        </div>
        <a class="more-btn" href="${s.url}">Sprawdź usługę <span aria-hidden="true">›</span></a>
      </div>
    </article>`).join('');
  dots.innerHTML = services.map((s, i) =>
    `<button type="button" class="dot" data-dot="${i}" aria-label="Pokaż: ${s.shortTitle}" aria-pressed="${i === 0}"></button>`
  ).join('');

  function render() {
    [...stage.children].forEach((card, i) => {
      const offset = mod(i - active);
      card.dataset.pos = String(offset);
      card.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
      const link = card.querySelector('a');
      if (link) link.tabIndex = offset === 0 ? 0 : -1;
    });
    serviceTitle.textContent = services[active].shortTitle;
    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
      dot.setAttribute('aria-pressed', i === active ? 'true' : 'false');
    });
  }
  function setActive(n) { active = mod(n); render(); }
  [...dots.children].forEach((dot, i) => dot.addEventListener('click', () => setActive(i)));
  [...stage.children].forEach((card, i) => card.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    setActive(i);
  }));
  serviceBox.addEventListener('click', () => setActive(active + 1));
  prev.addEventListener('click', () => setActive(active - 1));
  next.addEventListener('click', () => setActive(active + 1));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) return;
    if (event.key === 'ArrowLeft') setActive(active - 1);
    if (event.key === 'ArrowRight') setActive(active + 1);
  });
  render();
}