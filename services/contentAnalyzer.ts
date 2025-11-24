/**
 * Content Analyzer Service
 * Advanced analysis for creating better content
 */

import { generateContent } from './geminiService';
import type { Platform, Tone } from '../types';

// ============================================
// TYPES
// ============================================

export interface ContentAnalysis {
  overallScore: number;
  readability: {
    score: number;
    grade: string;
    suggestions: string[];
  };
  engagement: {
    score: number;
    hooks: string[];
    callToAction: string | null;
    emotionalTriggers: string[];
    suggestions: string[];
  };
  seo: {
    score: number;
    keywords: string[];
    keywordDensity: number;
    suggestions: string[];
  };
  structure: {
    score: number;
    paragraphCount: number;
    averageWordsPerParagraph: number;
    hasBreaks: boolean;
    hasEmojis: boolean;
    emojiCount: number;
    suggestions: string[];
  };
  sentiment: {
    overall: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
  };
  platformFit: {
    score: number;
    platform: Platform;
    suggestions: string[];
  };
  improvements: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    suggestion: string;
    example?: string;
  }[];
}

export interface CompetitorAnalysis {
  topPerformingElements: string[];
  commonPatterns: string[];
  uniqueOpportunities: string[];
  trendingTopics: string[];
  suggestions: string[];
}

export interface A/BTestSuggestion {
  variantA: {
    text: string;
    focusArea: string;
    hypothesis: string;
  };
  variantB: {
    text: string;
    focusArea: string;
    hypothesis: string;
  };
  testingStrategy: string;
  expectedWinner: 'A' | 'B' | 'unclear';
  reasoning: string;
}

// ============================================
// CONTENT ANALYSIS
// ============================================

