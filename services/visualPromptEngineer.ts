/**
 * Visual Prompt Engineer Service
 * Advanced prompt generation for images and videos using AI
 */

import { generateContent } from './geminiService';
import type { Platform, VisualStyle } from '../types';

// ============================================
// TYPES
// ============================================

export interface VisualPromptRequest {
  topic: string;
  platform: Platform;
  visualStyle: VisualStyle;
  tone?: string;
  targetAudience?: string;
  brandColors?: string[];
  contentType: 'image' | 'video' | 'carousel';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5';
}

export interface GeneratedPrompt {
  mainPrompt: string;
  detailedPrompt: string;
  negativePrompt: string;
  technicalSpecs: {
    style: string;
    lighting: string;
    composition: string;
    colorPalette: string[];
    mood: string;
    quality: string;
  };
  dallePrompt: string;
  midjourneyPrompt: string;
  stableDiffusionPrompt: string;
  recommendations: string[];
}

export interface VideoPrompt {
  sceneDescription: string;
  cameraMovement: string;
  visualEffects: string[];
  transitions: string;
  pacing: string;
  duration: number;
  keyFrames: {
    timestamp: string;
    description: string;
  }[];
  musicMood: string;
}

// ============================================
// VISUAL STYLE LIBRARIES
// ============================================

const VISUAL_STYLE_SPECS = {
  Professional: {
    keywords: ['corporate', 'clean', 'modern', 'sophisticated', 'polished'],
    lighting: 'soft studio lighting, even illumination',
    colors: ['#003366', '#0066CC', '#FFFFFF', '#F5F5F5'],
    composition: 'rule of thirds, balanced, centered',
    mood: 'confident, trustworthy, authoritative',
    quality: 'ultra high definition, sharp focus, professional photography'
  },
  Minimalist: {
    keywords: ['simple', 'clean', 'zen', 'spacious', 'uncluttered'],
    lighting: 'natural soft light, minimal shadows',
    colors: ['#FFFFFF', '#F8F8F8', '#E0E0E0', '#333333'],
    composition: 'negative space, single focal point, asymmetric balance',
    mood: 'calm, peaceful, focused, contemplative',
    quality: 'crisp, clean lines, high contrast, minimal detail'
  },
  Vibrant: {
    keywords: ['colorful', 'energetic', 'bold', 'dynamic', 'eye-catching'],
    lighting: 'bright, high contrast, saturated',
    colors: ['#FF4081', '#00BCD4', '#FFEB3B', '#4CAF50'],
    composition: 'dynamic angles, action-oriented, diagonal lines',
    mood: 'energetic, exciting, passionate, enthusiastic',
    quality: 'vivid colors, HDR, sharp details, high saturation'
  },
  Elegant: {
    keywords: ['luxurious', 'refined', 'sophisticated', 'premium', 'classy'],
    lighting: 'soft golden hour, rim lighting, ambient glow',
    colors: ['#B8860B', '#000000', '#FFFFFF', '#8B4513'],
    composition: 'symmetrical, centered, classical proportions',
    mood: 'refined, upscale, timeless, distinguished',
    quality: 'cinematic, bokeh background, premium materials'
  },
  Bold: {
    keywords: ['striking', 'dramatic', 'powerful', 'intense', 'commanding'],
    lighting: 'high contrast, dramatic shadows, spotlight',
    colors: ['#DC143C', '#000000', '#FF6347', '#FFD700'],
    composition: 'strong leading lines, powerful perspective',
    mood: 'bold, assertive, impactful, dominant',
    quality: 'high contrast, sharp edges, dramatic lighting'
  },
  Playful: {
    keywords: ['fun', 'whimsical', 'cheerful', 'lighthearted', 'creative'],
    lighting: 'bright, cheerful, colorful lighting',
    colors: ['#FF69B4', '#FFA500', '#00CED1', '#9370DB'],
    composition: 'playful angles, creative framing, unconventional',
    mood: 'joyful, fun, creative, lighthearted',
    quality: 'bright colors, soft focus on edges, creative effects'
  }
};

const PLATFORM_VISUAL_GUIDELINES = {
  'X': {
    aspectRatio: '16:9',
    focus: 'immediate visual impact, readable text overlay',
    style: 'bold graphics, high contrast, simple composition'
  },
  'LinkedIn': {
    aspectRatio: '1:1',
    focus: 'professional appearance, credibility, data visualization',
    style: 'corporate aesthetic, infographics, professional photos'
  },
  'Instagram': {
    aspectRatio: '1:1',
    focus: 'aesthetic appeal, lifestyle imagery, emotional connection',
    style: 'beautiful composition, lifestyle photography, artistic'
  },
  'Facebook': {
    aspectRatio: '1:1',
    focus: 'relatable, emotional, community-focused',
    style: 'warm, inviting, social, human-centered'
  },
  'TikTok': {
    aspectRatio: '9:16',
    focus: 'dynamic, trendy, attention-grabbing',
    style: 'vertical video, fast-paced, trendy effects'
  },
  'YouTube': {
    aspectRatio: '16:9',
    focus: 'professional thumbnail, clickable, clear subject',
    style: 'cinematic, professional, clear text overlay'
  }
};

