/* eslint-disable no-unused-vars */
/**
 * @fileoverview Option Carousel Component
 * @module Accessibility/OptionCarousel
 * 
 * A reusable banner carousel component for multi-option selections.
 * Shows one option at a time in a clickable banner-like box with bottom indicator lines.
 * Similar to UserWay's accessibility widget carousel UI.
 * 
 * @component
 * @example
 * ```tsx
 * <OptionCarousel
 *   options={['small', 'medium', 'large']}
 *   currentValue="medium"
 *   onChange={setValue}
 *   getDisplayName={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
 *   ariaLabel="font size"
 *   sectionId="font-size-heading"
 *   isDarkMode={false}
 * />
 * ```
 */

import React from 'react';
import { combineClasses } from './utils';

export interface OptionCarouselProps<T extends string> {
  options: T[];
  currentValue: T;
  onChange: (value: T) => void;
  getDisplayName: (value: T) => string;
  ariaLabel: string;
  sectionId: string;
  isDarkMode?: boolean;
  customClasses?: {
    container?: string;
    carousel?: string;
    button?: string;
    currentOption?: string;
  };
}

/**
 * OptionCarousel Component
 * 
 * Banner carousel component for multi-option selections.
 * Shows one option at a time in a clickable banner-like box.
 * Clicking cycles through options, creating a banner/card feel.
 * Reference: https://userway.org/blog/accessibility-features/
 * Scales well for any number of options.
 */
const OptionCarousel = <T extends string>({
  options,
  currentValue,
  onChange,
  getDisplayName,
  ariaLabel,
  sectionId,
  isDarkMode = false,
  customClasses
}: OptionCarouselProps<T>) => {
  const currentIndex = options.indexOf(currentValue);

  const cycleToNext = (): void => {
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cycleToNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      onChange(options[prevIndex]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      cycleToNext();
    }
  };

  return (
    <div 
      className={combineClasses("flex items-center justify-center", customClasses?.container || '')}
      role="radiogroup"
      aria-labelledby={sectionId}
    >
      {/* Banner-like Clickable Box */}
      <button
        onClick={cycleToNext}
        onKeyDown={handleKeyDown}
        className={combineClasses(
          `w-full px-4 py-3 sm:px-6 sm:py-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            isDarkMode
              ? 'bg-primary-600 text-white border-primary-600 shadow-lg hover:shadow-xl hover:bg-primary-700 focus:ring-offset-secondary-900'
              : 'bg-primary-600 text-white border-primary-600 shadow-lg hover:shadow-xl hover:bg-primary-700 focus:ring-offset-white'
          }`,
          customClasses?.currentOption || customClasses?.carousel || ''
        )}
        role="radio"
        aria-checked={true}
        aria-label={`Current ${ariaLabel}: ${getDisplayName(currentValue)}. Click to cycle through options.`}
      >
        <div className="text-center">
          <span className="text-sm sm:text-base font-semibold block">
            {getDisplayName(currentValue)}
          </span>
          {/* Bottom indicator lines - using inline styles to prevent contrast override */}
          <div className="flex items-center justify-center gap-1.5 mt-3 accessibility-panel-indicators">
            {options.map((_, index) => (
              <div
                key={index}
                className="h-1 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  width: index === currentIndex ? '1.5rem' : '0.375rem',
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </button>
    </div>
  );
};

export default OptionCarousel;

