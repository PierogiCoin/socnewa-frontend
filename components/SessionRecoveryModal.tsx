import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSessionRecovery } from '../hooks/useSessionRecovery';
import type { FormData } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { RefreshCwIcon } from './icons/RefreshCwIcon';
import { TrashIcon } from './icons/TrashIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { stripHtmlTags } from '../utils/textUtils';

interface SessionRecoveryModalProps {
  onRestore: (data: Partial<FormData>) => void;
  onDiscard: () => void;
}

export const SessionRecoveryModal: React.FC<SessionRecoveryModalProps> = ({
  onRestore,
  onDiscard
}) => {
  const { t } = useTranslation();
  const { sessionData, clearSession, getSessionAge } = useSessionRecovery();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal if there's a recoverable session
    if (sessionData) {
      // Small delay to ensure UI is ready
      setTimeout(() => setIsOpen(true), 500);
    }
  }, [sessionData]);

  const handleRestore = () => {
    if (sessionData) {
      onRestore(sessionData.data);
      clearSession();
      setIsOpen(false);
    }
  };

  const handleDiscard = () => {
    clearSession();
    setIsOpen(false);
    onDiscard();
  };

  if (!isOpen || !sessionData) return null;

  const sessionAge = getSessionAge(sessionData);
  const hasTopicContent = sessionData.data.topic && sessionData.data.topic.trim().length > 0;
  const hasAudienceContent = sessionData.data.audience && sessionData.data.audience.trim().length > 0;
  const hasKeywordsContent = sessionData.data.keywords && sessionData.data.keywords.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleDiscard}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <RefreshCwIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('sessionRecovery.title', '🔄 Recover Your Session?')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('sessionRecovery.description', 'We found unsaved work from your previous session.')}
              </p>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
              <ClockIcon className="w-4 h-4" />
              <span>
                {t('sessionRecovery.savedTime', 'Saved {{time}}', { time: sessionAge })}
              </span>
            </div>

            {/* Preview of saved content */}
            <div className="space-y-2">
              {hasTopicContent && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('sessionRecovery.topicPreview', 'Topic:')}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                    {stripHtmlTags(sessionData.data.topic || '')}
                  </p>
                </div>
              )}

              {hasAudienceContent && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('sessionRecovery.audiencePreview', 'Audience:')}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">
                    {sessionData.data.audience}
                  </p>
                </div>
              )}

              {hasKeywordsContent && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('sessionRecovery.keywordsPreview', 'Keywords:')}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">
                    {sessionData.data.keywords}
                  </p>
                </div>
              )}

              {sessionData.data.platform && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Platform:</span>
                  <span className="font-semibold">{sessionData.data.platform}</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-6">
            <AlertTriangleIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700 dark:text-orange-300">
              {t('sessionRecovery.warning', 'Restoring will replace your current unsaved changes.')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleRestore}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <RefreshCwIcon className="w-5 h-5" />
              {t('sessionRecovery.restore', 'Restore Session')}
            </button>
            <button
              onClick={handleDiscard}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
              {t('sessionRecovery.discard', 'Discard')}
            </button>
          </div>

          {/* Later option */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            {t('sessionRecovery.decideLater', 'Decide later')}
          </button>
        </div>
      </div>
    </>
  );
};
