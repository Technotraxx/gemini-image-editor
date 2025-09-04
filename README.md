# Gemini Image Editor

A conversational AI-powered image generation and editing application built with Next.js and Google's Gemini models, featuring native image generation capabilities through Gemini 2.5 Flash Image Preview.

## ✨ Features

### Core Capabilities
- **🎨 AI Image Generation**: Create images from text descriptions using Gemini 2.5 Flash Image Preview
- **✏️ Smart Image Editing**: Transform existing images through natural language commands
- **💬 Conversational Interface**: Chat-based interaction for intuitive image manipulation
- **🔄 Iterative Refinement**: Continue editing through multi-turn conversations
- **📸 Multi-Image Support**: Upload and work with up to 8 images simultaneously

### Advanced Features
- **🚀 Quick Actions**: Pre-configured image editing commands for common tasks
- **📚 Prompt Library**: Save and organize frequently used prompts
- **🎯 Smart Suggestions**: AI-generated edit commands based on image analysis
- **⚙️ Multi-Model Support**: Switch between different Gemini models (Flash, Pro, Flash-Lite, Image Preview)
- **💾 Local Storage**: All settings and prompts saved in browser storage
- **🎭 Custom System Prompts**: Configure image analysis behavior

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Technotraxx/gemini-image-editor.git
   cd gemini-image-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Configure API Key**
   - Click the Settings button in the app
   - Enter your Gemini API key
   - The key is saved securely in your browser's local storage

## 📖 Usage Guide

### Chat Interface
The app uses a conversational chat interface where you interact with Gemini through messages:

1. **Text Generation**: Type a description of the image you want to create
2. **Image Upload**: Click the image icon to upload photos for editing
3. **Quick Actions**: Select from pre-built editing commands when an image is uploaded
4. **Prompt Library**: Type `/` to access saved prompts

### Image Generation Examples
```
"A serene Japanese garden with cherry blossoms and a red bridge"
"Cyberpunk cityscape at night with neon lights"
"Professional headshot with studio lighting"
```

### Image Editing Examples
Upload an image and try these commands:
```
"Remove the background and make it transparent"
"Change the time of day to sunset"
"Make it look like a watercolor painting"
"Add dramatic lighting from the left"
```

### Quick Actions
The app includes pre-configured quick actions for common edits:
- Background removal/replacement
- Style transfers (sketch, painting, etc.)
- Color adjustments
- Object removal
- Professional enhancements

### Smart Command Suggestions
When you upload an image, the AI automatically analyzes it and suggests 5 relevant editing commands that you can click to execute immediately.

## 🛠️ Tech Stack

- **Framework**: [Next.js 13.5](https://nextjs.org/) (App Router)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Models**: Google Gemini API
  - Gemini 2.5 Flash
  - Gemini 2.5 Pro  
  - Gemini 2.5 Flash-Lite
  - Gemini 2.5 Flash Image Preview
- **State Management**: React Hooks + Local Storage
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
gemini-image-editor/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── gemini/          # Gemini API endpoint
│   ├── components/          # Page components
│   │   └── chat/           # Chat UI components
│   ├── hooks/              # Custom React hooks
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main chat interface
├── components/              # Shared UI components
│   ├── ui/                 # shadcn/ui components
│   └── dialogs/            # Modal dialogs
├── lib/                     # Utility functions
│   ├── constants.ts        # App constants
│   ├── geminiService.ts    # Gemini API service
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript definitions
├── public/                  # Static assets
└── package.json            # Dependencies
```

## 🔧 Configuration

### Available Models
- **Gemini 2.5 Flash**: Fast, general-purpose model
- **Gemini 2.5 Pro**: Advanced reasoning and capabilities
- **Gemini 2.5 Flash-Lite**: Lightweight, faster responses
- **Gemini 2.5 Flash Image Preview**: Specialized for image generation/editing

### Adjustable Parameters
- **Temperature**: Controls creativity (0.0 - 1.0)
- **Top-K**: Limits vocabulary selection
- **Top-P**: Nucleus sampling threshold
- **Max Output Tokens**: Response length limit
- **Safety Settings**: Content filtering levels

### Data Storage
All data is stored locally in your browser:
- API keys (encrypted in localStorage)
- Chat history (session-based)
- Saved prompts and quick actions
- User preferences and settings

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Technotraxx/gemini-image-editor)

### Self-Hosting

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name "gemini-editor" -- start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Security Notes

- API keys are stored in browser localStorage (never sent to the server except for API calls)
- All Gemini API calls are proxied through Next.js API routes
- No data is stored on servers - everything is client-side
- Images are processed as base64 strings in memory
- Implements Gemini's safety settings for content filtering

## 🐛 Troubleshooting

### Common Issues

**"API Key Required" Error**
- Open Settings and add your Gemini API key
- Get a key from [Google AI Studio](https://aistudio.google.com/apikey)

**Image Generation Not Working**
- Ensure you're using the "Gemini 2.5 Flash Image Preview" model
- Check API quotas in Google Cloud Console
- Verify prompt doesn't violate content policies

**Build Errors**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Large Image Issues**
- Images are automatically compressed
- Maximum 8 images per message
- Recommended image size: < 4MB

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Image Generation Guide](https://ai.google.dev/gemini-api/docs/image-generation)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google DeepMind for the Gemini models
- Vercel for Next.js framework
- Radix UI for accessible components
- shadcn for the beautiful UI library
- The open-source community

---

**Note**: This is a demonstration application showcasing Gemini's image generation and editing capabilities. For production use, implement proper authentication, rate limiting, and error handling.

⭐ Star this repo if you find it helpful!
