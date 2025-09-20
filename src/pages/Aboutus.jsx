import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import AgencyFAQ from "../components/agency/AgencyFAQ";
import FallingText from "../components/text/FallingText";
import LogoLoop from "../components/Animations/LogoLoop/LogoLoop";
import Loader from "../components/Loader";

// Lazy load components
const AgencyCard = lazy(() => import("../components/agency/AgencyCard"));
const AgencyPeople = lazy(() => import("../components/agency/AgencyPeople"));

const ComponentLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const Aboutus = () => {
  gsap.registerPlugin(ScrollTrigger);
  const imageDivRef = useRef(null);
  const imageRef = useRef(null);
  const bodyRef = useRef(null);
  const lenisRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const imageArray = useMemo(
    () => [
      "/assets/Team/imagenew.jpg",
      "/assets/Team/image1.jpg",
      "/assets/Team/team3.jpg",
      "/assets/Team/team4.jpg",
      "/assets/Team/team5.jpg",
      "/assets/Team/team6.jpg",
    ],
    []
  );

  // Prevent scroll when loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  const handleLoadComplete = () => {
    setLoading(false);
    setTimeout(() => {
      setShowContent(true);
      ScrollTrigger.refresh();
    }, 100);
  };

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = imageArray.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [imageArray]);

  // IMPROVED LENIS CONFIGURATION
  useEffect(() => {
    if (!imagesLoaded || !showContent) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      lerp: 0.12, // ✅ Increased for more responsive stopping
      wheelMultiplier: 1.0, // ✅ Reduced wheel sensitivity
      touchMultiplier: 2,
      infinite: false,
      normalizeWheel: true, // ✅ Better cross-browser consistency
      smoothTouch: false, // ✅ Disable on touch for better mobile experience

      // ✅ CRITICAL: Reduce momentum/inertia
      damping: 0.1, // Reduces overshoot
      orientation: "vertical",
    });

    lenisRef.current = lenis;

    // ✅ IMPROVED RAF LOOP with throttling
    let rafId;
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    function raf(time) {
      if (time - lastTime >= frameTime) {
        lenis.raf(time);
        ScrollTrigger.update();
        lastTime = time;
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // ✅ STOP MOMENTUM ON USER INTERACTION
    const stopMomentum = () => {
      lenis.stop();
      setTimeout(() => lenis.start(), 100);
    };

    // Add event listeners to interrupt momentum
    window.addEventListener("wheel", stopMomentum, { passive: true });
    window.addEventListener("touchstart", stopMomentum, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", stopMomentum);
      window.removeEventListener("touchstart", stopMomentum);
      lenis.destroy();
    };
  }, [imagesLoaded, showContent]);

  // OPTIMIZED GSAP ANIMATIONS
  useGSAP(() => {
    if (!imagesLoaded || !showContent) return;

    gsap.set([".text-transition", bodyRef.current], {
      willChange: "transform, color, background-color",
    });

    let lastImageIndex = -1;

    // ✅ REDUCED SCRUB VALUES for less interference
    gsap.to(imageDivRef.current, {
      scrollTrigger: {
        trigger: imageDivRef.current,
        start: "top 10%",
        end: "top -90%",
        pin: true,
        pinSpacing: true,
        pinType: "transform",
        scrub: 0.3, // ✅ Reduced scrub for smoother stopping
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,

        // ✅ THROTTLED UPDATES
        onUpdate: (elem) => {
          const progress = Math.min(elem.progress, 0.999);
          const imageIndex = Math.floor(progress * imageArray.length);

          if (imageIndex !== lastImageIndex && imageRef.current) {
            lastImageIndex = imageIndex;
            setCurrentImageIndex(imageIndex);

            // Batch image updates
            requestAnimationFrame(() => {
              if (imageRef.current) {
                imageRef.current.src = imageArray[imageIndex];
              }
            });
          }
        },
      },
    });

    // ✅ IMPROVED COLOR TRANSITIONS with reduced scrub
    const colorTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".agency-card-trigger",
        start: "top 80%",
        end: "top 20%",
        scrub: 0.1, // ✅ Much lighter scrub
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
        refreshPriority: -1,
      },
    });

    colorTl
      .to(bodyRef.current, { backgroundColor: "#000000", duration: 0.1 }, 0)
      .to(".text-transition", { color: "#ffffff", duration: 0.1 }, 0);

    // ✅ SECTION SNAP POINTS (Optional - add if you want snap-to-section behavior)
    const sections = [".section1", ".section2", ".agency-card-trigger"];

    sections.forEach((selector, index) => {
      ScrollTrigger.create({
        trigger: selector,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          // Optional: Add visual feedback when entering sections
          console.log(`Entering section ${index + 1}`);
        },
        onLeave: () => {
          // Optional: Add section-leaving behavior
          console.log(`Leaving section ${index + 1}`);
        },
      });
    });
  }, [imagesLoaded, showContent, imageArray]);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <Loader
            images={imageArray}
            projectName="About Us"
            projectType="Loading Team"
            onLoadComplete={handleLoadComplete}
          />
        </div>
      )}

      <div
        className={`transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          ref={bodyRef}
          className="text-black transition-colors duration-300 ease-out"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="section1 min-h-screen relative">
            <div
              ref={imageDivRef}
              className="absolute overflow-hidden 
                 lg:h-[20vw] h-[35vw] 
                 lg:w-[15vw] w-[25vw] 
                 -top-[20vh] 
                 left-1/2 -translate-x-1/2  
                 rounded-3xl shadow-lg z-[5]"
            >
              <img
                ref={imageRef}
                className="h-full w-full object-cover"
                src={imageArray[0]}
                alt={`Team member ${currentImageIndex + 1}`}
                loading="eager"
                decoding="async"
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>

            <div className="relative font-[manrope1] z-[10]">
              <div className="mt-[55vh] relative z-[15]">
                <h1 className="text-[19vw] uppercase leading-[15vw] text-center text-transition relative z-[20]">
                  Behind
                  <br />
                  the Work
                </h1>
              </div>
              <div className="pl-[50%] relative z-[15]">
                <p className="font-[manrope2] mt-[5vw] lg:text-2xl text-[2vh] text-transition">
                  Since 2023, I've been helping brands around the world find
                  their voice through bold branding, clean interfaces, and
                  purpose-driven design. From India to Germany, Canada to the
                  USA — I've collaborated with diverse clients, blending global
                  design sensibilities with strategic creativity.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mt-[20vh] relative z-[10]">
            <div className="section2 w-full min-h-screen lg:h-screen flex items-center justify-center py-8 lg:py-0">
              <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-16 max-w-7xl mx-auto px-8 lg:px-16 text-[2vh] font-[manrope2]">
                <div className="flex flex-col gap-6 flex-1">
                  <h2 className="text-xl lg:text-2xl font-semibold text-transition">
                    Our Approach
                  </h2>
                  <p className="leading-relaxed text-transition">
                    At Drimin Design, we believe great design is more than just
                    visuals — it's about creating meaningful experiences that
                    connect brands with people. We approach every project with
                    curiosity, creativity, and strategy. Whether it's designing
                    a brand identity, building a modern website, or developing a
                    full digital experience, we focus on blending functionality
                    with aesthetics to deliver solutions that inspire and
                    perform.
                  </p>
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  <h2 className="text-xl lg:text-2xl font-semibold text-transition">
                    Our Process
                  </h2>
                  <p className="leading-relaxed text-transition">
                    <li>
                      <span className="font-[manrope5] uppercase ">
                        Creativity with Purpose
                      </span>{" "}
                      – We design not just to look good, but to make an impact.
                    </li>
                    <li>
                      <span className="font-[manrope5] uppercase ">
                        Collaboration
                      </span>{" "}
                      – Every project is built on open communication and strong
                      partnerships with our clients.
                    </li>
                    <li>
                      <span className="font-[manrope5] uppercase ">
                        Innovation
                      </span>{" "}
                      – We embrace new ideas, tools, and trends to keep your
                      brand ahead of the curve.
                    </li>
                    <li>
                      <span className="font-[manrope5] uppercase ">
                        Simplicity
                      </span>{" "}
                      – Clear, minimal, and effective design that resonates with
                      your audience.
                    </li>
                    <li>
                      <span className="font-[manrope5] uppercase ">
                        Integrity
                      </span>{" "}
                      – We stay honest and transparent, always delivering what
                      we promise.
                    </li>
                  </p>
                </div>

                <div className="flex flex-col gap-6 flex-1 ">
                  <h2 className="text-xl lg:text-2xl font-semibold text-transition">
                    Our Values
                  </h2>
                  <p className="leading-relaxed text-transition">
                    At Drimin Design, our process is simple yet powerful. We
                    begin by discovering your brand, goals, and audience to
                    understand your vision. From there, we define a clear
                    strategy, covering everything from branding elements to
                    website structure. Next, we move into the design stage,
                    where we craft visuals, layouts, and experiences that truly
                    reflect your brand identity. Our team then develops these
                    ideas into seamless, responsive, and scalable solutions.
                    Finally, we deliver and support your project, ensuring a
                    successful launch and providing ongoing assistance for
                    long-term growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="agency-card-trigger relative z-[10]">
            <Suspense fallback={<ComponentLoader />}>
              <AgencyCard />
            </Suspense>
          </div>

          <div className="relative z-[10]">
            <Suspense fallback={<ComponentLoader />}>
              <AgencyPeople />
            </Suspense>
          </div>

          <div className="relative z-[10]">
            <Suspense fallback={<ComponentLoader />}>
              <AgencyFAQ />
            </Suspense>
          </div>

          <div className="relative z-[10] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-8 lg:px-16">
              <div className="text-center mb-12">
                <h1 className="lg:text-[30vh] text-[10vh] mt-0 uppercase  lg:leading-32 leading-10  p-[0] font-[manrope] font-black text-black mb-16">
                  What we do
                </h1>
              </div>

              <div className="h-[60vh] lg:h-[70vh] w-full">
                <FallingText
                  text="Creative, innovative, and reliable — delivering UI/UX, Website Design, Development, Branding, and social media graphics with strategic, adaptive, and user-centric solutions."
                  highlightWords={[
                    "Creative",
                    "Innovative",
                    
                    "UI/UX",
                    "Website",
                    "Design",
                    "Development",
                    "Branding",
                    "Social Media",
                    "Strategic",
                    "User-Centric",
                  ]}
                  trigger="hover"
                  backgroundColor="transparent"
                  wireframes={false}
                  gravity={0.8}
                  fontSize="clamp(1.2rem, 3vw, 2.5rem)"
                  mouseConstraintStiffness={0.9}
                />
              </div>

              <div className="text-center mt-8">
                <p className="text-sm lg:text-base text-gray-500 italic">
                  Move your cursor around to interact with the falling words
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
