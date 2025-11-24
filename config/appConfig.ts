/**
 * Application configuration constants
 */

import { Platform } from '../types';

/**
 * Platform character limits
 * Update these when social media platforms change their policies
 */
export const PLATFORM_CHARACTER_LIMITS: Record<Platform, number> = {
  [Platform.X]: 280,
  [Platform.LinkedIn]: 3000,
  [Platform.Instagram]: 2200,
  [Platform.Facebook]: 63206,
  [Platform.TikTok]: 2200,
  [Platform.YouTube]: 5000
};

/**
 * Session storage configuration
 */
export const SESSION_CONFIG = {
  STORAGE_KEY: 'socnew_unsaved_session',
  EXPIRY_HOURS: 24,
  AUTO_SAVE_DELAY_MS: 10000 // 10 seconds
};

/**
 * Character counter thresholds
 */
export const CHARACTER_THRESHOLDS = {
  WARNING: 80,  // Show warning at 80%
  DANGER: 90,   // Show danger at 90%
  ERROR: 100    // Show error at 100%
};
