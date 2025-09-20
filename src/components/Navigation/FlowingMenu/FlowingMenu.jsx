import React, { useState, useEffect } from "react";
import gsap from "gsap";

function FlowingMenu({ items = [] }) {
  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, hoverTexts = [] }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  React.useLayoutEffect(() => {
    if (marqueeRef.current && marqueeInnerRef.current) {
      gsap.set(marqueeRef.current, { y: "101%" });
      gsap.set(marqueeInnerRef.current, { y: "-101%" });
    }
  }, []);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if device supports hover (desktop) and screen is large enough
  const isHoverSupported = () => {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches && 
           window.innerWidth >= 768; // 768px = md breakpoint in Tailwind
  };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev) => {
    // Exit early if hover not supported or screen too small
    if (!isHoverSupported()) return;
    
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });
  };

  const handleMouseLeave = (ev) => {
    // Exit early if hover not supported or screen too small
    if (!isHoverSupported()) return;
    
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" });
  };

  // Prevent touch events from triggering hover on mobile
  const handleTouchStart = (ev) => {
    ev.preventDefault();
  };

  // Build marquee content: if hoverTexts are provided, loop them
  const marqueeWords = hoverTexts.length > 0 ? hoverTexts : [text];

  // Repeat many times so marquee looks infinite
  const repeatedMarqueeContent = Array.from({ length: 6 }).map((_, idx) => (
    <React.Fragment key={idx}>
      {marqueeWords.map((word, i) => (
        <span
          key={i}
          className="text-[#ffffff] uppercase font-[manrope1] leading-none px-2 sm:px-4 md:px-[1vw] text-4xl sm:text-6xl md:text-8xl lg:text-[12vh]"
        >
          {word}
        </span>
      ))}
      <div
        className={`flex-shrink-0 bg-cover bg-center mx-2 sm:mx-4 md:mx-[2vw] w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[200px] lg:h-[7vh] ${isMobile ? 'rounded-full' : 'rounded-[50px]'}`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </React.Fragment>
  ));

  return (
    <div
      className="relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff] h-16 sm:h-20 md:h-24 lg:h-24"
      ref={itemRef}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-[manrope1] text-white hover:text-[#060010] focus:text-white focus-visible:text-[#060010] transition-colors duration-300 text-2xl sm:text-4xl md:text-6xl lg:text-[12vh] leading-none px-4 sm:px-6 md:px-8"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        {text}
      </a>

      {/* White overlay that slides vertically via GSAP */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none bg-orange-500 will-change-transform"
        ref={marqueeRef}
      >
        <div
          className={`flex items-center h-full will-change-transform w-[400%] sm:w-[300%] md:w-[200%] ${!isMobile ? 'animate-marquee' : ''}`}
          ref={marqueeInnerRef}
        >
          {repeatedMarqueeContent}
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;