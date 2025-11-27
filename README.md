# SpriteForge - AI-Powered Sprite Sheet to GIF Converter

**SpriteForge** 是一个专业的 Web 工具，旨在帮助游戏开发者、UI 设计师和像素艺术家将 Sprite Sheets（精灵图表）快速切分并转换为高质量的 GIF 动图。

该项目的一大亮点是集成了 **Google Gemini AI**，能够智能分析图片布局，自动检测精灵图的行数和列数，极大地简化了手动配置的繁琐过程。

![SpriteForge Preview](https://via.placeholder.com/800x450.png?text=SpriteForge+Interface)

## ✨ 核心功能 (Key Features)

### 🤖 AI 智能布局检测
- 集成 **Gemini 2.5 Flash Image** 模型。
- 上传图片后，点击 "AI Auto-Detect Layout"，AI 将自动分析并计算 Sprite Sheet 的行数和列数，实现一键配置。

### ✂️ 精确的切片控制
- **自定义裁剪**：支持手动调整裁剪起点（X, Y）以及裁剪区域的宽（Width）和高（Height）。
- **网格设置**：自由调整行数（Rows）和列数（Columns），实时预览切割效果。

### 🎞️ 可视化帧管理
- **交互式网格**：生成的每一帧都会在右侧网格中展示。
- **帧过滤**：点击任意网格即可“排除/恢复”该帧。被排除的帧将不会出现在最终的 GIF 动画中（非常适合处理 Sprite Sheet 中的空白占位符）。

### ⚡ 动画参数调节
- **FPS 控制**：支持 1~60 FPS 的播放速度调节，实时决定动画的快慢。
- **实时生成**：基于浏览器端的 Canvas 和 Web Worker 技术，快速生成 GIF，无需上传图片到服务器处理（AI 检测除外）。

### 💾 即时预览与下载
- 生成完成后提供即时预览。
- 支持一键下载生成的 `.gif` 文件。

## 🛠️ 技术栈 (Tech Stack)

- **Frontend**: [React 19](https://react.dev/), TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini 2.5 Flash)
- **Image Processing**: HTML5 Canvas API
- **GIF Generation**: [gif.js](https://github.com/jnordberg/gif.js)

## 🚀 快速开始 (Getting Started)

### 前置要求
你需要一个 Google Gemini API Key。请访问 [Google AI Studio](https://aistudio.google.com/) 获取。

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/sprite-forge.git
   cd sprite-forge
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   在项目根目录创建或配置环境变量，确保 `API_KEY` 可用（通常在构建工具如 Vite/Webpack 或云开发环境中配置）。
   > 注意：本项目目前设计为在支持 `process.env.API_KEY` 注入的环境中运行。

4. **启动项目**
   ```bash
   npm start
   # 或
   npm run dev
   ```

## 📖 使用指南

1. **上传图片**：点击左侧上传区域或拖拽 PNG/JPG 文件。
2. **AI 检测（可选）**：点击 "AI Auto-Detect Layout" 按钮，让 AI 自动识别网格结构。
3. **手动微调**：
   - 调整裁剪参数以去除图片边缘的留白。
   - 调整 Rows/Cols 确保每个精灵被正确包裹。
4. **筛选帧**：在右侧预览区，点击不需要的帧（如空白格）将其变红排除。
5. **设置速度**：拖动 FPS 滑块调整动画速度。
6. **生成导出**：点击 "Generate GIF"，等待生成完毕后点击 "Download GIF"。

## 🤝 贡献 (Contributing)

欢迎提交 Issue 或 Pull Request 来改进这个项目！

## 📄 许可证 (License)

MIT License
