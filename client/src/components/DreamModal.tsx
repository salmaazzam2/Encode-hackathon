import React from 'react';
import { Dream } from '../types/Dream';

interface DreamModalProps {
  dream: Dream;
  onClose: () => void;
}

const DreamModal: React.FC<DreamModalProps> = ({ dream, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodIcon = (mood: string) => {
    if (mood.toLowerCase().includes('happy') || mood.toLowerCase().includes('joy')) {
      return <span className="text-red-400 text-xl">❤️</span>;
    }
    if (mood.toLowerCase().includes('mysterious') || mood.toLowerCase().includes('magical')) {
      return <span className="text-yellow-400 text-xl">⚡</span>;
    }
    return <span className="text-blue-400 text-xl">⭐</span>;
  };

  const getMoodColor = (moodScore: number) => {
    if (moodScore > 0.3) return 'text-green-400';
    if (moodScore < -0.3) return 'text-red-400';
    return 'text-blue-400';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-dream-purple to-dream-blue border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dream-gold/20 rounded-full flex items-center justify-center">
              <span className="text-dream-gold text-xl">⭐</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dream Star</h2>
              <p className="text-sm text-white/70">Your dream visualization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dream Image */}
          <div className="relative">
            <img
              src={dream.imageUrl}
              alt="Dream visualization"
              className="w-full h-64 object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
          </div>

          {/* Dream Details */}
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Dream Description</h3>
              <p className="text-white/80 leading-relaxed">{dream.description}</p>
            </div>

            {/* Mood Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getMoodIcon(dream.mood)}
                  <h4 className="font-medium text-white">Mood</h4>
                </div>
                <p className={`text-lg font-semibold ${getMoodColor(dream.moodScore)}`}>
                  {dream.mood}
                </p>
                <p className="text-sm text-white/60">
                  Mood intensity: {Math.abs(dream.moodScore * 100).toFixed(0)}%
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 text-xl">📅</span>
                  <h4 className="font-medium text-white">Created</h4>
                </div>
                <p className="text-white/80">{formatDate(dream.createdAt)}</p>
              </div>
            </div>

            {/* Star Position */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Star Position in Sky</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-white/60">X:</span>
                  <span className="text-white ml-2">{dream.position.x.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-white/60">Y:</span>
                  <span className="text-white ml-2">{dream.position.y.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-white/60">Z:</span>
                  <span className="text-white ml-2">{dream.position.z.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <span>⭐</span>
            <span>This dream star will forever shine in your personal dream sky</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamModal; 