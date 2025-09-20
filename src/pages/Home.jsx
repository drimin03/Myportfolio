import React, { useEffect } from "react";
import Video from "../components/home/Video";
import HomeHerotxt from "../components/home/HomeHerotxt";
import HomeBottomtxt from "../components/home/HomeBottomtxt";

const Home = () => {
  // Additional video optimization: Hint to browser about video importance
  useEffect(() => {
    // Set viewport meta for better mobile video performance
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    // Add performance hints for the video
    const performanceHint = document.createElement('link');
    performanceHint.rel = 'prefetch';
    performanceHint.href = '/videos/video.mp4';
    document.head.appendChild(performanceHint);

    return () => {
      if (document.head.contains(performanceHint)) {
        document.head.removeChild(performanceHint);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Fixed background video container */}
      <div className="h-screen w-screen fixed bg-black z-0">
        <Video />
      </div>
      
      {/* Content overlay */}
      <div className="h-screen w-screen relative pb-5 flex flex-col justify-between z-10">
        <HomeHerotxt />
        
        {/* Description text with better positioning */}
        <div className="pl-[50%] relative z-[15]">
          <p className="text-white lg:text-gray-300 text-[10px] lg:text-[15px] manrope1 mr-10 transition-opacity duration-1000 ease-in-out">
            "Turning ideas into bold, unforgettable designs. At Drimin Design,
            we craft brands, websites, and digital experiences that captivate,
            inspire, and make your vision a reality."
          </p>
        </div>
        
        <HomeBottomtxt />
      </div>
    </div>
  );
};

export default Home;