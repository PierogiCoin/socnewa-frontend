import React, { useEffect, useState } from 'react';
import { Platform } from '../types';
import { PLATFORM_CHARACTER_LIMITS } from '../config/appConfig';

interface FloatingCharacterBadgeProps {
  text: string;
  platform: Platform;
  show: boolean;
}

export const FloatingCharacterBadge: React.FC<FloatingCharacterBadgeProps> = ({
  text,
  platform,
  show
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const currentLength = text.length;
  const limit = PLATFORM_CHARACTER_LIMITS[platform];
  const percentage = (currentLength / limit) * 100;
  const remaining = limit - currentLength;

  useEffect(() => {
    if (show && currentLength > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [show, currentLength]);

  const getColor = () => {
    if (percentage >= 100) return 'bg-red-500 text-white';
    if (percentage >= 90) return 'bg-orange-500 text-white';
    if (percentage >= 80) return 'bg-yellow-500 text-slate-900';
    return 'bg-green-500 text-white';
  };

  const getIcon = () => {
    if (percentage >= 100) return '⚠️';
    if (percentage >= 90) return '⚡';
    if (percentage >= 80) return '📝';
    return '✓';
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      style={{ 
        animation: percentage >= 95 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
      }}
    >
      <div
        className={`${getColor()} rounded-full px-4 py-3 shadow-lg backdrop-blur-sm flex items-center gap-2 font-mono font-semibold text-sm hover:scale-105 transition-transform cursor-pointer group`}
        title={`${currentLength} / ${limit} characters`}
      >
        <span className="text-base">{getIcon()}</span>
        <div className="flex flex-col items-end">
          <span className="text-xs opacity-90">
            {remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}
          </span>
          <span className="text-[10px] opacity-75">
            {currentLength}/{limit}
          </span>
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
            {percentage >= 100 
              ? `${Math.abs(remaining)} characters over limit`
              : `${remaining} characters remaining`
            }
          </div>
        </div>
      </div>
    </div>
  );
};
