(function () {
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    let index = 0;

    function showSlide(nextIndex) {
      slides[index].classList.remove("active");
      dots[index].classList.remove("active");
      index = nextIndex;
      slides[index].classList.add("active");
      dots[index].classList.add("active");
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide((index + 1) % slides.length);
      }, 5200);
    }
  }

  const input = document.querySelector("#pageSearch");

  if (input) {
    const cards = Array.from(document.querySelectorAll(".movie-card"));

    input.addEventListener("input", function () {
      const value = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        const title = (card.dataset.title || "").toLowerCase();
        const tags = (card.dataset.tags || "").toLowerCase();
        const year = (card.dataset.year || "").toLowerCase();
        const matched = !value || title.includes(value) || tags.includes(value) || year.includes(value);
        card.classList.toggle("hidden-by-search", !matched);
      });
    });
  }
})();
