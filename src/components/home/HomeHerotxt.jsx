import React from "react";
import Video from "./Video";
import { IoPlayForward } from "react-icons/io5";
import { Link } from "react-router-dom"; // ✅ import Link


const HomeHerotxt = () => {
  return (
    <div className="text-center lg:mt-0  mt-70 font-[manrope1] mr-3.5 top-3.5">
      <div className=" uppercase lg:text-[9vw]  text-[11vw] lg:leading-[7.5vw]  leading-[10vw] ">
        Welcome
      </div>
      <div className=" uppercase lg:text-[9vw] text-[11vw] lg:leading-[7.5vw] leading-[10vw] flex items-center justify-center">
        to
        <div className="h-[7vw] w-[100px] lg:w-[230px] rounded-full border-1 overflow-hidden flex items-center justify-center bg-none">
          <Link to="/projects"> {/* 👈 Replace '/about' with your desired route */}
            <span className="text-white text-[9vw]">
              <IoPlayForward />
            </span>
          </Link>
        </div>
        my
      </div>

      <div className=" uppercase lg:text-[9vw] text-[11vw]  lg:leading-[7.5vw] leading-[10vw] ">
        Portfolio
      </div>
    </div>
  );
};

export default HomeHerotxt;
