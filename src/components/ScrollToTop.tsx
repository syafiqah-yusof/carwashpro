"use client";
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button 
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-t from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 z-50 flex items-center justify-center group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      aria-label="Scroll to top"
    >
      {/* Car icon that "drives" up slightly on hover */}
      <div className="flex flex-col items-center justify-center transform group-hover:-translate-y-1 transition-transform">
        <i className="bi bi-chevron-up text-xs font-bold -mb-1 opacity-70"></i>
        <i className="bi bi-car-front-fill text-xl"></i>
      </div>
    </button>
  );
}
