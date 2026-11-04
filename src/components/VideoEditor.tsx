import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Pause, Download, Plus, Music, Type, Wand2, 
  Sliders, Crop, Scissors, Volume2, Sparkles, Check, Trash2, Layers, Film 
} from 'lucide-react';
import { EditorProject, EditorClip, TextOverlay } from '../types';
import { AUDIO_TRACKS } from '../data/initialData';

interface VideoEditorProps {
  project?: EditorProject | null;
  onBack: () => void;
  onSave: (project: EditorProject) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  project: initialProject,
  onBack,
  onSave,
}) => {
  // Active Project State
  const [project, setProject] = useState<EditorProject>(
    initialProject || {
      id: `proj_${Date.now()}`,
      name: 'New Deepak Star Reel',
      aspectRatio: '9:16',
      clips: [
        {
          id: 'c1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
          title: 'Opening Scene',
          duration: 5,
        },
      ],
      textOverlays: [
        {
          id: 't1',
          text: 'DEEPAK STAR SPECIAL',
          color: '#fbbf24',
          fontSize: 22,
          xPercent: 50,
          yPercent: 75,
          animation: 'pop',
        },
      ],
      musicTitle: 'Royal Deepak Star BGM',
      musicVolume: 80,
      filter: 'cinematic-blue',
      brightness: 100,
      contrast: 100,
      speed: 1,
      updatedAt: new Date().toISOString(),
    }
  );

  // Active Tool Panel Tab
  const [activeTab, setActiveTab] = useState<'clips' | 'text' | 'music' | 'filters' | 'adjust'>('clips');

  // Playback & Canvas
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Text overlay form state
  const [newText, setNewText] = useState('Happy Celebration');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(20);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const totalDuration = project.clips.reduce((acc, c) => acc + c.duration, 0) || 5;

  // Real-time Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const render = (now: number) => {
      if (isPlaying) {
        const elapsed = ((now - startTime) / 1000) * project.speed;
        const curSec = elapsed % totalDuration;
        setCurrentTime(curSec);

        const width = canvas.width;
        const height = canvas.height;

        // Apply Adjustments & Filters
        let filterStr = `brightness(${project.brightness}%) contrast(${project.contrast}%)`;
        if (project.filter === 'cinematic-blue') {
          filterStr += ' hue-rotate(190deg) saturate(120%)';
        } else if (project.filter === 'golden-hour') {
          filterStr += ' sepia(40%) saturate(140%)';
        } else if (project.filter === 'cyberpunk') {
          filterStr += ' hue-rotate(280deg) saturate(180%)';
        } else if (project.filter === 'vivid') {
          filterStr += ' saturate(160%)';
        } else if (project.filter === 'bw-glamour') {
          filterStr += ' grayscale(100%) contrast(130%)';
        }
        ctx.filter = filterStr;

        // Draw background base
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e3a8a');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Draw animated timeline motion graphics
        ctx.save();
        ctx.translate(width / 2, height / 2);
        const rot = curSec * 0.5;
        ctx.rotate(rot);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 3;
        ctx.strokeRect(-80, -80, 160, 160);
        ctx.restore();

        // Draw 3D center star
        ctx.save();
        ctx.translate(width / 2, height / 2 - 20);
        const pulse = 1 + Math.sin(curSec * 4) * 0.05;
        ctx.scale(pulse, pulse);
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(
            Math.cos(((18 + j * 72) * Math.PI) / 180) * 40,
            -Math.sin(((18 + j * 72) * Math.PI) / 180) * 40
          );
          ctx.lineTo(
            Math.cos(((54 + j * 72) * Math.PI) / 180) * 18,
            -Math.sin(((54 + j * 72) * Math.PI) / 180) * 18
          );
        }
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Reset filter for text clarity
        ctx.filter = 'none';

        // Draw Text Overlays
        project.textOverlays.forEach((overlay) => {
          ctx.save();
          ctx.font = `bold ${overlay.fontSize}px Outfit, sans-serif`;
          ctx.fillStyle = overlay.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 6;
          const x = (width * overlay.xPercent) / 100;
          const y = (height * overlay.yPercent) / 100;

          if (overlay.animation === 'pop') {
            const popScale = 1 + Math.sin(curSec * 5) * 0.05;
            ctx.translate(x, y);
            ctx.scale(popScale, popScale);
            ctx.fillText(overlay.text, 0, 0);
          } else {
            ctx.fillText(overlay.text, x, y);
          }
          ctx.restore();
        });

        // Watermark badge
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('⭐ DEEPAK STAR APP', width / 2, 25);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, project, totalDuration]);

  // Handle Export Video using Canvas captureStream + MediaRecorder
  const handleExportVideo = () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportProgress(10);
    setIsPlaying(true);

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      setExportProgress(100);
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_HD.webm`;
      a.click();
      setTimeout(() => {
        setIsExporting(false);
        onSave(project);
      }, 1000);
    };

    mediaRecorder.start();

    // Progress tick
    const interval = setInterval(() => {
      setExportProgress((prev) => Math.min(prev + 20, 90));
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      mediaRecorder.stop();
    }, 3500);
  };

  // Add Clip
  const handleAddClip = () => {
    const newClip: EditorClip = {
      id: `c_${Date.now()}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      title: `Clip ${project.clips.length + 1}`,
      duration: 4,
    };
    setProject({ ...project, clips: [...project.clips, newClip] });
  };

  // Add Text Overlay
  const handleAddTextOverlay = () => {
    if (!newText.trim()) return;
    const overlay: TextOverlay = {
      id: `t_${Date.now()}`,
      text: newText,
      color: textColor,
      fontSize: textSize,
      xPercent: 50,
      yPercent: 50,
      animation: 'pop',
    };
    setProject({ ...project, textOverlays: [...project.textOverlays, overlay] });
    setNewText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-blue-500/20 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-white text-center">{project.name}</h1>
          <p className="text-[10px] text-blue-300 text-center font-mono">
            {project.aspectRatio} · {totalDuration}s · {project.filter}
          </p>
        </div>
        <button
          onClick={handleExportVideo}
          disabled={isExporting}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExporting ? `${exportProgress}%` : 'Export HD'}</span>
        </button>
      </div>

      {/* Editor Main Canvas Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 bg-black/60 relative overflow-hidden">
        <div
          className={`relative rounded-xl overflow-hidden border border-blue-500/30 bg-black shadow-2xl flex items-center justify-center ${
            project.aspectRatio === '9:16'
              ? 'w-[230px] h-[408px]'
              : project.aspectRatio === '1:1'
              ? 'w-[280px] h-[280px]'
              : 'w-full max-w-[480px] aspect-[16/9]'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={project.aspectRatio === '9:16' ? 720 : project.aspectRatio === '1:1' ? 720 : 1280}
            height={project.aspectRatio === '9:16' ? 1280 : project.aspectRatio === '1:1' ? 720 : 720}
            className="w-full h-full object-contain"
          />

          {/* Overlaid Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors"
          >
            {!isPlaying && (
              <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            )}
          </button>
        </div>

        {/* Video Scrubber */}
        <div className="w-full max-w-md px-4 mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>{currentTime.toFixed(1)}s</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-150"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>
          <span>{totalDuration}s</span>
        </div>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="flex items-center justify-around px-2 py-2 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('clips')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'clips' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Clips ({project.clips.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'text' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Text ({project.textOverlays.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'music' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music</span>
          </button>
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'filters' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setActiveTab('adjust')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'adjust' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Adjust</span>
          </button>
        </div>

        {/* Panel Content for Active Tab */}
        <div className="p-3 max-h-48 overflow-y-auto">
          {activeTab === 'clips' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Timeline Clips</span>
                <button
                  onClick={handleAddClip}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Clip</span>
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {project.clips.map((clip, i) => (
                  <div
                    key={clip.id}
                    className="relative w-24 h-20 rounded-xl overflow-hidden border border-blue-500/40 bg-slate-950 shrink-0 group"
                  >
                    <img src={clip.url} alt={clip.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 p-1 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-white truncate">{clip.title}</span>
                      <span className="text-[8px] font-mono text-amber-300">{clip.duration}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter text overlay..."
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
                <button
                  onClick={handleAddTextOverlay}
                  className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg text-xs"
                >
                  Add Text
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Color:</span>
                {(['#ffffff', '#fbbf24', '#38bdf8', '#f43f5e', '#a855f7'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border ${textColor === c ? 'ring-2 ring-white' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">Choose Music Track</p>
              <div className="grid grid-cols-2 gap-1.5">
                {AUDIO_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setProject({ ...project, musicTitle: track.title })}
                    className={`p-2 rounded-lg border text-left truncate transition-colors ${
                      project.musicTitle === track.title
                        ? 'bg-blue-900/40 border-blue-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold truncate">{track.title}</p>
                    <p className="text-[9px] text-slate-500">{track.artist}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'filters' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">Color & Cinematic Filters</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['none', 'cinematic-blue', 'golden-hour', 'cyberpunk', 'vivid', 'bw-glamour'] as const).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setProject({ ...project, filter: f })}
                      className={`p-2 rounded-lg border text-center capitalize text-xs font-medium transition-colors ${
                        project.filter === f
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.replace('-', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === 'adjust' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Brightness ({project.brightness}%)</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={project.brightness}
                  onChange={(e) => setProject({ ...project, brightness: Number(e.target.value) })}
                  className="w-40 accent-blue-500"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Contrast ({project.contrast}%)</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={project.contrast}
                  onChange={(e) => setProject({ ...project, contrast: Number(e.target.value) })}
                  className="w-40 accent-blue-500"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Speed ({project.speed}x)</span>
                <div className="flex items-center gap-1">
                  {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setProject({ ...project, speed: s })}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        project.speed === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
