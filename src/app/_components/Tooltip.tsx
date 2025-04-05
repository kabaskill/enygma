'use client'
import {MessageCircleQuestion} from "lucide-react";
import {TOOLTIPS} from "~/data/constants";
import {useState, useRef, useEffect} from "react";
import { cn } from "~/lib/utils";

// Global state to track which tooltip is currently open
let activeTooltipId: string | null = null;
let closeAllTooltips: (() => void) | null = null;

export default function Tooltip({tooltip}: {tooltip: string}) {
  const tooltipText = TOOLTIPS[tooltip];
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Register global click handler to close tooltips
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't close if clicking the button that opened this tooltip
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        return;
      }
      setIsVisible(false);
    };

    if (isVisible) {
      document.addEventListener("click", handleGlobalClick);
      // Update the global close function
      closeAllTooltips = () => setIsVisible(false);
    }

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [isVisible]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isVisible) {
      setIsVisible(false);
      activeTooltipId = null;
    } else {
      // Close any other open tooltips
      if (closeAllTooltips && activeTooltipId !== tooltip) {
        closeAllTooltips();
      }

      // Set this tooltip as active
      activeTooltipId = tooltip;
      setIsVisible(true);
    }
  };

  return (
    <div className="relative ">
      <button
        ref={buttonRef}
        className="flex items-center justify-center cursor-pointer p-0"
        aria-label="Show tooltip"
        onClick={handleClick}
      >
        <MessageCircleQuestion />
      </button>

      {isVisible && (
        <div
          className={cn(
            "absolute top-full left-1/2 -translate-x-1/2 mt-1",
            "w-3xs bg-white text-gray-800 text-sm py-1.5 px-3",
            "rounded shadow-md border border-gray-100 z-50 animate-in fade-in duration-200"
          )}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
