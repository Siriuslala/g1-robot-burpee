/* Keep camera changes on the same recording clock, including rapid changes. */
(() => {
  'use strict';
  const video = document.querySelector('#performance');
  const error = document.querySelector('#player-error');
  const start = document.querySelector('#start');
  const currentAction = document.querySelector('#current-action');
  const currentTime = document.querySelector('#current-time');
  const playbackState = document.querySelector('#playback-state');
  const viewButtons = [...document.querySelectorAll('[data-view]')];
  const speedButtons = [...document.querySelectorAll('[data-speed]')];
  const { duration, phases } = window.G1_TIMELINE;
  const notes = {
    transition: '运镜衔接 · 登台与搬运保持全景，俯卧撑前平滑转至近景。',
    fixed: '统一视角 · 全程使用同一全景视角，完整观察舞台、机器人与支架。',
  };
  const formatTime = (time) => `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
  let view = 'transition';
  let rate = 1;
  let pending = null;
  let revision = 0;
  let activeIndex = -1;
  let frame = null;
  const actions = [];
  const phaseElements = [];
  const progressElements = [];

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  async function play() {
    const currentRevision = revision;
    try {
      await video.play();
      if (currentRevision === revision) error.hidden = true;
    } catch (cause) {
      if (currentRevision !== revision || cause.name === 'AbortError') return;
      showError(cause.name === 'NotAllowedError'
        ? '浏览器暂停了自动续播，请点击视频中的播放按钮继续。'
        : '视频暂时无法播放，请检查网络连接后重试，或切换另一视角。');
    }
  }

  function seek(time) {
    if (pending) pending.time = time;
    else if (video.readyState >= 1) video.currentTime = Math.min(time, video.duration);
    else pending = { time, playing: false };
    update();
  }

  phases.forEach((phase, phaseIndex) => {
    const end = phases[phaseIndex + 1]?.start ?? duration;
    const section = document.createElement('section');
    section.className = 'phase';
    section.setAttribute('aria-labelledby', `phase-${phaseIndex}`);
    const heading = document.createElement('div');
    heading.className = 'phase-heading';
    heading.innerHTML = `<div class="phase-topline"><span class="phase-number">0${phaseIndex + 1}</span><span class="phase-range">${formatTime(phase.start)} — ${formatTime(end)}</span></div><h3 id="phase-${phaseIndex}">${phase.title}</h3><p class="phase-subtitle">${phase.subtitle}</p>`;
    section.append(heading);
    const list = document.createElement('ol');
    list.className = 'action-list';
    phase.actions.forEach((action) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'action-button';
      button.dataset.time = action.start;
      button.setAttribute('aria-label', `${action.label}，跳转到 ${action.start.toFixed(2)} 秒`);
      const label = document.createElement('span');
      label.textContent = action.label;
      const time = document.createElement('time');
      time.dateTime = `PT${action.start}S`;
      time.textContent = formatTime(action.start);
      button.append(label, time);
      button.addEventListener('click', () => seek(action.start));
      item.append(button);
      list.append(item);
      actions.push({ ...action, button, phaseIndex });
    });
    section.append(list);
    document.querySelector('#phases').append(section);
    phaseElements.push(section);
    const progress = document.createElement('button');
    progress.type = 'button';
    progress.style.flex = end - phase.start;
    progress.title = `${phase.title} · ${formatTime(phase.start)}`;
    progress.setAttribute('aria-label', `跳转到第 ${phaseIndex + 1} 阶段：${phase.title}`);
    progress.addEventListener('click', () => seek(phase.start));
    const fill = document.createElement('span');
    progress.append(fill);
    document.querySelector('#chapter-progress').append(progress);
    progressElements.push({ fill, start: phase.start, end });
  });

  function update() {
    const time = pending?.time ?? video.currentTime;
    currentTime.textContent = formatTime(time);
    playbackState.textContent = video.error ? '加载失败' : pending ? '切换中' : video.ended ? '表演结束' : video.paused ? (time > 0 ? '已暂停' : '准备就绪') : '正在播放';
    let index = 0;
    for (let i = 0; i < actions.length; i++) {
      if (actions[i].start <= time + 0.001) index = i;
      else break;
    }
    if (index !== activeIndex) {
      activeIndex = index;
      actions.forEach((action, i) => {
        if (i === index) action.button.setAttribute('aria-current', 'step');
        else action.button.removeAttribute('aria-current');
      });
      phaseElements.forEach((element, i) => element.classList.toggle('active', i === actions[index].phaseIndex));
      currentAction.textContent = actions[index].label;
    }
    for (const progress of progressElements) {
      progress.fill.style.width = `${100 * Math.max(0, Math.min(1, (time - progress.start) / (progress.end - progress.start)))}%`;
    }
  }

  function tick() {
    update();
    if (!video.paused && !video.ended) frame = requestAnimationFrame(tick);
    else frame = null;
  }

  for (const button of viewButtons) button.addEventListener('click', () => {
    const next = button.dataset.view;
    if (view === next && !video.error) return;
    pending = pending ?? { time: video.currentTime, playing: !video.paused && !video.ended };
    revision++;
    video.pause();
    view = next;
    error.hidden = true;
    video.poster = `assets/media/v3/${view}_poster.png`;
    video.src = `assets/media/v3/${view}.mp4`;
    video.load();
    video.playbackRate = rate;
    viewButtons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    document.querySelector('#view-note').textContent = notes[view];
    const download = document.querySelector('#download-video');
    download.href = `assets/media/v3/${view}.mp4`;
    download.download = `g1-performance-${view}.mp4`;
    document.querySelector('#download-label').textContent = '下载第三人称视频';
    update();
  });

  for (const button of speedButtons) button.addEventListener('click', () => {
    rate = Number(button.dataset.speed);
    video.playbackRate = rate;
    speedButtons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(Number(candidate.dataset.speed) === rate)));
  });

  video.addEventListener('loadedmetadata', () => {
    document.querySelector('#duration').textContent = formatTime(video.duration);
    video.playbackRate = rate;
    if (Math.abs(video.duration - duration) > 0.1) {
      showError('视频时长与动作时间轴不一致，请检查视频文件与阶段数据的版本。');
      return;
    }
    if (pending) {
      const state = pending;
      pending = null;
      video.currentTime = Math.min(state.time, video.duration);
      if (state.playing) void play();
    }
    update();
  });
  video.addEventListener('ratechange', () => {
    if (pending) return;
    rate = video.playbackRate;
    speedButtons.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.speed) === rate)));
  });
  video.addEventListener('play', () => {
    start.hidden = true;
    if (frame === null) tick();
  });
  for (const event of ['timeupdate', 'seeking', 'seeked', 'pause', 'ended']) video.addEventListener(event, update);
  video.addEventListener('error', () => {
    showError('视频加载失败。请检查网络连接，或点击视角按钮重新加载。');
    update();
  });
  start.addEventListener('click', () => {
    if (pending) pending.playing = true;
    else void play();
  });
  update();
})();
