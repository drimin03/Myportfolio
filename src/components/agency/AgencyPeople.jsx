import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const PersonItem = ({ person, index, hoveredIndex, onHover, onLeave, image }) => {
  const overlayRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;

    if (hoveredIndex === index) {
      // Animate overlay down when hovered
      gsap.to(overlay, {
        y: "0%",
        duration: 0.1,
        ease: "power1.out",
      });
    } else {
      // Animate overlay back up when not hovered
      gsap.to(overlay, {
        y: "-100%",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [hoveredIndex, index]);

  // Initial setup
  useEffect(() => {
    gsap.set(overlayRef.current, { y: "-100%" });
  }, []);

  return (
    <div
      className="relative flex justify-between items-center border-t border-gray-600 px-6 py-6 overflow-hidden cursor-pointer"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      {/* Hover overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-orange-600"></div>

      {/* Desktop layout - unchanged */}
      <span className="text-sm font-[manrope5] relative z-10 hidden md:block">{person.role}</span>
      <span className="text-lg font-[manrope3] relative z-10 hidden md:block">{person.name}</span>
      
      {/* Mobile layout - name and title on left, image on right */}
      <div className="flex flex-col items-start relative z-10 md:hidden normal-case">
        <span className="text-lg font-[manrope5]">{person.name}</span>
        <span className="text-sm font-[manrope3]">{person.role}</span>
      </div>
      
      {/* Mobile preview image */}
      {isMobile && (
        <div className="ml-4 flex-shrink-0 relative z-10 md:hidden">
          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg">
            <img
              src={image}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AgencyPeople = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  const people = [
    { role: "Founder & Ui Designer", name: "Dhruval" },
    { role: "App Developer", name: "Krupa" },
    { role: "Software Developer", name: "Vedant" },
    { role: "DevOps Engineer", name: "Ayush" },
    { role: "Full Stack Web Developer", name: "Jeet" },
    { role: "Frontend Developer", name: "Anushka" },
  ];

  const images = [
    "/assets/Team/imagenew.jpg",
      "/assets/Team/image1.jpg",
      "/assets/Team/team3.jpg",
      "/assets/Team/team4.jpg",
      "/assets/Team/team5.jpg",
      "/assets/Team/team6.jpg",
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate image reveal
  useEffect(() => {
    if (isMobile) return; // Skip animation on mobile

    const img = imageRef.current;
    const overlay = overlayRef.current;

    if (hoveredIndex !== null && img && overlay) {
      gsap.set(overlay, { x: "0%" });

      gsap.fromTo(
        img,
        { opacity: 0 },
        {
          opacity: 1,
          
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Curtain reveal
      gsap.to(overlay, {
        x: "100%",
        duration: 0.7,
        ease: "power4.inOut",
      });
    } else if (img) {
      // Hide image smoothly when leaving
      gsap.to(img, {
        opacity: 0,
        duration: 0.3,
        ease: "power4.inOut",
      });
    }
  }, [hoveredIndex, isMobile]);

  const handleHover = (index) => setHoveredIndex(index);
  const handleLeave = () => setHoveredIndex(null);

  return (
    <div className="relative bg-black text-white font-[manrope2] w-full mt-[30vh] ">
      {/* Pinned Image with left-to-right reveal - Desktop Only */}
      {!isMobile && (
        <div
          ref={imageWrapperRef}
          className="absolute inset-0 flex justify-center items-center z-50 pointer-events-none"
        >
          {hoveredIndex !== null && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-[80vh]">
              <img
                key={hoveredIndex}
                ref={imageRef}
                src={images[hoveredIndex % images.length]}
                alt="Person"
                className="max-h-[50vh] object-contain opacity-0"
              />
              {/* Overlay for reveal */}
              <div ref={overlayRef} className="absolute inset-0 bg-black"></div>
            </div>
          )}
        </div>
      )}

      {/* People List */}
      <div className="relative z-10 uppercase">
        {people.map((person, index) => (
          <PersonItem
            key={index}
            person={person}
            index={index}
            hoveredIndex={hoveredIndex}
            onHover={handleHover}
            onLeave={handleLeave}
            image={images[index % images.length]}
          />
        ))}
        <div className="border-t border-gray-600"></div>
      </div>
    </div>
  );
};

export default AgencyPeople;