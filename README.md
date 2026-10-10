# G1 Robot Performance

Unitree G1 舞台波比跳的静态展示网站：https://siriuslala.github.io/g1-robot-burpee

开发者用自然语言描述动作要求，GPT-6-Astra 在 Codex 中编写控制程序、运行 MuJoCo 仿真并依据实验反馈迭代。表演由本地控制程序结合预训练行走策略与全身控制执行。完整视频约 156.35 秒，覆盖登台与搬运、放置与展示、支架俯卧撑、跳跃与谢幕四个阶段。

## 播放功能

- 默认使用运镜衔接视角、1 倍速播放；统一视角展示相同动作序列。
- 支持 0.5、1、1.5 和 2 倍速，切换视角时保留播放位置、倍速和播放状态。
- 动作按钮随视频进度高亮，点击按钮可定位到对应动作。下方四段进度条分别对应四个表演阶段。
- 视频通过点击播放启动，支持原生进度拖动、全屏和移动设备行内播放。

## 目录

| 路径 | 内容 |
| --- | --- |
| `index.html` | 页面结构及播放器 |
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
node tests/player.mjs
```

检查覆盖默认选项、真实视频播放、所有倍速、视角切换时的位置与状态保留、连续快速切换、动作定位、高亮同步、视频末尾、移动布局、媒体错误提示以及 `/g1-robot-burpee/` 子路径资源加载。截图与结果写入已忽略的 `test-results/`。
