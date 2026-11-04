import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google Gen AI with server-only key & telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// In-Memory Database store with seed data
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'starter' | 'pro' | 'premium';
  credits: number;
  status: 'active' | 'blocked';
  createdAt: string;
}

let users: User[] = [
  {
    id: 'usr_owner',
    name: 'Deepak Patel',
    email: 'deepak.patel@deepakstar.com',
    role: 'admin',
    plan: 'premium',
    credits: 9999,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_demo',
    name: 'Rohit Sharma',
    email: 'rohit@example.com',
    role: 'user',
    plan: 'free',
    credits: 15,
    status: 'active',
    createdAt: '2026-02-14T10:30:00Z',
  },
  {
    id: 'usr_3',
    name: 'Pooja Verma',
    email: 'pooja.v@example.com',
    role: 'user',
    plan: 'pro',
    credits: 120,
    status: 'active',
    createdAt: '2026-03-01T14:20:00Z',
  },
  {
    id: 'usr_4',
    name: 'Amit Kumar',
    email: 'amit.k@example.com',
    role: 'user',
    plan: 'starter',
    credits: 45,
    status: 'active',
    createdAt: '2026-03-12T09:15:00Z',
  }
];

let templates = [
  {
    id: 'tpl_1',
    title: 'Royal Birthday Celebration 3D',
    category: 'Birthday',
    duration: 15,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    tags: ['Birthday', 'Celebration', 'Gold', 'Party'],
    musicName: 'Happy Birthday Royal Anthem (Bass Boosted)',
    views: 14200,
    isPremium: false,
  },
  {
    id: 'tpl_2',
    title: 'Grand Wedding Memories 4K',
    category: 'Wedding',
    duration: 20,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
    tags: ['Wedding', 'Shaadi', 'Love', 'Cinematic'],
    musicName: 'Kudmayi Shehnai Instrumental (Wedding Beats)',
    views: 29500,
    isPremium: true,
  },
  {
    id: 'tpl_3',
    title: 'Neon Cyberpunk Attitude Reel',
    category: 'Attitude',
    duration: 12,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    tags: ['Attitude', 'Swag', 'BGM', 'Drift'],
    musicName: 'Gangster Phonk Royalty Free Beat',
    views: 52100,
    isPremium: false,
  },
  {
    id: 'tpl_4',
    title: 'Diwali & Festival Lights',
    category: 'Festival',
    duration: 15,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    tags: ['Festival', 'Diwali', 'Dhol', 'Lights'],
    musicName: 'Festive Dhol & Sitar Symphony',
    views: 18300,
    isPremium: false,
  },
  {
    id: 'tpl_5',
    title: 'Romantic Heartbeats Love Status',
    category: 'Love',
    duration: 15,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    tags: ['Love', 'Romantic', 'Couple', 'Acoustic'],
    musicName: 'Slow Romantic Guitar Strings & Lo-Fi Beat',
    views: 41200,
    isPremium: true,
  },
  {
    id: 'tpl_6',
    title: 'Shree Krishna Devotional Bliss',
    category: 'Devotional',
    duration: 18,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600&auto=format&fit=crop&q=80',
    tags: ['Devotional', 'Krishna', 'Bhakti', 'Flute'],
    musicName: 'Divine Bansuri & Morning Bell Melody',
    views: 31000,
    isPremium: false,
  },
  {
    id: 'tpl_7',
    title: 'Morning Hustle Motivation',
    category: 'Motivation',
    duration: 15,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    tags: ['Motivation', 'Gym', 'Success', 'Hustle'],
    musicName: 'Unstoppable Heavy Trap Beats',
    views: 24700,
    isPremium: false,
  },
  {
    id: 'tpl_8',
    title: 'Broken Heart Sad Status',
    category: 'Sad Status',
    duration: 15,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
    tags: ['Sad', 'Heartbreak', 'Rain', 'Piano'],
    musicName: 'Lonely Raindrops Melancholic Piano',
    views: 38900,
    isPremium: false,
  }
];

let adSettings = {
  testMode: true,
  adMobAppId: 'ca-app-pub-3940256099942544~3347511713',
  bannerUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialUnitId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedUnitId: 'ca-app-pub-3940256099942544/5224354917',
  appOpenUnitId: 'ca-app-pub-3940256099942544/9257774110',
  bannerEnabled: true,
  interstitialEnabled: true,
  rewardedEnabled: true,
  appOpenEnabled: true,
  rewardCreditAmount: 5,
};

