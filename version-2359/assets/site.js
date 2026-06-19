
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function initNav() {
    const toggle = qs('.nav-toggle');
    const nav = qs('.site-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) nav.classList.remove('open');
    });
  }

  function initHeroSlider() {
    const wrap = qs('[data-hero-slider]');
    if (!wrap) return;
    const slides = qsa('.hero-slide', wrap);
    const dotsWrap = qs('.hero-dots', wrap);
    const prev = qs('.hero-prev', wrap);
    const next = qs('.hero-next', wrap);
    if (!slides.length) return;
    let idx = 0;
    const dots = slides.map((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
      btn.type = 'button';
      btn.setAttribute('aria-label', '切换到第 ' + (i + 1) + ' 张');
      btn.addEventListener('click', () => show(i));
      dotsWrap && dotsWrap.appendChild(btn);
      return btn;
    });

    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    }
    function step(n) { show(idx + n); }
    prev && prev.addEventListener('click', () => step(-1));
    next && next.addEventListener('click', () => step(1));
    let timer = setInterval(() => step(1), 4500);
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', () => { timer = setInterval(() => step(1), 4500); });
  }

  function initHeroSearch() {
    const input = qs('#heroSearchInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = encodeURIComponent(input.value.trim());
        window.location.href = 'search.html' + (q ? '?q=' + q : '');
      }
    });
  }

  function initPlayers() {
    qsa('[data-player-shell]').forEach((shell) => {
      const video = qs('video', shell);
      const btn = qs('.player-overlay', shell);
      if (!video || !btn) return;
      function syncIcon() { btn.textContent = video.paused ? '▶' : '❚❚'; }
      btn.addEventListener('click', async () => {
        try {
          if (video.paused) {
            await video.play();
          } else {
            video.pause();
          }
        } catch (err) {
          console.warn(err);
        }
        syncIcon();
      });
      video.addEventListener('play', syncIcon);
      video.addEventListener('pause', syncIcon);
      video.addEventListener('ended', syncIcon);
      syncIcon();
    });
  }

  function initSearchPage() {
    const input = qs('#searchInput');
    const region = qs('#filterRegion');
    const type = qs('#filterType');
    const year = qs('#filterYear');
    const results = qs('#searchResults');
    const summary = qs('#searchSummary');
    if (!input || !results || !summary || !window.MOVIE_INDEX) return;

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) input.value = q;
    const years = Array.from(new Set(window.MOVIE_INDEX.map(i => i.year).filter(Boolean))).sort((a,b) => String(b).localeCompare(String(a)));
    const regions = Array.from(new Set(window.MOVIE_INDEX.map(i => i.region).filter(Boolean))).sort((a,b) => a.localeCompare(b, 'zh-Hans-CN'));
    const types = Array.from(new Set(window.MOVIE_INDEX.map(i => i.type).filter(Boolean))).sort((a,b) => a.localeCompare(b, 'zh-Hans-CN'));

    regions.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; region.appendChild(o); });
    types.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; type.appendChild(o); });
    years.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; year.appendChild(o); });

    function card(item) {
      const card = document.createElement('article');
      card.className = 'movie-card';
      card.innerHTML = `
        <a class="movie-poster" href="${item.href}" style="--c1:${item.c1};--c2:${item.c2};">
          <span class="poster-glow"></span>
          <span class="poster-letter">${item.letter}</span>
          <span class="poster-chip">${item.year || '未知年份'}</span>
        </a>
        <div class="movie-body">
          <h3 class="movie-title"><a href="${item.href}">${item.title}</a></h3>
          <p class="movie-meta">${item.region} · ${item.type} · ${item.year}</p>
          <p class="movie-tags">${item.genre}</p>
          <p class="movie-desc">${item.summary}</p>
          <div class="movie-actions"><a class="btn btn-primary" href="${item.href}">查看详情</a><a class="btn btn-ghost" href="${item.href}#player">在线播放</a></div>
        </div>`;
      return card;
    }

    function render() {
      const kw = input.value.trim().toLowerCase();
      const rv = region.value;
      const tv = type.value;
      const yv = year.value;
      const filtered = window.MOVIE_INDEX.filter((item) => {
        const hay = [item.title, item.region, item.type, item.genre, item.tags, item.summary].join(' ').toLowerCase();
        if (kw && !hay.includes(kw)) return false;
        if (rv && item.region !== rv) return false;
        if (tv && item.type !== tv) return false;
        if (yv && String(item.year) !== String(yv)) return false;
        return true;
      });
      results.innerHTML = '';
      filtered.slice(0, 300).forEach((item) => results.appendChild(card(item)));
      summary.textContent = `共找到 ${filtered.length} 部影片，当前展示前 ${Math.min(filtered.length, 300)} 条。`;
    }
    input.addEventListener('input', render);
    region.addEventListener('change', render);
    type.addEventListener('change', render);
    year.addEventListener('change', render);
    render();
  }

  ready(function () {
    initNav();
    initHeroSlider();
    initHeroSearch();
    initPlayers();
    initSearchPage();
  });
})();
