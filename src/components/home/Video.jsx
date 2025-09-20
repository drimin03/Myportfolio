import React, { useRef, useEffect } from 'react';

const Video = ({ onReady }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlayThrough = () => {
      console.log('🎥 Video can play through');
      if (onReady) onReady(); // notify Home/Loader that video is ready
    };

    const handleError = (e) => {
      console.error('🚫 Video failed to load', e);
      if (onReady) onReady(); // even on error, let loader finish
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
    };
  }, [onReady]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      src="/videos/video.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      crossOrigin="anonymous"
    >
      <p>Your browser does not support video playback.</p>
    </video>
  );
};

export default Video;
