import React, { useState } from 'react';
import { Platform } from '../types';
import { EnhancementsPanel } from './EnhancementsPanel';

interface EnhancementButtonsProps {
  content: string;
  platform: Platform;
  onContentChange: (content: string) => void;
  onHashtagsAdd?: (hashtags: string[]) => void;
}

/**
 * Compact enhancement buttons that can be added to any form
 * Opens a modal/drawer with the full EnhancementsPanel
 */
export const EnhancementButtons: React.FC<EnhancementButtonsProps> = ({
  content,
  platform,
  onContentChange,
  onHashtagsAdd
}) => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      {/* Compact Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowPanel(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors shadow-sm hover:shadow"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="hidden sm:inline">Enhancements</span>
          <span className="sm:hidden">AI Tools</span>
        </button>

        <button
          onClick={() => setShowPanel(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 text-sm font-medium transition-colors"
        >
          <span>🏷️</span>
          <span className="hidden sm:inline">Hashtags</span>
        </button>

        <button
          onClick={() => setShowPanel(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 text-sm font-medium transition-colors"
        >
          <span>📋</span>
          <span className="hidden sm:inline">Templates</span>
        </button>

        <button
          onClick={() => setShowPanel(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 text-sm font-medium transition-colors"
        >
          <span>👁️</span>
          <span className="hidden sm:inline">Preview</span>
        </button>
      </div>

      {/* Modal/Drawer with Full Panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setShowPanel(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Full Enhancements Panel */}
              <div className="p-4 sm:p-6">
                <EnhancementsPanel
                  content={content}
                  platform={platform}
                  onContentChange={onContentChange}
                  onHashtagsAdd={(hashtags) => {
                    onHashtagsAdd?.(hashtags);
                    // Optional: close panel after adding hashtags
                    // setShowPanel(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Alternative: Inline compact version (no modal)
 * Shows just the buttons in a row, opens panel inline below
 */
export const EnhancementButtonsInline: React.FC<EnhancementButtonsProps> = ({
  content,
  platform,
  onContentChange,
  onHashtagsAdd
}) => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm font-medium transition-all shadow-sm hover:shadow"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {showPanel ? 'Hide' : 'Show'} AI Enhancements
        {!showPanel && (
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded text-xs">
            New!
          </span>
        )}
      </button>

      {/* Inline Panel */}
      {showPanel && (
        <div className="animate-in slide-in-from-top duration-300">
          <EnhancementsPanel
            content={content}
            platform={platform}
            onContentChange={onContentChange}
            onHashtagsAdd={onHashtagsAdd}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Alternative: Sidebar version
 * Slides in from the right side
 */
export const EnhancementsSidebar: React.FC<EnhancementButtonsProps & { isOpen: boolean; onClose: () => void }> = ({
  content,
  platform,
  onContentChange,
  onHashtagsAdd,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px]
        bg-white dark:bg-slate-900 shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        overflow-y-auto
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            ✨ AI Enhancements
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <EnhancementsPanel
            content={content}
            platform={platform}
            onContentChange={onContentChange}
            onHashtagsAdd={onHashtagsAdd}
          />
        </div>
      </div>
    </>
  );
};

export default EnhancementButtons;
