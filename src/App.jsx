// src/App.jsx
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Agency from "./pages/Aboutus";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Navbar from "./components/Navigation/Navbar";
import FullScreenNav from "./components/Navigation/FullScreenNav";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Portfolio from "./Projectpage/Portfolio";
import Footer from "./components/common/Footer";
import Aboutus from "./pages/Aboutus";
import ScrollToTop from "./components/common/ScrollTop";
import { useCriticalImages } from "./hooks/useCriticalImages";
import imageCache from "./utils/ImageCache";

const App = () => {
  const location = useLocation();

  // Preload critical images immediately when app starts
  useCriticalImages();

  // Preload video immediately when app starts
  useEffect(() => {
    // Preload the hero video
    const videoLink = document.createElement('link');
    videoLink.rel = 'preload';
    videoLink.href = '/videos/video.mp4';
    videoLink.as = 'video';
    videoLink.type = 'video/mp4';
    document.head.appendChild(videoLink);

    console.log('🎥 Video preloading started');

    // Cleanup function
    return () => {
      if (document.head.contains(videoLink)) {
        document.head.removeChild(videoLink);
      }
    };
  }, []);

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

  return (
    <div className="text-white overflow-x-hidden flex flex-col min-h-screen">
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
  );
};

export default App;