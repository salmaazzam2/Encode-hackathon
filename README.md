# Dream Visualizer 🌟

A magical web application that transforms your dreams into stars in a 3D sky. Share your dreams, watch them become beautiful visualizations, and explore them in an interactive 3D environment.

## ✨ Features

- **Dream Input**: Share your dreams through an intuitive form
- **AI-Powered Analysis**: Automatic mood analysis and dream interpretation
- **Image Generation**: Create beautiful visualizations of your dreams using DALL-E 3
- **3D Sky Visualization**: Explore your dreams as interactive stars in a 3D space
- **Dynamic Sky Colors**: The sky color changes based on the overall mood of your dreams
- **Persistent Storage**: All dreams are saved and can be revisited anytime
- **Interactive Experience**: Click on stars to view dream details and generated images

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** with React Three Fiber for 3D graphics
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose for data persistence
- **OpenAI API** for dream analysis and image generation
- **CORS** and security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dream-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit `server/.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/dream-visualizer
   PORT=5000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Setup

If you prefer to set up each part separately:

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## 📖 Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Share a dream** by clicking the moon icon in the top-left corner

3. **Describe your dream** in detail - include emotions, colors, people, places, and atmosphere

4. **Submit** and watch as your dream is processed:
   - AI analyzes the mood and emotional tone
   - DALL-E 3 generates a beautiful visualization
   - Your dream becomes a star in the 3D sky

5. **Explore your dream sky**:
   - Navigate the 3D space with mouse controls
   - Click on stars to view dream details
   - Watch the sky color change based on dream moods

## 🎨 Features in Detail

### Dream Analysis
- **Mood Detection**: AI analyzes the emotional tone of your dream
- **Mood Scoring**: Dreams are scored from -1 (negative) to 1 (positive)
- **Visual Representation**: Star colors reflect the dream's mood:
  - 🟡 Gold: Positive dreams
  - 🔴 Red: Negative dreams  
  - ⚪ Silver: Neutral dreams

### 3D Sky Visualization
- **Interactive Stars**: Each dream is represented as a glowing star
- **Dynamic Positioning**: Stars are placed randomly in 3D space
- **Hover Effects**: Stars glow and show dream previews on hover
- **Camera Controls**: Pan, zoom, and rotate to explore the sky
- **Auto-rotation**: The sky slowly rotates for a magical effect

### Sky Mood System
- **Collective Mood**: The sky color reflects the average mood of all dreams
- **Color Changes**:
  - Deep Blue: Positive dream collection
  - Deep Red: Negative dream collection
  - Neutral Blue: Mixed or neutral dreams
 
### Images
 ![image](https://github.com/user-attachments/assets/858bf4a3-20f2-4c84-8c63-41f0f4d62d4a)

 ![image](https://github.com/user-attachments/assets/dd11c3e1-6f0a-41ab-ae21-5522c9172396)

 ![image](https://github.com/user-attachments/assets/0a25aec4-d68c-405d-8a57-f7d3c649cc6f)

 ![image](https://github.com/user-attachments/assets/a106ad7b-f137-4032-b168-f72e1eadd21f)
 
 ![image](https://github.com/user-attachments/assets/d76f14c2-602b-4e26-86e0-06662d70f5d3)

## 🚀 Future developments

Bring the dream to life as a video so we can relive and remember the dream in a more vivid and fun way!

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dream-visualizer` |
| `PORT` | Server port | `5000` |

### Customization

You can customize various aspects of the application:

- **Star Colors**: Modify the mood-to-color mapping in `DreamSky.tsx`
- **Sky Colors**: Adjust the mood-to-sky-color logic in the backend
- **3D Settings**: Tune camera, lighting, and animation parameters
- **UI Theme**: Customize colors and styling in `tailwind.config.js`

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to your preferred platform (Heroku, Vercel, Railway, etc.)
3. Set environment variables in your deployment platform

### Frontend Deployment
1. Build the production version: `cd client && npm run build`
2. Deploy the `build` folder to your hosting platform
3. Update the API endpoint in the frontend if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Three.js community for 3D graphics
- React and the open-source community

## 🆘 Support

If you encounter any issues:

1. Check that all dependencies are installed correctly
2. Verify your OpenAI API key is valid and has sufficient credits
3. Ensure MongoDB is running and accessible
4. Check the browser console and server logs for error messages

For additional help, please open an issue on GitHub.

---

**Dream on and let your imagination soar! ✨** 
