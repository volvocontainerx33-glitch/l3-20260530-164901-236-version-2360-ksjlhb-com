(function () {
  const player = document.querySelector("#videoPlayer");
  const startButton = document.querySelector(".player-start");
  const playerBox = document.querySelector(".player-box");

  if (!player) {
    return;
  }

  const source = player.querySelector("source");
  const streamUrl = source ? source.getAttribute("src") : "";

  if (streamUrl && window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(player);
  } else if (streamUrl && player.canPlayType("application/vnd.apple.mpegurl")) {
    player.src = streamUrl;
  }

  function playVideo() {
    const promise = player.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (startButton) {
    startButton.addEventListener("click", playVideo);
  }

  player.addEventListener("play", function () {
    if (playerBox) {
      playerBox.classList.add("playing");
    }
  });

  player.addEventListener("pause", function () {
    if (playerBox) {
      playerBox.classList.remove("playing");
    }
  });
})();
