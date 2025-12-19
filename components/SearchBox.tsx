import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SearchEngine, Quote } from '../types';
import { SEARCH_ENGINES, QUOTES } from '../constants';
import SearchEngineMenu from './SearchEngineMenu';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';

interface SearchBoxProps {
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

type TypewriterPhase = 'typing' | 'waiting' | 'deleting';

const TYPING_SPEED = 200; // ms per char
const DELETING_SPEED = 100; // ms per char
const WAIT_DURATION = 8000; // ms to display full quote
// 5 Minutes = 300,000 ms
const QUOTE_REFRESH_INTERVAL = 300000;

const SearchBox: React.FC<SearchBoxProps> = ({ isActive, onActivate, onDeactivate }) => {
  const [query, setQuery] = useState('');
  
  // Persistence Logic
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(() => {
    if (typeof window !== 'undefined') {
      const savedType = localStorage.getItem('focus_search_engine_type');
      if (savedType) {
        const found = SEARCH_ENGINES.find(e => e.type === savedType);
        if (found) return found;
      }
    }
    return SEARCH_ENGINES[0];
  });

  // Quote State
  const [quote, setQuote] = useState<Quote>(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  
  // Typewriter State
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  // Time Tracking
  const lastQuoteUpdateRef = useRef<number>(Date.now());

  // Background Fetch Ref
  const nextQuoteRef = useRef<Quote | null>(null);

  // Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEngineSelect = (engine: SearchEngine) => {
    setSelectedEngine(engine);
    localStorage.setItem('focus_search_engine_type', engine.type);
  };

  // Fetch Logic
  const fetchQuoteData = useCallback(async (): Promise<Quote | null> => {
    try {
      const res = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=k');
      const data = await res.json();
      if (data && data.hitokoto) {
        return {
          text: data.hitokoto,
          author: data.from_who || data.from || '佚名'
        };
      }
    } catch (error) {
      console.warn("Background fetch failed");
    }
    return null;
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchQuoteData().then(data => {
      if (data) nextQuoteRef.current = data;
    });
  }, [fetchQuoteData]);

  // Typewriter Loop
  useEffect(() => {
    if (isActive) {
        return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
        if (displayedText.length < quote.text.length) {
            const randomSpeed = TYPING_SPEED + (Math.random() * 100 - 50);
            timeout = setTimeout(() => {
                setDisplayedText(quote.text.slice(0, displayedText.length + 1));
            }, randomSpeed);
        } else {
            setPhase('waiting');
        }
    } else if (phase === 'waiting') {
        timeout = setTimeout(() => {
            setPhase('deleting');
        }, WAIT_DURATION);
    } else if (phase === 'deleting') {
        if (displayedText.length > 0) {
            timeout = setTimeout(() => {
                setDisplayedText(quote.text.slice(0, displayedText.length - 1));
            }, DELETING_SPEED);
        } else {
            // Cycle Complete. Check if we should update the quote.
            const now = Date.now();
            if (now - lastQuoteUpdateRef.current > QUOTE_REFRESH_INTERVAL) {
                // Time to update
                if (nextQuoteRef.current) {
                    setQuote(nextQuoteRef.current);
                    nextQuoteRef.current = null;
                } else {
                    setQuote(prev => {
                        let newQ;
                        do {
                            newQ = QUOTES[Math.floor(Math.random() * QUOTES.length)];
                        } while (newQ.text === prev.text);
                        return newQ;
                    });
                }
                lastQuoteUpdateRef.current = now;
                fetchQuoteData().then(data => { if (data) nextQuoteRef.current = data; });
            }
            // Regardless of update, start typing again
            setPhase('typing');
        }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, phase, quote, isActive, fetchQuoteData]);


  // Handle Search Box Activation/Deactivation specifics
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.blur();
      // Resume loop automatically via the other useEffect
    }
  }, [isActive]);

  const getQuoteStyles = (text: string) => {
    const len = text.length;
    if (len <= 4) return 'text-5xl md:text-6xl tracking-[0.2em] leading-tight';
    if (len <= 10) return 'text-4xl md:text-5xl tracking-[0.15em] leading-snug';
    if (len <= 18) return 'text-3xl md:text-4xl tracking-[0.12em] leading-snug';
    return 'text-xl md:text-2xl tracking-[0.1em] leading-normal';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onDeactivate();
      }
    };
    if (isActive) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive, onDeactivate]);

  useEffect(() => {
    if (!query.trim() || !isActive) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const scriptId = 'baidu-suggestion-script';
    const callbackName = 'bdsug_' + Math.random().toString(36).substr(2, 9);
    (window as any)[callbackName] = (data: any) => {
        if (data && data.s && Array.isArray(data.s)) {
            const results = data.s.slice(0, 6);
            if (results.length > 0) {
                setSuggestions(results);
                setShowSuggestions(true);
                setSelectedIndex(-1);
            } else {
                setShowSuggestions(false);
            }
        }
        delete (window as any)[callbackName];
    };
    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=${callbackName}`;
    script.onerror = () => { delete (window as any)[callbackName]; };
    document.body.appendChild(script);
    return () => {
        (window as any)[callbackName] = () => {};
        const s = document.getElementById(scriptId);
        if (s) s.remove();
    };
  }, [query, isActive]);

  const triggerSearch = useCallback((searchText: string) => {
    if (!searchText.trim()) return;
    const url = selectedEngine.urlTemplate.replace('{query}', encodeURIComponent(searchText));
    window.open(url, '_blank');
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, [selectedEngine]);

  const handleSearchClick = () => {
    triggerSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex > -1 && suggestions[selectedIndex]) {
        triggerSearch(suggestions[selectedIndex]);
      } else {
        triggerSearch(query);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (showSuggestions) {
          setShowSuggestions(false);
      } else {
          onDeactivate();
      }
    }
  };

  const handleSuggestionClick = (s: string) => {
      triggerSearch(s);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-[600px] select-none">
      <div
        ref={containerRef}
        onClick={!isActive ? onActivate : undefined}
        className={`
          relative
          flex items-center justify-center
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          will-change-[width,height,border-radius,box-shadow,background-color]
          ${isActive 
            ? 'w-[90vw] md:w-[680px] h-[72px] rounded-full bg-white/40 backdrop-blur-3xl backdrop-saturate-150 cursor-default' 
            : 'w-[340px] h-[340px] rounded-full bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl cursor-pointer hover:scale-105 group'
          }
          ${isActive ? 'overflow-visible' : 'overflow-hidden'}
        `}
        style={{
          boxShadow: isActive 
            ? '0 0 0 2px rgba(255,255,255,0.8), 0 0 0 4px rgba(0,0,0,1), 0 30px 60px -10px rgba(0,0,0,0.5)' 
            : 'inset 0 0 40px rgba(255,255,255,0.15), inset 0 0 10px rgba(255,255,255,0.2), 0 20px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* QUOTE DISPLAY */}
        <div 
          className={`
            absolute inset-0 flex flex-col items-center justify-center z-10
            transition-all duration-500 ease-in-out
            ${!isActive 
              ? 'opacity-100 scale-100 blur-0 delay-200'
              : 'opacity-0 scale-50 blur-xl pointer-events-none'
            }
          `}
        >
           <div className="flex flex-col items-center justify-center gap-6 h-full w-full p-8 text-center">
             <div className="flex flex-row-reverse items-center justify-center h-full w-full gap-8">
                 <div 
                    className={`font-serif-sc text-white/95 font-black drop-shadow-lg py-2 ${getQuoteStyles(quote.text)}`}
                    style={{ writingMode: 'vertical-rl', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                 >
                    {displayedText}
                    {/* 
                        CURSOR FIXED:
                        Use a horizontal bar (w-[1em] h-[3px]) instead of a vertical bar.
                        In vertical-rl, this sits "below" the character.
                    */}
                    <span className="inline-block w-[1em] h-[3px] bg-white/80 animate-pulse mt-2 shadow-[0_0_5px_white]" />
                 </div>
                 
                 {/* Author & Stamp - Only visible when text is fully typed (waiting phase) */}
                 <div 
                    className={`
                        h-[60%] flex flex-col justify-end items-center pb-0 gap-3 
                        transition-opacity duration-700 ease-out
                        ${phase === 'waiting' ? 'opacity-90' : 'opacity-0'}
                    `}
                 >
                     <div 
                        className="font-serif-sc text-white/80 font-bold text-lg tracking-[0.4em] border-r-[2px] border-white/20 pr-3 py-2"
                        style={{ writingMode: 'vertical-rl' }}
                     >
                        {quote.author}
                     </div>
                     <div className="mt-2 w-10 h-10 bg-[#B92B27] rounded shadow-md border border-white/10 flex items-center justify-center opacity-90 hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-serif-sc font-bold text-lg select-none drop-shadow-sm">搜</span>
                     </div>
                 </div>
             </div>
           </div>
        </div>

        {/* SEARCH INTERFACE */}
        <div 
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-full max-w-[680px] h-[72px]
            flex items-center px-4 md:px-5 gap-0 z-20
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isActive 
              ? 'opacity-100 scale-100 delay-200' 
              : 'opacity-0 scale-90 pointer-events-none'
            }
          `}
        >
            <div className="flex-shrink-0 relative z-30 flex items-center justify-center w-[60px] h-full">
                <SearchEngineMenu selectedEngine={selectedEngine} onSelect={handleEngineSelect} />
            </div>

            <div className="flex-shrink-0 w-[1px] h-8 bg-black/10 mx-3" />

            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedEngine.placeholder}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-900 placeholder-gray-600/70 text-xl md:text-2xl font-serif-sc font-bold h-full tracking-wide"
                autoComplete="off"
            />

            <button 
                onClick={handleSearchClick}
                className="
                    flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full ml-2
                    bg-[#962626] text-white 
                    flex items-center justify-center 
                    hover:bg-[#852020] hover:scale-110 active:scale-95 
                    transition-all duration-300 
                    shadow-lg border border-white/10
                "
            >
                <ArrowRight size={24} className="text-white/95" />
            </button>

            {showSuggestions && isActive && suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+16px)] left-0 right-0 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden z-40 flex flex-col p-2 animation-fade-in-up">
                    {suggestions.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className={`
                                flex items-center gap-3 px-5 py-3.5 text-left w-full rounded-2xl transition-all duration-200
                                ${index === selectedIndex ? 'bg-black/5' : 'hover:bg-white/40'}
                            `}
                        >
                            <SearchIcon size={18} className={`opacity-50 ${index === selectedIndex ? 'text-black' : 'text-gray-700'}`} />
                            <span className="font-serif-sc text-gray-900 font-medium text-lg flex-1 truncate">
                                {item}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SearchBox;