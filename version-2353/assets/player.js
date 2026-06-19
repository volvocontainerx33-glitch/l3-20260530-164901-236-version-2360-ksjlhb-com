(function () {
    function setupPlayer(shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('[data-play-button]');
        var source = video ? video.querySelector('source') : null;
        var url = source ? source.getAttribute('src') : '';
        var started = false;
        var hls = null;

        if (!video || !url) {
            return;
        }

        if (source) {
            source.remove();
        }

        function attach() {
            if (started) {
                return;
            }
            started = true;

            if (button) {
                button.classList.add('is-hidden');
            }

            video.setAttribute('controls', 'controls');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = url;
            video.play().catch(function () {});
        }

        if (button) {
            button.addEventListener('click', attach);
        }

        video.addEventListener('click', function () {
            if (!started) {
                attach();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
