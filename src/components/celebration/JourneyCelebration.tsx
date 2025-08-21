'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useJourneyProgress } from '@/contexts/JourneyContext';

interface JourneyCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  stepTitle: string;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
}

const CONFETTI_COLORS = [
  '#58CC02', '#FFC800', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
];

const JourneyCelebration: React.FC<JourneyCelebrationProps> = ({ 
  isVisible, 
  onClose, 
  stepTitle 
}) => {
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [showContent, setShowContent] = useState(false);
  const { completedStepsCount, totalStepsCount, progressPercentage } = useJourneyProgress();

  // Create confetti particles
  const createConfetti = useCallback(() => {
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        size: Math.random() * 8 + 4,
      });
    }
    return particles;
  }, []);

  // Animate confetti
  useEffect(() => {
    if (!isVisible) return;

    setShowContent(true);
    const particles = createConfetti();
    setConfetti(particles);

    const interval = setInterval(() => {
      setConfetti(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        rotation: particle.rotation + particle.rotationSpeed,
        vy: particle.vy + 0.1, // gravity
      })).filter(particle => particle.y < window.innerHeight + 20));
    }, 16);

    // Auto-close after 10 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, createConfetti, onClose]);

  // Reset when closing
  useEffect(() => {
    if (!isVisible) {
      setConfetti([]);
      setShowContent(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map(particle => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
              borderRadius: '2px',
            }}
          />
        ))}
      </div>

      {/* Main celebration content */}
      <div 
        className={`
          bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center relative
          transform transition-all duration-500 ease-out
          ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close celebration"
        >
          <span className="text-gray-600">×</span>
        </button>

        {/* Celebration content */}
        <div className="space-y-6">
          {/* Main celebration message */}
          <div>
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h1>
            <p className="text-lg text-gray-600">
              You've completed your home buying journey!
            </p>
          </div>

          {/* Achievement stats */}
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              🏆 Your Achievement
            </h2>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {completedStepsCount}
                </div>
                <div className="text-sm text-green-700">Steps Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-green-700">Journey Complete</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🗝️</span>
                <span className="font-medium text-green-800">
                  Keys Received!
                </span>
              </div>
            </div>
          </div>

          {/* Encouraging message */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-800 font-medium">
              🏡 Welcome to homeownership! You've successfully navigated 
              the complex home buying process. Enjoy your new home!
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyCelebration;