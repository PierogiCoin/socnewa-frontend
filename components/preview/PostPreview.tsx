import React from 'react';
import { Platform } from '../../types';

interface PostPreviewProps {
  content: string;
  platform: Platform;
  username?: string;
  avatar?: string;
  timestamp?: string;
  imageUrl?: string;
  verified?: boolean;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  content,
  platform,
  username = 'yourname',
  avatar,
  timestamp = '2h ago',
  imageUrl,
  verified = false
}) => {
  
  const renderPlatformPreview = () => {
    switch (platform) {
      case Platform.LinkedIn:
        return <LinkedInPreview {...{ content, username, avatar, timestamp, imageUrl, verified }} />;
      case Platform.X:
        return <TwitterPreview {...{ content, username, avatar, timestamp, imageUrl, verified }} />;
      case Platform.Instagram:
        return <InstagramPreview {...{ content, username, avatar, timestamp, imageUrl, verified }} />;
      case Platform.Facebook:
        return <FacebookPreview {...{ content, username, avatar, timestamp, imageUrl, verified }} />;
      case Platform.TikTok:
        return <TikTokPreview {...{ content, username, avatar, timestamp, imageUrl, verified }} />;
      case Platform.YouTube:
        return <YouTubePreview {...{ content, username, avatar, timestamp, imageUrl, verified }} />;
      default:
        return <GenericPreview {...{ content, username, avatar, timestamp, imageUrl }} />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          {platform} Preview
        </span>
        <span className="text-xs text-slate-500">
          Live Preview
        </span>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {renderPlatformPreview()}
      </div>
      
      <div className="mt-2 text-xs text-slate-500 text-center">
        This is how your post will appear to your audience
      </div>
    </div>
  );
};

// LinkedIn Preview
const LinkedInPreview: React.FC<PostPreviewProps> = ({
  content, username, avatar, timestamp, imageUrl, verified
}) => (
  <div className="p-4 bg-white">
    {/* Header */}
    <div className="flex items-start gap-3 mb-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
        {avatar ? <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" /> : username[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-slate-900 truncate">{username}</span>
          {verified && (
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
          )}
          <span className="text-xs text-slate-500">• 1st</span>
        </div>
        <div className="text-xs text-slate-600">Professional Title</div>
        <div className="text-xs text-slate-500">{timestamp} • 🌐</div>
      </div>
      <button className="text-slate-400 hover:bg-slate-100 rounded p-1">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </button>
    </div>

    {/* Content */}
    <div className="text-sm text-slate-900 mb-3 whitespace-pre-wrap break-words">
      {formatContent(content)}
    </div>

    {/* Image */}
    {imageUrl && (
      <div className="mb-3 -mx-4">
        <img src={imageUrl} alt="" className="w-full" />
      </div>
    )}

    {/* Engagement Bar */}
    <div className="flex items-center justify-between py-2 border-t border-slate-200">
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
            </svg>
          </div>
        </div>
        <span>45</span>
      </div>
      <div className="text-xs text-slate-600">
        12 comments • 5 reposts
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-around border-t border-slate-200 pt-1">
      <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
        </svg>
        Like
      </button>
      <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        Comment
      </button>
      <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Repost
      </button>
      <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Send
      </button>
    </div>
  </div>
);

// Twitter/X Preview
const TwitterPreview: React.FC<PostPreviewProps> = ({
  content, username, avatar, timestamp, imageUrl, verified
}) => (
  <div className="p-4 bg-white">
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
        {avatar ? <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" /> : username[0].toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <span className="font-bold text-sm text-slate-900">{username}</span>
          {verified && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
            </svg>
          )}
          <span className="text-sm text-slate-500">@{username}</span>
          <span className="text-slate-500">·</span>
          <span className="text-sm text-slate-500">{timestamp}</span>
        </div>

        <div className="text-sm text-slate-900 mb-3 whitespace-pre-wrap break-words">
          {formatContent(content)}
        </div>

        {imageUrl && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200">
            <img src={imageUrl} alt="" className="w-full" />
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center justify-between max-w-md text-slate-500 text-sm">
          <button className="flex items-center gap-2 hover:text-blue-500 group">
            <div className="group-hover:bg-blue-50 rounded-full p-2 -m-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <span>24</span>
          </button>
          <button className="flex items-center gap-2 hover:text-green-500 group">
            <div className="group-hover:bg-green-50 rounded-full p-2 -m-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <span>8</span>
          </button>
          <button className="flex items-center gap-2 hover:text-pink-500 group">
            <div className="group-hover:bg-pink-50 rounded-full p-2 -m-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <span>142</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500 group">
            <div className="group-hover:bg-blue-50 rounded-full p-2 -m-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Instagram Preview  
const InstagramPreview: React.FC<PostPreviewProps> = ({
  content, username, avatar, timestamp, imageUrl, verified
}) => (
  <div className="bg-white">
    {/* Header */}
    <div className="flex items-center justify-between p-3 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white p-0.5">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
              {avatar ? <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" /> : username[0].toUpperCase()}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{username}</span>
            {verified && <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/></svg>}
          </div>
          <span className="text-xs text-slate-500">Sponsored</span>
        </div>
      </div>
      <button className="text-slate-900">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </button>
    </div>

    {/* Image */}
    {imageUrl ? (
      <img src={imageUrl} alt="" className="w-full aspect-square object-cover" />
    ) : (
      <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <span className="text-slate-400 text-sm">Your image here</span>
      </div>
    )}

    {/* Actions */}
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
          <button>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </button>
          <button>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
        </div>
        <button>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </button>
      </div>

      <div className="font-semibold text-sm">234 likes</div>
      
      <div className="text-sm">
        <span className="font-semibold mr-2">{username}</span>
        <span className="text-slate-900">{content.substring(0, 100)}{content.length > 100 && '...'}</span>
        {content.length > 100 && <button className="text-slate-500 ml-1">more</button>}
      </div>

      <button className="text-slate-500 text-sm">View all 12 comments</button>
      
      <div className="text-xs text-slate-400 uppercase">{timestamp}</div>
    </div>
  </div>
);

// Facebook, TikTok, YouTube previews (simplified versions)
const FacebookPreview: React.FC<PostPreviewProps> = (props) => <GenericPreview {...props} platform="Facebook" />;
const TikTokPreview: React.FC<PostPreviewProps> = (props) => <GenericPreview {...props} platform="TikTok" />;
const YouTubePreview: React.FC<PostPreviewProps> = (props) => <GenericPreview {...props} platform="YouTube" />;

const GenericPreview: React.FC<PostPreviewProps & { platform?: string }> = ({
  content, username, avatar, timestamp, imageUrl, platform = 'Social Media'
}) => (
  <div className="p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-semibold">
        {avatar ? <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" /> : username[0].toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-slate-900">{username}</div>
        <div className="text-sm text-slate-500">{timestamp}</div>
      </div>
    </div>

    <div className="text-slate-900 mb-4 whitespace-pre-wrap">
      {formatContent(content)}
    </div>

    {imageUrl && (
      <img src={imageUrl} alt="" className="w-full rounded-lg mb-4" />
    )}

    <div className="text-xs text-slate-500 text-center py-3 border-t border-slate-200">
      {platform} Preview - Detailed preview coming soon
    </div>
  </div>
);

// Helper: Format content (highlight hashtags, mentions, links)
const formatContent = (content: string) => {
  const parts = content.split(/(\s+)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      return <span key={index} className="text-blue-600 hover:underline cursor-pointer">{part}</span>;
    } else if (part.startsWith('@')) {
      return <span key={index} className="text-blue-600 hover:underline cursor-pointer">{part}</span>;
    } else if (part.match(/^https?:\/\//)) {
      return <a key={index} href={part} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{part}</a>;
    }
    return <span key={index}>{part}</span>;
  });
};

export default PostPreview;