let aiSettings = {
  provider: 'gemini',
  primaryModel: 'gemini-3.8-flash',
  apiKeyConfigured: !!geminiApiKey,
  rateLimitPerMinute: 60,
  maxVideoDurationSec: 30,
};

let plans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    duration: 'Forever',
    credits: 5,
    features: ['5 Daily AI Video Credits', 'Standard 720p Export', 'Basic Templates', 'Standard Processing', 'Ad Supported'],
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 49,
    duration: 'Month',
    credits: 50,
    features: ['50 AI Video Credits/mo', 'Full HD 1080p Export', 'No Watermark', 'Access to 100+ Templates', 'Standard Priority'],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99,
    duration: 'Month',
    credits: 150,
    features: ['150 AI Video Credits/mo', '1080p 60fps Ultra HD', 'No Watermark', 'All Premium Templates', 'Fast AI Queue', 'Ad-Free Experience'],
  },
  {
    id: 'premium',
    name: 'Premium Plan (VIP)',
    price: 199,
    duration: 'Month',
    credits: 500,
    features: ['500 AI Video Credits/mo', '4K Ultra HD Export Option', 'VIP Bollywood & Festival Templates', 'Instant Fast-Track Rendering', 'Commercial Usage License', '24/7 Priority Support'],
  }
];

let transactions = [
  {
    id: 'txn_982138',
    userId: 'usr_3',
    userName: 'Pooja Verma',
    planId: 'pro',
    planName: 'Pro Plan',
    amount: 99,
    currency: 'INR',
    method: 'UPI (GPay)',
    status: 'success',
    timestamp: '2026-03-01T14:22:10Z',
  },
  {
    id: 'txn_982139',
    userId: 'usr_4',
    userName: 'Amit Kumar',
    planId: 'starter',
    planName: 'Starter Plan',
    amount: 49,
    currency: 'INR',
    method: 'PhonePe UPI',
    status: 'success',
    timestamp: '2026-03-12T09:18:40Z',
  }
];

let supportTickets = [
  {
    id: 'tkt_101',
    userId: 'usr_demo',
    userName: 'Rohit Sharma',
    subject: 'AI Video Credit Question',
    message: 'Hello Deepak Star team, how can I earn more free credits without subscription?',
    status: 'resolved',
    reply: 'Hi Rohit, you can tap "Watch Ad" to get +5 instant credits anytime!',
    createdAt: '2026-03-02T11:00:00Z',
  },
  {
    id: 'tkt_102',
    userId: 'usr_4',
    userName: 'Amit Kumar',
    subject: 'Requesting Bhojpuri Festival Template',
    message: 'Please add more Chhath Puja and Holi 3D templates in the next update.',
    status: 'open',
    reply: '',
    createdAt: '2026-03-14T08:30:00Z',
  }
];

let notificationsHistory = [
  {
    id: 'notif_1',
    title: '✨ New 3D Wedding Templates Added!',
    body: 'Create stunning Shaadi reels with one click. Check out the new Wedding category!',
    target: 'All Users',
    sentAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'notif_2',
    title: '⚡ Holi Special Bonus Credits',
    body: 'Get 50 bonus credits on any subscription upgrade this week.',
    target: 'All Users',
    sentAt: '2026-03-14T09:00:00Z',
  }
];

// --- ROUTES ---

// Health & System status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'DEEPAK STAR APP',
    version: '2.5.0',
    owner: 'Deepak Patel',
    aiConfigured: !!ai,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Prompt Enhancer (Gemini 3.8 Flash)
