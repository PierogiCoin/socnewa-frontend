import type { CampaignHistoryItem, PostPerformanceData } from '../types';

/**
 * Real-Time Analytics Service
 * Handles live performance tracking, viral alerts, and engagement metrics
 */

export interface LiveMetrics {
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  timestamp: number;
}

export interface ViralAlert {
  id: string;
  postId: string;
  postSnippet: string;
  metric: string;
  value: number;
  timestamp: number;
  platform: string;
}

/**
 * Fetch live metrics from backend (mock for now)
 * In production: Connect to WebSocket or polling endpoint
 */
export const fetchLiveMetrics = async (
  userId: string,
  timeRange: '1h' | '24h' | '7d' = '24h'
): Promise<LiveMetrics> => {
  // TODO: Replace with real API call
  // const response = await fetch(`/api/analytics/live?userId=${userId}&range=${timeRange}`);
  // return response.json();

  // Mock data for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reach: Math.floor(15000 + Math.random() * 5000),
        likes: Math.floor(1200 + Math.random() * 300),
        comments: Math.floor(180 + Math.random() * 50),
        shares: Math.floor(85 + Math.random() * 30),
        engagementRate: Math.round((8 + Math.random() * 2) * 10) / 10,
        timestamp: Date.now()
      });
    }, 500);
  });
};

/**
 * Check for viral posts and generate alerts
 */
export const checkViralAlerts = (
  posts: CampaignHistoryItem[]
): ViralAlert[] => {
  const alerts: ViralAlert[] = [];
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

  posts.forEach(post => {
    if (!post.performance) return;

    // Viral reach alert
    if (post.timestamp > twoHoursAgo && post.performance.reach > 2000) {
      alerts.push({
        id: `viral-reach-${post.id}`,
        postId: post.id,
        postSnippet: post.result.postText.substring(0, 60) + '...',
        metric: 'reach',
        value: post.performance.reach,
        timestamp: post.timestamp,
        platform: post.result.platform
      });
    }

    // High engagement alert
    const engRate = post.performance.reach > 0
      ? ((post.performance.likes + post.performance.comments + post.performance.shares) / post.performance.reach * 100)
      : 0;
    
    if (engRate > 10) {
      alerts.push({
        id: `viral-engagement-${post.id}`,
        postId: post.id,
        postSnippet: post.result.postText.substring(0, 60) + '...',
        metric: 'engagement',
        value: Math.round(engRate * 10) / 10,
        timestamp: post.timestamp,
        platform: post.result.platform
      });
    }
  });

  return alerts.slice(0, 5);
};

/**
 * Generate mock performance data for posts
 * In production: Fetch from social media APIs
 */
export const generateMockPerformanceData = (): PostPerformanceData => {
  const reach = Math.floor(500 + Math.random() * 5000);
  const likes = Math.floor(reach * (0.05 + Math.random() * 0.15)); // 5-20% engagement
  const comments = Math.floor(likes * (0.1 + Math.random() * 0.2));
  const shares = Math.floor(likes * (0.05 + Math.random() * 0.15));

  return {
    reach,
    likes,
    comments,
    shares
  };
};

/**
 * Calculate best posting times based on historical performance
 * Uses AI to analyze patterns in engagement
 */
export const calculateBestPostingTimes = async (
  userId: string,
  history: CampaignHistoryItem[]
): Promise<Array<{
  platform: string;
  day: string;
  time: string;
  score: number;
  reason: string;
}>> => {
  // TODO: Implement AI-based analysis using Gemini
  // Analyze historical data for patterns
  
  // Mock best times based on common patterns
  return [
    {
      platform: 'LinkedIn',
      day: 'Wtorek',
      time: '10:00',
      score: 85,
      reason: 'Najwyższe engagement rate w ostatnich 30 dniach'
    },
    {
      platform: 'Instagram',
      day: 'Czwartek',
      time: '18:30',
      score: 78,
      reason: 'Peak aktywności Twojej grupy docelowej'
    },
    {
      platform: 'X',
      day: 'Środa',
      time: '14:00',
      score: 72,
      reason: 'Największy zasięg organiczny'
    },
    {
      platform: 'Facebook',
      day: 'Piątek',
      time: '20:00',
      score: 68,
      reason: 'Wysokie zaangażowanie w weekend approach'
    }
  ];
};

/**
 * Calculate ROI based on performance metrics
 */
export const calculateROI = (
  posts: CampaignHistoryItem[],
  investmentAmount: number
): {
  totalReach: number;
  totalEngagement: number;
  costPerReach: number;
  costPerEngagement: number;
  estimatedValue: number;
} => {
  const totalReach = posts.reduce((sum, p) => sum + (p.performance?.reach || 0), 0);
  const totalEngagement = posts.reduce((sum, p) => 
    sum + (p.performance?.likes || 0) + 
    (p.performance?.comments || 0) + 
    (p.performance?.shares || 0), 0
  );

  const costPerReach = investmentAmount > 0 ? investmentAmount / totalReach : 0;
  const costPerEngagement = investmentAmount > 0 ? investmentAmount / totalEngagement : 0;

  // Simple valuation: $0.10 per reach, $1 per engagement
  const estimatedValue = (totalReach * 0.10) + (totalEngagement * 1.0);

  return {
    totalReach,
    totalEngagement,
    costPerReach: Math.round(costPerReach * 100) / 100,
    costPerEngagement: Math.round(costPerEngagement * 100) / 100,
    estimatedValue: Math.round(estimatedValue * 100) / 100
  };
};

/**
 * WebSocket connection for live updates (placeholder)
 * In production: Implement WebSocket client
 */
export class LiveAnalyticsStream {
  private ws: WebSocket | null = null;
  private listeners: Array<(data: LiveMetrics) => void> = [];

  connect(userId: string) {
    // TODO: Implement WebSocket connection
    // this.ws = new WebSocket(`wss://your-backend.com/analytics/live?userId=${userId}`);
    
    // Mock live updates every 5 seconds
    setInterval(() => {
      this.notifyListeners({
        reach: Math.floor(15000 + Math.random() * 5000),
        likes: Math.floor(1200 + Math.random() * 300),
        comments: Math.floor(180 + Math.random() * 50),
        shares: Math.floor(85 + Math.random() * 30),
        engagementRate: Math.round((8 + Math.random() * 2) * 10) / 10,
        timestamp: Date.now()
      });
    }, 5000);
  }

  subscribe(callback: (data: LiveMetrics) => void) {
    this.listeners.push(callback);
  }

  unsubscribe(callback: (data: LiveMetrics) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  private notifyListeners(data: LiveMetrics) {
    this.listeners.forEach(listener => listener(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
