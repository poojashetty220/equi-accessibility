/* eslint-disable no-unused-vars */
/**
 * @fileoverview Dropdown Component
 * @module Accessibility/Dropdown
 * 
 * A reusable dropdown component for selecting from a list of options.
 * Used for position and theme selection in the accessibility panel.
 * 
 * @component
 * @example
 * ```tsx
 * <Dropdown
 *   label="Position"
 *   value="bottom-right"
 *   options={['bottom-right', 'top-left']}
 *   onChange={setValue}
 *   getDisplayName={(val) => val.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
 *   isOpen={isOpen}
 *   onToggle={setIsOpen}
 *   isDarkMode={false}
 * />
 * ```
 */

import React from 'react';
import { combineClasses } from './utils';

export interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  getDisplayName?: (value: T) => string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  isDarkMode?: boolean;
  className?: string;
  minWidth?: string;
  onCloseOther?: () => void;
}

/**
 * Dropdown Component
 * 
 * A reusable dropdown component for selecting from a list of options.
 * Supports keyboard navigation and accessibility features.
 */
const Dropdown = <T extends string>({
  label,
  value,
  options,
  onChange,
  getDisplayName,
  isOpen,
  onToggle,
  isDarkMode = false,
  className = '',
  minWidth = 'min-w-[140px]',
  onCloseOther
}: DropdownProps<T>) => {
  const defaultGetDisplayName = (val: T): string => {
    return val.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayName = getDisplayName ? getDisplayName(value) : defaultGetDisplayName(value);

  const handleToggle = (): void => {
    if (onCloseOther) {
      onCloseOther();
    }
    onToggle(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      onToggle(false);
    }
  };

  const handleOptionSelect = (option: T): void => {
    onChange(option);
    onToggle(false);
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, option: T): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionSelect(option);
    } else if (e.key === 'Escape') {
      onToggle(false);
    }
  };

  return (
    <div className={combineClasses("relative", className)}>
      <label className={`block text-xs ${isDarkMode ? 'text-white/90' : 'text-white/90'} font-medium mb-1.5`}>
        {label}
      </label>
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={combineClasses(
          `w-full sm:w-auto ${minWidth} px-3 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all flex items-center justify-between gap-2`,
          ''
        )}
        aria-label={`Select ${label.toLowerCase()}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="capitalize">{displayName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className={combineClasses(
          `absolute top-full left-0 mt-1 w-full sm:w-auto ${minWidth} rounded-lg shadow-lg border z-50 overflow-hidden ${
            isDarkMode 
              ? 'bg-secondary-800 border-secondary-600' 
              : 'bg-white border-secondary-200'
          }`,
          ''
        )}>
          {options.map((option) => {
            const optionDisplayName = getDisplayName ? getDisplayName(option) : defaultGetDisplayName(option);
            const isSelected = option === value;
            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                className={combineClasses(
                  `w-full text-left px-3 py-2 text-sm transition-colors focus:outline-none ${
                    isSelected
                      ? 'bg-primary-600 text-white font-medium'
                      : isDarkMode
                        ? 'text-white hover:bg-secondary-700 focus:bg-secondary-700'
                        : 'text-secondary-900 hover:bg-secondary-50 focus:bg-primary-50'
                  }`,
                  ''
                )}
                role="option"
                aria-selected={isSelected}
              >
                {optionDisplayName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