app.post('/api/ai/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt, style = 'Cinematic', aspectRatio = '9:16' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      // Fallback enhancement if API key not injected
      return res.json({
        enhancedPrompt: `Ultra-detailed cinematic video in ${style} aesthetic, 8k resolution, dramatic volumetric lighting, smooth camera movement, vibrant color grading, high aesthetic composition: ${prompt}`,
        musicSuggestion: 'Cinematic Epic Strings with deep bass hits and atmospheric pads',
        colorPalette: ['#1e3a8a', '#3b82f6', '#f8fafc', '#0284c7']
      });
    }

    const systemInstruction = `You are an elite video director and AI cinematographer for the "DEEPAK STAR APP". 
Transform user video prompts into highly vivid, cinematic, camera-directed video generation descriptions. 
Include precise camera direction (e.g. slow zoom, orbit, gimbal tracking), lighting style, motion rhythm, and suitable background music description.
Return in JSON format with fields: enhancedPrompt (string), musicSuggestion (string), colorPalette (array of 4 hex color strings).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Enhance this user video prompt for a ${style} style video (aspect ratio ${aspectRatio}): "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      enhancedPrompt: parsed.enhancedPrompt || prompt,
      musicSuggestion: parsed.musicSuggestion || 'Uplifting modern commercial beat',
      colorPalette: parsed.colorPalette || ['#1e3a8a', '#3b82f6', '#ffffff', '#0ea5e9']
    });
  } catch (err: any) {
    console.error('Enhance prompt error:', err);
    res.status(500).json({ error: err.message || 'Failed to enhance prompt' });
  }
});

// AI Video Generation Job (Synthesizes full storyboard, scenes, script & motion frames)
app.post('/api/ai/generate-video', async (req: Request, res: Response) => {
  try {
    const { prompt, style, duration = 10, aspectRatio = '9:16', resolution = '1080p', sourceImageUrl } = req.body;

    if (!prompt && !sourceImageUrl) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    // Default scenes in case Gemini is not configured or errors
    let scenes = [
      {
        id: 'scene_1',
        timeStart: 0,
        timeEnd: Math.round(duration * 0.33),
        title: 'Opening Hook',
        description: `Cinematic wide establishing shot of ${prompt || 'vibrant 3D visuals'}, dynamic lighting`,
        cameraMotion: 'Slow Zoom In & Dolly',
        textOverlay: 'DEEPAK STAR EXCLUSIVE',
        bgGradient: 'from-blue-900 via-indigo-950 to-slate-950',
      },
      {
        id: 'scene_2',
        timeStart: Math.round(duration * 0.33),
        timeEnd: Math.round(duration * 0.66),
        title: 'Peak Dynamic Action',
        description: `Intense detailed motion with ${style || 'cinematic'} visual effects, glowing particles`,
        cameraMotion: 'Dynamic 3D Orbit',
        textOverlay: prompt?.slice(0, 30) || 'Creative Excellence',
        bgGradient: 'from-sky-900 via-blue-950 to-navy-950',
      },
      {
        id: 'scene_3',
        timeStart: Math.round(duration * 0.66),
        timeEnd: duration,
        title: 'Climax & Finale',
        description: `Stunning royal blue golden burst finale, professional high-fidelity finish`,
        cameraMotion: 'Pull Back & Reveal',
        textOverlay: 'CREATED ON DEEPAK STAR APP',
        bgGradient: 'from-blue-950 via-slate-900 to-black',
      }
    ];

    let scriptNarration = `Experience the next generation of AI creation with DEEPAK STAR APP. Visualizing ${prompt}.`;
    let musicSuggestion = 'Royal Anthem 3D Beats with Euphoric Synthesizers';

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Create a professional multi-scene video storyboard for this prompt: "${prompt}".
Style: ${style || 'Cinematic 3D'}, Duration: ${duration} seconds, Aspect Ratio: ${aspectRatio}.
Divide into 3 distinct scenes covering 0 to ${duration}s.
Return JSON with:
- videoTitle: string
- scriptNarration: string
- musicSuggestion: string
- scenes: array of 3 objects with { id, timeStart, timeEnd, title, description, cameraMotion, textOverlay, visualTone }`,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.scenes && Array.isArray(parsed.scenes)) {
          scenes = parsed.scenes.map((s: any, idx: number) => ({
            id: s.id || `scene_${idx + 1}`,
            timeStart: s.timeStart ?? (idx * (duration / 3)),
            timeEnd: s.timeEnd ?? ((idx + 1) * (duration / 3)),
            title: s.title || `Scene ${idx + 1}`,
            description: s.description || prompt,
            cameraMotion: s.cameraMotion || 'Smooth Pan',
            textOverlay: s.textOverlay || '',
            bgGradient: idx === 0 ? 'from-blue-900 via-indigo-950 to-slate-950' : idx === 1 ? 'from-sky-900 via-blue-950 to-navy-950' : 'from-blue-950 via-slate-900 to-black',
          }));
        }
        if (parsed.scriptNarration) scriptNarration = parsed.scriptNarration;
        if (parsed.musicSuggestion) musicSuggestion = parsed.musicSuggestion;
      } catch (geminiErr) {
        console.warn('Gemini storyboard synthesis fallback used:', geminiErr);
      }
    }

    const job = {
      id: `job_${Date.now()}`,
      status: 'completed',
      title: prompt ? `${prompt.slice(0, 24)}...` : 'AI Video Creation',
      prompt,
      style: style || 'Cinematic 3D',
      duration,
      aspectRatio,
      resolution,
      scenes,
      scriptNarration,
      musicSuggestion,
      downloadUrl: '', // Ready for local Canvas render & export
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, job });
  } catch (err: any) {
    console.error('AI video generation error:', err);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

// Templates API
app.get('/api/templates', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let filtered = [...templates];
  if (category && category !== 'All') {
    filtered = filtered.filter(t => t.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
  }
  res.json({ templates: filtered });
});

// Admin add template
app.post('/api/admin/templates', (req: Request, res: Response) => {
  const { title, category, duration, aspectRatio, previewUrl, tags, musicName, isPremium } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category required' });
  }
  const newTpl = {
    id: `tpl_${Date.now()}`,
    title,
    category,
    duration: Number(duration) || 15,
    aspectRatio: aspectRatio || '9:16',
    previewUrl: previewUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    tags: Array.isArray(tags) ? tags : [category, 'Video'],
    musicName: musicName || 'Bollywood Trending Beats',
    views: 0,
    isPremium: Boolean(isPremium),
  };
  templates.unshift(newTpl);
  res.json({ success: true, template: newTpl });
});