export const analyzeContent = async (
  content: string,
  platform: Platform,
  userId: string
): Promise<ContentAnalysis> => {
  
  const aiPrompt = `You are an EXPERT content strategist and copywriter. Analyze this ${platform} post.

CONTENT TO ANALYZE:
"""
${content}
"""

Platform: ${platform}

Analyze deeply and respond in JSON format:
{
  "overallScore": 0-100,
  "readability": {
    "score": 0-100,
    "grade": "Easy/Medium/Hard",
    "suggestions": ["Tip 1", "Tip 2"]
  },
  "engagement": {
    "score": 0-100,
    "hooks": ["Hook elements found"],
    "callToAction": "The CTA or null",
    "emotionalTriggers": ["Emotion 1", "Emotion 2"],
    "suggestions": ["How to improve engagement"]
  },
  "seo": {
    "score": 0-100,
    "keywords": ["keyword1", "keyword2"],
    "keywordDensity": 0.0-10.0,
    "suggestions": ["SEO improvements"]
  },
  "structure": {
    "score": 0-100,
    "paragraphCount": 0,
    "averageWordsPerParagraph": 0,
    "hasBreaks": true/false,
    "hasEmojis": true/false,
    "emojiCount": 0,
    "suggestions": ["Structure improvements"]
  },
  "sentiment": {
    "overall": "positive/negative/neutral",
    "confidence": 0.0-1.0,
    "emotions": ["joy", "excitement", "trust"]
  },
  "platformFit": {
    "score": 0-100,
    "platform": "${platform}",
    "suggestions": ["Platform-specific tips"]
  },
  "improvements": [
    {
      "priority": "high/medium/low",
      "category": "Category name",
      "suggestion": "What to do",
      "example": "How to do it (optional)"
    }
  ]
}

ANALYSIS CRITERIA:

📊 Readability (0-100):
- Sentence length variety
- Word complexity
- Flow and rhythm
- Clarity

🎯 Engagement (0-100):
- Attention-grabbing hook
- Emotional resonance
- Clear value proposition
- Strong CTA
- Conversational tone

🔍 SEO (0-100):
- Relevant keywords
- Natural keyword placement
- Searchable phrases

📐 Structure (0-100):
- Paragraph breaks
- Visual appeal
- Scanability
- Use of emojis/formatting

😊 Sentiment:
- Overall emotional tone
- Specific emotions detected

🎭 Platform Fit (0-100):
- Optimal length for ${platform}
- Style matches platform
- Format optimized

Generate detailed, actionable analysis now:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse analysis');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// COMPETITOR ANALYSIS
// ============================================

export const analyzeCompetitors = async (
  topic: string,
  platform: Platform,
  samplePosts: string[],
  userId: string
): Promise<CompetitorAnalysis> => {
  
  const aiPrompt = `Analyze these ${platform} posts about "${topic}" to identify patterns and opportunities.

SAMPLE POSTS:
${samplePosts.map((post, i) => `
Post ${i + 1}:
${post}
---
`).join('\n')}

Respond in JSON:
{
  "topPerformingElements": ["Element 1", "Element 2", "Element 3"],
  "commonPatterns": ["Pattern 1", "Pattern 2"],
  "uniqueOpportunities": ["Gap 1", "Gap 2"],
  "trendingTopics": ["Topic 1", "Topic 2"],
  "suggestions": ["Strategy 1", "Strategy 2", "Strategy 3"]
}

ANALYZE:
1. What makes these posts engaging?
2. What patterns do you see?
3. What's missing that could work?
4. What angles haven't been covered?
5. What strategy would stand out?

Generate analysis:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse competitor analysis');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// A/B TEST SUGGESTIONS
// ============================================

export const generateABTestVariants = async (
  originalContent: string,
  platform: Platform,
  focusArea: 'hook' | 'cta' | 'emotion' | 'length' | 'structure',
  userId: string
): Promise<ABTestSuggestion> => {
  
  const aiPrompt = `Generate A/B test variants for this ${platform} post, focusing on ${focusArea}.

ORIGINAL CONTENT:
"""
${originalContent}
"""

Platform: ${platform}
Focus Area: ${focusArea}

Respond in JSON:
{
  "variantA": {
    "text": "Full text of variant A",
    "focusArea": "${focusArea}",
    "hypothesis": "Why this might perform better"
  },
  "variantB": {
    "text": "Full text of variant B (different approach)",
    "focusArea": "${focusArea}",
    "hypothesis": "Why THIS might perform better"
  },
  "testingStrategy": "How to test these variants",
  "expectedWinner": "A/B/unclear",
  "reasoning": "Why you predict this result"
}

REQUIREMENTS:
- Variant A: ${focusArea === 'hook' ? 'Strong, attention-grabbing opening' : 
             focusArea === 'cta' ? 'Clear, action-oriented CTA' :
             focusArea === 'emotion' ? 'Emotional, storytelling approach' :
             focusArea === 'length' ? 'Shorter, punchier version' :
             'Different structural format'}

- Variant B: ${focusArea === 'hook' ? 'Question-based or curiosity gap opening' :
             focusArea === 'cta' ? 'Soft, conversational CTA' :
             focusArea === 'emotion' ? 'Data-driven, logical approach' :
             focusArea === 'length' ? 'Longer, more detailed version' :
             'Alternative structural approach'}

Generate variants now:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse A/B test variants');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// CONTENT OPTIMIZATION
// ============================================

export const optimizeContent = async (
  content: string,
  platform: Platform,
  goal: 'engagement' | 'reach' | 'conversion' | 'education',
  userId: string
): Promise<{
  optimizedContent: string;
  changes: string[];
  expectedImprovement: string;
  reasoning: string;
}> => {
  
  const aiPrompt = `Optimize this ${platform} post for ${goal}.

ORIGINAL CONTENT:
"""
${content}
"""

Platform: ${platform}
Goal: ${goal}

Respond in JSON:
{
  "optimizedContent": "Your optimized version",
  "changes": [
    "Change 1: Did X to improve Y",
    "Change 2: Added Z for better result"
  ],
  "expectedImprovement": "X% better engagement/reach/conversion",
  "reasoning": "Why these changes will improve ${goal}"
}

OPTIMIZATION STRATEGIES for ${goal}:
${goal === 'engagement' ? `
- Stronger hook
- Clear CTA encouraging comments
- Question or poll
- Emotional storytelling
- Relatable content
` : goal === 'reach' ? `
- Trending keywords
- Shareable value
- Broad appeal
- Optimal hashtags
- Best posting time hints
` : goal === 'conversion' ? `
- Clear value proposition
- Urgency/scarcity
- Social proof
- Strong CTA
- Objection handling
` : `
- Clear structure
- Step-by-step info
- Examples
- Key takeaways
- Actionable tips
`}

Generate optimized content:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse optimization');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// CONTENT SCORING
// ============================================

export const scoreContent = (content: string, platform: Platform): {
  scores: {
    lengthScore: number;
    emojiScore: number;
    hashtagScore: number;
    readabilityScore: number;
    ctaScore: number;
  };
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
} => {
  
  // Length scoring (platform-specific)
  const length = content.length;
  const optimalLengths: Record<Platform, { min: number; max: number }> = {
    [Platform.X]: { min: 150, max: 280 },
    [Platform.LinkedIn]: { min: 1000, max: 2000 },
    [Platform.Instagram]: { min: 500, max: 1500 },
    [Platform.Facebook]: { min: 200, max: 1000 },
    [Platform.TikTok]: { min: 100, max: 500 },
    [Platform.YouTube]: { min: 300, max: 1500 }
  };
  
  const { min, max } = optimalLengths[platform];
  const lengthScore = length < min ? (length / min) * 100 :
                      length > max ? Math.max(0, 100 - ((length - max) / max) * 100) :
                      100;
  
  // Emoji scoring
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojiCount = (content.match(emojiRegex) || []).length;
  const emojiScore = Math.min(100, (emojiCount / 3) * 100); // 3 emojis = 100%
  
  // Hashtag scoring
  const hashtagRegex = /#\w+/g;
  const hashtagCount = (content.match(hashtagRegex) || []).length;
  const optimalHashtags = platform === Platform.Instagram ? 10 : 3;
  const hashtagScore = Math.min(100, (hashtagCount / optimalHashtags) * 100);
  
  // Readability (sentence length)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / sentences.length;
  const readabilityScore = Math.max(0, 100 - Math.abs(avgWordsPerSentence - 15) * 5); // Optimal ~15 words
  
  // CTA scoring
  const ctaKeywords = ['click', 'learn', 'discover', 'join', 'try', 'get', 'download', 'subscribe', 'follow', 'share', 'comment'];
  const hasCTA = ctaKeywords.some(kw => content.toLowerCase().includes(kw));
  const ctaScore = hasCTA ? 100 : 0;
  
  // Total score (weighted)
  const scores = {
    lengthScore: Math.round(lengthScore),
    emojiScore: Math.round(emojiScore),
    hashtagScore: Math.round(hashtagScore),
    readabilityScore: Math.round(readabilityScore),
    ctaScore
  };
  
  const totalScore = Math.round(
    (lengthScore * 0.3) +
    (emojiScore * 0.15) +
    (hashtagScore * 0.15) +
    (readabilityScore * 0.25) +
    (ctaScore * 0.15)
  );
  
  const grade = totalScore >= 90 ? 'A' :
                totalScore >= 80 ? 'B' :
                totalScore >= 70 ? 'C' :
                totalScore >= 60 ? 'D' : 'F';
  
  return { scores, totalScore, grade };
};

// ============================================
// TRENDING TOPICS DETECTOR
// ============================================

export const detectTrendingAngles = async (
  topic: string,
  platform: Platform,
  userId: string
): Promise<{
  trendingAngles: {
    angle: string;
    trendScore: number;
    reasoning: string;
    exampleHook: string;
  }[];
  recommendation: string;
}> => {
  
  const aiPrompt = `Identify trending angles for content about "${topic}" on ${platform}.

Respond in JSON:
{
  "trendingAngles": [
    {
      "angle": "Specific angle or approach",
      "trendScore": 0-100,
      "reasoning": "Why this is trending",
      "exampleHook": "Example opening line using this angle"
    }
  ],
  "recommendation": "Which angle to use and why"
}

Consider:
- Current events
- Platform trends
- Audience interests
- Seasonality
- Viral formats

Generate 5 trending angles:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse trending angles');
  }

  return JSON.parse(jsonMatch[0]);
};
