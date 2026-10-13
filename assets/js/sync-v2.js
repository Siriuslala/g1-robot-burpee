/* Either native player can control the shared recording clock. */
(() => {
  'use strict';
  const main = document.querySelector('#performance');
  const ego = document.querySelector('#first-person');
  const error = document.querySelector('#player-error');
  const players = [main, ego];
  function report() {
    error.textContent = '视频同步播放失败，请重新点击播放，或下载视频观看。';
    error.hidden = false;
  }
  function align(source, target, tolerance = 0.08) {
    if (source.readyState >= 1 && target.readyState >= 1 && Math.abs(source.currentTime - target.currentTime) > tolerance) {
      target.currentTime = Math.min(source.currentTime, target.duration);
    }
  }
  for (const source of players) {
    const target = source === main ? ego : main;
    source.addEventListener('play', () => {
      align(source, target);
      if (target.paused && !target.ended) target.play().catch(cause => {
        if (cause.name !== 'AbortError') { source.pause(); report(); }
      });
    });
    source.addEventListener('pause', () => { if (!target.paused) target.pause(); });
    source.addEventListener('seeking', () => align(source, target));
    source.addEventListener('ratechange', () => {
      if (target.playbackRate !== source.playbackRate) target.playbackRate = source.playbackRate;
    });
    source.addEventListener('ended', () => target.pause());
  }
  ego.addEventListener('loadedmetadata', () => {
    align(main, ego);
    ego.playbackRate = main.playbackRate;
    if (Math.abs(ego.duration - window.G1_TIMELINE.duration) > 0.1) report();
  });
  ego.addEventListener('error', report);
  main.addEventListener('timeupdate', () => {
    if (!main.paused && !ego.paused && !main.seeking && !ego.seeking && main.readyState >= 3 && ego.readyState >= 3) align(main, ego, 0.25);
  });
})();
