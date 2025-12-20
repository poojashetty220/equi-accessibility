/**
 * @fileoverview Checkbox Option Component
 * @module Accessibility/CheckboxOption
 * 
 * A reusable checkbox-style option component for toggleable settings.
 * Used for visual options and preferences in the accessibility panel.
 * 
 * @component
 * @example
 * ```tsx
 * <CheckboxOption
 *   label="Monochrome Mode"
 *   checked={monochrome}
 *   onChange={setMonochrome}
 *   isDarkMode={false}
 *   onKeyDown={handleKeyDown}
 * />
 * ```
 */

import React from 'react';
import { combineClasses } from './utils';

export interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isDarkMode?: boolean;
  onKeyDown?: (e: React.KeyboardEvent, action: () => void) => void;
  className?: string;
  badgeText?: string;
  ariaLabel?: string;
}

/**
 * CheckboxOption Component
 * 
 * A reusable checkbox-style option component for toggleable settings.
 * Provides visual feedback and accessibility support.
 */
const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  label,
  checked,
  onChange,
  isDarkMode = false,
  onKeyDown,
  className = '',
  badgeText,
  ariaLabel
}) => {
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (onKeyDown) {
      onKeyDown(e, () => onChange(!checked));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const baseClasses = `group flex items-center justify-between space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
    checked
      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
      : isDarkMode
        ? 'bg-secondary-800 text-white border-secondary-600 hover:bg-secondary-700 hover:border-primary-400 focus:ring-offset-secondary-900'
        : 'bg-white text-secondary-900 border-secondary-300 hover:bg-primary-50 hover:border-primary-200 focus:ring-offset-white'
  }`;

  const displayBadgeText = badgeText || (checked ? 'On' : 'Off');

  return (
    <div
      onClick={() => onChange(!checked)}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      className={combineClasses(baseClasses, className)}
      aria-label={ariaLabel || `${label} ${checked ? 'enabled' : 'disabled'}`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div className={`relative w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          checked
            ? isDarkMode
              ? 'bg-white border-white shadow-sm'
              : 'bg-white border-white shadow-sm'
            : isDarkMode
              ? 'bg-secondary-700 border-secondary-500 group-hover:border-primary-400'
              : 'bg-white border-secondary-300 group-hover:border-primary-300'
        }`}>
          {checked && (
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-white' : 'text-secondary-900'
        }`}>
          {label}
        </span>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded ${
        checked
          ? 'bg-white/20 text-white'
          : isDarkMode
            ? 'bg-secondary-700 text-secondary-300'
            : 'bg-secondary-100 text-secondary-700'
      }`}>
        {displayBadgeText}
      </span>
    </div>
  );
};

export default CheckboxOption;

