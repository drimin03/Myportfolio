import React from 'react'
import { ArrowDown } from "lucide-react";

function PortfolioSection() {
  return (
    <div>
      <section className="min-h-screen w-full flex flex-col justify-center items-center gap-[2vh] bg-black">
          <h2 className="text-[8vw] font-[manrope4] text-center whitespace-nowrap text-white leading-tight md:leading-25">
            THANK YOU FOR WAITING
            <br />
            TILL THE LAST SLIDE{" "}
          </h2>
          <div>
            <label className="flex items-center gap-2 text-white mt-25 border-2 border-solid border-white p-3.5 rounded-xl cursor-pointer hover:bg-white hover:text-black transition-all duration-300 font-[manrope4]">
              MORE PROJECTS HERE
              <ArrowDown size={20} />
            </label>
          </div>
        </section>
    </div>
  )
}

export default PortfolioSection