import React, { useState, useEffect } from 'react';
import DreamSky from './components/DreamSky';
import DreamForm from './components/DreamForm';
import DreamModal from './components/DreamModal';
import { Dream } from './types/Dream';

function App() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [skyMood, setSkyMood] = useState({ mood: 'neutral', color: '#1a1a2e' });
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isAiMode = dreams.length >= 5;

  useEffect(() => {
    fetchDreams();
    fetchSkyMood();
  }, []);

  const fetchDreams = async () => {
    try {
      const response = await fetch('/api/dreams');
      if (response.ok) {
        const data = await response.json();
        setDreams(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch dreams');
        setDreams([]);
      }
    } catch (error) {
      console.error('Error fetching dreams:', error);
      setDreams([]);
    }
  };

  const fetchSkyMood = async () => {
    try {
      const response = await fetch('/api/sky-mood');
      if (response.ok) {
        const data = await response.json();
        setSkyMood(data);
      } else {
        console.error('Failed to fetch sky mood');
        setSkyMood({ mood: 'neutral', color: '#1a1a2e' });
      }
    } catch (error) {
      console.error('Error fetching sky mood:', error);
      setSkyMood({ mood: 'neutral', color: '#1a1a2e' });
    }
  };

  const handleDreamSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const apiCall = fetch('/api/dreams', {
        method: 'POST',
        body: formData,
      });

      let response;

      // When in AI mode, ensure the loading screen shows for at least 5 seconds for a better user experience.
      if (isAiMode) {
        const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 5000));
        const [apiResponse] = await Promise.all([apiCall, minLoadingPromise]);
        response = apiResponse;
      } else {
        // In manual mode, no delay is needed.
        response = await apiCall;
      }

      if (response.ok) {
        const newDream = await response.json();
        setDreams(prev => [newDream, ...(Array.isArray(prev) ? prev : [])]);
        fetchSkyMood(); // Update sky mood
        setShowForm(false);
      } else {
        throw new Error('Failed to create dream');
      }
    } catch (error) {
      console.error('Error creating dream:', error);
      alert('Failed to process your dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDreamClick = (dream: Dream) => {
    setSelectedDream(dream);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 transition-colors duration-1000"
        style={{ 
          background: `linear-gradient(135deg, ${skyMood.color} 0%, ${skyMood.color}dd 50%, ${skyMood.color}aa 100%)` 
        }}
      />

      {/* 3D Dream Sky */}
      <DreamSky 
        dreams={Array.isArray(dreams) ? dreams : []} 
        skyColor={skyMood.color}
        onDreamClick={handleDreamClick}
      />

      {/* Floating UI Elements */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowForm(true)}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300"
        >
          <span className="text-xl">🌙</span>
        </button>
      </div>

      {/* Dream Counter */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-medium">{Array.isArray(dreams) ? dreams.length : 0} Dreams</span>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-lg font-medium">Processing your dream...</p>
            <p className="text-sm text-white/70 mt-2">Creating your dream star</p>
          </div>
        </div>
      )}

      {/* Dream Form Modal */}
      {showForm && (
        <DreamForm 
          onSubmit={handleDreamSubmit}
          onClose={() => setShowForm(false)}
          isLoading={isLoading}
          isAiMode={isAiMode}
        />
      )}

      {/* Dream Detail Modal */}
      {selectedDream && (
        <DreamModal 
          dream={selectedDream}
          onClose={() => setSelectedDream(null)}
        />
      )}

      {/* Welcome Message */}
      {(!Array.isArray(dreams) || dreams.length === 0) && !showForm && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 text-center text-white/80">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-md">
            <span className="text-2xl mb-3 block">✨</span>
            <h3 className="text-lg font-medium mb-2">Welcome to Dream Visualizer</h3>
            <p className="text-sm mb-4">
              Enter 5 dreams manually to unlock the AI-powered Dream Visualizer!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-dream-gold text-dream-blue px-6 py-2 rounded-full font-medium hover:bg-yellow-300 transition-colors"
            >
              Share Your First Dream
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 