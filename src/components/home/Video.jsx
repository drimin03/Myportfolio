import React, { useState, useRef, useEffect } from 'react';

const Video = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      console.log('🎥 Video loaded and ready to play');
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      console.log('🎥 Video can play through without interruption');
    };

    const handleError = (e) => {
      setHasError(true);
      setIsLoading(false);
      console.error('🚫 Video loading error:', e);
    };

    const handleLoadStart = () => {
      console.log('🎥 Video loading started');
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          const progress = (bufferedEnd / duration) * 100;
          setLoadProgress(progress);
        }
      }
    };

    const handleLoadedMetadata = () => {
      console.log('🎥 Video metadata loaded');
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  if (hasError) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg mb-2">Video failed to load</p>
          <p className="text-sm opacity-75">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Loading overlay with progress */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="text-white text-center">
            {/* Animated loading spinner */}
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-600"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white absolute top-0 left-0"></div>
            </div>
            
            <p className="text-sm opacity-75 mb-2">Loading video...</p>
            
            {/* Progress bar */}
            {loadProgress > 0 && (
              <div className="w-48 bg-gray-700 rounded-full h-1 mx-auto">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(loadProgress, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Optimized Video */}
      <video 
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        src="/videos/video.mp4"
        autoPlay 
        loop 
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        onLoadedData={() => setIsLoading(false)}
        onCanPlayThrough={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        onProgress={() => {
          const video = videoRef.current;
          if (video && video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const duration = video.duration;
            if (duration > 0) {
              const progress = (bufferedEnd / duration) * 100;
              setLoadProgress(progress);
            }
          }
        }}
      >
        {/* Fallback for browsers that don't support video */}
        <div className="h-full w-full bg-black flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">📹</div>
            <p>Your browser doesn't support video playback.</p>
          </div>
        </div>
      </video>

      {/* Subtle fade-in effect for when video is ready */}
      {!isLoading && (
        <div 
          className="absolute inset-0 bg-black pointer-events-none animate-pulse"
          style={{
            animation: 'fadeOut 0.5s ease-out forwards'
          }}
        />
      )}
    </div>
  );
};

export default Video;