// Admin delete template
app.delete('/api/admin/templates/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  templates = templates.filter(t => t.id !== id);
  res.json({ success: true, message: 'Template removed' });
});

// AdMob configuration & Rewarded claim
app.get('/api/admob/config', (req: Request, res: Response) => {
  res.json({ config: adSettings });
});

app.post('/api/admob/claim-reward', (req: Request, res: Response) => {
  const { userId = 'usr_demo' } = req.body;
  const user = users.find(u => u.id === userId);
  if (user) {
    user.credits += adSettings.rewardCreditAmount;
    return res.json({
      success: true,
      reward: adSettings.rewardCreditAmount,
      totalCredits: user.credits,
      message: `Rewarded ad completed! +${adSettings.rewardCreditAmount} AI credits added.`
    });
  }
  res.json({
    success: true,
    reward: adSettings.rewardCreditAmount,
    totalCredits: 20,
    message: `Rewarded ad completed! +${adSettings.rewardCreditAmount} AI credits added.`
  });
});

app.post('/api/admin/admob/config', (req: Request, res: Response) => {
  adSettings = { ...adSettings, ...req.body };
  res.json({ success: true, config: adSettings });
});

// Payments & Subscriptions (Razorpay & India UPI)
app.get('/api/plans', (req: Request, res: Response) => {
  res.json({ plans });
});

app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { planId, billingCycle = 'monthly', userId = 'usr_demo' } = req.body;
  const selectedPlan = plans.find(p => p.id === planId);
  if (!selectedPlan) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  const basePrice = selectedPlan.price;
  const amount = billingCycle === 'yearly' ? Math.round(basePrice * 10) : basePrice; // 2 months free for yearly
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  res.json({
    orderId,
    amount,
    currency: 'INR',
    planId,
    planName: selectedPlan.name,
    upiVpa: 'deepakstar@upi',
    merchantName: 'DEEPAK STAR APP (Deepak Patel)',
    key: 'rzp_test_deepakstar987654',
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { orderId, paymentId, signature, planId, userId = 'usr_demo', method = 'UPI' } = req.body;

  // Server-side verification simulation
  if (!orderId || !paymentId) {
    return res.status(400).json({ error: 'Order ID and Payment ID are required for verification' });
  }

  const selectedPlan = plans.find(p => p.id === planId) || plans[1];
  const user = users.find(u => u.id === userId);

  if (user) {
    user.plan = selectedPlan.id as any;
    user.credits += selectedPlan.credits;
  }

  const newTxn = {
    id: `txn_${Date.now()}`,
    userId,
    userName: user ? user.name : 'User',
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    amount: selectedPlan.price,
    currency: 'INR',
    method,
    status: 'success',
    timestamp: new Date().toISOString(),
  };

  transactions.unshift(newTxn);

  res.json({
    success: true,
    verified: true,
    transaction: newTxn,
    newPlan: selectedPlan.id,
    newCredits: user ? user.credits : 100,
    message: `Payment successful! Your ${selectedPlan.name} is now active.`
  });
});

