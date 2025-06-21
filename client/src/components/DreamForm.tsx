import React, { useState } from 'react';
import { Dream } from '../types/Dream';

interface DreamFormProps {
  onSubmit: (dreamData: FormData) => void;
  onClose: () => void;
  isLoading: boolean;
  isAiMode: boolean;
}

const DreamForm: React.FC<DreamFormProps> = ({ onSubmit, onClose, isLoading, isAiMode }) => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mood, setMood] = useState('Neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      const formData = new FormData();
      formData.append('description', description);
      if (!isAiMode) {
        formData.append('mood', mood);
        if (imageFile) {
          formData.append('image', imageFile);
        }
      }
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-dream-purple to-dream-blue border border-white/20 rounded-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dream-gold/20 rounded-full flex items-center justify-center">
              <span className="text-dream-gold text-xl">🌙</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share Your Dream</h2>
              <p className="text-sm text-white/70">Let your dream become a star</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {isAiMode ? "Describe your dream for the AI" : "Dream Description"}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you saw, felt, or experienced..."
              className="w-full h-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-dream-gold/50 transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {!isAiMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Dream Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-dream-gold/20 file:text-dream-gold hover:file:bg-dream-gold/30"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-dream-gold/50 transition-all"
                  disabled={isLoading}
                >
                  <option className="text-black">Joyful</option>
                  <option className="text-black">Peaceful</option>
                  <option className="text-black">Mysterious</option>
                  <option className="text-black">Anxious</option>
                  <option className="text-black">Frightening</option>
                  <option className="text-black">Neutral</option>
                </select>
              </div>
            </>
          )}

          {/* Tips */}
          {isAiMode && (
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-dream-gold text-sm">🤖</span>
                <div className="text-xs text-white/70">
                  <p className="font-medium text-white/80">AI Mode Activated!</p>
                  <p>The AI will now generate an image and analyze the mood from your description.</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!description.trim() || isLoading}
            className="w-full bg-gradient-to-r from-dream-gold to-yellow-400 text-dream-blue font-semibold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-dream-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-dream-blue/30 border-t-dream-blue rounded-full animate-spin" />
                Processing Dream...
              </>
            ) : (
              <>
                <span>📤</span>
                Create Dream Star
              </>
            )}
          </button>
        </form>

        {/* Character count */}
        <div className="mt-3 text-right">
          <span className={`text-xs ${description.length > 500 ? 'text-red-400' : 'text-white/50'}`}>
            {description.length}/500
          </span>
        </div>
      </div>
    </div>
  );
};

export default DreamForm; 