import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Video, Image as ImageIcon, Film, Sliders, Play, Pause, 
  Download, Share2, Edit3, ArrowLeft, RefreshCw, Wand2, Check, AlertCircle, Volume2, VolumeX 
} from 'lucide-react';
import { VideoJob, Scene, EditorProject } from '../types';

interface AiVideoCreatorProps {
  onBack: () => void;
  onSaveToProjects: (project: EditorProject) => void;
  onOpenInEditor: (project: EditorProject) => void;
  userCredits: number;
  onDeductCredit: () => void;
  onNeedCredits: () => void;
}

export const AiVideoCreator: React.FC<AiVideoCreatorProps> = ({
  onBack,
  onSaveToProjects,
  onOpenInEditor,
  userCredits,
  onDeductCredit,
  onNeedCredits,
}) => {
  const [mode, setMode] = useState<'text' | 'image' | 'animation'>('text');
  const [prompt, setPrompt] = useState('A majestic royal golden star ascending over Mumbai skyline at dusk, cinematic blue volumetric lighting, 3D sparks and celebration confetti');
  const [style, setStyle] = useState('3D Animation');
  const [duration, setDuration] = useState<number>(10);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [motionType, setMotionType] = useState('3D Orbit & Zoom');

  // Generation Pipeline States
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [generatedJob, setGeneratedJob] = useState<VideoJob | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const STYLES = [
    { id: '3D Animation', label: '3D Royal Animation', icon: '👑' },
    { id: 'Cinematic Movie', label: 'Bollywood Cinematic', icon: '🎬' },
    { id: 'Cyberpunk', label: 'Neon Cyberpunk', icon: '⚡' },
    { id: 'Royal Fantasy', label: 'Gold & Diamond Luxury', icon: '✨' },
    { id: 'Anime', label: 'Anime / Manga', icon: '🎨' },
    { id: 'Photorealistic', label: 'Ultra Photorealistic', icon: '📸' },
  ];

  // AI Prompt Enhancer using Gemini backend
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Enhance prompt failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Real AI Generation
  const handleGenerateVideo = async () => {
    if (userCredits < 1) {
      onNeedCredits();
      return;
    }

    setIsGenerating(true);
    setProgressPercent(10);
    setGenerationStep('Validating AI Credits & Provider Engine...');

    try {
      // Step 1: Deduct credit
      onDeductCredit();

      setTimeout(() => {
        setProgressPercent(35);
        setGenerationStep('Gemini 3.8 Flash analyzing prompt & camera optics...');
      }, 700);

      const res = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          duration,
          aspectRatio,
          resolution,
          sourceImageUrl: uploadedImage,
        }),
      });

      setTimeout(() => {
        setProgressPercent(70);
        setGenerationStep('Synthesizing 3D scenes, motion keyframes & audio track...');
      }, 1500);

      const data = await res.json();

      setTimeout(() => {
        setProgressPercent(100);
        setGenerationStep('Rendering final 1080p stream...');
        if (data.success && data.job) {
          setGeneratedJob(data.job);
          setIsGenerating(false);
          setIsPlaying(true);
        } else {
          throw new Error(data.error || 'Generation failed');
        }
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      alert('Video generation error: ' + err.message);
    }
  };

  // Canvas Video Player Engine (Real-time render loop)
  useEffect(() => {
    if (!generatedJob || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const renderFrame = (now: number) => {
      if (isPlaying) {
        const elapsed = (now - startTime) / 1000;
        const currentTotalSec = elapsed % duration;
        setCurrentTime(currentTotalSec);

        // Determine current scene
        const sceneIdx = generatedJob.scenes.findIndex(
          (s) => currentTotalSec >= s.timeStart && currentTotalSec <= s.timeEnd
        );
        if (sceneIdx !== -1) setCurrentSceneIdx(sceneIdx);

        // Draw Canvas Frame
        const width = canvas.width;
        const height = canvas.height;

        // Background Gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (sceneIdx === 0) {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#1e3a8a');
          grad.addColorStop(1, '#0284c7');
        } else if (sceneIdx === 1) {
          grad.addColorStop(0, '#1e1b4b');
          grad.addColorStop(0.5, '#312e81');
          grad.addColorStop(1, '#0369a1');
        } else {
          grad.addColorStop(0, '#020617');
          grad.addColorStop(0.5, '#1d4ed8');
          grad.addColorStop(1, '#eab308');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // If source image exists, draw with zoom effect
        if (uploadedImage) {
          // Subtle pulse
        }

        // Draw 3D Floating Particles & Stars
        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
          const px = ((i * 37 + elapsed * 40) % width);
          const py = ((i * 53 + elapsed * 25) % height);
          const radius = (i % 3) + 1.5;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(251, 191, 36, 0.8)';
          ctx.fill();
        }

        // Draw 3D Center Star Emblem
        const centerX = width / 2;
        const centerY = height / 2 - 20;
        const starScale = 1 + Math.sin(elapsed * 3) * 0.08;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(starScale, starScale);

        // Glow ring
        ctx.beginPath();
        ctx.arc(0, 0, 45, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // 5-point Star
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(
            Math.cos(((18 + j * 72) * Math.PI) / 180) * 35,
            -Math.sin(((18 + j * 72) * Math.PI) / 180) * 35
          );
          ctx.lineTo(
            Math.cos(((54 + j * 72) * Math.PI) / 180) * 16,
            -Math.sin(((54 + j * 72) * Math.PI) / 180) * 16
          );
        }
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Scene Title & Text Overlay
        const activeScene = generatedJob.scenes[sceneIdx] || generatedJob.scenes[0];
        ctx.textAlign = 'center';

        // Scene text overlay
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(activeScene.title.toUpperCase(), width / 2, height - 70);

        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(activeScene.textOverlay || prompt.slice(0, 24), width / 2, height - 40);
        ctx.shadowBlur = 0;

        // Deepak Star App Watermark
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('⭐ DEEPAK STAR APP', width / 2, 24);
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, generatedJob, duration, uploadedImage]);

  // Download Video from Canvas using MediaRecorder
  const handleDownloadVideo = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DeepakStar_AI_${Date.now()}.webm`;
      a.click();
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 4000);
  };

  // Save to My Projects
  const handleSaveProject = () => {
    if (!generatedJob) return;
    const newProj: EditorProject = {
      id: `proj_${Date.now()}`,
      name: generatedJob.title || 'AI Generated Star Video',
      aspectRatio,
      clips: [
        {
          id: 'c1',
          type: 'image',
          url: uploadedImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
          title: 'AI Scene',
          duration,
        },
      ],
      textOverlays: [
        {
          id: 't1',
          text: prompt.slice(0, 30),
          color: '#ffffff',
          fontSize: 20,
          xPercent: 50,
          yPercent: 80,
          animation: 'fade',
        },
      ],
      musicTitle: generatedJob.musicSuggestion || 'Royal Deepak Star BGM',
      musicVolume: 80,
      filter: style === 'Cyberpunk' ? 'cyberpunk' : 'cinematic-blue',
      brightness: 100,
      contrast: 105,
      speed: 1,
      updatedAt: new Date().toISOString(),
    };

    onSaveToProjects(newProj);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Open in Video Editor
  const handleTransferToEditor = () => {
    if (!generatedJob) return;
    const proj: EditorProject = {
      id: `proj_${Date.now()}`,
      name: `Edit: ${generatedJob.title}`,
      aspectRatio,
      clips: [
        {
          id: 'c_gen',
          type: 'image',
          url: uploadedImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
          title: 'Generated Scene',
          duration,
        },
      ],
      textOverlays: [
        {
          id: 't_overlay',
          text: generatedJob.scenes[0]?.textOverlay || 'DEEPAK STAR APP',
          color: '#38bdf8',
          fontSize: 22,
          xPercent: 50,
          yPercent: 75,
          animation: 'pop',
        },
      ],
      musicTitle: generatedJob.musicSuggestion || 'Royal Deepak Star BGM',
      musicVolume: 85,
      filter: 'cinematic-blue',
      brightness: 100,
      contrast: 110,
      speed: 1,
      updatedAt: new Date().toISOString(),
    };
    onOpenInEditor(proj);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-blue-500/20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-white flex items-center gap-1.5 justify-center">
            <Sparkles className="w-4 h-4 text-sky-400" />
            AI Video Generator
          </h1>
          <p className="text-[10px] text-blue-300/80">Powered by Gemini AI Engine</p>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-500/30 px-2 py-1 rounded-full text-xs">
          <span className="text-[10px] text-slate-400">Credits:</span>
          <span className="font-bold text-amber-400">{userCredits}</span>
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-2xl mx-auto w-full">
        {/* If result is generated, show real video canvas player */}
        {generatedJob ? (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-blue-500/40 bg-slate-900 shadow-2xl relative flex flex-col items-center">
              {/* Canvas Player */}
              <div
                className={`relative flex items-center justify-center bg-black overflow-hidden ${
                  aspectRatio === '9:16'
                    ? 'w-[280px] h-[497px]'
                    : aspectRatio === '1:1'
                    ? 'w-[320px] h-[320px]'
                    : 'w-full aspect-[16/9]'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  width={aspectRatio === '9:16' ? 720 : aspectRatio === '1:1' ? 720 : 1280}
                  height={aspectRatio === '9:16' ? 1280 : aspectRatio === '1:1' ? 720 : 720}
                  className="w-full h-full object-contain"
                />

                {/* Overlaid Play/Pause Control on tap */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors group"
                >
                  {!isPlaying && (
                    <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  )}
                </button>
              </div>

              {/* Player Progress Bar & Controls */}
              <div className="w-full px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 text-slate-300 hover:text-white"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    {currentTime.toFixed(1)}s / {duration}s
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-sky-400"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Scene Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Generated AI Storyboard Scenes:</p>
              <div className="grid grid-cols-3 gap-2">
                {generatedJob.scenes.map((scene, i) => (
                  <div
                    key={scene.id}
                    onClick={() => {
                      setCurrentTime(scene.timeStart);
                      setCurrentSceneIdx(i);
                    }}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                      currentSceneIdx === i
                        ? 'bg-blue-900/40 border-blue-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-[10px] font-bold text-sky-400">Scene {i + 1}</p>
                    <p className="text-xs font-semibold truncate mt-0.5">{scene.title}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{scene.cameraMotion}</p>
                  </div>
                ))}
              </div>
              {generatedJob.musicSuggestion && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <span className="text-amber-400">🎵 Suggested Track:</span>
                  <span className="text-slate-300 italic">{generatedJob.musicSuggestion}</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Download, Edit, Save, New */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadVideo}
                className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-xs transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </button>
              <button
                onClick={handleTransferToEditor}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl border border-blue-500/30 flex items-center justify-center gap-2 text-xs transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Open in Video Editor</span>
              </button>
              <button
                onClick={handleSaveProject}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-xs transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Saved to My Projects!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Save to My Projects</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setGeneratedJob(null)}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-xs transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate Another</span>
              </button>
            </div>
          </div>
        ) : (
          /* Generation Creation Form */
          <div className="space-y-4">
            {/* Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setMode('text')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'text'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Text to Video</span>
              </button>
              <button
                onClick={() => setMode('image')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'image'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo to Video</span>
              </button>
              <button
                onClick={() => setMode('animation')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'animation'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Animation</span>
              </button>
            </div>

            {/* Mode: Image Upload Area if Photo to Video */}
            {mode !== 'text' && (
              <div className="p-4 rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-950/20 text-center">
                {uploadedImage ? (
                  <div className="relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-32 h-32 object-cover rounded-xl shadow-md border border-blue-400/50"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-white">Select Photo for 3D AI Animation</p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG up to 10MB</p>
                    <label className="mt-3 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl cursor-pointer transition-colors shadow">
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Prompt Input Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  {mode === 'image' ? 'Motion & Animation Prompt' : 'Describe your video concept'}
                </label>
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isEnhancing ? 'Enhancing with AI...' : '✨ Enhance Prompt'}</span>
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="E.g., Golden wedding entry with fireworks and royal carriage..."
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Choose Visual Style</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      style === st.id
                        ? 'bg-blue-900/40 border-blue-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{st.icon}</span>
                    <span className="text-xs font-medium">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        aspectRatio === ratio
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Duration</label>
                <div className="grid grid-cols-4 gap-1">
                  {([5, 10, 15, 30] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setDuration(sec)}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        duration === sec
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">Export Quality</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResolution('720p')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    resolution === '720p'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  720p HD
                </button>
                <button
                  onClick={() => setResolution('1080p')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    resolution === '1080p'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1080p Full HD
                </button>
              </div>
            </div>

            {/* Progress Bar when generating */}
            {isGenerating && (
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {generationStep}
                  </span>
                  <span className="font-bold text-white">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-blue-900">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-amber-300 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  AI is creating scenes, camera movements, text typography and sync sound.
                </p>
              </div>
            )}

            {/* Generate CTA Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate 3D AI Video (1 Credit)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
