// src/components/MoreProjects.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";

const MoreProjects = ({ projects = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // current project id
  const carouselRef = useRef(null);

  // Filter out current project safely
  const filteredProjects =
    projects?.filter((p) => String(p.id) !== String(id))?.slice(0, 3) || []; // only 3 cards

  useEffect(() => {
    if (!carouselRef.current || filteredProjects.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".project-card");
      if (cards.length === 0) return;

      // Infinite smooth horizontal scrolling
      gsap.to(cards, {
        xPercent: -100 * (cards.length / 2),
        duration: 25,
        repeat: -1,
        ease: "linear",
        modifiers: {
          xPercent: gsap.utils.wrap(-100 * cards.length, 0),
        },
      });
    }, carouselRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  if (filteredProjects.length === 0) return null;

  return (
    <div className="w-full bg-white py-5 px-0 mt-12 shadow-lg  rounded-xl sm:rounded-none ">
      <h2 className="text-2xl font-[manrope4] px-5 text-black mb-6">
        More Projects
      </h2>
      <div ref={carouselRef} className="flex gap-8 overflow-hidden relative">
        {[...filteredProjects, ...filteredProjects].map((project, i) => (
          <div
            key={project.id + "-" + i}
            className="project-card min-w-[250px] max-w-[300px] sm:min-w-[280px] sm:max-w-[320px] md:min-w-[420px] md:max-w-[460px] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white"
            onClick={() => navigate(`/portfolio/${project.id}`)}
          >
            <div className="relative">
              <img
                src={project.displayImage || "/assets/placeholder.png"}
                alt={project.name}
                className="object-cover w-full h-40 sm:h-48 md:h-64"
              />
            </div>
            <div className="p-3 sm:p-4 md:p-5 bg-white">
              <h3 className="text-sm sm:text-base md:text-lg font-[manrope4] text-black">
                {project.name}
              </h3>
              <p className="text-xs uppercase text-gray-500">{project.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreProjects;