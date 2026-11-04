export interface Scene {
  id: string;
  timeStart: number;
  timeEnd: number;
  title: string;
  description: string;
  cameraMotion: string;
  textOverlay: string;
  bgGradient?: string;
}

export interface VideoJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  title: string;
  prompt: string;
  style: string;
  duration: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  resolution: '720p' | '1080p';
  scenes: Scene[];
  scriptNarration?: string;
  musicSuggestion?: string;
  downloadUrl?: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  category: string;
  duration: number;
  aspectRatio: string;
  previewUrl: string;
  tags: string[];
  musicName: string;
  views: number;
  isPremium: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'starter' | 'pro' | 'premium';
  credits: number;
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface SubscriptionPlan {
  id: 'free' | 'starter' | 'pro' | 'premium';
  name: string;
  price: number;
  duration: string;
  credits: number;
  features: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  reply?: string;
  createdAt: string;
}

export interface AdMobConfig {
  testMode: boolean;
  adMobAppId: string;
  bannerUnitId: string;
  interstitialUnitId: string;
  rewardedUnitId: string;
  appOpenUnitId: string;
  bannerEnabled: boolean;
  interstitialEnabled: boolean;
  rewardedEnabled: boolean;
  appOpenEnabled: boolean;
  rewardCreditAmount: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  animation: 'none' | 'fade' | 'pop' | 'typewriter';
}

export interface EditorClip {
  id: string;
  type: 'image' | 'video' | 'color';
  url?: string;
  color?: string;
  title: string;
  duration: number;
}

export interface EditorProject {
  id: string;
  name: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  clips: EditorClip[];
  textOverlays: TextOverlay[];
  musicTitle: string;
  musicVolume: number;
  filter: 'none' | 'cinematic-blue' | 'golden-hour' | 'cyberpunk' | 'vivid' | 'bw-glamour' | 'dreamy';
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  speed: number; // 0.5, 1, 1.25, 1.5, 2
  updatedAt: string;
}
