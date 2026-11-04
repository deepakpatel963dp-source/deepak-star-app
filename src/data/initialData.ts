import { Template, SubscriptionPlan, EditorProject, AdMobConfig } from '../types';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl_1',
    title: 'Royal Birthday 3D Celebration',
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
    title: 'Grand Wedding Royal Shaadi 4K',
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
    title: 'Diwali & Holi Festive Sparks',
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
    title: 'Shree Krishna Devotional Flute',
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
    title: 'Morning Hustle Workout Motivation',
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
    title: 'Broken Rain Melancholy Sad Status',
    category: 'Sad Status',
    duration: 15,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
    tags: ['Sad', 'Heartbreak', 'Rain', 'Piano'],
    musicName: 'Lonely Raindrops Melancholic Piano',
    views: 38900,
    isPremium: false,
  },
  {
    id: 'tpl_9',
    title: 'Viral Instagram 3D Transition Reel',
    category: 'Trending Reels',
    duration: 10,
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tags: ['Trending', 'Reels', 'Fast Cut', '3D Zoom'],
    musicName: 'Speed Up Afro Trap Drop 2026',
    views: 68400,
    isPremium: true,
  }
];

export const AUDIO_TRACKS = [
  { id: 'aud_1', title: 'Royal Deepak Star BGM', artist: 'Deepak Star Studio', duration: '0:30' },
  { id: 'aud_2', title: 'Bollywood Romantic Melodies', artist: 'Pritam Vibe', duration: '0:45' },
  { id: 'aud_3', title: 'High Octane Bass Trap', artist: 'DJ Shadow Beats', duration: '0:25' },
  { id: 'aud_4', title: 'Festive Punjabi Dhol Mix', artist: 'Bhangra Kings', duration: '0:35' },
  { id: 'aud_5', title: 'Lo-Fi Night Drive', artist: 'Chillhop Beats', duration: '0:40' },
  { id: 'aud_6', title: 'Devotional Flute Harmony', artist: 'Vrindavan Studio', duration: '0:50' },
];

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    duration: 'Forever',
    credits: 5,
    features: [
      '5 Daily AI Video Credits',
      'Standard 720p HD Export',
      'Basic Video Templates',
      'Standard Video Editor Tools',
      'Ad Supported (Watch for Credits)'
    ],
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 49,
    duration: 'Month',
    credits: 50,
    features: [
      '50 AI Video Credits/Month',
      'Full HD 1080p Export',
      'Remove Watermark',
      'Access to 100+ Pro Templates',
      'Standard Priority Generation'
    ],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99,
    duration: 'Month',
    credits: 150,
    features: [
      '150 AI Video Credits/Month',
      '1080p 60fps Ultra Smooth',
      'No Watermark',
      'All Templates Unlocked',
      'Fast AI Queue Priority',
      '100% Ad-Free Experience'
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan (VIP)',
    price: 199,
    duration: 'Month',
    credits: 500,
    features: [
      '500 AI Video Credits/Month',
      '4K Ultra HD Export Option',
      'VIP Bollywood & 3D Templates',
      'Instant Dedicated Fast-Track Queue',
      'Commercial Usage License',
      '24/7 Priority Support on WhatsApp'
    ],
  }
];

export const DEFAULT_ADMOB_CONFIG: AdMobConfig = {
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

export const INITIAL_PROJECTS: EditorProject[] = [
  {
    id: 'proj_1',
    name: 'Royal Birthday Reel 2026',
    aspectRatio: '9:16',
    clips: [
      { id: 'c1', type: 'image', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80', title: 'Party Intro', duration: 4 },
      { id: 'c2', type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', title: 'Celebration Climax', duration: 6 },
    ],
    textOverlays: [
      { id: 't1', text: 'HAPPY BIRTHDAY DEEPAK!', color: '#fbbf24', fontSize: 24, xPercent: 50, yPercent: 20, animation: 'pop' },
      { id: 't2', text: 'MAY ALL DREAMS COME TRUE', color: '#ffffff', fontSize: 16, xPercent: 50, yPercent: 75, animation: 'fade' }
    ],
    musicTitle: 'Happy Birthday Royal Anthem (Bass Boosted)',
    musicVolume: 80,
    filter: 'cinematic-blue',
    brightness: 105,
    contrast: 110,
    speed: 1,
    updatedAt: '2026-03-12T15:30:00Z',
  },
  {
    id: 'proj_2',
    name: 'AI Cyberpunk City 3D',
    aspectRatio: '9:16',
    clips: [
      { id: 'c3', type: 'image', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', title: 'Cyber City', duration: 5 }
    ],
    textOverlays: [
      { id: 't3', text: 'FUTURE REELS 2026', color: '#38bdf8', fontSize: 22, xPercent: 50, yPercent: 85, animation: 'fade' }
    ],
    musicTitle: 'High Octane Bass Trap',
    musicVolume: 90,
    filter: 'cyberpunk',
    brightness: 100,
    contrast: 115,
    speed: 1.25,
    updatedAt: '2026-03-14T11:20:00Z',
  }
];
