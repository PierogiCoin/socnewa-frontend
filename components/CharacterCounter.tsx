import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { PLATFORM_CHARACTER_LIMITS, CHARACTER_THRESHOLDS } from '../config/appConfig';

interface CharacterCounterProps {
  text: string;
  platform: Platform;
  showAllPlatforms?: boolean;
  className?: string;
}

const platformLimits = PLATFORM_CHARACTER_LIMITS;

const platformDisplayNames: Record<Platform, string> = {
  [Platform.X]: 'X (Twitter)',
  [Platform.LinkedIn]: 'LinkedIn',
  [Platform.Instagram]: 'Instagram',
  [Platform.Facebook]: 'Facebook',
  [Platform.TikTok]: 'TikTok',
  [Platform.YouTube]: 'YouTube'
};

const platformIcons: Record<Platform, string> = {
  [Platform.X]: '𝕏',
  [Platform.LinkedIn]: '💼',
  [Platform.Instagram]: '📸',
  [Platform.Facebook]: '👥',
  [Platform.TikTok]: '🎵',
  [Platform.YouTube]: '▶️'
};

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  text,
  platform,
  showAllPlatforms = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const [showAllPlatformsState, setShowAllPlatformsState] = React.useState(showAllPlatforms);
  
  const currentLength = text.length;
  const limit = platformLimits[platform];
  const percentage = (currentLength / limit) * 100;
  const remaining = limit - currentLength;

  const getStatusColor = (percent: number) => {
    if (percent >= CHARACTER_THRESHOLDS.ERROR) return {
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-500',
      icon: ExclamationCircleIcon
    };
    if (percent >= CHARACTER_THRESHOLDS.DANGER) return {
      text: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-500',
      icon: AlertTriangleIcon
    };
    if (percent >= CHARACTER_THRESHOLDS.WARNING) return {
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-500',
      icon: AlertTriangleIcon
    };
    return {
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-500',
      icon: CheckCircleIcon
    };
  };

  const status = getStatusColor(percentage);
  const StatusIcon = status.icon;

  const renderPlatformCounter = (plat: Platform, isMainPlatform: boolean = false) => {
    const platLimit = platformLimits[plat];
    const platPercentage = (currentLength / platLimit) * 100;
    const platStatus = getStatusColor(platPercentage);

    return (
      <div
        key={plat}
        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
          isMainPlatform
            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
            : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{platformIcons[plat]}</span>
          <span className={`text-sm ${isMainPlatform ? 'font-semibold' : 'font-medium'}`}>
            {platformDisplayNames[plat]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${platStatus.text}`}>
            {currentLength}/{platLimit}
          </span>
          {platPercentage < 100 ? (
            <CheckCircleIcon className={`w-4 h-4 ${platStatus.text}`} />
          ) : (
            <ExclamationCircleIcon className={`w-4 h-4 ${platStatus.text}`} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main platform counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-5 h-5 ${status.text} transition-colors duration-200`} />
            <div className="flex flex-col">
              <span className={`text-sm font-semibold ${status.text} transition-colors duration-200`}>
                {currentLength} / {limit}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {remaining > 0 
                  ? `${remaining} ${t('characterCounter.remaining', 'characters left')}`
                  : `${Math.abs(remaining)} ${t('characterCounter.over', 'characters over')}`
                }
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowAllPlatformsState(!showAllPlatformsState)}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {showAllPlatformsState 
              ? t('characterCounter.hideAll', '▲ Hide') 
              : t('characterCounter.showAll', '▼ Show all')}
          </button>
        </div>

        {/* Progress bar with animation */}
        <div className="relative w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-300 ease-out ${status.bg} ${
              percentage >= 95 ? 'animate-pulse' : ''
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          {percentage > 100 && (
            <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse" />
          )}
        </div>

        {/* Warning messages */}
        {percentage >= 100 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ExclamationCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">
              {t('characterCounter.exceededWarning', `Post exceeds character limit for ${platformDisplayNames[platform]}`)}
            </p>
          </div>
        )}
        {percentage >= 90 && percentage < 100 && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <AlertTriangleIcon className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {t('characterCounter.nearLimit', 'Approaching character limit')}
            </p>
          </div>
        )}
      </div>

      {/* Show limits for all platforms with smooth transition */}
      {showAllPlatformsState && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
            <span>📊</span>
            {t('characterCounter.allPlatforms', 'Character limits for all platforms:')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.values(Platform).map(plat => 
              renderPlatformCounter(plat, plat === platform)
            )}
          </div>
          
          {/* Quick stats */}
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>{t('characterCounter.tip', 'Tip')}:</strong> {
                currentLength < 280 
                  ? t('characterCounter.tipShort', 'Perfect length for X (Twitter)!')
                  : currentLength < 2200
                    ? t('characterCounter.tipMedium', 'Great for Instagram, TikTok, and YouTube!')
                    : t('characterCounter.tipLong', 'Best for LinkedIn and Facebook!')
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper hook for character counting
export const useCharacterCount = (text: string) => {
  const length = text.length;
  
  const getStatusForPlatform = (platform: Platform) => {
    const limit = platformLimits[platform];
    const percentage = (length / limit) * 100;
    
    return {
      length,
      limit,
      percentage,
      isValid: percentage < 100,
      isNearLimit: percentage >= 80 && percentage < 100,
      isOverLimit: percentage >= 100
    };
  };

  const getAllPlatformStatus = () => {
    return Object.values(Platform).reduce((acc, platform) => {
      acc[platform] = getStatusForPlatform(platform);
      return acc;
    }, {} as Record<Platform, ReturnType<typeof getStatusForPlatform>>);
  };

  return {
    length,
    getStatusForPlatform,
    getAllPlatformStatus
  };
};
