import React, { useState } from 'react';
import { Platform } from '../types';
import { generateHashtags, HashtagAnalysis } from '../services/enhancements/hashtagService';
import { getAllTemplates, Template, fillTemplate } from '../services/enhancements/templateService';
import { getBestPostingTime, PostingTimeRecommendation } from '../services/enhancements/timingService';
import PostPreview from './preview/PostPreview';
import { useAuth } from '../contexts/AuthContext';

interface EnhancementsPanelProps {
  content: string;
  platform: Platform;
  onContentChange: (content: string) => void;
  onHashtagsAdd: (hashtags: string[]) => void;
}

export const EnhancementsPanel: React.FC<EnhancementsPanelProps> = ({
  content,
  platform,
  onContentChange,
  onHashtagsAdd
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hashtags' | 'templates' | 'timing' | 'preview'>('hashtags');
  const [isLoading, setIsLoading] = useState(false);
  const [hashtagData, setHashtagData] = useState<HashtagAnalysis | null>(null);
  const [timingData, setTimingData] = useState<PostingTimeRecommendation | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

  const tabs = [
    { id: 'hashtags', label: '🏷️ Hashtags', icon: '🏷️' },
    { id: 'templates', label: '📋 Templates', icon: '📋' },
    { id: 'timing', label: '⏰ Best Time', icon: '⏰' },
    { id: 'preview', label: '👁️ Preview', icon: '👁️' }
  ];

  const handleGenerateHashtags = async () => {
    if (!content.trim() || !user) return;
    
    setIsLoading(true);
    try {
      const result = await generateHashtags(content, platform, user.id);
      setHashtagData(result);
    } catch (error) {
      console.error('Failed to generate hashtags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHashtags = (hashtags: string[]) => {
    onHashtagsAdd(hashtags);
    const hashtagString = '\n\n' + hashtags.join(' ');
    onContentChange(content + hashtagString);
  };

  const handleGetBestTime = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await getBestPostingTime(
        platform,
        'general',
        'general audience',
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        user.id
      );
      setTimingData(result);
    } catch (error) {
      console.error('Failed to get best time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    
    // Initialize empty values for variables
    const initialValues: Record<string, string> = {};
    template.variables.forEach(v => {
      initialValues[v] = '';
    });
    setTemplateValues(initialValues);
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    
    const filledContent = fillTemplate(selectedTemplate, templateValues);
    onContentChange(filledContent);
    setSelectedTemplate(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Content Enhancements
        </h3>
        <p className="text-sm text-purple-100 mt-1">
          Supercharge your content with AI-powered tools
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden text-xl">{tab.icon}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Hashtags Tab */}
        {activeTab === 'hashtags' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Smart Hashtag Generator
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI-powered hashtags optimized for {platform}
                </p>
              </div>
              <button
                onClick={handleGenerateHashtags}
                disabled={isLoading || !content.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Generate
                  </>
                )}
              </button>
            </div>

            {hashtagData && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Reach</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {(hashtagData.total_potential_reach / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Hashtags</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {hashtagData.suggestions.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
                      Recommended Mix
                    </h5>
                    <button
                      onClick={() => handleAddHashtags(hashtagData.recommended)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Add All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtagData.recommended.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleAddHashtags([tag])}
                        className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy */}
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      High Competition (Visibility)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtagData.mixed_strategy.high_competition.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Medium Competition (Balance)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtagData.mixed_strategy.medium_competition.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Low Competition (Niche)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtagData.mixed_strategy.low_competition.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All Suggestions */}
                <details className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                    View All Suggestions ({hashtagData.suggestions.length})
                  </summary>
                  <div className="mt-3 space-y-2">
                    {hashtagData.suggestions.map(item => (
                      <div key={item.hashtag} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{item.hashtag}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Pop: {item.popularity}%
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              item.competition === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              item.competition === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {item.competition}
                            </span>
                            {item.trending && (
                              <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded">
                                🔥 Trending
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddHashtags([item.hashtag])}
                          className="ml-2 px-3 py-1 text-xs text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {!hashtagData && !isLoading && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p className="text-sm">Write some content first, then generate hashtags</p>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                Content Templates
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pre-built templates for faster content creation
              </p>
            </div>

            {!selectedTemplate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {getAllTemplates().map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 text-left transition-colors group"
                  >
                    <div className="font-semibold text-sm mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {template.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      {template.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {template.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        ⏱️ {template.estimatedTime}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-slate-900 dark:text-white">
                    {selectedTemplate.name}
                  </h5>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    ← Back
                  </button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Example:</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedTemplate.example}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Fill in the details:
                  </div>
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable}>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {variable.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        value={templateValues[variable] || ''}
                        onChange={(e) => setTemplateValues({
                          ...templateValues,
                          [variable]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Tips:</div>
                  <ul className="space-y-1">
                    {selectedTemplate.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleApplyTemplate}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Apply Template
                </button>
              </div>
            )}
          </div>
        )}

        {/* Timing Tab */}
        {activeTab === 'timing' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Best Time to Post
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI-optimized posting schedule for {platform}
                </p>
              </div>
              <button
                onClick={handleGetBestTime}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
              >
                {isLoading ? 'Loading...' : 'Get Best Time'}
              </button>
            </div>

            {timingData && (
              <div className="space-y-4">
                {/* Main Recommendation */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      Best Time to Post
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                    {timingData.bestTime}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mb-3">
                    {timingData.reasoning}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Confidence: {timingData.confidence}%
                    </span>
                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {timingData.expectedReach}
                    </span>
                  </div>
                </div>

                {/* Alternatives */}
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Alternative Times
                  </h5>
                  <div className="space-y-2">
                    {timingData.alternatives.map((alt, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{alt.time}</span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {alt.expectedReach}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {alt.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!timingData && !isLoading && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Get AI-powered timing recommendations</p>
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div>
            {content.trim() ? (
              <PostPreview
                content={content}
                platform={platform}
                username={user?.displayName || 'yourname'}
                avatar={user?.photoURL}
              />
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-sm">Write some content to see the preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
