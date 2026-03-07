// Updated src/pages/Projects.jsx - WITH FILTER TABS
import React, { useEffect, useState } from "react";
import ProjectsCard from "../components/projects/ProjectsCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import projectsData from "../data/projectsData.js";
import { useRoutePreloader } from "../hooks/useCriticalImages";

const Projects = () => {
  const [showContent, setShowContent] = useState(false);
  
  // ✅ NEW: Filter state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ NEW: Get unique categories from projectsData
  const categories = ["All", ...new Set(projectsData.map(project => project.type))];

  // ✅ NEW: Filter projects based on selected category
  const filteredProjects = selectedCategory === "All" 
    ? projectsData 
    : projectsData.filter(project => project.type === selectedCategory);

  // Collect all project images for preloading
  const allProjectImages = projectsData.flatMap(project => [
    project.displayImage,
    ...project.images.slice(0, 2)
  ]);

  // Preload project images
  useRoutePreloader(allProjectImages, 'high');

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  // ✅ UPDATED: Pair up FILTERED projects for the two-card layout
  const pairedProjects = [];
  for (let i = 0; i < filteredProjects.length; i += 2) {
    pairedProjects.push({
      project1: filteredProjects[i],
      project2: i + 1 < filteredProjects.length ? filteredProjects[i + 1] : null,
    });
  }

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
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
  }, [showContent]);

  useGSAP(() => {
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
  }, [showContent]);

  // ✅ NEW: Refresh ScrollTrigger when category changes
  useEffect(() => {
    if (showContent) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [selectedCategory, showContent]);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Main content with fade-in */}
      <div
        className={`transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-2 mb-[20vh]">
          {/* Section Title */}
          <div className="pt-[40vh]">
            <h2 className="font-[manrope5] text-black uppercase text-[9vw]">
              Projects
            </h2>
          </div>

          {/* ✅ NEW: Filter Tabs */}
          <div className="mt-8 mb-12 flex flex-wrap gap-3 px-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-[manrope4] text-sm uppercase transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="lg:-mt-5 lol">
            {pairedProjects.length > 0 ? (
              pairedProjects.map((pair, idx) => (
                <div
                  key={`${selectedCategory}-${idx}`}
                  className="hero w-full h-auto lg:h-[400px] mb-2 overflow-hidden"
                >
                  <ProjectsCard 
                    project1={pair.project1} 
                    project2={pair.project2} 
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg font-[manrope4]">
                  No projects found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
