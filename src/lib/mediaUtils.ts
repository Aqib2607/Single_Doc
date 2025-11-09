// Utility functions for handling media URLs

/**
 * Converts YouTube watch URLs to embed URLs for iframe embedding
 * Handles various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Already embed URLs are returned as-is
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  // If it's already an embed URL, return as is
  if (url.includes('/embed/')) {
    return url;
  }
  
  // Handle different YouTube URL formats
  let videoId = '';
  
  // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch?v=')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  }
  // Short URL: https://youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  // Mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
  else if (url.includes('m.youtube.com/watch?v=')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  }
  
  // If we found a video ID, convert to embed URL with proper parameters
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&controls=1&showinfo=0`;
  }
  
  // If not a YouTube URL or couldn't extract ID, return original URL
  return url;
};

/**
 * Checks if a URL is a valid YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Extracts video ID from YouTube URL
 */
export const getYouTubeVideoId = (url: string): string | null => {
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('m.youtube.com/watch?v=')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('/embed/')) {
    videoId = url.split('/embed/')[1].split('?')[0];
  }
  
  return videoId || null;
};