// ============================================
// PROMPT ENGINEERING
// ============================================

export const generateVisualPrompt = async (
  request: VisualPromptRequest,
  userId: string
): Promise<GeneratedPrompt> => {
  
  const styleSpec = VISUAL_STYLE_SPECS[request.visualStyle];
  const platformGuide = PLATFORM_VISUAL_GUIDELINES[request.platform];
  
  const aiPrompt = `You are an EXPERT visual prompt engineer specializing in AI image generation.
Generate a PROFESSIONAL prompt for creating a ${request.contentType} for ${request.platform}.

📝 INPUT:
Topic: ${request.topic}
Visual Style: ${request.visualStyle}
Platform: ${request.platform}
Aspect Ratio: ${request.aspectRatio || platformGuide.aspectRatio}
Tone: ${request.tone || 'professional'}
Target Audience: ${request.targetAudience || 'general audience'}
${request.brandColors ? `Brand Colors: ${request.brandColors.join(', ')}` : ''}

🎯 STYLE SPECIFICATIONS:
Keywords: ${styleSpec.keywords.join(', ')}
Lighting: ${styleSpec.lighting}
Composition: ${styleSpec.composition}
Mood: ${styleSpec.mood}
Quality: ${styleSpec.quality}

🎨 PLATFORM GUIDELINES:
Focus: ${platformGuide.focus}
Style: ${platformGuide.style}

📋 GENERATE (Respond in JSON format):
{
  "mainPrompt": "A concise, powerful prompt (max 50 words) focusing on the main subject and style",
  "detailedPrompt": "A comprehensive prompt (150-200 words) with all visual details: subject, setting, lighting, colors, mood, composition, technical quality",
  "negativePrompt": "What to AVOID in the image (artifacts, distortions, unwanted elements)",
  "technicalSpecs": {
    "style": "Specific artistic style description",
    "lighting": "Detailed lighting setup",
    "composition": "Composition rules and framing",
    "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
    "mood": "Emotional tone and atmosphere",
    "quality": "Technical quality specifications"
  },
  "dallePrompt": "Optimized prompt for DALL-E 3 (natural language, descriptive, max 400 chars)",
  "midjourneyPrompt": "Optimized prompt for Midjourney v6 (use :: separators, --ar flag, --style flag)",
  "stableDiffusionPrompt": "Optimized prompt for Stable Diffusion (comma-separated tags, emphasis with (brackets))",
  "recommendations": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
  ]
}

🎯 REQUIREMENTS:
1. Main prompt must be clear and focused
2. Detailed prompt must be comprehensive but not overwhelming
3. Negative prompt must prevent common AI artifacts
4. Each AI platform prompt must be optimized for that specific tool
5. Include ${platformGuide.aspectRatio} aspect ratio considerations
6. Recommendations should be actionable and specific

Generate the JSON response now:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// VIDEO PROMPT ENGINEERING
// ============================================

export const generateVideoPrompt = async (
  request: VisualPromptRequest,
  duration: number = 15,
  userId: string
): Promise<VideoPrompt> => {
  
  const styleSpec = VISUAL_STYLE_SPECS[request.visualStyle];
  
  const aiPrompt = `You are an EXPERT video director and cinematographer.
Generate a PROFESSIONAL video prompt for a ${duration}-second ${request.platform} video.

📝 INPUT:
Topic: ${request.topic}
Visual Style: ${request.visualStyle}
Platform: ${request.platform}
Duration: ${duration} seconds
Tone: ${request.tone || 'engaging'}
Target Audience: ${request.targetAudience || 'general audience'}

🎨 STYLE SPECIFICATIONS:
Mood: ${styleSpec.mood}
Lighting: ${styleSpec.lighting}
Colors: ${styleSpec.colors.join(', ')}

📋 GENERATE (Respond in JSON format):
{
  "sceneDescription": "Detailed description of what happens in the video from start to finish",
  "cameraMovement": "Specific camera movements (pan, zoom, dolly, crane, etc.)",
  "visualEffects": ["Effect 1", "Effect 2", "Effect 3"],
  "transitions": "How scenes transition (cut, fade, wipe, etc.)",
  "pacing": "Fast/Medium/Slow and why",
  "duration": ${duration},
  "keyFrames": [
    {
      "timestamp": "0:00",
      "description": "What's visible at this exact moment"
    },
    {
      "timestamp": "0:05",
      "description": "What's visible at this exact moment"
    },
    {
      "timestamp": "0:10",
      "description": "What's visible at this exact moment"
    },
    {
      "timestamp": "0:15",
      "description": "What's visible at this exact moment"
    }
  ],
  "musicMood": "Type of music/soundtrack that would fit (upbeat/dramatic/calm/etc.)"
}

🎯 PLATFORM-SPECIFIC NOTES:
${request.platform === 'TikTok' ? '- Fast cuts, trending effects, vertical format (9:16)' :
  request.platform === 'YouTube' ? '- Cinematic quality, professional transitions, horizontal (16:9)' :
  request.platform === 'Instagram' ? '- Aesthetic visuals, trendy effects, square or vertical (1:1 or 9:16)' :
  '- Engaging from frame 1, clear message, optimized for sound-off viewing'}

Generate the JSON response now:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// PROMPT ANALYZER & IMPROVER
// ============================================

export const analyzeAndImprovePrompt = async (
  userPrompt: string,
  contentType: 'image' | 'video',
  userId: string
): Promise<{
  analysis: {
    clarity: number;
    specificity: number;
    creativeness: number;
    technicalDetail: number;
    overallScore: number;
  };
  improvements: string[];
  improvedPrompt: string;
  comparison: {
    before: string;
    after: string;
    changes: string[];
  };
}> => {
  
  const aiPrompt = `You are an EXPERT prompt engineer. Analyze this ${contentType} prompt and improve it.

ORIGINAL PROMPT:
"${userPrompt}"

Analyze and improve this prompt. Respond in JSON format:
{
  "analysis": {
    "clarity": 0-100,
    "specificity": 0-100,
    "creativeness": 0-100,
    "technicalDetail": 0-100,
    "overallScore": 0-100
  },
  "improvements": [
    "What's missing or could be better (3-5 points)",
    "Specific suggestions for improvement"
  ],
  "improvedPrompt": "Your significantly improved version of the prompt",
  "comparison": {
    "before": "${userPrompt}",
    "after": "Your improved prompt",
    "changes": [
      "Change 1: Added...",
      "Change 2: Improved...",
      "Change 3: Specified..."
    ]
  }
}

IMPROVEMENT CRITERIA:
✅ Add specific visual details (lighting, colors, composition)
✅ Include technical quality specs (4K, HDR, sharp focus)
✅ Specify mood and atmosphere
✅ Add camera angles/framing (for video)
✅ Include negative prompts (what to avoid)
✅ Make it more descriptive but concise
✅ Remove vague terms, add concrete descriptors

Generate the JSON response now:`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
};

// ============================================
// PROMPT TEMPLATES
// ============================================

export const getPromptTemplates = (category: string): string[] => {
  const templates: Record<string, string[]> = {
    'product': [
      'Professional product photography of {product} on {background}, studio lighting, 4K, commercial photography',
      '{product} floating in mid-air with dramatic lighting, white background, high-end advertising style, ultra sharp',
      'Lifestyle shot of {product} in use, natural setting, soft morning light, authentic, relatable, high quality'
    ],
    'lifestyle': [
      'Authentic lifestyle photo, {activity}, natural lighting, candid moment, warm tones, emotional connection',
      'Minimalist lifestyle flat lay, {items}, white marble background, top-down view, symmetrical, clean aesthetic',
      'Cozy {setting}, soft golden hour light, inviting atmosphere, depth of field, cinematic composition'
    ],
    'abstract': [
      'Abstract geometric composition, {colors}, gradient background, modern design, minimalist, clean lines',
      '3D abstract shapes floating, {mood} lighting, futuristic, glass material, reflective surfaces, 4K render',
      'Fluid art, organic shapes, {colors} color palette, flowing movement, artistic, high detail'
    ],
    'business': [
      'Professional business setting, modern office, natural light through windows, diverse team, collaborative',
      'Corporate headshot, {professional}, neutral background, studio lighting, confident expression, sharp focus',
      'Business strategy visualization, infographic style, data charts, clean design, professional color scheme'
    ],
    'social': [
      'Social media content, eye-catching design, bold typography, {theme}, vibrant colors, modern aesthetic',
      'Instagram story template, {topic}, trendy design, mobile-first, attention-grabbing, shareable',
      'Viral social media graphic, {concept}, minimalist design, high contrast, thumb-stopping visual'
    ]
  };

  return templates[category] || templates['product'];
};

// ============================================
// CAROUSEL PROMPT GENERATOR
// ============================================

export const generateCarouselPrompts = async (
  topic: string,
  slideCount: number,
  visualStyle: VisualStyle,
  platform: Platform,
  userId: string
): Promise<{
  slides: {
    slideNumber: number;
    title: string;
    prompt: string;
    textOverlay: string;
    designNotes: string;
  }[];
  overallTheme: string;
  colorScheme: string[];
  consistency: string[];
}> => {
  
  const aiPrompt = `Generate prompts for a ${slideCount}-slide Instagram carousel about "${topic}".

Visual Style: ${visualStyle}
Platform: ${platform}

Generate JSON:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "Catchy title for slide 1",
      "prompt": "Detailed image prompt for this slide",
      "textOverlay": "Text to overlay on the image",
      "designNotes": "Design tips for this specific slide"
    }
    // ... repeat for ${slideCount} slides
  ],
  "overallTheme": "Cohesive theme binding all slides",
  "colorScheme": ["#HEX1", "#HEX2", "#HEX3"],
  "consistency": [
    "Element 1 to keep consistent",
    "Element 2 to keep consistent",
    "Element 3 to keep consistent"
  ]
}

Each slide should:
- Have visual consistency
- Build on previous slides
- Use consistent color scheme
- Have clear hierarchy`;

  const response = await generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: { parts: [{ text: aiPrompt }] },
    userId
  });

  const text = response.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
};
