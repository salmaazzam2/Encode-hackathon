import React, { useEffect, useRef } from 'react';
import { Dream } from '../types/Dream';

interface DreamSkyProps {
  dreams: Dream[];
  skyColor: string;
  onDreamClick: (dream: Dream) => void;
}

const DreamSky: React.FC<DreamSkyProps> = ({ dreams, skyColor, onDreamClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, skyColor);
    gradient.addColorStop(1, '#000011');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      const opacity = Math.random() * 0.8 + 0.2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Draw dream stars - ensure dreams is an array
    if (Array.isArray(dreams)) {
      dreams.forEach((dream, index) => {
        const x = (dream.position.x + 10) * (canvas.width / 20);
        const y = (dream.position.y + 10) * (canvas.height / 20);
        
        // Determine star color based on mood
        let starColor;
        if (dream.moodScore > 0.3) starColor = '#ffd700'; // Gold for positive
        else if (dream.moodScore < -0.3) starColor = '#ff6b6b'; // Red for negative
        else starColor = '#c0c0c0'; // Silver for neutral

        // Draw star glow
        const glowSize = Math.abs(dream.moodScore) * 20 + 15;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, starColor);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw star core
        const coreSize = Math.abs(dream.moodScore) * 5 + 3;
        ctx.beginPath();
        ctx.arc(x, y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();

        // Add click handler
        canvas.addEventListener('click', (e) => {
          const rect = canvas.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          
          const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
          if (distance < glowSize) {
            onDreamClick(dream);
          }
        });
      });
    }
  }, [dreams, skyColor, onDreamClick]);

  return (
    <div className="fixed inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ background: `radial-gradient(circle, ${skyColor} 0%, #000011 100%)` }}
      />
    </div>
  );
};

export default DreamSky; 