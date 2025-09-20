// src/components/common/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BellRing } from "lucide-react";
import TextPressure from "../text/TextPressure";

// Toast Notification Component
const Toast = ({ message, type, isVisible, onClose }) => {
  return (
    <div
      className={`absolute mt-3 left-0 transform transition-all duration-500 ease-out max-w-xs ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm ${
          type === 'success'
            ? 'bg-orange-600/90 border-orange-300 text-white'
            : 'bg-red-900/90 border-red-600 text-red-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const AnimatedLink = ({ to, href, children, className = "", isExternal = false }) => {
  const text = children;
  
  const LinkComponent = isExternal ? "a" : Link;
  const linkProps = isExternal ? { href, target: "_blank", rel: "noopener noreferrer" } : { to };
  
  return (
    <LinkComponent
      {...linkProps}
      className={`block relative overflow-hidden group ${className}`}
      style={{ lineHeight: "1.2" }}
    >
      <span className="inline-block">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block transition-transform duration-300 ease-out"
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span
        className="absolute top-0 left-0 inline-block"
        style={{ transform: "translateY(100%)" }}
      >
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block transition-transform duration-300 ease-out group-hover:translate-y-[-100%]"
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <style jsx>{`
        .group:hover span:first-child span {
          transform: translateY(-100%);
        }
      `}</style>
    </LinkComponent>
  );
};

const Footer = () => {
  // Toast notification state
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  // State for bell icon animation
  const [isRinging, setIsRinging] = useState(false);

  // Function to show toast
  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  // Function to hide toast
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Web3Forms handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Add Web3Forms access key
    formData.append("access_key", "9de0307c-9099-4652-ac76-36fe1d7ddce7");

    // Start ringing animation
    setIsRinging(true);

    try {
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        showToast("Thanks! You're subscribed to our newsletter.", 'success');
        e.target.reset();
      } else {
        showToast("Something went wrong. Please try again.", 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      // Stop ringing animation after 2 seconds
      setTimeout(() => {
        setIsRinging(false);
      }, 2000);
    }
  };

  return (
    <>
      <footer className="relative bg-black text-gray-300 px-6 pt-12 pb-60 lg:min-h-[140vh] min-h-screen">
        {/* Top content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-12">
          {/* Left Side */}
          <div className="space-y-6 max-w-md">
            <p className="text-2xl md:text-3xl font-[manrope4] leading-tight">
              Do it once. Do it right.
            </p>
            <div>
              <p className="font-[manrope5] uppercase">New Business:</p>
              <a href="mailto:drimindesign@gmail.com" className="hover:underline">
                drimindesign@gmail.com
              </a>
            </div>
            <div>
              <p className="font-[manrope3]">Sign up for our newsletter <span className="font-[5px]"> (No spam)</span></p>
              <div className="relative">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center border-b border-gray-500 max-w-xs"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-transparent flex-1 py-1 px-2 text-white placeholder-gray-500 focus:outline-none"
                    required
                  />
                  <button 
                    type="submit" 
                    className={`text-white p-1 transition-all duration-300 ${
                      isRinging ? 'animate-bounce' : 'hover:scale-110'
                    }`}
                  >
                    {isRinging ? (
                      <BellRing size={18} className="animate-pulse" />
                    ) : (
                      <Bell size={18} />
                    )}
                  </button>
                </form>
                
                {/* Toast Notification positioned directly below form */}
                <Toast
                  message={toast.message}
                  type={toast.type}
                  isVisible={toast.isVisible}
                  onClose={hideToast}
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col md:flex-row font-[manrope2] gap-12 mt-12 md:mt-0">
            {/* Navigation */}
            <div className="space-y-2">
              <AnimatedLink to="/">Home</AnimatedLink>
              <AnimatedLink to="/projects">Portfolio</AnimatedLink>
              <AnimatedLink to="/aboutus">About</AnimatedLink>
              <AnimatedLink to="/contact">Contact</AnimatedLink>
            </div>

            {/* Social */}
            <div className="space-y-2">
              <AnimatedLink href="https://www.instagram.com/drimindesign.in/" isExternal>
                Instagram ↗
              </AnimatedLink>
              <AnimatedLink href="#" isExternal>
                LinkedIn ↗
              </AnimatedLink>
              <AnimatedLink to="/contact">Let's talk</AnimatedLink>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between text-sm border-t border-gray-700 pt-6 relative z-10">
          <div>
            <p>Maharashtra—India</p>
            <p>PUNE</p>
          </div>
          <p>Terms of use ©2025</p>
        </div>

        {/* Big Text pinned to bottom */}
        <div className="absolute bottom-0 left-0 w-full text-center">
          <TextPressure
            text="DRIMIN!"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={false}
            textColor="#ffffff"
            strokeColor="#ff0000"
            FontSize={16}
          />
        </div>
      </footer>

      {/* Toast Notification - moved to be inline with form */}
    </>
  );
};

export default Footer;