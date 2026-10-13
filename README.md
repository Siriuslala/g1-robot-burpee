# G1 Robot Performance

Unitree G1 舞台波比跳的静态展示网站：https://siriuslala.github.io/g1-robot-burpee

网站提供 Unitree G1 舞台表演的两个版本：v2 展示 GPT 在线监督与已有运动控制结合的连续仿真，v1 展示状态机控制的原有表演。两版均覆盖登台与搬运、放置与展示、支架俯卧撑、跳跃与谢幕四个阶段。

## 版本

首页默认展示 v2，左侧为第三人称视频，右侧为第一人称视频，支持同步播放、暂停、进度跳转与倍速。v2 采用 GPT 在线监督、任务顺序辅助和已有运动控制，共 53 次决策、155.908 s 连续仿真；模型决策期间暂停物理时间。视频按 15 fps 渲染，资源与审计分别位于 `assets/media/v2/` 和 `assets/data/v2/`，技术方案位于 `technical.html`。完整阶段执行及状态衔接审计通过，严格物理和部分动作质量检查未通过，详见技术方案。

v1 保存在 `v1/index.html`，保留原有播放器、视频、时间轴与说明，技术方案保存在 `technical_v1.html`。下述原视频参数与来源均属于 v1。

## 播放功能

- 默认使用运镜衔接视角、1 倍速播放；统一视角展示相同动作序列。
- 支持 0.5、1、1.5 和 2 倍速，切换视角时保留播放位置、倍速和播放状态。
- 动作按钮随视频进度高亮，点击按钮可定位到对应动作。下方四段进度条分别对应四个表演阶段。
- 视频通过点击播放启动，支持原生进度拖动、全屏和移动设备行内播放。

## 目录

| 路径 | 内容 |
| --- | --- |
| `index.html` | 页面结构及播放器 |
| `technical.html` | 技术方案，含控制流程、公式与参数说明 |
| `assets/css/method.css` | 技术方案页面及移动端排版 |
| `assets/css/site.css` | 桌面与移动端样式 |
| `assets/js/player.js` | 视角切换、倍速与阶段同步 |
| `assets/js/timeline.js` | 四阶段动作标签与起始时间 |
| `assets/media/` | 两种完整视频及封面 |
| `assets/data/` | 原始动作事件、渲染记录与资源 SHA-256 |
| `tests/player.mjs` | 浏览器交互检查 |

## 时间轴

动作边界来自完整仿真记录的 `events.json`。时间轴减去首个采样时刻 0.002 秒后对应视频时间，渲染采样率为 20 fps。相邻控制事件合并为便于观看的动作标签；跳跃中的后摆屈膝和前摆起跳按控制器的 1.5 秒与 2.8 秒偏移细分，落地起点来自后段 `metrics.csv` 中腾空后首次足部接触的采样时刻 48.744 秒。动作边界的显示精度受 0.05 秒视频帧间隔限制。

运镜衔接与统一视角使用同一组保存状态记录，源目录为 `artifacts/stage_performance/sequence_001`。前段为 `stage_transport/sequence_065_low`，后段为 `stage_burpee/flex_024`；运镜发生于约 95.67–98.66 秒。原始渲染记录保留在 `assets/data/render.json`，其中严格物理审计结果为 `false`。本页面提供仿真表演的可视化展示。

## 本地预览

无需构建步骤或前端依赖。在仓库目录启动静态服务器：

```bash
python3 -m http.server 8080
```

浏览器访问 `http://localhost:8080`。也可直接打开 `index.html`。

## 验证

浏览器检查需要可用的 `playwright` 包与 Chromium；网站运行本身不依赖它们。设置 `PLAYWRIGHT_MODULE` 为 Playwright 模块的绝对路径，设置 `CHROMIUM_PATH` 为浏览器路径，然后运行：

```bash
node tests/versions.mjs
node tests/player.mjs
```

检查覆盖默认选项、真实视频播放、所有倍速、视角切换时的位置与状态保留、连续快速切换、动作定位、高亮同步、视频末尾、移动布局、媒体错误提示以及 `/g1-robot-burpee/` 子路径资源加载。截图与结果写入已忽略的 `test-results/`。

## 静态资源缓存

CSS 和 JavaScript 的引用携带内容哈希版本号，资源内容改变后使用新的 URL，避免浏览器复用旧版文件。每次修改样式或脚本后，在提交前运行：

```bash
python3 scripts/version_assets.py
```

将更新的 HTML 与对应资源一同部署。重复运行且资源内容不变时，页面不会产生变化。
