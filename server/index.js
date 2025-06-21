const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Replicate = require('replicate');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// API Clients - will be used only if the keys are present
let replicate, hf;
if (process.env.REPLICATE_API_TOKEN && process.env.HF_ACCESS_TOKEN) {
  console.log('🤖 AI providers configured.');
  replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  hf = new HfInference(process.env.HF_ACCESS_TOKEN);
} else {
  console.log('⚠️ AI provider keys not found in .env. AI generation will be disabled.');
}

// --- Multer Setup for File Uploads ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
// --- End Multer Setup ---

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection with improved SSL configuration
const mongoOptions = {
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// If MONGODB_URI is provided, use it with SSL settings
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb+srv://username:password@cluster.mongodb.net/dream-visualizer?retryWrites=true&w=majority') {
  mongoOptions.tls = true;
  mongoOptions.tlsAllowInvalidCertificates = true;
  mongoOptions.tlsAllowInvalidHostnames = true;
  
  mongoose.connect(process.env.MONGODB_URI, mongoOptions)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully');
    })
    .catch((err) => {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      console.log('⚠️  Continuing without database - dreams will not be saved');
    });
} else {
  // Use local MongoDB or continue without database
  console.log('⚠️  No MongoDB URI provided - using in-memory storage');
  console.log('   To use MongoDB Atlas, add your connection string to server/.env');
}

// Dream Schema
const dreamSchema = new mongoose.Schema({
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mood: { type: String, required: true },
  moodScore: { type: Number, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

const Dream = mongoose.model('Dream', dreamSchema);

// In-memory storage fallback
let inMemoryDreams = [];
let dreamCounter = 0;

// --- AI Generation Logic ---
async function analyzeDreamAndGenerateImage(dreamDescription) {
  if (!replicate || !hf) {
    throw new Error('AI providers not configured.');
  }
  // This function is the same as before...
  // ... (code for calling Replicate & HF)
  try {
    console.log('Analysing mood with Hugging Face...');
    const sentimentResult = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: dreamDescription,
    });
    
    const primarySentiment = sentimentResult.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    
    let mood;
    let moodScore;

    switch (primarySentiment.label.toLowerCase()) {
      case 'positive':
        mood = 'Joyful';
        moodScore = 0.8;
        break;
      case 'negative':
        mood = 'Anxious';
        moodScore = -0.8;
        break;
      default:
        mood = 'Mysterious';
        moodScore = 0.1;
    }
    console.log(`Mood determined as: ${mood}`);

    console.log('Generating image with Replicate...');
    const imageOutput = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535523a55ff1e3b9007e6687",
      {
        input: {
          prompt: `A dreamlike, ethereal, mystical, and otherworldly image capturing: ${dreamDescription}`,
          width: 1024,
          height: 1024,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        }
      }
    );
    console.log('Image generated successfully.');

    return {
      imageUrl: imageOutput[0],
      mood: mood,
      moodScore: moodScore
    };
  } catch (error) {
    console.error('Error in AI pipeline:', error);
    throw error;
  }
}

// Routes
app.post('/api/dreams', upload.single('image'), async (req, res) => {
  try {
    const { description } = req.body;
    let analysis;

    // --- DEMO MODE LOGIC ---
    if (dreamCounter < 5) {
      // Manual Mode
      console.log(`Manual Mode: Dream ${dreamCounter + 1}/5`);
      const { mood } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : `https://via.placeholder.com/1024x1024.png/1a1a2e/ffffff?text=No+Image`;
      
      if (!description || !mood) {
        return res.status(400).json({ error: 'Dream description and mood are required in manual mode.' });
      }

      let moodScore = 0;
      switch (mood.toLowerCase()) {
        case 'joyful': case 'peaceful': moodScore = 0.8; break;
        case 'anxious': case 'frightening': moodScore = -0.8; break;
        default: moodScore = 0.1;
      }
      analysis = { description, imageUrl, mood, moodScore };
    } else {
      // AI Mode
      console.log('AI Mode Activated!');
      if (!replicate || !hf) {
        return res.status(503).json({ error: 'AI providers not configured. Please add keys to .env file.' });
      }
      const aiAnalysis = await analyzeDreamAndGenerateImage(description);
      analysis = { ...aiAnalysis, description };
    }

    const position = {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20
    };

    const dream = {
      _id: `dream_${++dreamCounter}`,
      description: analysis.description,
      imageUrl: analysis.imageUrl,
      mood: analysis.mood,
      moodScore: analysis.moodScore,
      position,
      createdAt: new Date()
    };
    
    // Save to memory/DB
    inMemoryDreams.push(dream);
    // ... DB saving logic would go here if connected
    
    res.json(dream);

  } catch (error) {
    console.error('Error creating dream:', error);
    res.status(500).json({ error: 'Failed to process dream' });
  }
});

app.get('/api/dreams', async (req, res) => {
  // The frontend can get the count from the array length, so we revert this.
  try {
    // In a real app, you'd fetch from DB here. For now, in-memory is fine.
    const dreams = inMemoryDreams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(dreams);
  } catch (error) {
    console.error('Error fetching dreams:', error);
    res.status(500).json({ error: 'Failed to fetch dreams' });
  }
});

app.get('/api/sky-mood', async (req, res) => {
  try {
    let dreams = [];
    if (mongoose.connection.readyState === 1) {
      dreams = await Dream.find();
    } else {
      console.log('⚠️  MongoDB fetch failed, using in-memory storage');
      dreams = inMemoryDreams;
    }

    if (!dreams || dreams.length === 0) {
      return res.json({ mood: 'neutral', color: '#1a1a2e' });
    }

    const avgMoodScore = dreams.reduce((sum, dream) => sum + dream.moodScore, 0) / dreams.length;
    
    let color;
    if (avgMoodScore > 0.3) {
      color = '#1a1a4e';
    } else if (avgMoodScore < -0.3) {
      color = '#2e1a1a';
    } else {
      color = '#1a1a2e';
    }

    res.json({ mood: avgMoodScore > 0 ? 'positive' : avgMoodScore < 0 ? 'negative' : 'neutral', color });
  } catch (error) {
    console.error('Error calculating sky mood:', error);
    res.status(500).json({ error: 'Failed to calculate sky mood' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 