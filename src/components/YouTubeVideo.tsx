import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { getYouTubeVideoId } from '@/lib/mediaUtils';

interface YouTubeVideoProps {
  url: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ url, title, className = '', style }) => {
  const videoId = getYouTubeVideoId(url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  
  // Convert embed URL to watch URL for opening in new tab
  const watchUrl = url.includes('/embed/') 
    ? url.replace('/embed/', '/watch?v=')
    : url;

  const handleClick = () => {
    // Always open in new tab since iframe embedding is blocked
    window.open(watchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`relative cursor-pointer group ${className}`} 
      style={style} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            // Fallback to a placeholder if thumbnail fails
            e.currentTarget.src = 'https://via.placeholder.com/640x360/f3f4f6/6b7280?text=Click+to+Watch+Video';
          }}
        />
      )}
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg">
        <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <Play className="w-8 h-8 text-white fill-current ml-1" />
        </div>
      </div>
      
      {/* External link indicator */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4 text-white" />
      </div>
      
      {/* Video title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
        <p className="text-white font-semibold text-sm truncate">{title}</p>
        <p className="text-white/70 text-xs mt-1">Click to watch on YouTube</p>
      </div>
    </div>
  );
};

export default YouTubeVideo;