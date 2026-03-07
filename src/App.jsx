// src/App.jsx
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Agency from "./pages/Aboutus";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Navbar from "./components/Navigation/Navbar";
import FullScreenNav from "./components/Navigation/FullScreenNav";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Portfolio from "./Projectpage/Portfolio";
import Footer from "./components/common/Footer";
import Aboutus from "./pages/Aboutus";
import ScrollToTop from "./components/common/ScrollTop";
import Loader from "./components/Loader";
import { CRITICAL_IMAGES, useCriticalImages } from "./hooks/useCriticalImages";
import imageCache from "./utils/ImageCache";

const App = () => {
  const location = useLocation();
  const hasSeenLoader = (() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("loader_seen_global") === "true";
  })();

  const [loading, setLoading] = useState(!hasSeenLoader);
  const [showContent, setShowContent] = useState(hasSeenLoader);

  // Preload critical images immediately when app starts
  useCriticalImages();

  // No video assets to preload

  // Optional: Set up image cache monitoring (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleCacheEvent = ({ url, event, data }) => {
        console.log(`🖼️ Image ${event}:`, url.split('/').pop());
      };

      const unsubscribe = imageCache.addObserver(handleCacheEvent);
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    // Sync Lenis with RAF
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleLoadComplete = () => {
    setLoading(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("loader_seen_global", "true");
    }
    setTimeout(() => {
      setShowContent(true);
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <div className="text-white overflow-x-hidden flex flex-col min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <Loader
            images={CRITICAL_IMAGES}
            projectName="Loading"
            projectType="Experience"
            onLoadComplete={handleLoadComplete}
            priority="high"
          />
        </div>
      )}

      <div
        className={`transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar />
        <FullScreenNav />
        <ScrollToTop />

        {/* Main content grows to push footer down */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/portfolio/:id" element={<Portfolio />} />
          </Routes>
        </div>

        {/* Show footer only if NOT on Home */}
        {location.pathname !== "/" && <Footer />}
      </div>
    </div>
  );
};

export default App;
