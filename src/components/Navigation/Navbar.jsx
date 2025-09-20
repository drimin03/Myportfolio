import React, { useContext, useRef, useEffect } from "react";
import { NavbarColorContext, NavbarContext } from "../../Context/NavContext";
import gsap from "gsap";

const Navbar = () => {
  const navGreenRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);

  const [navOpen, setNavOpen] = useContext(NavbarContext);
  const [navColor] = useContext(NavbarColorContext);

  // Set initial state for lines to be visible
  useEffect(() => {
    gsap.set([topLineRef.current, bottomLineRef.current], {
      opacity: 1,
      x: 0
    });
  }, []);

  // Animate in with stagger
  const handleMouseEnter = () => {
    gsap.to(navGreenRef.current, {
      height: "100%",
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.fromTo(
      [topLineRef.current, bottomLineRef.current],
      { x: 20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out",
      }
    );
  };

  // Animate out
  const handleMouseLeave = () => {
    gsap.to(navGreenRef.current, {
      height: "0%",
      duration: 0.4,
      ease: "power3.inOut",
    });

    gsap.to([topLineRef.current, bottomLineRef.current], {
      x: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.25,
      ease: "power2.in",
    });
  };

  return (
    <div className="z-[9998] flex fixed top-0 w-full items-center justify-between lg:h-16 h-12">
      {/* Logo */}
      <div className="flex items-center h-full lg:pl-5 pl-2">
        <div className="lg:w-46 w-24 h-full flex items-center">
          <img 
            src="/logo2.svg"
            alt="Logo"
            className="w-full h-auto object-contain"
            style={{
              filter: navColor === 'white'
                ? 'brightness(0) saturate(100%) invert(1)' 
                : 'brightness(0) saturate(100%)'
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div
        onClick={() => {
          setNavOpen(true);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="lg:h-16 h-12 bg-black relative lg:w-[16vw] w-36 cursor-pointer"
      >
        {/* Animated background */}
        <div
          ref={navGreenRef}
          className="bg-orange-500 absolute top-0 h-0 w-full"
        ></div>

        {/* Lines */}
        <div className="relative text-amber-50 h-full lg:px-12 px-8 flex flex-col justify-center items-end lg:gap-1.5 gap-0.5">
          <div ref={topLineRef} className="lg:w-18 w-12 h-0.5 bg-white"></div>
          <div ref={bottomLineRef} className="lg:w-10 w-6 h-0.5 bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;