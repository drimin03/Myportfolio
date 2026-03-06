import React from 'react'
import { Link } from 'react-router-dom'

const HomeBottomtxt = () => {
  return (
    <div className='font-[manrope2] flex flex-row items-center justify-center gap-4 sm:gap-3 px-6 relative z-50 pointer-events-auto'>
      <Link 
        to='/projects' 
        className='text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[5vw] xl:text-[4vw] 
                   leading-tight py-2 sm:py-2 lg:py-2 
                   /* Glass Effect Classes Below */
                   bg-white/10 backdrop-blur-md
                   max-sm:bg-white/25 max-sm:shadow-[0_0_20px_rgba(255,255,255,0.25)]
                   rounded-full px-6 sm:px-8 lg:px-10 
                   uppercase transition-all duration-300 
                   min-w-fit text-center flex-shrink-0 pointer-events-auto
                   text-white hover:text-orange-800 hover:bg-white/20 
                   shadow-lg relative z-50'>
        Projects
      </Link>
      
      <Link 
        to='/aboutus' 
        className='text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[5vw] xl:text-[4vw] 
                   leading-tight py-2 sm:py-2 lg:py-2 
                   /* Glass Effect Classes Below */
                   bg-white/10 backdrop-blur-md
                   max-sm:bg-white/25 max-sm:shadow-[0_0_20px_rgba(255,255,255,0.25)]
                   rounded-full px-6 sm:px-8 lg:px-10 
                   uppercase transition-all duration-300 
                   min-w-fit text-center flex-shrink-0 pointer-events-auto
                   text-white hover:text-orange-800 hover:bg-white/20 
                   shadow-lg relative z-50'>
        About
      </Link>
    </div>
  )
}

export default HomeBottomtxt
