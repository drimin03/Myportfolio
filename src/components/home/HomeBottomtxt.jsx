import React from 'react'
import { Link } from 'react-router-dom'

const HomeBottomtxt = () => {
  return (
    <div className='font-[manrope2] flex flex-row items-center justify-center gap-3 sm:gap-2 px-4'>
      <Link 
        to='/projects' 
        className='text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] 
                   hover:border-orange-200 hover:text-orange-200 
                   leading-tight py-2 sm:py-1 lg:py-0 
                   border-2 border-white rounded-full 
                   px-4 sm:px-6 lg:px-6 
                   uppercase 
                   transition-all duration-300 
                   min-w-fit
                   text-center
                   flex-shrink-0 '>
        Projects
      </Link>
      <Link 
        to='/aboutus' 
        className='text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] 
                   hover:border-orange-200 hover:text-orange-200 
                   leading-tight py-2 sm:py-1 lg:py-0 
                   border-2 border-white rounded-full 
                   px-4 sm:px-6 lg:px-6 
                   uppercase 
                   transition-all duration-300 
                   min-w-fit
                   text-center
                   flex-shrink-0'>
        About
      </Link>
    </div>
  )
}

export default HomeBottomtxt