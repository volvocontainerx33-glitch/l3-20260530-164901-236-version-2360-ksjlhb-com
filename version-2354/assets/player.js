(function () {
  function bindNative(video, streamUrl) {
    video.src = streamUrl;
  }

  function bindHls(video, streamUrl) {
    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return hls;
    }
    bindNative(video, streamUrl);
    return null;
  }

  window.initMoviePlayer = function (videoId, streamUrl, buttonId) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    if (!video || !button || !streamUrl) {
      return;
    }

    let hls = null;
    const nativeType = 'application/vnd.apple.mpegurl';
    if (video.canPlayType(nativeType)) {
      bindNative(video, streamUrl);
    } else {
      hls = bindHls(video, streamUrl);
    }

    function startPlayback() {
      button.classList.add('is-hidden');
      video.controls = true;
      const playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        button.classList.remove('is-hidden');
      }
    });
    video.addEventListener('ended', function () {
      button.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
