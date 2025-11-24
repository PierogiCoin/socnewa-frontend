/**
 * Best Time to Post Service
 * AI-powered optimal posting time suggestions
 */

import { generateContent } from '../geminiService';
import { Platform } from '../../types';

export interface PostingTimeRecommendation {
  bestTime: string; // "Tuesday 9:00 AM EST"
  dayOfWeek: string;
  hour: number; // 24-hour format
  timezone: string;
  confidence: number; // 0-100
  expectedReach: string; // "+45% vs average"
  reasoning: string;
  alternatives: {
    time: string;
    reason: string;
    expectedReach: string;
  }[];
}

// Platform-specific best practices (general data)
const PLATFORM_BEST_TIMES: Record<Platform, {
  bestDays: string[];
  bestHours: number[];
  worstTimes: string[];
  tips: string[];
}> = {
  [Platform.LinkedIn]: {
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
    bestHours: [8, 9, 12, 17, 18],
    worstTimes: ['Weekends', 'Late nights'],
    tips: [
      'Peak engagement during work hours',
      'Tuesday-Thursday mornings best',
      'Lunch time (12-1 PM) also good',
      'Avoid posting after 6 PM'
    ]
  },
  [Platform.X]: {
    bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bestHours: [8, 9, 12, 15, 17, 18],
    worstTimes: ['3-5 AM'],
    tips: [
      'Multiple posts per day okay',
      'Lunch and evening commute peak',
      'Weekday mornings 8-10 AM best',
      'Real-time events boost engagement'
    ]
  },
  [Platform.Instagram]: {
    bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bestHours: [9, 11, 12, 13, 17, 18, 19, 20],
    worstTimes: ['Early morning 3-6 AM'],
    tips: [
      'Lunch breaks popular',
      'Evening 6-9 PM highest engagement',
      'Stories: post throughout day',
      'Reels: evening/weekends best'
    ]
  },
  [Platform.Facebook]: {
    bestDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bestHours: [9, 13, 14, 15],
    worstTimes: ['Early morning', 'Late night'],
    tips: [
      '1-4 PM workday breaks',
      'Wednesday at 11 AM & 1 PM peak',
      'Thursday & Friday slightly better',
      'Weekends lower engagement'
    ]
  },
  [Platform.TikTok]: {
    bestDays: ['Tuesday', 'Thursday', 'Friday'],
    bestHours: [6, 10, 19, 20, 21, 22],
    worstTimes: ['Work hours 9-5 PM'],
    tips: [
      'Early morning 6-10 AM good',
      'Evening 7-10 PM best',
      'Tuesday 9 AM peak',
      'Thursday 12 PM & 7 PM peaks'
    ]
  },
  [Platform.YouTube]: {
    bestDays: ['Friday', 'Saturday', 'Sunday'],
    bestHours: [12, 13, 14, 15, 18, 19, 20],
    worstTimes: ['Early morning weekdays'],
    tips: [
      'Weekend afternoons best',
      'Friday 12-3 PM very good',
      'Saturday/Sunday 9 AM-11 AM',
      'Consistency matters most'
    ]
  }
};

export const getBestPostingTime = async (
  platform: Platform,
  contentType: string,
  targetAudience: string,
  timezone: string,
  userId: string
): Promise<PostingTimeRecommendation> => {
  
  const platformData = PLATFORM_BEST_TIMES[platform];
  
  const prompt = `You are a social media timing expert. Recommend the BEST time to post on ${platform}.

CONTEXT:
- Platform: ${platform}
- Content Type: ${contentType}
- Target Audience: ${targetAudience}
- Timezone: ${timezone}

PLATFORM DATA:
- Best Days: ${platformData.bestDays.join(', ')}
- Best Hours: ${platformData.bestHours.join(', ')}
- General Tips: ${platformData.tips.join(' | ')}

ANALYZE:
1. Audience behavior patterns
2. Platform-specific trends
3. Content type performance
4. Timezone considerations
5. Day-of-week analysis

Respond in JSON format:
{
  "bestTime": "Tuesday 9:00 AM EST",
  "dayOfWeek": "Tuesday",
  "hour": 9,
  "timezone": "${timezone}",
  "confidence": 0-100,
  "expectedReach": "+45% vs average",
  "reasoning": "Detailed explanation why this time is best for THIS audience and content",
  "alternatives": [
    {
      "time": "Thursday 1:00 PM EST",
      "reason": "Lunch break, high engagement",
      "expectedReach": "+35% vs average"
    },
    {
      "time": "Wednesday 8:00 AM EST",
      "reason": "Early morning commute",
      "expectedReach": "+30% vs average"
    }
  ]
}

REQUIREMENTS:
- Be specific (day + time + timezone)
- Consider audience demographics
- Account for content type
- Provide 2-3 alternatives
- Explain WHY each time works
- Include expected impact

Generate recommendation:`;

  try {
    const response = await generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: { parts: [{ text: prompt }] },
      userId
    });

    const text = response.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse timing recommendation');
    }

    return JSON.parse(jsonMatch[0]);
    
  } catch (error) {
    console.error('Timing recommendation error:', error);
    return generateFallbackTiming(platform, timezone);
  }
};

