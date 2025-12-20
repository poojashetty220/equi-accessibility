/* eslint-disable no-unused-vars */
/**
 * @fileoverview Accessibility Customization Panel Component
 * @module Accessibility/AccessibilityCustomizationPanel
 * 
 * This component provides a UI for customizing the props that are passed to
 * the AccessibilityPanel component from the main application. It allows
 * developers/users to configure:
 * - Panel position
 * - Theme mode
 * - Other AccessibilityPanel props
 * 
 * @component
 * @example
 * ```tsx
 * <AccessibilityCustomizationPanel
 *   position={position}
 *   theme={theme}
 *   onPositionChange={setPosition}
 *   onThemeChange={setTheme}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import type { PanelPosition, ThemeMode, EnabledOptions, SaveMode } from './types';
import { defaultEnabledOptions } from './types';

export interface AccessibilityCustomizationPanelProps {
  position: PanelPosition;
  theme: ThemeMode;
  onPositionChange: (position: PanelPosition) => void;
  onThemeChange: (theme: ThemeMode) => void;
  className?: string;
  /** Current enabled options configuration */
  enabledOptions?: EnabledOptions;
  /** Callback when enabled options change */
  onEnabledOptionsChange?: (options: EnabledOptions) => void;
  /** Current save mode */
  saveMode?: SaveMode;
  /** Callback when save mode changes */
  onSaveModeChange?: (mode: SaveMode) => void;
}

