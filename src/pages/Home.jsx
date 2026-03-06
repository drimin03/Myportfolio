import React, { useEffect, useState } from "react";
import Ballpit from "../components/Ballpit";
import HomeHerotxt from "../components/home/HomeHerotxt";
import HomeBottomtxt from "../components/home/HomeBottomtxt";
import Loader from "../components/Loader";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ballCount, setBallCount] = useState(120);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const getCount = () => {
      if (typeof window === "undefined") return 120;
      const width = window.innerWidth;
      if (width <= 640) return 25;
      if (width <= 1024) return 80;
      return 120;
    };

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsSmallScreen(window.innerWidth <= 640);
      }
      setBallCount(getCount());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isLoaded && (
        <Loader
          videos={["/videos/video.mp4"]}
          minDurationMs={5000}
          onLoadComplete={() => setIsLoaded(true)}
        />
      )}

      {isLoaded && (
        <div className="relative">
          {/* Ballpit background */}
          <div className="h-screen w-screen fixed bg-black z-0 pointer-events-none">
            <Ballpit
              className="h-full w-full pointer-events-none"
              followCursor={!isSmallScreen}
              enableTouch={!isSmallScreen}
              enablePointer={!isSmallScreen}
              count={ballCount}
              colors={[0xff5900, 0xff5900, 0xe9e9e9]}
              ambientIntensity={0.6}
              lightIntensity={110}
              materialParams={{
                metalness: 0.15,
                roughness: 0.35,
                clearcoat: 1,
                clearcoatRoughness: 0.2
              }}
            />
          </div>

          {/* Content Layer */}
          <div className="h-screen w-screen relative flex flex-col justify-between z-10 pointer-events-auto">
            {/* Hero Title */}
            <HomeHerotxt />

            {/* Side-aligned paragraph */}
            <div className="flex justify-end pr-8 relative z-[15]">
              <div className="max-w-[320px]">
                <p className="text-white lg:text-gray-300 text-[12px] lg:text-[12px] leading-relaxed manrope1 opacity-90">
                  "Turning ideas into bold, unforgettable designs. At Drimin
                  Design, we craft brands, websites, and digital experiences
                  that captivate, inspire, and make your vision a reality."
                </p>
              </div>
            </div>

            {/* Bottom centered navigation buttons */}
            <div className="flex justify-center pb-6">
              <HomeBottomtxt />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
