"use client"

import FlowingMenu from "../Navigation/FlowingMenu/FlowingMenu"
import { useContext, useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { NavbarContext } from "../../context/NavContext"
import Lenis from "@studio-freight/lenis"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const FullScreenNav = ({ onClose }) => {
  const fullScreenRef = useRef(null)
  const [navOpen, setNavOpen] = useContext(NavbarContext)

  const demoItems = [
    { link: "/", text: "Home", hoverTexts: ["Desert", "Sunset", "Adventure"], image: "https://picsum.photos/600/400?random=1" },
    { link: "/aboutus", text: "About us", hoverTexts: ["Wine", "Nature", "Relax"], image: "https://picsum.photos/600/400?random=2" },
    { link: "/projects", text: "Projects", hoverTexts: ["Ocean", "Waves", "Peace"], image: "https://picsum.photos/600/400?random=3" },
    { link: "/contact", text: "Contact", hoverTexts: ["Connect", "Reach", "Collaborate"], image: "https://picsum.photos/600/400?random=4" },
  ]

  // 🚀 Setup Lenis once
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      lerp: 0.1,
      wheelMultiplier: 1,
    })

    function raf(time) {
      lenis.raf(time)
      ScrollTrigger.update() // keep GSAP in sync
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Animation functions
  function gsapAnimation() {
    const tl = gsap.timeline()
    tl.to(".fullscreennav", { display: "block", duration: 0 })
    tl.to(
      ".stairing",
      {
        height: "100%",
        duration: 0.8,
        ease: "power3.inOut",
        stagger: { amount: 0.4, from: "end" },
      },
      "+=0.1"
    )
    tl.to(
      ".nav-content",
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
  }

  function gsapAnimationReverse() {
    const tl = gsap.timeline()
    tl.to(".nav-content", { opacity: 0, duration: 0.4, ease: "power2.in" })
    tl.to(
      ".stairing",
      {
        height: 0,
        duration: 0.6,
        ease: "power3.inOut",
        stagger: { amount: 0.3, from: "start" },
      },
      "-=0.1"
    )
    tl.to(".fullscreennav", { display: "none", duration: 0 })
  }

  // GSAP animation trigger
  useGSAP(() => {
    if (navOpen) gsapAnimation()
    else gsapAnimationReverse()
  }, [navOpen])

  const handleClose = () => {
    setNavOpen(false)
    if (onClose) onClose()
  }

  return (
    <div
      ref={fullScreenRef}
      className="fullscreennav hidden text-orange-500 overflow-hidden h-screen w-full z-[9999] fixed top-0 left-0"
    >
      {/* Staircase Background */}
      <div className="h-screen w-full fixed bg-transparent">
        <div className="h-full w-full flex">
          <div className="stairing h-0 w-1/5 bg-black transform-gpu"></div>
          <div className="stairing h-0 w-1/5 bg-black transform-gpu"></div>
          <div className="stairing h-0 w-1/5 bg-black transform-gpu"></div>
          <div className="stairing h-0 w-1/5 bg-black transform-gpu"></div>
          <div className="stairing h-0 w-1/5 bg-black transform-gpu"></div>
        </div>
      </div>

      {/* Content */}
      <div className="nav-content opacity-0 bg-black font-[manrope] min-h-screen flex flex-col relative transform-gpu">
        {/* Top bar - Sticks at top */}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 fixed top-0 left-0 w-full z-50 bg-black">
          {/* Logo */}
          <div className="lg:w-46 w-24 h-full flex items-center">
            <img
              src="/logo1.svg"
              alt="Logo"
              className="h-10  sm:h-12 md:h-14 lg:h-16 object-contain"
              style={{ filter: "brightness(0) saturate(100%) invert(1)" }}
            />
          </div>

          {/* Cross Button */}
          <button
            onClick={handleClose}
            className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center cursor-pointer group"
          >
            <div className="absolute w-6 sm:w-8 md:w-12 lg:w-16 xl:w-20 h-[2px] sm:h-[3px] bg-white rotate-45 transition-colors duration-300 group-hover:bg-orange-500"></div>
            <div className="absolute w-6 sm:w-8 md:w-12 lg:w-16 xl:w-20 h-[2px] sm:h-[3px] bg-white -rotate-45 transition-colors duration-300 group-hover:bg-orange-500"></div>
          </button>
        </div>

        {/* Menu - sits below top bar */}
        <div className="flex-1 w-full overflow-y-auto mt-24 sm:mt-28 md:mt-32 lg:mt-36">
          <FlowingMenu items={demoItems} />
        </div>
      </div>
    </div>
  )
}

export default FullScreenNav
