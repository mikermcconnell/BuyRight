'use client';

import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  PlayIcon,
  XMarkIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueIn?: string;
  estimatedTime?: string;
  isCompleted?: boolean;
  phase: string;
  stepId?: string;
  hasEducationalContent?: boolean;
}

interface TaskCardProps {
  task: Task;
  onStart?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onLearnMore?: (task: Task) => void;
  onSkip?: (task: Task) => void;
  showComplexityToggle?: boolean;
  isBeginnerMode?: boolean;
  className?: string;
}

const priorityConfig = {
  low: {
    color: 'bg-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
  },
  medium: {
    color: 'bg-yellow-400',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
  },
  high: {
    color: 'bg-red-400',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
  },
};

export default function TaskCard({
  task,
  onStart,
  onComplete,
  onLearnMore,
  onSkip,
  showComplexityToggle = true,
  isBeginnerMode = false,
  className = '',
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeAction, setSwipeAction] = useState<'start' | 'complete' | null>(null);
  
  const priority = priorityConfig[task.priority];
  const isCompleted = task.isCompleted;

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0) {
        // Swipe right - Complete task
        if (!isCompleted) {
          setSwipeAction('complete');
          setTimeout(() => {
            onComplete?.(task);
            setSwipeAction(null);
          }, 200);
        }
      } else {
        // Swipe left - Start task
        if (!isCompleted) {
          setSwipeAction('start');
          setTimeout(() => {
            onStart?.(task);
            setSwipeAction(null);
          }, 200);
        }
      }
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      layout
    >
      {/* Swipe Action Backgrounds */}
      <div className="absolute inset-0 flex items-center justify-between px-4 rounded-xl overflow-hidden">
        {/* Complete Action (Swipe Right) */}
        <motion.div
          className="flex items-center justify-center w-16 h-full bg-progress-completed rounded-l-xl"
          initial={{ x: -64 }}
          animate={{ x: swipeAction === 'complete' ? 0 : -64 }}
        >
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </motion.div>

        {/* Start Action (Swipe Left) */}
        <motion.div
          className="flex items-center justify-center w-16 h-full bg-primary-500 rounded-r-xl"
          initial={{ x: 64 }}
          animate={{ x: swipeAction === 'start' ? 0 : 64 }}
        >
          <PlayIcon className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Main Task Card */}
      <motion.div
        className={`
          relative bg-white rounded-xl border p-4 min-h-[72px] touch-target
          ${isCompleted ? 'border-progress-completed bg-progress-completed/5' : priority.borderColor}
          ${swipeAction ? 'z-10' : ''}
        `}
        drag={!isCompleted ? "x" : false}
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: isCompleted ? 1 : 0.98 }}
        animate={{
          x: swipeAction ? (swipeAction === 'complete' ? 120 : -120) : 0,
          opacity: swipeAction ? 0.8 : 1,
        }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-start space-x-3">
          {/* Priority/Status Indicator */}
          <div className="flex-shrink-0 pt-1">
            {isCompleted ? (
              <CheckCircleIconSolid className="w-5 h-5 text-progress-completed" />
            ) : (
              <div className={`w-3 h-3 rounded-full ${priority.color}`} />
            )}
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium leading-tight ${
                  isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h4>
                
                <p className={`text-sm mt-1 ${
                  isCompleted ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>

                {/* Task Metadata */}
                <div className="flex items-center space-x-4 mt-2">
                  {task.dueIn && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{task.dueIn}</span>
                    </div>
                  )}
                  
                  {task.estimatedTime && (
                    <span className="text-xs text-gray-500">
                      ⏱ {task.estimatedTime}
                    </span>
                  )}

                  {task.priority === 'high' && !isCompleted && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Urgent
                    </span>
                  )}
                </div>

                {/* Beginner Mode - Educational Content */}
                {isBeginnerMode && task.hasEducationalContent && !isCompleted && (
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <InformationCircleIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Learn More</p>
                          <p className="text-xs">
                            This task includes helpful guidance and tips to help you understand 
                            the process better.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-3">
                {/* Learn More Button (Beginner Mode) */}
                {isBeginnerMode && task.hasEducationalContent && !isCompleted && (
                  <button
                    onClick={() => {
                      if (isExpanded) {
                        onLearnMore?.(task);
                      } else {
                        setIsExpanded(!isExpanded);
                      }
                    }}
                    className="icon-touch-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <BookOpenIcon className="icon-sm" />
                  </button>
                )}

                {/* Start/Continue Button */}
                {!isCompleted && (
                  <button
                    onClick={() => onStart?.(task)}
                    className="icon-touch-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <ChevronRightIcon className="icon-sm" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        {!isCompleted && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-1 bg-gray-200 rounded-full" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Task List Component
interface TaskListProps {
  tasks: Task[];
  onStartTask?: (task: Task) => void;
  onCompleteTask?: (task: Task) => void;
  onLearnMore?: (task: Task) => void;
  isBeginnerMode?: boolean;
  showCompleted?: boolean;
  className?: string;
}

export function TaskList({
  tasks,
  onStartTask,
  onCompleteTask,
  onLearnMore,
  isBeginnerMode = false,
  showCompleted = true,
  className = '',
}: TaskListProps) {
  const filteredTasks = showCompleted 
    ? tasks 
    : tasks.filter(task => !task.isCompleted);

  const pendingTasks = filteredTasks.filter(task => !task.isCompleted);
  const completedTasks = filteredTasks.filter(task => task.isCompleted);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Pending Tasks */}
      {pendingTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStart={onStartTask}
          onComplete={onCompleteTask}
          onLearnMore={onLearnMore}
          isBeginnerMode={isBeginnerMode}
        />
      ))}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && showCompleted && (
        <>
          <div className="flex items-center space-x-2 mt-6 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 font-medium">Completed</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStart={onStartTask}
              onComplete={onCompleteTask}
              onLearnMore={onLearnMore}
              isBeginnerMode={isBeginnerMode}
            />
          ))}
        </>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <CheckCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">All caught up!</p>
          <p className="text-sm text-gray-400 mt-1">
            You've completed all your current tasks.
          </p>
        </div>
      )}
    </div>
  );
}