(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    const root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const nextIndex = Number(dot.getAttribute('data-hero-dot')) || 0;
        show(nextIndex);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    const scopes = Array.from(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      const section = scope.closest('section') || document;
      const cards = Array.from(section.querySelectorAll('[data-card]'));
      const search = scope.querySelector('[data-search]');
      const type = scope.querySelector('[data-type-filter]');
      const year = scope.querySelector('[data-year-filter]');
      const empty = scope.querySelector('[data-empty]');

      function valueOf(element) {
        return element ? element.value.trim().toLowerCase() : '';
      }

      function cardText(card) {
        return [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
      }

      function apply() {
        const query = valueOf(search);
        const typeValue = valueOf(type);
        const yearValue = valueOf(year);
        let visible = 0;

        cards.forEach(function (card) {
          const text = cardText(card);
          const matchesQuery = !query || text.indexOf(query) !== -1;
          const matchesType = !typeValue || String(card.getAttribute('data-type')).toLowerCase() === typeValue;
          const matchesYear = !yearValue || String(card.getAttribute('data-year')).toLowerCase() === yearValue;
          const shouldShow = matchesQuery && matchesType && matchesYear;
          card.hidden = !shouldShow;
          if (shouldShow) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [search, type, year].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
  });
})();
