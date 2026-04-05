<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cyber Photo Enhancer — Gemini Pro 2.5

AI-powered cyberpunk-style photo enhancer built with **Google Gemini 2.5**.  
Upload a photo and transform it into a futuristic, high-contrast cyber aesthetic with AI.

## ✨ Features

- 🧠 Powered by Gemini 2.5 multimodal AI
- 🎨 Cyberpunk / neon / futuristic enhancement
- 📸 Image-to-image transformation
- ⚡ Fast client-side UI
- 🧪 Built with AI Studio template
- 🔐 Uses Gemini API key locally

Gemini 2.5 supports multimodal inputs (text + images) and long-context reasoning, making it well-suited for advanced image editing workflows and creative transformations. :contentReference[oaicite:0]{index=0}

---

## 🖼️ Example Use Cases

- Cyberpunk profile pictures  
- Neon city aesthetic photos  
- Gaming avatars  
- Synthwave edits  
- AI-enhanced photography  
- Social media visuals  

---

## 🚀 Demo

View in AI Studio:  
https://ai.studio/apps/drive/1ilC2TxFjrZTKSXHobpAtvNezIsP4OAF9

---

## 🛠️ Tech Stack

- Google Gemini 2.5
- AI Studio App Template
- Node.js
- React (AI Studio default)
- Vite

---

## 📦 Run Locally

### Prerequisites

- Node.js 18+
- Gemini API Key

Get API key: https://ai.google.dev/

---

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create:

```
.env.local
```

Add:

```
GEMINI_API_KEY=your_api_key_here
```

---

### 3. Start development server

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🧪 How It Works

1. Upload an image  
2. Prompt Gemini for cyber enhancement  
3. AI generates edited version  
4. Download the result  

Gemini handles both image understanding and transformation in one pipeline.

---

## 📁 Project Structure

```
cyber-photo-enhancer/
│
├── src/
├── components/
├── lib/
├── public/
├── .env.local
└── package.json
```

---

## 🔑 Environment Variables

| Variable | Description |
|---------|-------------|
| GEMINI_API_KEY | Google Gemini API key |

---

## 🧠 Prompt Strategy

Example prompt used:

```
Transform this image into a cyberpunk futuristic style,
neon lighting, high contrast, glowing elements,
cinematic, detailed, ultra realistic
```

You can modify this in:

```
/src/lib/gemini.ts
```

---

## 🚀 Deploy

You can deploy to:

- Vercel
- Netlify
- Cloudflare Pages
- Firebase Hosting

Build:

```bash
npm run build
```

---

## 📸 Screenshots

(Add your before/after images here)

---

## 🗺️ Roadmap

- [ ] Style presets
- [ ] Multiple cyber styles
- [ ] Batch processing
- [ ] Download HD
- [ ] Prompt editor
- [ ] History gallery

---

## 🤝 Contributing

Pull requests welcome.

1. Fork repo  
2. Create branch  
3. Commit changes  
4. Open PR  

---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project:

- Star the repo  
- Share it  
- Build something cool with it  
