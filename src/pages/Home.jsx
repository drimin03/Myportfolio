import React, { useState } from "react";
import Ballpit from "../components/Ballpit";
import HomeHerotxt from "../components/home/HomeHerotxt";
import HomeBottomtxt from "../components/home/HomeBottomtxt";
import Loader from "../components/Loader";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
          <div className="h-screen w-screen fixed bg-black z-0">
            <Ballpit
              className="h-full w-full"
              followCursor
              count={120}
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
          <div className="h-screen w-screen relative flex flex-col justify-between z-10">
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
