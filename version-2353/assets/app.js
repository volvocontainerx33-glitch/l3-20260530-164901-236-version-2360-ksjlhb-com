(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
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
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (panel) {
        var section = panel.parentElement;
        var cards = Array.prototype.slice.call(section.querySelectorAll('[data-card]'));
        var search = panel.querySelector('[data-search-input]');
        var typeSelect = panel.querySelector('[data-type-filter]');
        var yearSelect = panel.querySelector('[data-year-filter]');

        function uniqueValues(name) {
            var values = [];
            cards.forEach(function (card) {
                var value = card.getAttribute(name) || '';
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            return values.sort(function (a, b) {
                return b.localeCompare(a, 'zh-CN');
            });
        }

        function fill(select, values) {
            if (!select) {
                return;
            }
            values.slice(0, 80).forEach(function (value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        fill(typeSelect, uniqueValues('data-type'));
        fill(yearSelect, uniqueValues('data-year'));

        function apply() {
            var q = search ? search.value.trim().toLowerCase() : '';
            var type = typeSelect ? typeSelect.value : '';
            var year = yearSelect ? yearSelect.value : '';

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();

                var matchesSearch = !q || haystack.indexOf(q) !== -1;
                var matchesType = !type || card.getAttribute('data-type') === type;
                var matchesYear = !year || card.getAttribute('data-year') === year;
                card.classList.toggle('is-hidden', !(matchesSearch && matchesType && matchesYear));
            });
        }

        [search, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    });
})();
