import React, { useState, useEffect } from 'react';
import { WALLPAPER_URL_BASE } from '../constants';

interface WallpaperProps {
  isFocusMode: boolean;
  refreshTrigger: number;
}

const Wallpaper: React.FC<WallpaperProps> = ({ isFocusMode, refreshTrigger }) => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [nextImage, setNextImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load initial image and handle refresh
  useEffect(() => {
    const newUrl = `${WALLPAPER_URL_BASE}${Date.now()}`;
    const img = new Image();
    img.src = newUrl;
    img.onload = () => {
      setNextImage(newUrl);
      setLoading(false);
    };
  }, [refreshTrigger]);

  // Transition handling
  useEffect(() => {
    if (nextImage && nextImage !== currentImage) {
      // Small delay to ensure the image is ready in DOM if we were doing complex transitions, 
      // but here we just swap. For a smoother crossfade, we could use two divs.
      setCurrentImage(nextImage);
    }
  }, [nextImage]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
      {/* Background Layer with Transition Effects */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          isFocusMode ? 'scale-110 blur-md brightness-75' : 'scale-100 blur-0 brightness-90'
        }`}
        style={{ backgroundImage: `url(${currentImage})` }}
      />
      
      {/* Overlay for better text contrast if image is too bright */}
      <div className={`absolute inset-0 bg-black/10 transition-opacity duration-700 ${isFocusMode ? 'opacity-40' : 'opacity-10'}`} />
    </div>
  );
};

export default Wallpaper;
