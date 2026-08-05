/**
 * Session Storage Helper
 * Provides utilities for storing and retrieving data in session storage
 */

// Generic sessionStorage helpers
export const setSessionStorageItem = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to set sessionStorage item ${key}:`, error);
  }
};

export const getSessionStorageItem = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.warn(`Failed to get sessionStorage item ${key}:`, error);
    return null;
  }
};

export const removeSessionStorageItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove sessionStorage item ${key}:`, error);
  }
};

const TIMELINE_TASKS_KEY = "timeline_tasks_";

// type TimelineTask = any; // Replacing with local type if needed
export interface TimelineTask {
  id: string;
  [key: string]: any;
}

export interface SessionTimelineTask {
  projectId: string;
  tasks: TimelineTask[];
  lastUpdated: string;
}

/**
 * Store timeline tasks for a specific project in session storage
 */
export const storeTimelineTasks = (
  projectId: string,
  tasks: TimelineTask[]
): void => {
  try {
    const data: SessionTimelineTask = {
      projectId,
      tasks,
      lastUpdated: new Date().toISOString(),
    };
    sessionStorage.setItem(
      `${TIMELINE_TASKS_KEY}${projectId}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn("Failed to store timeline tasks in session storage:", error);
  }
};

/**
 * Retrieve timeline tasks for a specific project from session storage
 */
export const getTimelineTasks = (projectId: string): TimelineTask[] | null => {
  try {
    const stored = sessionStorage.getItem(`${TIMELINE_TASKS_KEY}${projectId}`);
    if (!stored) return null;

    const data: SessionTimelineTask = JSON.parse(stored);

    // Check if data is not too old (e.g., 1 hour)
    const lastUpdated = new Date(data.lastUpdated);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    if (lastUpdated < oneHourAgo) {
      // Data is too old, remove it
      removeTimelineTasks(projectId);
      return null;
    }

    return data.tasks;
  } catch (error) {
    console.warn(
      "Failed to retrieve timeline tasks from session storage:",
      error
    );
    return null;
  }
};

/**
 * Remove timeline tasks for a specific project from session storage
 */
export const removeTimelineTasks = (projectId: string): void => {
  try {
    sessionStorage.removeItem(`${TIMELINE_TASKS_KEY}${projectId}`);
  } catch (error) {
    console.warn(
      "Failed to remove timeline tasks from session storage:",
      error
    );
  }
};

/**
 * Clear all timeline tasks from session storage
 */
export const clearAllTimelineTasks = (): void => {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(TIMELINE_TASKS_KEY)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear timeline tasks from session storage:", error);
  }
};
