import React, { useState } from 'react';
import Wallpaper from './components/Wallpaper';
import SearchBox from './components/SearchBox';
import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // Initialize in Focus Mode (Active Search) by default as requested
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefreshWallpaper = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other clicks
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* Background Layer */}
      <Wallpaper isFocusMode={isFocusMode} refreshTrigger={refreshTrigger} />

      {/* Main Content Layer */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center p-4">
        
        {/* Search Component */}
        <div className="perspective-1000">
            <SearchBox 
                isActive={isFocusMode} 
                onActivate={() => setIsFocusMode(true)} 
                onDeactivate={() => setIsFocusMode(false)}
            />
        </div>

      </main>

      {/* Wallpaper Switcher - Fixed Position */}
      {/* Only visible when not in focus mode to reduce distraction */}
      <div 
        className={`
            absolute bottom-8 right-8 z-20 
            transition-all duration-500 
            ${isFocusMode ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}
        `}
      >
        <button
          onClick={handleRefreshWallpaper}
          className="
            group flex items-center gap-2 px-4 py-3 
            bg-black/30 hover:bg-black/50 backdrop-blur-md 
            border border-white/10 rounded-full 
            text-white/80 hover:text-white 
            transition-all duration-300 shadow-lg hover:shadow-xl
          "
        >
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm font-medium">切换壁纸</span>
        </button>
      </div>
      
      {/* Credits / Footer - Optional */}
       <div 
        className={`
            absolute bottom-8 left-8 z-20 
            transition-all duration-500 
            ${isFocusMode ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}
        `}
      >
        <span className="text-white/40 text-xs tracking-widest uppercase font-semibold select-none">
           专注 · 沉浸
        </span>
      </div>

    </div>
  );
};

export default App;