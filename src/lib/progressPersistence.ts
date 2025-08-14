// Enhanced progress persistence service with API + localStorage fallback
import { UserJourneyProgress } from '@/types/regional';
import { JourneyApi } from './progressApi';

const STORAGE_KEY = 'buyright_journey_progress';
const SYNC_KEY = 'buyright_last_sync';
const OFFLINE_QUEUE_KEY = 'buyright_offline_queue';

interface OfflineAction {
  id: string;
  type: 'save' | 'update' | 'reset';
  payload: any;
  timestamp: Date;
}

export class ProgressPersistence {
  // Save progress with API + localStorage fallback
  static async saveProgress(progress: UserJourneyProgress): Promise<boolean> {
    try {
      // Always save to localStorage first for immediate access
      this.saveToLocalStorage(progress);

      // Try to save to API
      if (navigator.onLine) {
        const result = await JourneyApi.progress.saveProgress(progress);
        
        if (result.success) {
          // Update sync timestamp
          localStorage.setItem(SYNC_KEY, new Date().toISOString());
          
          // Clear any offline queue items for this progress
          this.clearOfflineQueue();
          return true;
        } else {
          // API failed, queue for later sync
          this.queueOfflineAction({
            id: `save_${Date.now()}`,
            type: 'save',
            payload: progress,
            timestamp: new Date()
          });
        }
      } else {
        // Offline, queue the action
        this.queueOfflineAction({
          id: `save_${Date.now()}`,
          type: 'save',
          payload: progress,
          timestamp: new Date()
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      // Ensure localStorage save succeeded
      this.saveToLocalStorage(progress);
      return false;
    }
  }

  // Load progress with API + localStorage fallback
  static async loadProgress(userId: string): Promise<UserJourneyProgress | null> {
    try {
      // First try to load from API if online
      if (navigator.onLine) {
        const result = await JourneyApi.progress.getProgress(userId);
        
        if (result.success && result.data) {
          // Save to localStorage for offline access
          this.saveToLocalStorage(result.data);
          return result.data;
        }
      }

      // Fallback to localStorage
      return this.loadFromLocalStorage();
    } catch (error) {
      console.error('Error loading progress:', error);
      // Always fallback to localStorage
      return this.loadFromLocalStorage();
    }
  }

  // Update progress with optimistic updates
  static async updateProgress(
    userId: string,
    updates: Partial<UserJourneyProgress>
  ): Promise<boolean> {
    try {
      // Get current progress from localStorage
      const currentProgress = this.loadFromLocalStorage();
      if (!currentProgress) {
        console.error('No current progress found to update');
        return false;
      }

      // Apply updates optimistically
      const updatedProgress: UserJourneyProgress = {
        ...currentProgress,
        ...updates,
        lastUpdated: new Date()
      };

      // Save optimistic update to localStorage
      this.saveToLocalStorage(updatedProgress);

      // Try to sync with API
      if (navigator.onLine) {
        const result = await JourneyApi.progress.updateProgress(userId, updates);
        
        if (result.success) {
          localStorage.setItem(SYNC_KEY, new Date().toISOString());
          this.clearOfflineQueue();
          return true;
        } else {
          // API failed, queue for later sync
          this.queueOfflineAction({
            id: `update_${Date.now()}`,
            type: 'update',
            payload: { userId, updates },
            timestamp: new Date()
          });
        }
      } else {
        // Offline, queue the action
        this.queueOfflineAction({
          id: `update_${Date.now()}`,
          type: 'update',
          payload: { userId, updates },
          timestamp: new Date()
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  }

  // Reset progress
  static async resetProgress(userId: string): Promise<boolean> {
    try {
      // Clear localStorage immediately
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SYNC_KEY);

      // Try to reset via API
      if (navigator.onLine) {
        const result = await JourneyApi.progress.resetProgress(userId);
        
        if (result.success) {
          this.clearOfflineQueue();
          return true;
        } else {
          // API failed, queue for later sync
          this.queueOfflineAction({
            id: `reset_${Date.now()}`,
            type: 'reset',
            payload: { userId },
            timestamp: new Date()
          });
        }
      } else {
        // Offline, queue the action
        this.queueOfflineAction({
          id: `reset_${Date.now()}`,
          type: 'reset',
          payload: { userId },
          timestamp: new Date()
        });
      }

      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  }

  // Sync offline changes when coming back online
  static async syncOfflineChanges(): Promise<void> {
    if (!navigator.onLine) {
      return;
    }

    try {
      const queue = this.getOfflineQueue();
      
      for (const action of queue) {
        try {
          switch (action.type) {
            case 'save':
              await JourneyApi.progress.saveProgress(action.payload);
              break;
            case 'update':
              await JourneyApi.progress.updateProgress(
                action.payload.userId,
                action.payload.updates
              );
              break;
            case 'reset':
              await JourneyApi.progress.resetProgress(action.payload.userId);
              break;
          }
        } catch (error) {
          console.error(`Failed to sync offline action ${action.id}:`, error);
          // Keep the action in queue for retry
          continue;
        }
      }

      // Clear queue after successful sync
      this.clearOfflineQueue();
      localStorage.setItem(SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error syncing offline changes:', error);
    }
  }

  // Check if we need to sync
  static needsSync(): boolean {
    const lastSync = localStorage.getItem(SYNC_KEY);
    const queue = this.getOfflineQueue();
    
    if (queue.length > 0) {
      return true;
    }

    if (!lastSync) {
      return true;
    }

    // Sync if it's been more than 5 minutes since last sync
    const lastSyncTime = new Date(lastSync);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (now.getTime() - lastSyncTime.getTime()) > fiveMinutes;
  }

  // Private helper methods
  private static saveToLocalStorage(progress: UserJourneyProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private static loadFromLocalStorage(): UserJourneyProgress | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        // Convert date strings back to Date objects
        progress.startedAt = new Date(progress.startedAt);
        progress.lastUpdated = new Date(progress.lastUpdated);
        
        // Convert step progress dates
        if (progress.stepProgress) {
          Object.keys(progress.stepProgress).forEach(stepId => {
            const stepProg = progress.stepProgress[stepId];
            if (stepProg.startedAt) {
              stepProg.startedAt = new Date(stepProg.startedAt);
            }
            if (stepProg.completedAt) {
              stepProg.completedAt = new Date(stepProg.completedAt);
            }
          });
        }
        
        return progress;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  }

  private static queueOfflineAction(action: OfflineAction): void {
    try {
      const queue = this.getOfflineQueue();
      queue.push(action);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to queue offline action:', error);
    }
  }

  private static getOfflineQueue(): OfflineAction[] {
    try {
      const queueData = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Failed to get offline queue:', error);
      return [];
    }
  }

  private static clearOfflineQueue(): void {
    try {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear offline queue:', error);
    }
  }
}

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    ProgressPersistence.syncOfflineChanges();
  });

  // Periodic sync check
  setInterval(() => {
    if (navigator.onLine && ProgressPersistence.needsSync()) {
      ProgressPersistence.syncOfflineChanges();
    }
  }, 60000); // Check every minute
}