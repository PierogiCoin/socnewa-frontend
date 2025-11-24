import React, { useState } from 'react';
import { Platform } from '../types';
import { EnhancementsPanel } from './EnhancementsPanel';

/**
 * Demo component showing how to use EnhancementsPanel
 * This can be used as a standalone page or integrated into your existing forms
 */
export const EnhancementsDemo: React.FC = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.LinkedIn);
  const [showEnhancements, setShowEnhancements] = useState(true);

  const handleHashtagsAdd = (hashtags: string[]) => {
    console.log('Added hashtags:', hashtags);
    // Hashtags are already added to content by EnhancementsPanel
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            🚀 Content Enhancements
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Supercharge your content with AI-powered tools
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Content Editor */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                ✏️ Content Editor
              </h2>

              {/* Platform Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value={Platform.LinkedIn}>LinkedIn</option>
                  <option value={Platform.X}>X (Twitter)</option>
                  <option value={Platform.Instagram}>Instagram</option>
                  <option value={Platform.Facebook}>Facebook</option>
                  <option value={Platform.TikTok}>TikTok</option>
                  <option value={Platform.YouTube}>YouTube</option>
                </select>
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here... Try writing something and then use the enhancements panel to add hashtags, templates, or preview your post!"
                  rows={12}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">
                    {content.length} characters
                  </span>
                  <button
                    onClick={() => setContent('')}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Quick Start Examples:
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setContent('Just launched our new AI-powered content creation platform! After 18 months of development, we\'re finally ready to share what we\'ve been building. This is going to revolutionize how marketers create content.')}
                    className="w-full text-left px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-sm"
                  >
                    📢 Product Launch Example
                  </button>
                  <button
                    onClick={() => setContent('5 productivity hacks that changed my life:\n\n1. Wake up at 5 AM\n2. Time-block everything\n3. Single-task only\n4. Take breaks every 90 minutes\n5. Review progress daily\n\nWhich one will you try first?')}
                    className="w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm"
                  >
                    💡 Tips Post Example
                  </button>
                  <button
                    onClick={() => setContent('3 years ago, I was broke and lost. Today, I run a 7-figure business. The journey wasn\'t easy, but here\'s what I learned along the way...')}
                    className="w-full text-left px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-sm"
                  >
                    📖 Storytelling Example
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">✨ What You Get:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-200 mt-0.5">🏷️</span>
                  <div>
                    <span className="font-medium">Smart Hashtags</span>
                    <p className="text-sm text-purple-100">AI generates optimized hashtags with reach estimates</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-200 mt-0.5">📋</span>
                  <div>
                    <span className="font-medium">15+ Templates</span>
                    <p className="text-sm text-purple-100">Pre-built templates for every post type</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-200 mt-0.5">⏰</span>
                  <div>
                    <span className="font-medium">Best Time</span>
                    <p className="text-sm text-purple-100">AI recommends optimal posting times</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-200 mt-0.5">👁️</span>
                  <div>
                    <span className="font-medium">Live Preview</span>
                    <p className="text-sm text-purple-100">See exactly how your post will look</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Enhancements Panel */}
          <div>
            {showEnhancements ? (
              <EnhancementsPanel
                content={content}
                platform={platform}
                onContentChange={setContent}
                onHashtagsAdd={handleHashtagsAdd}
              />
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Enhancements Panel Hidden
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Click below to show the enhancement tools
                </p>
                <button
                  onClick={() => setShowEnhancements(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Show Enhancements
                </button>
              </div>
            )}

            {showEnhancements && (
              <button
                onClick={() => setShowEnhancements(false)}
                className="mt-4 w-full text-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Hide Enhancements Panel
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              All features are production-ready!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancementsDemo;
