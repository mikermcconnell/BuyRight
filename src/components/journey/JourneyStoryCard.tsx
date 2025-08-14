'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface JourneyStoryCardProps {
  progress: number;
  currentPhase: string | null;
  completedPhases: number;
  totalPhases: number;
  userLocation?: string;
  userName?: string;
  className?: string;
}

export default function JourneyStoryCard({
  progress,
  currentPhase,
  completedPhases,
  totalPhases,
  userLocation,
  userName,
  className = '',
}: JourneyStoryCardProps) {
  const getStoryContent = () => {
    if (progress === 0) {
      return {
        title: "Your Journey Begins Here",
        subtitle: `Welcome to your home buying adventure, ${userName || 'future homeowner'}!`,
        description: "Every successful homeowner started exactly where you are now. The key is taking that first step.",
        action: "Start by assessing your finances",
        mood: "hopeful",
        icon: SparklesIcon,
        color: "from-blue-500 to-blue-600",
        bgColor: "from-blue-50 to-indigo-50",
      };
    } else if (progress < 25) {
      return {
        title: "Building Your Foundation",
        subtitle: "You've taken the hardest step - you've started!",
        description: "Most people never make it past the planning phase. You're already ahead of the curve.",
        action: "Keep building momentum",
        mood: "encouraging",
        icon: ChartBarIcon,
        color: "from-green-500 to-green-600",
        bgColor: "from-green-50 to-emerald-50",
      };
    } else if (progress < 50) {
      return {
        title: "Momentum is Building",
        subtitle: "You're making real progress toward your goal!",
        description: "This is where many buyers start to feel confident. You're on the right track.",
        action: "Stay focused on your next milestone",
        mood: "confident",
        icon: CheckCircleIcon,
        color: "from-orange-500 to-orange-600",
        bgColor: "from-orange-50 to-yellow-50",
      };
    } else if (progress < 75) {
      return {
        title: "You're in the Home Stretch",
        subtitle: "Most of the heavy lifting is behind you!",
        description: "You've made it further than many first-time buyers. Your dream home is within reach.",
        action: "Keep pushing forward",
        mood: "determined",
        icon: HomeIcon,
        color: "from-purple-500 to-purple-600",
        bgColor: "from-purple-50 to-pink-50",
      };
    } else if (progress < 90) {
      return {
        title: "So Close You Can Taste It",
        subtitle: "Your keys are almost in your hands!",
        description: "You're in the final phase. Stay focused and trust the process you've been following.",
        action: "Finish strong",
        mood: "excited",
        icon: StarIcon,
        color: "from-pink-500 to-pink-600",
        bgColor: "from-pink-50 to-rose-50",
      };
    } else {
      return {
        title: "Congratulations, Homeowner!",
        subtitle: "You've done what millions dream of doing.",
        description: "From planning to closing, you've successfully navigated one of life's biggest milestones.",
        action: "Enjoy your new home",
        mood: "triumphant",
        icon: HomeSolid,
        color: "from-emerald-500 to-emerald-600",
        bgColor: "from-emerald-50 to-green-50",
      };
    }
  };

  const story = getStoryContent();
  const Icon = story.icon;

  const phaseNames: { [key: string]: string } = {
    planning: "Planning & Budgeting",
    financing: "Getting Pre-Approved",
    searching: "House Hunting",
    inspection: "Inspection & Negotiation",
    closing: "Closing Process",
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl p-8 shadow-xl
        bg-gradient-to-br ${story.bgColor}
        border border-white/50
        ${className}
      `}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      {/* Background decoration */}
      <div className="absolute top-6 right-6 opacity-10">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <HomeSolid className="w-24 h-24" />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header with icon and location */}
        <motion.div
          className="flex items-start justify-between mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-14 h-14 bg-gradient-to-br ${story.color}
              rounded-2xl flex items-center justify-center shadow-lg
            `}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            {userLocation && (
              <div className="text-sm text-gray-600">
                <div className="font-medium">Buying in</div>
                <div className="text-primary-600">{userLocation}</div>
              </div>
            )}
          </div>

          {/* Progress badge */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</div>
            <div className="text-xs text-gray-600 text-center">Complete</div>
          </div>
        </motion.div>

        {/* Story content */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {story.title}
          </h2>
          <p className="text-lg text-gray-700 mb-3 font-medium">
            {story.subtitle}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {story.description}
          </p>
        </motion.div>

        {/* Phase status */}
        {currentPhase && (
          <motion.div
            className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Current Phase</div>
                <div className="font-semibold text-gray-900">
                  {phaseNames[currentPhase] || currentPhase}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="font-bold text-primary-600">
                  {completedPhases} of {totalPhases}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to action */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <ClockIcon className="w-4 h-4" />
            <span>{story.action}</span>
          </div>

          {/* Success rating for completed journeys */}
          {progress >= 100 && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2">Journey Complete!</span>
            </div>
          )}
        </motion.div>

        {/* Motivational quote for certain progress levels */}
        {(progress === 0 || progress >= 50) && (
          <motion.div
            className="mt-6 p-4 bg-white/40 backdrop-blur-sm rounded-xl border-l-4 border-primary-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-sm italic text-gray-700">
              {progress === 0 && '"The journey of a thousand miles begins with one step." - Lao Tzu'}
              {progress >= 50 && progress < 100 && '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill'}
              {progress >= 100 && '"Home is where love resides, memories are created, and laughter never ends."'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 pointer-events-none rounded-3xl" />
    </motion.div>
  );
}