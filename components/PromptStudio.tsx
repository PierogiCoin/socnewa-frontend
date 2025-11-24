import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  generateVisualPrompt, 
  generateVideoPrompt, 
  analyzeAndImprovePrompt,
  generateCarouselPrompts,
  getPromptTemplates,
  type VisualPromptRequest,
  type GeneratedPrompt,
  type VideoPrompt
} from '../services/visualPromptEngineer';
import { Platform, VisualStyle } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { BeakerIcon } from './icons/BeakerIcon';

export const PromptStudio: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'carousel'>('generate');
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Form inputs
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.Instagram);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>(VisualStyle.Professional);
  const [tone, setTone] = useState('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandColors, setBrandColors] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:5'>('1:1');
  const [duration, setDuration] = useState(15);
  
  // Results
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [videoPrompt, setVideoPrompt] = useState<VideoPrompt | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [carouselResult, setCarouselResult] = useState<any>(null);
  
  // Analyze tab
  const [userPrompt, setUserPrompt] = useState('');
  
  // Carousel tab
  const [slideCount, setSlideCount] = useState(5);

  const handleGenerate = async () => {
    if (!user || !topic) return;
    
    setIsGenerating(true);
    try {
      const request: VisualPromptRequest = {
        topic,
        platform,
        visualStyle,
        tone,
        targetAudience,
        brandColors: brandColors.length > 0 ? brandColors : undefined,
        contentType,
        aspectRatio
      };
      
      if (contentType === 'image') {
        const result = await generateVisualPrompt(request, user.id);
        setGeneratedPrompt(result);
      } else {
        const result = await generateVideoPrompt(request, duration, user.id);
        setVideoPrompt(result);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to generate prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!user || !userPrompt) return;
    
    setIsGenerating(true);
    try {
      const result = await analyzeAndImprovePrompt(userPrompt, contentType, user.id);
      setAnalysisResult(result);
    } catch (error: any) {
      alert(error.message || 'Failed to analyze prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCarousel = async () => {
    if (!user || !topic) return;
    
    setIsGenerating(true);
    try {
      const result = await generateCarouselPrompts(topic, slideCount, visualStyle, platform, user.id);
      setCarouselResult(result);
    } catch (error: any) {
      alert(error.message || 'Failed to generate carousel');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const loadTemplate = (template: string) => {
    setUserPrompt(template);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Prompt Studio AI
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Generate professional prompts for images, videos, and carousels
          </p>
        </div>

        {/* Tabs - Mobile: Scrollable, Desktop: Flex */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'generate'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <PhotoIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Generate</span>
            <span className="xs:hidden">Gen</span>
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'analyze'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BeakerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
            <span>Analyze</span>
          </button>
          <button
            onClick={() => setActiveTab('carousel')}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'carousel'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <VideoCameraIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
            <span>Carousel</span>
          </button>
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Content Type Toggle - Mobile Friendly */}
            <div className="flex gap-2">
              <button
                onClick={() => setContentType('image')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  contentType === 'image'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
                Image
              </button>
              <button
                onClick={() => setContentType('video')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  contentType === 'video'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <VideoCameraIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
                Video
              </button>
            </div>

            {/* Form - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Sunrise over mountains"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                >
                  {Object.values(Platform).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                  Visual Style
                </label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                >
                  {Object.values(VisualStyle).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="4:5">4:5 (Vertical)</option>
                </select>
              </div>

              {contentType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min="5"
                    max="60"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Audience (optional)
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young professionals, tech enthusiasts"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-98 touch-manipulation"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin inline-block mr-2">⚡</span>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  <span className="hidden xs:inline">Generate Professional Prompt</span>
                  <span className="xs:hidden">Generate Prompt</span>
                </>
              )}
            </button>

            {/* Results for Image */}
            {generatedPrompt && contentType === 'image' && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Generated Prompts
                </h3>

                {/* Main Prompt */}
                <PromptCard
                  title="Main Prompt"
                  prompt={generatedPrompt.mainPrompt}
                  onCopy={() => copyToClipboard(generatedPrompt.mainPrompt, 'main')}
                  copied={copiedField === 'main'}
                />

                {/* Detailed Prompt */}
                <PromptCard
                  title="Detailed Prompt"
                  prompt={generatedPrompt.detailedPrompt}
                  onCopy={() => copyToClipboard(generatedPrompt.detailedPrompt, 'detailed')}
                  copied={copiedField === 'detailed'}
                />

                {/* Platform-Specific Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PromptCard
                    title="DALL-E 3"
                    prompt={generatedPrompt.dallePrompt}
                    onCopy={() => copyToClipboard(generatedPrompt.dallePrompt, 'dalle')}
                    copied={copiedField === 'dalle'}
                    compact
                  />
                  <PromptCard
                    title="Midjourney"
                    prompt={generatedPrompt.midjourneyPrompt}
                    onCopy={() => copyToClipboard(generatedPrompt.midjourneyPrompt, 'midjourney')}
                    copied={copiedField === 'midjourney'}
                    compact
                  />
                  <PromptCard
                    title="Stable Diffusion"
                    prompt={generatedPrompt.stableDiffusionPrompt}
                    onCopy={() => copyToClipboard(generatedPrompt.stableDiffusionPrompt, 'sd')}
                    copied={copiedField === 'sd'}
                    compact
                  />
                </div>

                {/* Technical Specs */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Style:</span>
                      <p className="text-slate-600 dark:text-slate-400">{generatedPrompt.technicalSpecs.style}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Lighting:</span>
                      <p className="text-slate-600 dark:text-slate-400">{generatedPrompt.technicalSpecs.lighting}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Mood:</span>
                      <p className="text-slate-600 dark:text-slate-400">{generatedPrompt.technicalSpecs.mood}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Composition:</span>
                      <p className="text-slate-600 dark:text-slate-400">{generatedPrompt.technicalSpecs.composition}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Color Palette:</span>
                    <div className="flex gap-2 mt-2">
                      {generatedPrompt.technicalSpecs.colorPalette.map((color, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-lg border-2 border-white dark:border-slate-600 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    💡 Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
                    {generatedPrompt.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Results for Video */}
            {videoPrompt && contentType === 'video' && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Video Prompt
                </h3>

                <PromptCard
                  title="Scene Description"
                  prompt={videoPrompt.sceneDescription}
                  onCopy={() => copyToClipboard(videoPrompt.sceneDescription, 'scene')}
                  copied={copiedField === 'scene'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Camera Movement</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{videoPrompt.cameraMovement}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Pacing</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{videoPrompt.pacing}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Frames</h4>
                  <div className="space-y-3">
                    {videoPrompt.keyFrames.map((frame, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="font-mono text-sm font-semibold text-purple-600 dark:text-purple-400 min-w-[60px]">
                          {frame.timestamp}
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{frame.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Your Prompt
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Paste your prompt here to analyze and improve it..."
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* Templates */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Quick Templates:
              </h4>
              <div className="flex flex-wrap gap-2">
                {getPromptTemplates('social').map((template, i) => (
                  <button
                    key={i}
                    onClick={() => loadTemplate(template)}
                    className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Template {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isGenerating || !userPrompt}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? 'Analyzing...' : 'Analyze & Improve'}
            </button>

            {analysisResult && (
              <div className="mt-6 space-y-4 animate-fade-in">
                {/* Scores */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <ScoreCard label="Clarity" score={analysisResult.analysis.clarity} />
                  <ScoreCard label="Specificity" score={analysisResult.analysis.specificity} />
                  <ScoreCard label="Creativeness" score={analysisResult.analysis.creativeness} />
                  <ScoreCard label="Technical" score={analysisResult.analysis.technicalDetail} />
                  <ScoreCard label="Overall" score={analysisResult.analysis.overallScore} highlight />
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">Before</h4>
                    <p className="text-sm text-red-800 dark:text-red-400">{analysisResult.comparison.before}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center justify-between">
                      After
                      <button
                        onClick={() => copyToClipboard(analysisResult.comparison.after, 'improved')}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {copiedField === 'improved' ? <CheckIcon className="w-3 h-3" /> : <CopyIcon className="w-3 h-3" />}
                      </button>
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-400">{analysisResult.comparison.after}</p>
                  </div>
                </div>

                {/* Changes */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What Changed:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-400">
                    {analysisResult.comparison.changes.map((change: string, i: number) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Suggestions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-400">
                    {analysisResult.improvements.map((imp: string, i: number) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Carousel Tab */}
        {activeTab === 'carousel' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Carousel Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 5 Tips for Better Photography"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Number of Slides
                </label>
                <input
                  type="number"
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                  min="3"
                  max="10"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateCarousel}
              disabled={isGenerating || !topic}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? 'Generating Carousel...' : 'Generate Carousel Prompts'}
            </button>

            {carouselResult && (
              <div className="mt-6 space-y-4 animate-fade-in">
                {/* Color Scheme */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Color Scheme
                  </h4>
                  <div className="flex gap-3">
                    {carouselResult.colorScheme.map((color: string, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-white dark:border-slate-600 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slides */}
                <div className="space-y-3">
                  {carouselResult.slides.map((slide: any, i: number) => (
                    <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                            Slide {slide.slideNumber}
                          </span>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mt-2">
                            {slide.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(slide.prompt, `slide-${i}`)}
                          className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          {copiedField === `slide-${i}` ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <strong>Prompt:</strong> {slide.prompt}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <strong>Text Overlay:</strong> {slide.textOverlay}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {slide.designNotes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const PromptCard: React.FC<{
  title: string;
  prompt: string;
  onCopy: () => void;
  copied: boolean;
  compact?: boolean;
}> = ({ title, prompt, onCopy, copied, compact }) => (
  <div className={`bg-slate-50 dark:bg-slate-700 rounded-lg ${compact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4'}`}>
    <div className="flex items-center justify-between mb-2">
      <h4 className={`font-semibold text-slate-900 dark:text-white ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
        {title}
      </h4>
      <button
        onClick={onCopy}
        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all touch-manipulation"
      >
        {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
      </button>
    </div>
    <p className={`text-slate-600 dark:text-slate-300 break-words ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
      {prompt}
    </p>
  </div>
);

const ScoreCard: React.FC<{ label: string; score: number; highlight?: boolean }> = ({ 
  label, 
  score, 
  highlight 
}) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={`text-center p-2.5 sm:p-3 rounded-lg ${
      highlight 
        ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 ring-2 ring-purple-400' 
        : 'bg-slate-50 dark:bg-slate-700'
    }`}>
      <div className={`text-xl sm:text-2xl font-bold ${getColor(score)}`}>
        {score}
      </div>
      <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1">
        {label}
      </div>
    </div>
  );
};
