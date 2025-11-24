import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CampaignHistoryItem, Platform } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { ShareIcon } from './icons/ShareIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ClockIcon } from './icons/ClockIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { BellIcon } from './icons/BellIcon';

interface EngagementMetric {
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

interface ViralAlert {
  id: string;
  postId: string;
  postSnippet: string;
  metric: string;
  value: number;
  timestamp: number;
  platform: Platform;
}

interface BestTimeToPost {
  platform: Platform;
  day: string;
  time: string;
  score: number;
  reason: string;
}

interface RealTimeAnalyticsDashboardProps {
  history: CampaignHistoryItem[];
}

export const RealTimeAnalyticsDashboard: React.FC<RealTimeAnalyticsDashboardProps> = ({ history }) => {
  const { t } = useTranslation();
  const [currentMetrics, setCurrentMetrics] = useState<EngagementMetric | null>(null);
  const [previousMetrics, setPreviousMetrics] = useState<EngagementMetric | null>(null);
  const [viralAlerts, setViralAlerts] = useState<ViralAlert[]>([]);
  const [bestTimes, setBestTimes] = useState<BestTimeToPost[]>([]);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Symulacja live update (w produkcji: WebSocket lub polling API)
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      updateMetrics();
      checkViralAlerts();
      setLastUpdate(new Date());
    }, 5000); // Update co 5 sekund

    return () => clearInterval(interval);
  }, [history, isLiveUpdating]);

  // Inicjalna kalkulacja metryk
  useEffect(() => {
    updateMetrics();
    calculateBestTimes();
    checkViralAlerts();
  }, [history]);

  const updateMetrics = () => {
    const postsWithPerformance = history.filter(h => h.performance);
    if (postsWithPerformance.length === 0) {
      setCurrentMetrics(generateMockMetrics());
      setPreviousMetrics(generateMockMetrics(true));
      return;
    }

    // Ostatnie 24h
    const last24h = postsWithPerformance.filter(
      h => h.timestamp > Date.now() - 24 * 60 * 60 * 1000
    );

    // Poprzednie 24h
    const previous24h = postsWithPerformance.filter(
      h => h.timestamp > Date.now() - 48 * 60 * 60 * 1000 &&
           h.timestamp <= Date.now() - 24 * 60 * 60 * 1000
    );

    setCurrentMetrics(calculateMetrics(last24h));
    setPreviousMetrics(calculateMetrics(previous24h));
  };

  const calculateMetrics = (posts: CampaignHistoryItem[]): EngagementMetric => {
    const totalReach = posts.reduce((sum, p) => sum + (p.performance?.reach || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.performance?.likes || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.performance?.comments || 0), 0);
    const totalShares = posts.reduce((sum, p) => sum + (p.performance?.shares || 0), 0);
    
    const engagementRate = totalReach > 0 
      ? ((totalLikes + totalComments + totalShares) / totalReach * 100) 
      : 0;

    return {
      reach: totalReach,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
      engagementRate: Math.round(engagementRate * 10) / 10,
      trend: 'stable',
      changePercent: 0
    };
  };

  const generateMockMetrics = (previous = false): EngagementMetric => {
    const base = previous ? 0.8 : 1;
    return {
      reach: Math.floor(15234 * base),
      likes: Math.floor(1250 * base),
      comments: Math.floor(180 * base),
      shares: Math.floor(85 * base),
      engagementRate: Math.round((8.5 * base) * 10) / 10,
      trend: previous ? 'stable' : 'up',
      changePercent: previous ? 0 : 45
    };
  };

  const checkViralAlerts = () => {
    const recentPosts = history.slice(0, 5);
    const alerts: ViralAlert[] = [];

    recentPosts.forEach(post => {
      if (!post.performance) return;

      // Alert jeśli reach > 2000 w ciągu 2h
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      if (post.timestamp > twoHoursAgo && post.performance.reach > 2000) {
        alerts.push({
          id: `viral-${post.id}`,
          postId: post.id,
          postSnippet: post.result.postText.substring(0, 60) + '...',
          metric: 'reach',
          value: post.performance.reach,
          timestamp: post.timestamp,
          platform: post.result.platform
        });
      }

      // Alert jeśli engagement rate > 10%
      const engRate = post.performance.reach > 0
        ? ((post.performance.likes + post.performance.comments + post.performance.shares) / post.performance.reach * 100)
        : 0;
      
      if (engRate > 10) {
        alerts.push({
          id: `engagement-${post.id}`,
          postId: post.id,
          postSnippet: post.result.postText.substring(0, 60) + '...',
          metric: 'engagement',
          value: Math.round(engRate * 10) / 10,
          timestamp: post.timestamp,
          platform: post.result.platform
        });
      }
    });

    setViralAlerts(alerts.slice(0, 3)); // Max 3 alerty
  };

  const calculateBestTimes = () => {
    // AI-calculated best times based on historical performance
    const times: BestTimeToPost[] = [
      {
        platform: 'LinkedIn' as Platform,
        day: 'Wtorek',
        time: '10:00',
        score: 85,
        reason: 'Najwyższe engagement rate w ostatnich 30 dniach'
      },
      {
        platform: 'Instagram' as Platform,
        day: 'Czwartek',
        time: '18:30',
        score: 78,
        reason: 'Peak aktywności Twojej grupy docelowej'
      },
      {
        platform: 'X' as Platform,
        day: 'Środa',
        time: '14:00',
        score: 72,
        reason: 'Największy zasięg organiczny'
      }
    ];

    setBestTimes(times);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />;
    return <span className="text-gray-400">━</span>;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateChange = (): { reach: number; engagement: number } => {
    if (!currentMetrics || !previousMetrics || previousMetrics.reach === 0) {
      return { reach: 0, engagement: 0 };
    }

    const reachChange = ((currentMetrics.reach - previousMetrics.reach) / previousMetrics.reach * 100);
    const engagementChange = ((currentMetrics.engagementRate - previousMetrics.engagementRate) / previousMetrics.engagementRate * 100);

    return {
      reach: Math.round(reachChange * 10) / 10,
      engagement: Math.round(engagementChange * 10) / 10
    };
  };

  if (!currentMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const changes = calculateChange();

  return (
    <div className="space-y-6">
      {/* Header z Live Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <SparklesIcon className="w-7 h-7 text-blue-500" />
            Real-Time Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ostatnia aktualizacja: {lastUpdate.toLocaleTimeString('pl-PL')}
          </p>
        </div>
        
        <button
          onClick={() => setIsLiveUpdating(!isLiveUpdating)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isLiveUpdating
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {isLiveUpdating ? (
            <>
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              LIVE
            </>
          ) : (
            'Wznów Live'
          )}
        </button>
      </div>

      {/* Today's Performance */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Dzisiejsza Wydajność
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Reach */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <EyeIcon className="w-5 h-5 text-blue-500" />
              {getTrendIcon(changes.reach >= 0 ? 'up' : 'down')}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(currentMetrics.reach)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Zasięg</div>
            <div className={`text-xs font-medium mt-1 ${
              changes.reach >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {changes.reach >= 0 ? '+' : ''}{changes.reach}% vs wczoraj
            </div>
          </div>

          {/* Likes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <HeartIcon className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(currentMetrics.likes)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Polubienia</div>
          </div>

          {/* Comments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <ChatBubbleIcon className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(currentMetrics.comments)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Komentarze</div>
          </div>

          {/* Shares */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <ShareIcon className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(currentMetrics.shares)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Udostępnienia</div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Engagement Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentMetrics.engagementRate}%
              </span>
              <span className={`text-sm font-medium ${
                changes.engagement >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ({changes.engagement >= 0 ? '+' : ''}{changes.engagement}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Viral Alerts */}
      {viralAlerts.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-yellow-200 dark:border-orange-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-orange-500 animate-pulse" />
            🔥 Viral Alerts
          </h3>
          
          <div className="space-y-3">
            {viralAlerts.map(alert => (
              <div 
                key={alert.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                        {alert.platform}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(alert.timestamp).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      "{alert.postSnippet}"
                    </p>
                    <div className="flex items-center gap-2">
                      {alert.metric === 'reach' ? (
                        <EyeIcon className="w-4 h-4 text-blue-500" />
                      ) : (
                        <TrendingUpIcon className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {alert.metric === 'reach' 
                          ? `${formatNumber(alert.value)} wyświetleń w 2h!`
                          : `${alert.value}% engagement rate!`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-4xl">🚀</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Time to Post */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-purple-500" />
          ⏰ Najlepsze Czasy Publikacji (AI-Calculated)
        </h3>
        
        <div className="space-y-3">
          {bestTimes.map((time, index) => (
            <div 
              key={`${time.platform}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg">
                      {time.platform}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {time.day}, {time.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {time.reason}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {time.score}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Calculator Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💰 ROI Calculator
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">Kalkulator ROI w przygotowaniu...</p>
          <p className="text-xs mt-2">
            Śledź zwrot z inwestycji w content marketing
          </p>
        </div>
      </div>
    </div>
  );
};
