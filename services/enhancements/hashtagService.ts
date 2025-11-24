/**
 * Hashtag Generator Service
 * AI-powered hashtag suggestions with popularity & competition analysis
 */

import { generateContent } from '../geminiService';
import { Platform } from '../../types';

export interface HashtagSuggestion {
  hashtag: string;
  popularity: number; // 0-100
  competition: 'low' | 'medium' | 'high';
  category: string;
  trending: boolean;
  estimated_reach?: number;
}

export interface HashtagAnalysis {
  suggestions: HashtagSuggestion[];
  recommended: string[]; // Top 5-10 recommended
  mixed_strategy: {
    high_competition: string[]; // 2-3 popular hashtags
    medium_competition: string[]; // 3-5 moderate hashtags
    low_competition: string[]; // 2-3 niche hashtags
  };
  platform_specific: string[];
  total_potential_reach: number;
}

// Platform-specific hashtag limits
const HASHTAG_LIMITS: Record<Platform, number> = {
  [Platform.Instagram]: 30,
  [Platform.X]: 2,
  [Platform.LinkedIn]: 5,
  [Platform.Facebook]: 5,
  [Platform.TikTok]: 10,
  [Platform.YouTube]: 15
};

// Platform-specific best practices
const PLATFORM_TIPS: Record<Platform, string> = {
  [Platform.Instagram]: 'Use 20-30 hashtags, mix popular and niche',
  [Platform.X]: 'Use 1-2 hashtags max, be specific',
  [Platform.LinkedIn]: 'Use 3-5 hashtags, focus on professional topics',
  [Platform.Facebook]: 'Use 2-5 hashtags, avoid overuse',
  [Platform.TikTok]: 'Use 5-10 hashtags, include trending sounds',
  [Platform.YouTube]: 'Use 10-15 hashtags in description'
};

export const generateHashtags = async (
  content: string,
  platform: Platform,
  userId: string,
  options?: {
    count?: number;
    includeNiche?: boolean;
    language?: string;
  }
): Promise<HashtagAnalysis> => {
  
  const maxHashtags = options?.count || HASHTAG_LIMITS[platform];
  const language = options?.language || 'English';
  
  const prompt = `You are a EXPERT social media strategist specializing in hashtag optimization.

Generate optimized hashtags for this ${platform} post:

CONTENT:
"""
${content}
"""

REQUIREMENTS:
- Language: ${language}
- Platform: ${platform}
- Max hashtags: ${maxHashtags}
- Strategy: Mix of high, medium, and low competition
- Include trending hashtags if relevant

PLATFORM GUIDELINES:
${PLATFORM_TIPS[platform]}

Respond in JSON format:
{
  "suggestions": [
    {
      "hashtag": "#ExactHashtag",
      "popularity": 0-100,
      "competition": "low/medium/high",
      "category": "Category name",
      "trending": true/false,
      "estimated_reach": 10000
    }
  ],
  "recommended": ["#Top5", "#Hashtags", "#InOrder"],
  "mixed_strategy": {
    "high_competition": ["#Popular1", "#Popular2"],
    "medium_competition": ["#Moderate1", "#Moderate2", "#Moderate3"],
    "low_competition": ["#Niche1", "#Niche2"]
  },
  "platform_specific": ["#PlatformSpecific1", "#PlatformSpecific2"],
  "total_potential_reach": 150000
}

ANALYSIS CRITERIA:

📊 Popularity (0-100):
- 90-100: Mega popular (10M+ posts)
- 70-89: Very popular (1M-10M posts)
- 50-69: Popular (100K-1M posts)
- 30-49: Moderate (10K-100K posts)
- 0-29: Niche (< 10K posts)

🎯 Competition:
- High: Saturated, hard to rank
- Medium: Competitive but possible
- Low: Easy to rank, targeted audience

🔥 Trending:
- Check current trends
- Seasonal relevance
- Recent viral topics

STRATEGY:
- 2-3 high competition (visibility)
- 3-5 medium competition (balance)
- 2-3 low competition (niche reach)

Generate ${maxHashtags} total hashtags optimized for ${platform}:`;

  try {
    const response = await generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: { parts: [{ text: prompt }] },
      userId
    });

    const text = response.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse hashtag suggestions');
    }

    return JSON.parse(jsonMatch[0]);
    
  } catch (error) {
    console.error('Hashtag generation error:', error);
    
    // Fallback: basic hashtags
    return generateFallbackHashtags(content, platform);
  }
};

// Fallback hashtag generation (rule-based)
const generateFallbackHashtags = (
  content: string,
  platform: Platform
): HashtagAnalysis => {
  
  // Extract keywords from content
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  // Common trending hashtags by category
  const trending = [
    '#trending', '#viral', '#fyp', '#foryou', '#explore'
  ];
  
  // Generate basic hashtags
  const suggestions: HashtagSuggestion[] = words
    .slice(0, 10)
    .map((word, index) => ({
      hashtag: `#${word.charAt(0).toUpperCase() + word.slice(1)}`,
      popularity: 50 - (index * 3),
      competition: 'medium' as const,
      category: 'general',
      trending: index < 2,
      estimated_reach: 5000
    }));
  
  return {
    suggestions,
    recommended: suggestions.slice(0, 5).map(s => s.hashtag),
    mixed_strategy: {
      high_competition: trending.slice(0, 2),
      medium_competition: suggestions.slice(0, 3).map(s => s.hashtag),
      low_competition: suggestions.slice(3, 5).map(s => s.hashtag)
    },
    platform_specific: [`#${platform}`],
    total_potential_reach: 25000
  };
};

// Analyze existing hashtags
export const analyzeHashtags = async (
  hashtags: string[],
  platform: Platform,
  userId: string
): Promise<{
  analysis: HashtagSuggestion[];
  score: number;
  improvements: string[];
}> => {
  
  const prompt = `Analyze these hashtags for ${platform}:

${hashtags.map(h => `- ${h}`).join('\n')}

Provide analysis in JSON:
{
  "analysis": [
    {
      "hashtag": "#Example",
      "popularity": 0-100,
      "competition": "low/medium/high",
      "category": "Category",
      "trending": true/false
    }
  ],
  "score": 0-100,
  "improvements": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}`;

  try {
    const response = await generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: { parts: [{ text: prompt }] },
      userId
    });

    const text = response.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('Parse failed');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return {
      analysis: hashtags.map(h => ({
        hashtag: h,
        popularity: 50,
        competition: 'medium' as const,
        category: 'general',
        trending: false
      })),
      score: 60,
      improvements: ['Consider mixing popular and niche hashtags']
    };
  }
};

// Get trending hashtags for platform
export const getTrendingHashtags = async (
  platform: Platform,
  category: string,
  userId: string
): Promise<string[]> => {
  
  const prompt = `List 10 currently trending hashtags for ${platform} in the ${category} category.

Format: Return only hashtags, one per line, starting with #.`;

  try {
    const response = await generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: { parts: [{ text: prompt }] },
      userId
    });

    const text = response.candidates[0].content.parts[0].text;
    const hashtags = text
      .split('\n')
      .filter(line => line.trim().startsWith('#'))
      .map(line => line.trim())
      .slice(0, 10);
    
    return hashtags;
  } catch (error) {
    return ['#trending', '#viral', '#explore', '#fyp', '#foryou'];
  }
};
