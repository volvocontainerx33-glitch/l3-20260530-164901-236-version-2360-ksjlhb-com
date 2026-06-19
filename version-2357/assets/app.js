(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length > 1) {
            var current = 0;
            var showSlide = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                });
            });
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]")).forEach(function (root) {
            var input = root.querySelector("[data-filter-input]");
            var year = root.querySelector("[data-filter-year]");
            var type = root.querySelector("[data-filter-type]");
            var region = root.querySelector("[data-filter-region]");
            var count = root.querySelector("[data-filter-count]");
            var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
            var run = function () {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var yearValue = year ? year.value : "";
                var typeValue = type ? type.value : "";
                var regionValue = region ? region.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var searchText = (card.getAttribute("data-search") || "").toLowerCase();
                    var matched = true;
                    if (keyword && searchText.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (yearValue && card.getAttribute("data-year") !== yearValue) {
                        matched = false;
                    }
                    if (typeValue && card.getAttribute("data-type") !== typeValue) {
                        matched = false;
                    }
                    if (regionValue && card.getAttribute("data-region") !== regionValue) {
                        matched = false;
                    }
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = "当前显示 " + visible + " 部影片";
                }
            };
            [input, year, type, region].forEach(function (control) {
                if (!control) {
                    return;
                }
                control.addEventListener("input", run);
                control.addEventListener("change", run);
            });
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-player-box]")).forEach(function (box) {
            var video = box.querySelector("video");
            var overlay = box.querySelector("[data-play-overlay]");
            var streamUrl = box.getAttribute("data-stream-url");
            var hlsInstance = null;
            var attached = false;
            if (!video || !overlay || !streamUrl) {
                return;
            }
            var attach = function () {
                if (attached) {
                    return;
                }
                attached = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new Hls();
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = streamUrl;
                }
            };
            var start = function () {
                attach();
                overlay.classList.add("is-hidden");
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {
                        overlay.classList.remove("is-hidden");
                    });
                }
            };
            overlay.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (!attached || video.paused) {
                    start();
                }
            });
        });
    });
})();
