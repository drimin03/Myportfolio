import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { ScrollTrigger } from "gsap/all"

const AgencyCard = () => {
  gsap.registerPlugin(ScrollTrigger)

  const sectionRef = useRef(null)
  const cardContainerRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const topRightTextRef = useRef(null)
  const bottomLeftTextRef = useRef(null)

  // Track animation states
  const animationState = useRef({
    hasStacked: false,
    isAnimating: false
  })

  useGSAP(() => {
    // Background color transition
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onEnter: () => gsap.to("body", { backgroundColor: "#000000", duration: 0.8 }),
        onLeave: () => gsap.to("body", { backgroundColor: "#ffffff", duration: 0.8 }),
        onEnterBack: () => gsap.to("body", { backgroundColor: "#000000", duration: 0.8 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#ffffff", duration: 0.8 }),
      },
    })

    // Cards initial positions
    gsap.set(card1Ref.current, { y: 0, zIndex: 1 })
    gsap.set(card2Ref.current, { y: "100%", zIndex: 2 })

    // Initial text setup - first text visible, second text hidden
    gsap.set(topRightTextRef.current, { opacity: 1, y: 0 })
    gsap.set(bottomLeftTextRef.current, { opacity: 0, y: 20 })

    // Check if mobile device
    const isMobile = window.innerWidth < 640

    // Get responsive start position based on screen size
    const getStartPosition = () => {
      const width = window.innerWidth
      if (width < 640) return "top 40%" // Mobile - more space
      if (width < 1024) return "top 20%" // Tablet - medium space  
      return "top top" // Desktop - original position
    }

    // Pin card1 and animate card2 stacking
    gsap.fromTo(
      card2Ref.current,
      { y: "100%" },
      {
        y: "0%",
        ease: isMobile ? "power2.inOut" : "none", // Smooth ease for mobile, linear for desktop
        scrollTrigger: {
          trigger: cardContainerRef.current,
          start: getStartPosition(),
          end: isMobile ? "+=100%" : "+=200%", // Shorter scroll distance on mobile for quick swap
          scrub: isMobile ? 0.5 : 1.2, // Less scrub on mobile for snappier feel
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          anticipatePin: 1,
          
          onUpdate: (self) => {
            const progress = self.progress
            
            // On mobile, use a quicker transition point (30%) to avoid jitter
            const transitionPoint = isMobile ? 0.3 : 0.5

            // Smooth transition
            if (progress >= transitionPoint && !animationState.current.hasStacked && !animationState.current.isAnimating) {
              animationState.current.hasStacked = true
              animationState.current.isAnimating = true

              // Simple fade and slide transition
              gsap.to(topRightTextRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                onComplete: () => {
                  gsap.to(bottomLeftTextRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    onComplete: () => {
                      animationState.current.isAnimating = false
                    }
                  })
                }
              })
            } 
            // Reverse animation
            else if (progress < transitionPoint && animationState.current.hasStacked && !animationState.current.isAnimating) {
              animationState.current.hasStacked = false
              animationState.current.isAnimating = true

              gsap.to(bottomLeftTextRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                onComplete: () => {
                  gsap.to(topRightTextRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    onComplete: () => {
                      animationState.current.isAnimating = false
                    }
                  })
                }
              })
            }
          },
          
          refreshPriority: -1,
        },
      }
    )
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Top Left Text - Responsive positioning */}
      <div
        ref={topRightTextRef}
        className="absolute top-16 left-4 sm:top-20 sm:left-6 lg:top-80 lg:left-8 z-30 text-white font-sans text-left"
        style={{ willChange: 'opacity, transform' }}
      >
        <h2 className="title text-xl sm:text-2xl lg:text-4xl mb-1 sm:mb-2 leading-tight">KRUPA.A.PATEL</h2>
        <p className="designation uppercase text-xs sm:text-sm lg:text-base font-light opacity-70">App Developer</p>
      </div>

      {/* Bottom Right Text - Moved further down on small screens, unchanged on large screens */}
      <div
        ref={bottomLeftTextRef}
        className="absolute bottom-3 right-4 sm:bottom-20 sm:right-6 lg:bottom-60 lg:right-8 z-30 text-white font-sans text-right"
        style={{ willChange: 'opacity, transform' }}
      >
        <h2 className="title text-xl sm:text-2xl lg:text-4xl mb-1 sm:mb-2 leading-tight">DHRUVAL.A.PATEL</h2>
        <p className="designation uppercase text-xs sm:text-sm lg:text-base opacity-70">UI Designer / Founder</p>
      </div>

      {/* Card Container (pinned) - Better spacing and positioning for mobile */}
      <div 
        ref={cardContainerRef} 
        className="relative z-10 w-64 h-80 sm:w-72 sm:h-96 lg:w-90 lg:h-[90vh] mt-16 sm:mt-8 lg:mt-0"
        style={{ willChange: 'transform' }}
      >
        {/* Card 1 */}
        <div 
          ref={card1Ref} 
          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <img
            src="/assets/Team/image1.jpg"
            alt="Card 1"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card 2 */}
        <div 
          ref={card2Ref} 
          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <img
            src="/assets/Team/imagenew.jpg"
            alt="Card 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default AgencyCard