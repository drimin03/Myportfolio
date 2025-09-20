// Updated src/pages/Projects.jsx
import React, { useEffect, useState } from "react";
import ProjectsCard from "../components/projects/ProjectsCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Lenis from "@studio-freight/lenis";
import projectsData from "../new.json";
import Loader from "../components/Loader"; // ✅ Add Loader
import { useRoutePreloader } from "../hooks/useCriticalImages"; // ✅ Add route preloader

const Projects = () => {
  // ✅ Add loading states
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // ✅ Collect all project images for preloading
  const allProjectImages = projectsData.flatMap(project => [
    project.displayImage,
    ...project.images.slice(0, 2) // Load first 2 images from each project
  ]);

  // ✅ Preload project images
  useRoutePreloader(allProjectImages, 'high');

  // ✅ Prevent scroll when loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  // ✅ Handle load completion
  const handleLoadComplete = () => {
    setLoading(false);
    setTimeout(() => {
      setShowContent(true);
      ScrollTrigger.refresh();
    }, 100);
  };

  // Pair up projects for the two-card layout
  const pairedProjects = [];
  for (let i = 0; i < projectsData.length; i += 2) {
    pairedProjects.push({
      project1: projectsData[i],
      project2: i + 1 < projectsData.length ? projectsData[i + 1] : null,
    });
  }

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // ✅ Only initialize Lenis after content is shown
    if (!showContent) return;

    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, [showContent]); // ✅ Depend on showContent

  useGSAP(() => {
    // ✅ Only run animations after content is shown
    if (!showContent) return;

    if (window.innerWidth >= 1024) {
      gsap.fromTo(
        ".hero",
        { height: "100px" },
        {
          height: "400px",
          stagger: { amount: 0.5 },
          scrollTrigger: {
            trigger: ".lol",
            markers: false,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          }
        }
      );
    }
  }, [showContent]); // ✅ Depend on showContent

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* ✅ Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <Loader
            images={allProjectImages.slice(0, 10)} // Load first 10 images for loader
            projectName="Projects"
            projectType="Loading Projects"
            onLoadComplete={handleLoadComplete}
          />
        </div>
      )}

      {/* ✅ Main content with fade-in */}
      <div
        className={`transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-2 mb-[20vh]">
          {/* Section Title */}
          <div className="pt-[40vh]">
            <h2 className="font-[manrope1] text-black uppercase text-[9vw]">
              Projects
            </h2>
          </div>

          {/* Projects Grid */}
          <div className="lg:-mt-5 lol">
            {pairedProjects.map((pair, idx) => (
              <div
                key={idx}
                className="hero w-full h-auto lg:h-[400px] mb-2 overflow-hidden"
              >
                <ProjectsCard 
                  project1={pair.project1} 
                  project2={pair.project2} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;