import { useState, useEffect, useRef } from "react";
import { useInView } from 'motion/react';
import imageCache from '../utils/ImageCache';

const SCRAMBLE_CHARS = "!<>-_\\/[]{}-=+*^?#________";

// ScrambleText Component
function ScrambleText({
  text,
  delay = 0,
  duration = 1.6,
  className = '',
  startWhen = true,
  onStart,
  onEnd
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = text || '';
    }
  }, [text]);

  useEffect(() => {
    if (!isInView || !startWhen || !ref.current) return;

    let frameId = null;
    let startAt = null;
    let timeoutId = null;
    const targetText = text || '';
    const textLength = targetText.length;

    if (typeof onStart === 'function') onStart();

    const animate = (timestamp) => {
      if (!startAt) startAt = timestamp;
      const elapsed = (timestamp - startAt) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * textLength);

      const output = targetText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

      if (ref.current) ref.current.textContent = output;

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        if (ref.current) ref.current.textContent = targetText;
        if (typeof onEnd === 'function') onEnd();
      }
    };

    timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isInView, startWhen, delay, duration, onStart, onEnd, text]);

  return <span className={className} ref={ref} />;
}

function Loader({
  images = [],
  projectName = "PROJECT",
  projectType = "Loading...",
  onLoadComplete,
  priority = 'normal'
}) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [startCountUp, setStartCountUp] = useState(false);
  const [showMoveUp, setShowMoveUp] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(true);

  // Check if any images need loading
  useEffect(() => {
    // If no images, don't show loader
    if (images.length === 0) {
      setShouldShowLoader(false);
      setLoadingComplete(true);
      return;
    }

    // Check if any images are not cached
    const uncachedImages = images.filter(url => !imageCache.isImageCached(url));
    
    // If all images are cached, no need to show loader
    if (uncachedImages.length === 0) {
      setShouldShowLoader(false);
      setLoadingComplete(true);
    } else {
      // Some images need loading, show loader
      setShouldShowLoader(true);
    }
  }, [images]);

  // Prevent scrolling when loader is active
  useEffect(() => {
    if (!shouldShowLoader) return;
    
    document.body.style.overflow = showMoveUp ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMoveUp, shouldShowLoader]);

  // Start the scramble animation immediately
  useEffect(() => {
    if (!shouldShowLoader) return;
    
    const timer = setTimeout(() => {
      setStartCountUp(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [shouldShowLoader]);

  // Enhanced image preloading with global cache
  useEffect(() => {
    // If we determined we don't need to show loader, call onLoadComplete immediately
    if (!shouldShowLoader) {
      if (onLoadComplete) {
        setTimeout(() => {
          setShowMoveUp(true);
          setTimeout(onLoadComplete, 1000);
        }, 100);
      }
      return;
    }

    if (images.length === 0) {
      setLoadingComplete(true);
      return;
    }

    const loadImages = async () => {
      try {
        const uncachedImages = images.filter(url => !imageCache.isImageCached(url));
        const alreadyCached = images.length - uncachedImages.length;

        if (uncachedImages.length === 0) {
          setLoadingProgress(100);
          setLoadingComplete(true);
          return;
        }

        if (alreadyCached > 0) {
          const initialProgress = (alreadyCached / images.length) * 100;
          setLoadingProgress(initialProgress);
        }

        await imageCache.preloadImages(uncachedImages, (loaded, failed) => {
          const totalCompleted = alreadyCached + loaded + failed;
          const progress = (totalCompleted / images.length) * 100;
          setLoadingProgress(Math.min(progress, 100));
        });

        setLoadingComplete(true);

      } catch (error) {
        console.error('Error in image loading:', error);
        setLoadingComplete(true);
      }
    };

    loadImages();
  }, [images, shouldShowLoader, onLoadComplete]);

  // Handle completion - wait for both scramble and images
  const handleCountUpEnd = () => {
    const checkCompletion = () => {
      if (loadingComplete) {
        setTimeout(() => {
          setShowMoveUp(true);
          setTimeout(() => {
            if (onLoadComplete) onLoadComplete();
          }, 1000);
        }, 500);
      } else {
        setTimeout(checkCompletion, 100);
      }
    };
    
    checkCompletion();
  };

  const loadingText = "Your experience is loading... almost there";
  const scrambleText = `${projectName} ${projectType}`.trim();

  // If we determined we don't need to show loader, don't render the loader UI
  if (!shouldShowLoader) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black text-black h-screen w-screen transition-transform duration-1000 ease-in-out ${
        showMoveUp ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Scramble Loading Text */}
      <div className="pb-4">
        <div className="text-center">
          <ScrambleText
            text={scrambleText}
            duration={1.6}
            startWhen={startCountUp}
            className="font-[manrope4] text-lg md:text-xl text-white"
            onEnd={handleCountUpEnd}
          />
        </div>
      </div>

      {/* Staggered Loading Text Below Counter */}
      <div className="pt-6">
        <p className="text-center text-white font-[manrope4] text-lg md:text-xl flex justify-center flex-wrap">
          {loadingText.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block transition-transform duration-500 ease-out"
              style={{
                transitionDelay: `${index * 40}ms`, // continuous stagger
                transform: showMoveUp ? "translateY(-100%)" : "translateY(0%)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default Loader;


