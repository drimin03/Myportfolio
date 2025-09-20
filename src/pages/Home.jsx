import React, { useState } from "react";
import Video from "../components/home/Video";
import HomeHerotxt from "../components/home/HomeHerotxt";
import HomeBottomtxt from "../components/home/HomeBottomtxt";
import Loader from "../components/Loader";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <Loader
          images={['/videos/video.mp4']} // pass video to loader
          onLoadComplete={() => setIsLoaded(true)}
        />
      )}

      {isLoaded && (
        <div className="relative">
          <div className="h-screen w-screen fixed bg-black z-0">
            <Video onReady={() => setIsLoaded(true)} /> {/* callback for video */}
          </div>

          <div className="h-screen w-screen relative pb-5 flex flex-col justify-between z-10">
            <HomeHerotxt />
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
      )}
    </>
  );
};

export default Home;
