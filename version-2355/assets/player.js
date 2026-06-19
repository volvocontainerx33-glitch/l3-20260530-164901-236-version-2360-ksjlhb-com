(function () {
  const player = document.querySelector('[data-video-player]');
  const button = document.querySelector('[data-play-button]');
  const overlay = document.querySelector('[data-play-overlay]');
  let loaded = false;

  if (!player) {
    return;
  }

  function beginPlayback() {
    const source = player.getAttribute('data-src');

    if (!source) {
      return;
    }

    if (!loaded) {
      loaded = true;

      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(player);
      } else {
        player.src = source;
      }
    }

    if (overlay) {
      overlay.classList.add('hidden');
    }

    player.play().catch(function () {});
  }

  if (button) {
    button.addEventListener('click', beginPlayback);
  }

  player.addEventListener('click', beginPlayback, { once: true });
}());
