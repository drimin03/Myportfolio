import { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import React from "react";
import CircularText from "../components/text/CircularText";
import PortfolioSection from "../components/projects/PortfolioSection";
import MoreProjects from "../components/common/MoreProjects";
import Loader from "../components/Loader";
import projectsData from "../data/projectsData.js";
import { NavbarColorContext } from "../context/NavContext.jsx";

gsap.registerPlugin(ScrollTrigger);

function Portfolio() {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === parseInt(id));
  const [navColor, setNavColor] = useContext(NavbarColorContext);

  if (!project) {
    return (
      <div className="bg-gray-100 text-black min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Project not found</h1>
      </div>
    );
  }

  const imageRef = useRef([]);
  const imageContainerRef = useRef(null);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Control nav color based on loading state
  useEffect(() => {
    if (loading) {
      setNavColor('white'); // White logo on black loader background
    } else {
      setNavColor('black'); // Black logo on gray portfolio background
    }
  }, [loading, setNavColor]);

  // Prevent scroll when loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); // force start at top
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  // Extend images to exactly 7 by cycling if necessary
  // const extendedImages = [...project.images];
  // while (extendedImages.length < 7) {
  //   extendedImages.push(...project.images.slice(0, 7 - extendedImages.length));
  // }
  // extendedImages.length = 7;
  const extendedImages = project.images;


  // Handle loading completion
  const handleLoadComplete = () => {
    setLoading(false);
    setTimeout(() => {
      setShowContent(true);
      ScrollTrigger.refresh();
    }, 100);
  };

  // Create image sections
  const imageSection = extendedImages.map((img, i) => (
    <div
      key={i}
      className="w-[85vw] h-[45vh] xs:h-[55vh] md:w-screen md:h-[95vh] mt-6 shrink-0 rounded-2xl overflow-hidden"
      ref={(ref) => (imageRef.current[i] = ref)}
    >
      <img src={img} className="w-full h-full object-cover" alt={`panel-${i + 1}`} />
    </div>
  ));

  // Horizontal scroll
  useGSAP(
    () => {
      if (!showContent) return;

      const panels = imageRef.current.filter(Boolean);
      const container = imageContainerRef.current;
      if (!container || panels.length === 0) return;

      const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;

      if (isLargeScreen) {
        const totalScroll = container.scrollWidth - container.clientWidth;

        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top -=2%",
            end: `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
            invalidateOnRefresh: true,
            snap: 1 / (panels.length - 1),
          },
        });
      }
    },
    { scope: imageContainerRef, dependencies: [showContent] }
  );

  // Format team
  const teamString = project.team.join(", ");
  const formattedDate = project.date.split("T")[0];

  return (
    <div className="bg-gray-100 text-black min-h-screen w-full overflow-hidden">
      {/* Loader always fullscreen & blocks scroll */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
          <Loader
            images={extendedImages}
            projectName={project.name}
            projectType={project.type}
            onLoadComplete={handleLoadComplete}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* INTRO SECTION */}
        <div className="mt-50 relative flex gap-3 px-6 md:px-10 h-[40vh] md:h-[50vh] bg-gray-100">
          <div className="flex flex-col justify-end items-start h-full w-full md:w-1/2 relative pb-6">
            <label className="font-[manrope4] text-[4vh] md:text-[6vh]">
              {project.type}
            </label>
            <h2 className="font-[manrope5] uppercase text-[12vw] md:text-[13vw] tracking-tight leading-none whitespace-nowrap">
              {project.name.split(" ").map((word, i) => (
                <React.Fragment key={i}>
                  {word}
                  <br />
                </React.Fragment>
              ))}
            </h2>
          </div>
        </div>

        {/* HORIZONTAL SCROLL SECTION */}
        <div className="bg-black w-full overflow-hidden">
          <section className="min-h-screen relative flex justify-center items-center">
            <h1 className="absolute top-5 left-5 text-white text-[12px] md:text-[16px] font-[manrope4] w-[40%] md:w-[45%] pr-2">
              {project.description}
            </h1>
            <div className="absolute top-5 right-5 text-white text-[12px] md:text-[16px] font-[manrope4] w-[40%] md:w-[45%] text-right pl-2">
              {project.type}
            </div>
            <div className="flex justify-center items-center">
              <CircularText
                text="VIEW*PROJECT*SCROLL*DOWN*"
                onHover="speedUp"
                spinDuration={20}
                className="w-[120px] h-[120px] md:w-[200px] md:h-[200px]"
              />
            </div>
            <h1 className="absolute bottom-5 left-5 text-white text-[12px] md:text-[16px] font-[manrope4]">
              {teamString}
            </h1>
            <div className="absolute bottom-5 right-5 text-white text-[12px] md:text-[16px] font-[manrope4]">
              {formattedDate}
            </div>
          </section>

          <section
            className="min-h-screen flex flex-col md:flex-row md:flex-nowrap items-center space-y-6 md:space-y-0 md:space-x-6 md:px-20 overflow-hidden"
            ref={imageContainerRef}
          >
            {imageSection}
          </section>

          {/* THANK YOU SECTION */}
          <PortfolioSection />

          {/* MORE PROJECTS SECTION */}
          <div className="bg-black px-0 md:px-10 pb-20">
            <MoreProjects projects={projectsData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;