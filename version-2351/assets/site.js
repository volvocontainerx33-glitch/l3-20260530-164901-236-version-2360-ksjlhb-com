(function () {
  var app = {};

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  app.initCommon = function () {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length) {
      var current = 0;
      var show = function (index) {
        current = index;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
        });
      });
      window.setInterval(function () {
        show((current + 1) % slides.length);
      }, 5200);
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-search-input]")).forEach(function (input) {
      var scopeId = input.getAttribute("data-search-input");
      var scope = document.getElementById(scopeId);
      if (!scope) {
        return;
      }
      var controls = Array.prototype.slice.call(document.querySelectorAll("[data-filter-for='" + scopeId + "']"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-card"));
      var apply = function () {
        var q = input.value.trim().toLowerCase();
        var filterText = controls.map(function (item) {
          return item.value || "";
        }).join(" ").trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var hitQ = !q || text.indexOf(q) !== -1;
          var hitFilter = !filterText || text.indexOf(filterText) !== -1;
          card.classList.toggle("is-hidden-card", !(hitQ && hitFilter));
        });
      };
      input.addEventListener("input", apply);
      controls.forEach(function (item) {
        item.addEventListener("change", apply);
      });
    });
  };

  app.initPlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var mask = document.getElementById(options.maskId);
    if (!video || !options.source) {
      return;
    }

    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(options.source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = options.source;
      }
    }

    function start() {
      attach();
      if (mask) {
        mask.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (mask) {
      mask.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (mask) {
        mask.classList.add("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  window.VideoApp = app;
  ready(app.initCommon);
})();
