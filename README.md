# 会议记录 - Notion风格编辑器

一个支持语音输入的Notion风格文本编辑器，基于Next.js和TipTap构建。

## 功能特性

- 📝 **Notion风格编辑器**: 使用TipTap构建的富文本编辑器
- 🎤 **实时语音转录**: 支持连续语音识别和实时转录显示
- 🤖 **AI会议总结**: 集成OpenAI GPT生成结构化会议总结
- 🎨 **现代化UI**: 简洁美观的用户界面
- 📱 **响应式设计**: 支持各种设备尺寸

## 技术栈

- **Next.js 15**: React框架
- **TipTap**: 富文本编辑器
- **Tailwind CSS**: 样式框架
- **Web Speech API**: 语音识别
- **OpenAI GPT-4o**: AI会议总结
- **TypeScript**: 类型安全

## 快速开始

1. 安装依赖:
```bash
npm install
```

2. 配置环境变量 (可选，用于AI会议总结功能):
```bash
# 方法1: 使用npm命令 (推荐)
npm run setup

# 方法2: 使用设置脚本
./setup.sh

# 方法3: 手动配置
cp .env.example .env.local
# 然后编辑 .env.local 文件，添加您的OpenAI API密钥
```

3. 启动开发服务器:
```bash
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

1. **文本编辑**: 直接在编辑器中输入文本
2. **语音输入**: 点击"开始录音"按钮，允许麦克风权限后即可进行语音输入
3. **停止录音**: 点击"停止录音"按钮结束语音输入
4. **AI会议总结**: 输入会议内容后，点击"生成总结"按钮获取AI生成的会议总结
5. **插入总结**: 预览总结内容，选择插入到编辑器或关闭

## 浏览器支持

语音识别功能需要支持Web Speech API的浏览器：
- Chrome (推荐)
- Edge
- Safari (部分支持)

## 环境配置

### OpenAI API 配置

1. 复制 `.env.example` 文件为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，添加您的OpenAI API密钥：
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   OPENAI_MODEL=gpt-4o
   ```

## 注意事项

- 首次使用需要允许麦克风权限
- 语音识别需要网络连接
- AI会议总结功能需要配置OpenAI API密钥
- 建议在安静的环境中使用语音功能以获得最佳效果
