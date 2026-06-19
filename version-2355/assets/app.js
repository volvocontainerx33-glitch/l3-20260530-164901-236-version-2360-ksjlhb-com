(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });

    if (hero) {
      const image = slides[current].getAttribute('data-bg');
      hero.style.setProperty('--hero-bg', 'url("' + image + '")');
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function cardText(card) {
    return normalize([
      card.dataset.title,
      card.dataset.region,
      card.dataset.year,
      card.dataset.genre,
      card.dataset.tags
    ].join(' '));
  }

  function renderSearchResults(keyword) {
    if (!searchResults || !window.SEARCH_DATA) {
      return;
    }

    const q = normalize(keyword);
    searchResults.innerHTML = '';

    if (!q) {
      return;
    }

    const matches = window.SEARCH_DATA.filter(function (item) {
      return normalize(item.text).includes(q);
    }).slice(0, 16);

    matches.forEach(function (item) {
      const link = document.createElement('a');
      link.href = item.url;
      link.innerHTML = '<strong>' + item.title + '</strong><br><span>' + item.meta + '</span>';
      searchResults.appendChild(link);
    });
  }

  function filterCards(keyword) {
    const q = normalize(keyword);

    cards.forEach(function (card) {
      const matched = !q || cardText(card).includes(q);
      card.classList.toggle('hidden-card', !matched);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterCards(searchInput.value);
      renderSearchResults(searchInput.value);
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const value = button.getAttribute('data-filter') || '';
      if (searchInput) {
        searchInput.value = value;
      }
      filterCards(value);
      renderSearchResults(value);
    });
  });
}());