app.get('/api/payments/history', (req: Request, res: Response) => {
  res.json({ transactions });
});

// Admin Stats & Management
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'success' ? t.amount : 0), 342850);
  res.json({
    totalUsers: 14290 + users.length,
    activeUsers: 3840,
    newUsersToday: 412,
    premiumUsers: users.filter(u => u.plan !== 'free').length + 1280,
    totalVideosCreated: 89450,
    activeAiJobs: 14,
    totalRevenue,
    adMobEarnings: 42100,
    aiConfigured: !!ai,
    templatesCount: templates.length,
    openTicketsCount: supportTickets.filter(t => t.status === 'open').length,
  });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json({ users });
});

app.post('/api/admin/users/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, credits } = req.body;
  const target = users.find(u => u.id === id);

  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (action === 'block') {
    target.status = 'blocked';
  } else if (action === 'unblock') {
    target.status = 'active';
  } else if (action === 'add_credits') {
    target.credits += Number(credits) || 50;
  } else if (action === 'delete') {
    users = users.filter(u => u.id !== id);
    return res.json({ success: true, message: 'User deleted' });
  }

  res.json({ success: true, user: target });
});

// Support tickets
app.get('/api/support/tickets', (req: Request, res: Response) => {
  res.json({ tickets: supportTickets });
});

app.post('/api/support/tickets', (req: Request, res: Response) => {
  const { subject, message, userId = 'usr_demo', userName = 'Rohit Sharma' } = req.body;
  const newTicket = {
    id: `tkt_${Date.now()}`,
    userId,
    userName,
    subject,
    message,
    status: 'open',
    reply: '',
    createdAt: new Date().toISOString(),
  };
  supportTickets.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});

app.post('/api/admin/support/reply', (req: Request, res: Response) => {
  const { id, reply } = req.body;
  const ticket = supportTickets.find(t => t.id === id);
  if (ticket) {
    ticket.reply = reply;
    ticket.status = 'resolved';
    return res.json({ success: true, ticket });
  }
  res.status(404).json({ error: 'Ticket not found' });
});

// Broadcast notifications
app.post('/api/admin/broadcast-notification', (req: Request, res: Response) => {
  const { title, body, target = 'All Users' } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body required' });
  }
  const notif = {
    id: `notif_${Date.now()}`,
    title,
    body,
    target,
    sentAt: new Date().toISOString(),
  };
  notificationsHistory.unshift(notif);
  res.json({ success: true, notification: notif, recipientCount: 14290 });
});

app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications: notificationsHistory });
});

// Kotlin Android Project Source Code Generator
app.get('/api/export/android-project', (req: Request, res: Response) => {
  const androidFiles = {
    appName: 'DEEPAK STAR APP',
    packageName: 'com.deepakpatel.deepakstarapp',
    versionName: '1.0.0',
    versionCode: 1,
    buildGradleKts: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.deepakpatel.deepakstarapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.deepakpatel.deepakstarapp"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")
    implementation("com.google.android.gms:play-services-ads:23.6.0")
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("com.razorpay:checkout:1.6.40")
}`,
    manifestXml: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="DEEPAK STAR APP"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.DeepakStarApp">

        <!-- Google AdMob Application ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713"/>

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.DeepakStarApp">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    mainActivityKt: `package com.deepakpatel.deepakstarapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.deepakpatel.deepakstarapp.ui.navigation.DeepakStarNavGraph
import com.deepakpatel.deepakstarapp.ui.theme.DeepakStarAppTheme
import com.google.android.gms.ads.MobileAds

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Google Mobile Ads SDK
        MobileAds.initialize(this) {}

        setContent {
            DeepakStarAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    DeepakStarNavGraph()
                }
            }
        }
    }
}`
  };

  res.json({ success: true, project: androidFiles });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⭐ DEEPAK STAR APP Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
