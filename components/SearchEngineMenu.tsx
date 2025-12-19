import React, { useState, useRef, useEffect } from 'react';
import { SearchEngine } from '../types';
import { SEARCH_ENGINES } from '../constants';
import { ChevronDown } from 'lucide-react';

interface SearchEngineMenuProps {
  selectedEngine: SearchEngine;
  onSelect: (engine: SearchEngine) => void;
}

const SearchEngineMenu: React.FC<SearchEngineMenuProps> = ({ selectedEngine, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (engine: SearchEngine) => {
    onSelect(engine);
    setIsOpen(false);
  };

  const Icon = selectedEngine.icon;

  return (
    <div className="relative group w-full flex justify-center" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1 p-2 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors w-full h-full"
        title="切换搜索引擎"
      >
        {/* Render icon with natural colors */}
        <Icon size={28} />
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown - Light Glass Theme */}
      <div
        className={`absolute top-full left-0 mt-4 w-60 py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 origin-top-left transition-all duration-200 z-50 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
          搜索引擎
        </div>
        {SEARCH_ENGINES.map((engine) => (
          <button
            key={engine.type}
            onClick={() => handleSelect(engine)}
            className={`w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-blue-500/5 transition-colors ${
              selectedEngine.type === engine.type ? 'bg-blue-500/5 text-blue-700 font-bold' : 'text-gray-700 font-medium'
            }`}
          >
            <engine.icon size={22} />
            <span className="text-base font-serif-sc">{engine.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchEngineMenu;