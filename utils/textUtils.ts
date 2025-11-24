/**
 * Text utility functions for string manipulation and cleaning
 */

import DOMPurify from 'dompurify';

/**
 * Strips HTML tags from a string securely
 * Uses DOMPurify to ensure complete sanitization and prevent XSS attacks
 * @param html - String potentially containing HTML tags
 * @returns Clean text without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // Use DOMPurify to sanitize and remove all HTML tags
  // ALLOWED_TAGS: [] means no tags are allowed, only text content
  const cleanText = DOMPurify.sanitize(html, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true  // Keep text content, remove only tags
  });
  
  return cleanText;
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Counts words in a text string
 * @param text - Text to count words in
 * @returns Number of words
 */
export const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Sanitizes text for safe display (removes HTML and trims whitespace)
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export const sanitizeDisplayText = (text: string): string => {
  return stripHtmlTags(text).trim();
};