// Fallback timing (based on general data)
const generateFallbackTiming = (
  platform: Platform,
  timezone: string
): PostingTimeRecommendation => {
  
  const platformData = PLATFORM_BEST_TIMES[platform];
  const bestDay = platformData.bestDays[0];
  const bestHour = platformData.bestHours[0];
  
  return {
    bestTime: `${bestDay} ${bestHour}:00 ${timezone}`,
    dayOfWeek: bestDay,
    hour: bestHour,
    timezone,
    confidence: 75,
    expectedReach: '+35% vs average',
    reasoning: `Based on ${platform} engagement data, ${bestDay} at ${bestHour}:00 typically sees high activity. ${platformData.tips[0]}`,
    alternatives: [
      {
        time: `${platformData.bestDays[1]} ${platformData.bestHours[1]}:00 ${timezone}`,
        reason: platformData.tips[1],
        expectedReach: '+25% vs average'
      },
      {
        time: `${platformData.bestDays[0]} ${platformData.bestHours[2]}:00 ${timezone}`,
        reason: platformData.tips[2],
        expectedReach: '+20% vs average'
      }
    ]
  };
};

// Get posting schedule for week
export const getWeeklySchedule = async (
  platform: Platform,
  postsPerWeek: number,
  userId: string
): Promise<{
  schedule: {
    day: string;
    time: string;
    reasoning: string;
  }[];
  strategy: string;
}> => {
  
  const prompt = `Create an optimal weekly posting schedule for ${platform}.

REQUIREMENTS:
- Posts per week: ${postsPerWeek}
- Maximize reach and engagement
- Avoid cannibalization
- Consider algorithm behavior

Respond in JSON:
{
  "schedule": [
    {
      "day": "Monday",
      "time": "9:00 AM",
      "reasoning": "Why this slot"
    }
  ],
  "strategy": "Overall scheduling strategy explanation"
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
      schedule: generateDefaultSchedule(platform, postsPerWeek),
      strategy: 'Balanced schedule based on platform best practices'
    };
  }
};

const generateDefaultSchedule = (
  platform: Platform,
  count: number
): { day: string; time: string; reasoning: string; }[] => {
  
  const platformData = PLATFORM_BEST_TIMES[platform];
  const schedule = [];
  
  for (let i = 0; i < count; i++) {
    const dayIndex = i % platformData.bestDays.length;
    const hourIndex = i % platformData.bestHours.length;
    
    schedule.push({
      day: platformData.bestDays[dayIndex],
      time: `${platformData.bestHours[hourIndex]}:00`,
      reasoning: platformData.tips[i % platformData.tips.length]
    });
  }
  
  return schedule;
};

// Analyze current posting times
export const analyzePostingPattern = async (
  posts: { timestamp: Date; engagement: number }[],
  platform: Platform,
  userId: string
): Promise<{
  insights: string[];
  recommendations: string[];
  bestPerformingTimes: string[];
  worstPerformingTimes: string[];
}> => {
  
  // Group by hour and day
  const byHour: Record<number, number[]> = {};
  const byDay: Record<string, number[]> = {};
  
  posts.forEach(post => {
    const hour = post.timestamp.getHours();
    const day = post.timestamp.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!byHour[hour]) byHour[hour] = [];
    if (!byDay[day]) byDay[day] = [];
    
    byHour[hour].push(post.engagement);
    byDay[day].push(post.engagement);
  });
  
  // Calculate averages
  const avgByHour = Object.entries(byHour).map(([hour, engagements]) => ({
    hour: parseInt(hour),
    avg: engagements.reduce((a, b) => a + b, 0) / engagements.length
  })).sort((a, b) => b.avg - a.avg);
  
  const avgByDay = Object.entries(byDay).map(([day, engagements]) => ({
    day,
    avg: engagements.reduce((a, b) => a + b, 0) / engagements.length
  })).sort((a, b) => b.avg - a.avg);
  
  return {
    insights: [
      `Your best performing hour: ${avgByHour[0].hour}:00`,
      `Your best performing day: ${avgByDay[0].day}`,
      `Average engagement: ${(posts.reduce((a, b) => a + b.engagement, 0) / posts.length).toFixed(0)}`
    ],
    recommendations: [
      `Post more on ${avgByDay[0].day} at ${avgByHour[0].hour}:00`,
      `Avoid ${avgByDay[avgByDay.length - 1].day}`,
      `Experiment with ${avgByHour[1].hour}:00 as alternative time`
    ],
    bestPerformingTimes: avgByHour.slice(0, 3).map(h => `${h.hour}:00`),
    worstPerformingTimes: avgByHour.slice(-3).map(h => `${h.hour}:00`)
  };
};

// Get timezone-aware recommendation
export const getLocalizedTime = (
  utcTime: string,
  targetTimezone: string
): string => {
  try {
    const date = new Date(utcTime);
    return date.toLocaleString('en-US', {
      timeZone: targetTimezone,
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return utcTime;
  }
};
