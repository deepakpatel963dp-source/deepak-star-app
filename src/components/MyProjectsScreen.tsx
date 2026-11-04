import React from 'react';
import { Film, Play, Edit3, Trash2, Download, Plus, ArrowLeft } from 'lucide-react';
import { EditorProject } from '../types';

interface MyProjectsScreenProps {
  projects: EditorProject[];
  onBack: () => void;
  onOpenProject: (project: EditorProject) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNew: () => void;
}

export const MyProjectsScreen: React.FC<MyProjectsScreenProps> = ({
  projects,
  onBack,
  onOpenProject,
  onDeleteProject,
  onCreateNew,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Back"
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-white">My Projects & Downloads</h1>
        </div>
        <button
          onClick={onCreateNew}
          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-900/30 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">No Projects Saved Yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Create an AI video from text or design a custom clip in the Video Editor.
            </p>
            <button
              onClick={onCreateNew}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30"
            >
              Create Video Now
            </button>
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all flex items-center gap-3.5"
            >
              {/* Thumbnail */}
              <div
                onClick={() => onOpenProject(proj)}
                className="relative w-18 h-24 rounded-xl overflow-hidden bg-black shrink-0 cursor-pointer group border border-slate-800"
              >
                <img
                  src={proj.clips[0]?.url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-current opacity-90" />
                </div>
                <span className="absolute bottom-1 right-1 bg-black/70 text-[8px] font-mono text-amber-300 px-1 rounded">
                  {proj.aspectRatio}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">{proj.name}</h3>
                <p className="text-xs text-sky-400 mt-0.5 truncate">{proj.musicTitle}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>{proj.clips.length} clips</span>
                  <span>·</span>
                  <span>Filter: {proj.filter}</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1">
                  Updated {new Date(proj.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenProject(proj)}
                  className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors"
                  title="Open in Editor"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
