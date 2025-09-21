import React from 'react'
import { Link } from 'react-router-dom'

const HomeBottomtxt = () => {
  return (
    <div className='font-[manrope2] flex flex-row items-center justify-center gap-4 sm:gap-3 px-6'>
      <Link 
        to='/projects' 
        className='text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[5vw] xl:text-[4vw] 
                   hover:border-orange-400 hover:text-orange-400 
                   leading-tight py-1 sm:py-1 lg:py-1 
                   border-2 border-white rounded-full 
                   px-6 sm:px-8 lg:px-10 
                   uppercase 
                   transition-all duration-300 
                   min-w-fit
                   text-center
                   flex-shrink-0'>
        Projects
      </Link>
      <Link 
        to='/aboutus' 
        className='text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[5vw] xl:text-[4vw] 
                   hover:border-orange-400 hover:text-orange-400 
                   leading-tight py-1 sm:py-1 lg:py-1 
                   border-2 border-white rounded-full 
                   px-6 sm:px-8 lg:px-10 
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
