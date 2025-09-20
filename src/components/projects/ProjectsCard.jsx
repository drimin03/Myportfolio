import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectsCard = (props) => {
  const navigate = useNavigate();

  // Helper to format date to YYYY (can extend for full date if needed)
  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 4) : "N/A";
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-4">
      {/* Project 1 */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div
          className="relative group overflow-hidden rounded-none hover:rounded-3xl transition-all cursor-pointer"
          onClick={() => navigate(`/portfolio/${props.project1?.id}`)}
        >
          <img
            className="object-cover w-full h-64 lg:h-full"
            src={props.project1?.displayImage || "/assets/placeholder.png"}
            alt={props.project1?.name || "Project"}
          />

          {/* Overlay text for large screens */}
          <div className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all absolute top-0 left-0 w-full h-full bg-black/60 items-end justify-between p-6">
            <h2 className="text-xl font-[manrope4] text-white">
              {props.project1?.name || "Project"}
            </h2>
            <span className="text-black text-sm font-[manrope4] uppercase bg-white px-3 py-1 rounded-full absolute top-6 right-6">
              {props.project1?.type || "N/A"}
            </span>
            <div className="text-white border border-white rounded-full p-2 cursor-pointer hover:bg-white/20 transition-colors">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        {/* Always visible text on small screens */}
        <div className="block text-black uppercase lg:hidden bg-white p-3 mt-2 shadow">
          <h2 className="text-lg font-semibold">{props.project1?.name || "Project"}</h2>
          <p className="text-sm text-gray-500">{formatDate(props.project1?.date)}</p>
        </div>
      </div>

      {/* Project 2 (conditionally render if exists) */}
      {props.project2 && (
        <div className="w-full lg:w-1/2 flex flex-col">
          <div
            className="relative group overflow-hidden rounded-none hover:rounded-3xl transition-all cursor-pointer"
            onClick={() => navigate(`/portfolio/${props.project2?.id}`)}
          >
            <img
              className="object-cover w-full h-64 lg:h-full"
              src={props.project2?.displayImage || "/assets/placeholder.png"}
              alt={props.project2?.name || "Project"}
            />

            {/* Overlay text for large screens */}
            <div className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all absolute top-0 left-0 w-full h-full bg-black/60 items-end justify-between p-6">
              <h2 className="text-xl font-[manrope4] text-white">
                {props.project2?.name || "Project"}
              </h2>
              <span className="text-black text-sm font-[manrope4] uppercase bg-white px-3 py-1 rounded-full absolute top-6 right-6">
                {props.project2?.type || "N/A"}
              </span>
              <div className="text-white border border-white rounded-full p-2 cursor-pointer hover:bg-white/20 transition-colors">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          {/* Always visible text on small screens */}
          <div className="block text-black uppercase lg:hidden bg-white p-3 mt-2 shadow">
            <h2 className="text-lg font-semibold">{props.project2?.name || "Project"}</h2>
            <p className="text-sm text-gray-500">{formatDate(props.project2?.date)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsCard;