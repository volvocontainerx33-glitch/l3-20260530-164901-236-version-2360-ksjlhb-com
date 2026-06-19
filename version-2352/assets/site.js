
(function(){
  const qs = (s, p=document) => p.querySelector(s);
  const qsa = (s, p=document) => Array.from(p.querySelectorAll(s));

  function setupNav(){
    const toggle = qs('[data-nav-toggle]');
    const nav = qs('[data-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  function setupHero(){
    const slides = qsa('[data-hero-slide]');
    if (!slides.length) return;
    let i = 0;
    const show = (n) => {
      slides.forEach((el, idx) => el.classList.toggle('active', idx === n));
    };
    show(0);
    setInterval(() => {
      i = (i + 1) % slides.length;
      show(i);
    }, 5000);
  }

  function setupPlayer(){
    const shell = qs('[data-player-shell]');
    const video = qs('video[data-hls-src]', shell || document);
    const btn = qs('[data-play-btn]', shell || document);
    const overlay = qs('[data-play-overlay]', shell || document);
    if (!shell || !video || !btn || !overlay) return;
    const src = video.getAttribute('data-hls-src');
    let started = false;
    function start(){
      if (started) return;
      started = true;
      overlay.classList.add('hidden');
      const canNative = video.canPlayType('application/vnd.apple.mpegurl');
      if (video.src && video.src !== src) video.removeAttribute('src');
      if (window.Hls && !canNative) {
        if (video._hlsInstance) {
          try { video._hlsInstance.destroy(); } catch(e) {}
        }
        const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
        video._hlsInstance = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, function(evt, data){
          console.warn('HLS error', data);
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function(){ video.play().catch(()=>{}); });
      } else {
        video.src = src;
        video.play().catch(()=>{});
      }
    }
    btn.addEventListener('click', start);
    overlay.addEventListener('click', start);
    video.addEventListener('click', start);
  }

  function setupFilter(){
    const input = qs('[data-filter-input]');
    const cards = qsa('[data-filter-card]');
    if (!input || !cards.length) return;
    const count = qs('[data-filter-count]');
    const apply = () => {
      const v = input.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach(card => {
        const txt = (card.getAttribute('data-search') || '').toLowerCase();
        const ok = !v || txt.includes(v);
        card.style.display = ok ? '' : 'none';
        if (ok) shown += 1;
      });
      if (count) count.textContent = shown;
    };
    input.addEventListener('input', apply);
    apply();
  }

  function setupJump(){
    qsa('[data-scroll-to]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.querySelector(btn.getAttribute('data-scroll-to'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    setupNav();
    setupHero();
    setupPlayer();
    setupFilter();
    setupJump();
  });
})();
