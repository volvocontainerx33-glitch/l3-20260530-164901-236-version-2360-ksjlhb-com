(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let index = 0;
    let timer = null;

    const show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    };

    const start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };

    const restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")));
        restart();
      });
    });

    start();
  }

  const inputs = Array.from(document.querySelectorAll("[data-search-input]"));
  const clearButtons = Array.from(document.querySelectorAll("[data-clear-search]"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const lists = Array.from(document.querySelectorAll("[data-card-list]"));
  const emptyStates = Array.from(document.querySelectorAll("[data-empty-state]"));
  let currentFilter = "all";

  const cardMatches = function (card, query) {
    const text = [
      card.getAttribute("data-title"),
      card.getAttribute("data-genre"),
      card.getAttribute("data-region"),
      card.getAttribute("data-type"),
      card.getAttribute("data-tags")
    ].join(" ").toLowerCase();

    const category = card.getAttribute("data-category") || "";
    const filterOk = currentFilter === "all" || category === currentFilter;
    const searchOk = !query || text.indexOf(query) !== -1;
    return filterOk && searchOk;
  };

  const applySearch = function () {
    const query = (inputs[0] ? inputs[0].value : "").trim().toLowerCase();

    lists.forEach(function (list, listIndex) {
      const cards = Array.from(list.querySelectorAll(".movie-card"));
      let visible = 0;

      cards.forEach(function (card) {
        const ok = cardMatches(card, query);
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });

      if (emptyStates[listIndex]) {
        emptyStates[listIndex].classList.toggle("show", visible === 0);
      }
    });
  };

  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      inputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applySearch();
    });
  });

  clearButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      inputs.forEach(function (input) {
        input.value = "";
      });
      applySearch();
    });
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      applySearch();
    });
  });

  const players = Array.from(document.querySelectorAll("[data-player]"));

  players.forEach(function (wrap) {
    const video = wrap.querySelector("video");
    const button = wrap.querySelector(".play-layer");
    const src = wrap.getAttribute("data-stream");
    let ready = false;
    let hls = null;

    const attach = function () {
      if (!video || !src || ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        ready = true;
        return;
      }

      video.src = src;
      ready = true;
    };

    const play = function () {
      attach();
      if (button) {
        button.classList.add("is-hidden");
      }
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    };

    if (button && video) {
      button.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("play", function () {
        if (button) {
          button.classList.add("is-hidden");
        }
      });

      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    }
  });
})();
