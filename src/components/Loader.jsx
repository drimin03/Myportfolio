import { useState, useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from 'motion/react';
import imageCache from '../utils/ImageCache';

// CountUp Component
function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = num => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };
  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === 'down' ? to : from);
    }
  }, [from, to, direction]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') onStart();
      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);
      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === 'function') onEnd();
      }, delay * 1000 + duration * 1000);
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', latest => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0
        };
        const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
        ref.current.textContent = separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
      }
    });
    return () => unsubscribe();
  }, [springValue, separator, maxDecimals]);

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

  // Prevent scrolling when loader is active
  useEffect(() => {
    document.body.style.overflow = showMoveUp ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMoveUp]);

  // Start the CountUp animation immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartCountUp(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced image preloading with global cache
  useEffect(() => {
    if (images.length === 0) {
      setLoadingComplete(true);
      return;
    }

    const loadImages = async () => {
      try {
        // Check how many images are already cached
        const uncachedImages = images.filter(url => !imageCache.isImageCached(url));
        const alreadyCached = images.length - uncachedImages.length;
        
        console.log(`Loading images: ${alreadyCached} already cached, ${uncachedImages.length} to load`);
        
        if (uncachedImages.length === 0) {
          // All images already cached!
          setLoadingProgress(100);
          setLoadingComplete(true);
          return;
        }

        // Set initial progress for already cached images
        if (alreadyCached > 0) {
          const initialProgress = (alreadyCached / images.length) * 100;
          setLoadingProgress(initialProgress);
        }

        // Load remaining images with progress tracking
        await imageCache.preloadImages(uncachedImages, (loaded, failed, total) => {
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
  }, [images]);

  // Handle completion - wait for both CountUp and images
  const handleCountUpEnd = () => {
    const checkCompletion = () => {
      if (loadingComplete) {
        setTimeout(() => {
          setShowMoveUp(true);
          setTimeout(() => {
            if (onLoadComplete) {
              onLoadComplete();
            }
          }, 1000);
        }, 500);
      } else {
        setTimeout(checkCompletion, 100);
      }
    };
    
    checkCompletion();
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black text-black h-screen w-screen transition-transform duration-1000 ease-in-out ${
        showMoveUp ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Loading Progress Counter */}
      <div className="pb-16">
        <div className="text-center">
          <CountUp
            from={0}
            to={100}
            duration={2}
            startWhen={startCountUp}
            className="font-[manrope4] text-8xl md:text-8xl font-bold text-white"
            onEnd={handleCountUpEnd}
          />
          

        </div>
      </div>
    </div>
  );
}

export default Loader;