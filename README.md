# Gemini Image Editor

A modern Next.js application that leverages Google's Gemini AI models to analyze and edit images with powerful AI capabilities.

## ✨ Features

- **AI-Powered Image Generation**: Create images from text descriptions using Gemini's native image generation
- **Smart Image Editing**: Transform and edit existing images using natural language prompts
- **Real-time Processing**: Fast, responsive image generation and editing
- **Multiple Input Support**: Combine text and images for complex editing tasks
- **Iterative Refinement**: Continue editing images through conversation
- **Modern UI**: Clean, responsive interface built with Next.js and React

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

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📖 Usage

### Image Generation

1. Enter a text prompt describing the image you want to create
2. Click "Generate" to create an AI-generated image
3. Download or continue editing the result

Example prompts:
- "A futuristic city with floating gardens and glass buildings"
- "A cozy coffee shop interior with warm lighting"
- "Abstract art with vibrant colors and geometric shapes"

### Image Editing

1. Upload an existing image
2. Describe the changes you want to make
3. Submit to see the AI-edited result
4. Continue refining with additional prompts

Example editing prompts:
- "Change the background to a sunset"
- "Make it look like a watercolor painting"
- "Add snow to the scene"
- "Remove the object on the left"

### Advanced Features

- **Multi-turn Editing**: Keep refining your image through multiple prompts
- **Style Transfer**: Apply the style of one image to another
- **Image Composition**: Combine multiple images into a single scene

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS / CSS Modules
- **AI Model**: Google Gemini 2.0 Flash
- **API**: Gemini API via `@google/generative-ai`
- **Deployment**: Vercel / Self-hosted

## 📁 Project Structure

```
gemini-image-editor/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── components/      # React components
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── public/              # Static assets
├── lib/                 # Utility functions
│   └── gemini.ts       # Gemini API integration
├── types/              # TypeScript type definitions
├── .env.local          # Environment variables
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies
└── README.md          # Documentation
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

### Gemini API Configuration

```javascript
// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseModalities: ["TEXT", "IMAGE"]
  }
});
```

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      }
    }
  }
}
```

### Components

Key components you can customize:
- `ImageUploader`: Handle image uploads
- `PromptInput`: Text input for prompts
- `ImageDisplay`: Display generated/edited images
- `GenerationControls`: Controls for image generation

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Technotraxx/gemini-image-editor)

1. Click the deploy button above
2. Add your `GEMINI_API_KEY` in the environment variables
3. Deploy!

### Self-Hosting

```bash
# Build the application
npm run build

# Start with PM2
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 API Usage

- The Gemini API has rate limits and quotas
- Each image generation/edit consumes tokens
- Monitor your usage at [Google Cloud Console](https://console.cloud.google.com/)
- Consider implementing caching for frequently requested operations

## 🔐 Security

- Never expose your API key in client-side code
- Use Next.js API routes to proxy requests to Gemini
- Implement rate limiting for production use
- Validate and sanitize all user inputs

## 🐛 Troubleshooting

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

**API Key Issues**
- Ensure the key is in `.env.local` (not `.env`)
- Restart the dev server after adding the key
- Check key validity at Google AI Studio

**Image Generation Fails**
- Check API quotas
- Verify prompt doesn't violate content policies
- Try simpler prompts first

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Image Generation Guide](https://ai.google.dev/gemini-api/docs/image-generation)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google DeepMind for the Gemini models
- Vercel for Next.js framework
- The open-source community

---

**Demo App**: This is a demonstration application showcasing Gemini's image generation and editing capabilities. For production use, implement proper authentication, rate limiting, and error handling.

⭐ Star this repo if you find it helpful!