/**
 * ToggleSwitch Component
 * 
 * A toggle switch for enabling/disabling options.
 */
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  onKeyDown: (e: React.KeyboardEvent, action: () => void) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  onKeyDown,
}) => (
  <button
    onClick={onChange}
    onKeyDown={(e) => onKeyDown(e, onChange)}
    className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
    role="switch"
    aria-checked={checked}
  >
    <span className="text-sm text-secondary-700">{label}</span>
    <div
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        checked ? 'bg-primary-600' : 'bg-secondary-300'
      }`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </div>
  </button>
);

/**
 * AccessibilityCustomizationPanel Component
 * 
 * A configuration panel that allows customization of AccessibilityPanel props.
 * This is separate from the AccessibilityPanel itself and is meant to be used
 * in the main application to control how the AccessibilityPanel is configured.
 */
const AccessibilityCustomizationPanel: React.FC<AccessibilityCustomizationPanelProps> = ({
  position,
  theme,
  onPositionChange,
  onThemeChange,
  className = '',
  enabledOptions: userEnabledOptions = {},
  onEnabledOptionsChange,
  saveMode = 'auto',
  onSaveModeChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState<boolean>(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const [isSaveModeDropdownOpen, setIsSaveModeDropdownOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Merge user-provided enabled options with defaults
  const enabledOptions: Required<EnabledOptions> = {
    ...defaultEnabledOptions,
    ...userEnabledOptions
  };

  // Handler for toggling individual options
  const handleOptionToggle = (optionKey: keyof EnabledOptions): void => {
    if (onEnabledOptionsChange) {
      onEnabledOptionsChange({
        ...userEnabledOptions,
        [optionKey]: !enabledOptions[optionKey]
      });
    }
  };

  const saveModeOptions: SaveMode[] = ['auto', 'manual'];

  const positionOptions: PanelPosition[] = [
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left',
    'top-center',
    'bottom-center',
  ];

  const themeOptions: ThemeMode[] = ['light', 'dark', 'auto'];

  // Handle Escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsPositionDropdownOpen(false);
        setIsThemeDropdownOpen(false);
        setIsSaveModeDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        (isPositionDropdownOpen || isThemeDropdownOpen || isSaveModeDropdownOpen)
      ) {
        setIsPositionDropdownOpen(false);
        setIsThemeDropdownOpen(false);
        setIsSaveModeDropdownOpen(false);
      }
    };

    if (isPositionDropdownOpen || isThemeDropdownOpen || isSaveModeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPositionDropdownOpen, isThemeDropdownOpen, isSaveModeDropdownOpen]);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e, () => setIsOpen(!isOpen))}
        className="fixed bottom-20 right-4 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-40"
        aria-label="Open accessibility customization panel"
        aria-expanded={isOpen}
        aria-controls="accessibility-customization-panel"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Customization Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-customization-panel"
          className="fixed bottom-32 right-4 w-80 bg-white border border-secondary-200 rounded-xl shadow-2xl z-50 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customization-panel-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200">
            <h3
              id="customization-panel-title"
              className="text-lg font-semibold text-secondary-900"
            >
              Panel Configuration
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => handleKeyDown(e, () => setIsOpen(false))}
              className="p-1.5 rounded-lg hover:bg-secondary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close customization panel"
            >
              <svg
                className="w-5 h-5 text-secondary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Position Control */}
            <div className="relative">
              <label
                htmlFor="position-select"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Panel Position
              </label>
              <button
                id="position-select"
                onClick={() => {
                  setIsPositionDropdownOpen(!isPositionDropdownOpen);
                  setIsThemeDropdownOpen(false);
                  setIsSaveModeDropdownOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsPositionDropdownOpen(!isPositionDropdownOpen);
                    setIsThemeDropdownOpen(false);
                    setIsSaveModeDropdownOpen(false);
                  } else if (e.key === 'Escape') {
                    setIsPositionDropdownOpen(false);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-secondary-300 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all flex items-center justify-between"
                aria-label="Select panel position"
                aria-expanded={isPositionDropdownOpen}
                aria-haspopup="listbox"
              >
                <span className="capitalize">
                  {position.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <svg
                  className={`w-4 h-4 text-secondary-500 transition-transform ${isPositionDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isPositionDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-lg shadow-lg border border-secondary-200 bg-white z-50 overflow-hidden">
                  {positionOptions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => {
                        onPositionChange(pos);
                        setIsPositionDropdownOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onPositionChange(pos);
                          setIsPositionDropdownOpen(false);
                        } else if (e.key === 'Escape') {
                          setIsPositionDropdownOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors focus:outline-none ${
                        position === pos
                          ? 'bg-primary-600 text-white font-medium'
                          : 'text-secondary-900 hover:bg-secondary-50 focus:bg-primary-50'
                      }`}
                      role="option"
                      aria-selected={position === pos}
                    >
                      {pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Control */}
            <div className="relative">
              <label
                htmlFor="theme-select"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Theme Mode
              </label>
              <button
                id="theme-select"
                onClick={() => {
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                  setIsPositionDropdownOpen(false);
                  setIsSaveModeDropdownOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsThemeDropdownOpen(!isThemeDropdownOpen);
                    setIsPositionDropdownOpen(false);
                    setIsSaveModeDropdownOpen(false);
                  } else if (e.key === 'Escape') {
                    setIsThemeDropdownOpen(false);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-secondary-300 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all flex items-center justify-between"
                aria-label="Select theme mode"
                aria-expanded={isThemeDropdownOpen}
                aria-haspopup="listbox"
              >
                <span className="capitalize">{theme}</span>
                <svg
                  className={`w-4 h-4 text-secondary-500 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isThemeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-lg shadow-lg border border-secondary-200 bg-white z-50 overflow-hidden">
                  {themeOptions.map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => {
                        onThemeChange(themeOption);
                        setIsThemeDropdownOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onThemeChange(themeOption);
                          setIsThemeDropdownOpen(false);
                        } else if (e.key === 'Escape') {
                          setIsThemeDropdownOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors focus:outline-none ${
                        theme === themeOption
                          ? 'bg-primary-600 text-white font-medium'
                          : 'text-secondary-900 hover:bg-secondary-50 focus:bg-primary-50'
                      }`}
                      role="option"
                      aria-selected={theme === themeOption}
                    >
                      {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save Mode Control */}
            <div className="relative">
              <label
                htmlFor="save-mode-select"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Save Mode
              </label>
              <button
                id="save-mode-select"
                onClick={() => {
                  setIsSaveModeDropdownOpen(!isSaveModeDropdownOpen);
                  setIsPositionDropdownOpen(false);
                  setIsThemeDropdownOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsSaveModeDropdownOpen(!isSaveModeDropdownOpen);
                    setIsPositionDropdownOpen(false);
                    setIsThemeDropdownOpen(false);
                  } else if (e.key === 'Escape') {
                    setIsSaveModeDropdownOpen(false);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-secondary-300 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all flex items-center justify-between"
                aria-label="Select save mode"
                aria-expanded={isSaveModeDropdownOpen}
                aria-haspopup="listbox"
              >
                <span className="capitalize">{saveMode === 'auto' ? 'Auto Save' : 'Manual Save'}</span>
                <svg
                  className={`w-4 h-4 text-secondary-500 transition-transform ${isSaveModeDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSaveModeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-lg shadow-lg border border-secondary-200 bg-white z-50 overflow-hidden">
                  {saveModeOptions.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        onSaveModeChange?.(mode);
                        setIsSaveModeDropdownOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSaveModeChange?.(mode);
                          setIsSaveModeDropdownOpen(false);
                        } else if (e.key === 'Escape') {
                          setIsSaveModeDropdownOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors focus:outline-none ${
                        saveMode === mode
                          ? 'bg-primary-600 text-white font-medium'
                          : 'text-secondary-900 hover:bg-secondary-50 focus:bg-primary-50'
                      }`}
                      role="option"
                      aria-selected={saveMode === mode}
                    >
                      {mode === 'auto' ? 'Auto Save' : 'Manual Save'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enabled Options Section */}
            <div className="pt-4 border-t border-secondary-200">
              <h4 className="text-sm font-medium text-secondary-700 mb-3">
                Enabled Options
              </h4>
              <p className="text-xs text-secondary-500 mb-3">
                Toggle which accessibility options are visible in the panel.
              </p>
              
              {/* Typography Options */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-secondary-600 uppercase tracking-wide mb-2">
                  Typography
                </h5>
                <div className="space-y-2">
                  <ToggleSwitch
                    label="Font Family"
                    checked={enabledOptions.fontFamily}
                    onChange={() => handleOptionToggle('fontFamily')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Font Size"
                    checked={enabledOptions.fontSize}
                    onChange={() => handleOptionToggle('fontSize')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Line Height"
                    checked={enabledOptions.lineHeight}
                    onChange={() => handleOptionToggle('lineHeight')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Letter Spacing"
                    checked={enabledOptions.letterSpacing}
                    onChange={() => handleOptionToggle('letterSpacing')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Word Spacing"
                    checked={enabledOptions.wordSpacing}
                    onChange={() => handleOptionToggle('wordSpacing')}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Visual Options */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-secondary-600 uppercase tracking-wide mb-2">
                  Visual
                </h5>
                <div className="space-y-2">
                  <ToggleSwitch
                    label="Contrast"
                    checked={enabledOptions.contrast}
                    onChange={() => handleOptionToggle('contrast')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Saturation"
                    checked={enabledOptions.saturation}
                    onChange={() => handleOptionToggle('saturation')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Monochrome"
                    checked={enabledOptions.monochrome}
                    onChange={() => handleOptionToggle('monochrome')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Hide Images"
                    checked={enabledOptions.hideImages}
                    onChange={() => handleOptionToggle('hideImages')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Highlight Titles"
                    checked={enabledOptions.highlightTitles}
                    onChange={() => handleOptionToggle('highlightTitles')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Highlight Links"
                    checked={enabledOptions.highlightLinks}
                    onChange={() => handleOptionToggle('highlightLinks')}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-secondary-600 uppercase tracking-wide mb-2">
                  Preferences
                </h5>
                <div className="space-y-2">
                  <ToggleSwitch
                    label="Screen Reader"
                    checked={enabledOptions.screenReader}
                    onChange={() => handleOptionToggle('screenReader')}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Panel Settings */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-secondary-600 uppercase tracking-wide mb-2">
                  Panel Settings
                </h5>
                <div className="space-y-2">
                  <ToggleSwitch
                    label="Position Selector"
                    checked={enabledOptions.position}
                    onChange={() => handleOptionToggle('position')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Theme Selector"
                    checked={enabledOptions.theme}
                    onChange={() => handleOptionToggle('theme')}
                    onKeyDown={handleKeyDown}
                  />
                  <ToggleSwitch
                    label="Reset Button"
                    checked={enabledOptions.resetButton}
                    onChange={() => handleOptionToggle('resetButton')}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-4 pt-4 border-t border-secondary-200">
            <p className="text-xs text-secondary-500">
              These settings control how the Accessibility Panel appears and behaves.
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0  z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AccessibilityCustomizationPanel;

