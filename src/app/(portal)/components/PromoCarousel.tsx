"use client";
import { useState, useEffect } from "react";

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["/promo1.jpg", "/promo2.jpg"]; 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 30000); // 30 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card p-4 shadow-2xl border border-white/10 w-full overflow-hidden relative">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <i className="bi bi-megaphone-fill text-blue-500 mr-2"></i> Current Promotions
      </h3>
      <div className="aspect-[16/9] w-full relative rounded-lg overflow-hidden bg-black/50 border border-gray-700">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Promotion ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            onError={(e) => {
              // Fallback to show something if user hasn't added the image yet
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450/000000/FFFFFF?text=Please+upload+' + src.replace('/', '');
            }}
          />
        ))}
        {/* Indicators */}
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
