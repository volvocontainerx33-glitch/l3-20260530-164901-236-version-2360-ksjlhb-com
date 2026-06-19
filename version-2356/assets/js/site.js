(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  var params = new URLSearchParams(window.location.search);
  var queryFromUrl = params.get("q") || "";

  document.querySelectorAll(".js-card-scope").forEach(function (scope) {
    var searchInput = scope.querySelector(".js-card-search");
    var filters = Array.prototype.slice.call(scope.querySelectorAll(".js-card-filter"));
    var emptyState = scope.querySelector("[data-empty-state]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-card"));

    if (searchInput && queryFromUrl && !searchInput.value) {
      searchInput.value = queryFromUrl;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
      var query = normalize(searchInput ? searchInput.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" "));

        var matchedQuery = !query || text.indexOf(query) !== -1;
        var matchedFilters = filters.every(function (filter) {
          var field = filter.getAttribute("data-filter");
          var value = normalize(filter.value);
          return !value || normalize(card.getAttribute("data-" + field)) === value;
        });
        var matched = matchedQuery && matchedFilters;
        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
    }

    filters.forEach(function (filter) {
      filter.addEventListener("change", applyFilter);
    });

    if (queryFromUrl) {
      applyFilter();
    }
  });
}());
