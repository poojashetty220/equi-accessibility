/**
 * @fileoverview Main Accessibility Panel Component
 * @module Accessibility/AccessibilityPanel
 * 
 * This is the primary component that renders the accessibility settings panel.
 * It manages all accessibility state, applies global filters (monochrome, hide images),
 * handles persistence via sessionStorage, and provides a complete UI for users to
 * customize their accessibility preferences.
 * 
 * Uses reusable components:
 * - Dropdown: For position and theme selection in the header
 * - AccessibilityOptions: For all accessibility option controls
 * 
 * @component
 * @example
 * ```tsx
 * <AccessibilityPanel
 *   isOpen={isPanelOpen}
 *   onClose={() => setIsPanelOpen(false)}
 *   className="custom-panel"
 *   classes={{ header: "bg-blue-600" }}
 * />
 * ```
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AccessibilityOptions from './AccessibilityOptions';
import Dropdown from './Dropdown';
import { combineClasses } from './utils';
import { 
  enableScreenReaderMode, 
  disableScreenReaderMode,
  isScreenReaderModeEnabled,
  announceToScreenReader,
  initializeAnnouncer,
  setSpeechSynthesis,
  stopSpeaking,
} from './screenReaderUtils';
import type { AccessibilityPanelProps, TextSize, LineHeight, LetterSpacing, WordSpacing, ContrastLevel, SaturationLevel, PanelPosition, ThemeMode, FontFamily, StorageHandler, EnabledOptions, HighlightTitlesColors, HighlightLinksColors } from './types';
import { defaultEnabledOptions, defaultHighlightTitlesColors, defaultHighlightLinksColors } from './types';

/**
 * AccessibilityPanel Component
 * 
 * A modal panel that provides accessibility customization options including:
 * - Text size adjustment (small, medium, large)
 * - Font family selection (default, sans-serif, serif, dyslexia-friendly, or custom)
 * - Contrast levels (normal, high)
 * - Color saturation (normal, low, high)
 * - Visual options (monochrome mode, hide images)
 * - Preferences (screen reader)
 * - Panel position and theme selection (via Dropdown component)
 * 
 * Features:
 * - Click outside to close
 * - Escape key to close
 * - Screen reader announcements
 * - Session persistence
 * - Customizable styling via classes prop
 * - Custom fonts via customFonts prop (can override default fonts like 'dyslexia-friendly')
 * - Reusable components for consistency (Dropdown, OptionCarousel, CheckboxOption, SectionHeading)
 * 
 * @example
 * // Override dyslexia-friendly font when font script is loaded separately
 * <AccessibilityPanel
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   customFonts={{
 *     'dyslexia-friendly': '"OpenDyslexic", "Comic Sans MS", sans-serif'
 *   }}
 * />
 */
const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ 
  isOpen, 
  onClose,
  className = '',
  classes = {},
  position = 'bottom-right',
  theme = 'auto',
  onPositionChange: externalOnPositionChange,
  onThemeChange: externalOnThemeChange,
  customFonts = {},
  saveMode = 'auto',
  storageType = 'localStorage',
  storageHandler,
  onSave,
  enabledOptions: userEnabledOptions = {},
  highlightTitlesColors: userHighlightTitlesColors = {},
  highlightLinksColors: userHighlightLinksColors = {}
}) => {
  // Merge user-provided enabled options with defaults
  const enabledOptions: Required<EnabledOptions> = {
    ...defaultEnabledOptions,
    ...userEnabledOptions
  };
  
  // Merge user-provided highlight colors with defaults
  const highlightTitlesColors: Required<HighlightTitlesColors> = {
    ...defaultHighlightTitlesColors,
    ...userHighlightTitlesColors
  };
  
  const highlightLinksColors: Required<HighlightLinksColors> = {
    ...defaultHighlightLinksColors,
    ...userHighlightLinksColors
  };
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [textSize, setTextSize] = useState<TextSize>('default');
  const [lineHeight, setLineHeight] = useState<LineHeight>('default');
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacing>('default');
  const [wordSpacing, setWordSpacing] = useState<WordSpacing>('default');
  const [contrast, setContrast] = useState<ContrastLevel>('default');
  const [saturation, setSaturation] = useState<SaturationLevel>('normal');
  const [screenReader, setScreenReader] = useState<boolean>(false);
  const [monochrome, setMonochrome] = useState<boolean>(false);
  const [hideImages, setHideImages] = useState<boolean>(false);
  const [highlightTitles, setHighlightTitles] = useState<boolean>(false);
  const [highlightLinks, setHighlightLinks] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<FontFamily>('default');
  
  // Internal state for position and theme (can override props)
  const [internalPosition, setInternalPosition] = useState<PanelPosition | null>(null);
  const [internalTheme, setInternalTheme] = useState<ThemeMode | null>(null);
  
  // Dropdown states
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState<boolean>(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  
  // Manual save mode state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Track if we should apply effects (used for manual save mode)
  // In auto mode: always apply immediately
  // In manual mode: only apply when this flag is true (triggered by Save button)
  const shouldApplyEffectsRef = useRef<boolean>(saveMode === 'auto');
  
  // Track initial load to apply loaded settings regardless of saveMode
  const isInitialLoadRef = useRef<boolean>(true);
  
  // Use internal state if available, otherwise fall back to props
  const currentPosition = internalPosition ?? position;
  const currentTheme = internalTheme ?? theme;

  // ============================================================================
  // STORAGE UTILITIES
  // ============================================================================

  /**
   * Gets the storage implementation based on props
   * Returns custom storageHandler if provided, otherwise localStorage or sessionStorage
   */
  const getStorage = useCallback((): StorageHandler => {
    if (storageHandler) {
      return storageHandler;
    }
    
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    return {
      getItem: (key: string) => storage.getItem(key),
      setItem: (key: string, value: string) => storage.setItem(key, value),
      removeItem: (key: string) => storage.removeItem(key),
    };
  }, [storageHandler, storageType]);

  /**
   * Saves a value to storage (handles both sync and async storage handlers)
   */
  const saveToStorage = useCallback(async (key: string, value: string): Promise<void> => {
    const storage = getStorage();
    await Promise.resolve(storage.setItem(key, value));
  }, [getStorage]);

  /**
   * Removes a value from storage (handles both sync and async storage handlers)
   */
  const removeFromStorage = useCallback(async (key: string): Promise<void> => {
    const storage = getStorage();
    await Promise.resolve(storage.removeItem(key));
  }, [getStorage]);

  /**
   * Loads a value from storage (handles both sync and async storage handlers)
   */
  const loadFromStorage = useCallback(async (key: string): Promise<string | null> => {
    const storage = getStorage();
    return await Promise.resolve(storage.getItem(key));
  }, [getStorage]);
  
  // ============================================================================
  // REFS
  // ============================================================================
  
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const imagePlaceholdersRef = useRef<Map<HTMLImageElement, HTMLDivElement>>(new Map());

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Gets position classes based on the position prop
   * Returns Tailwind classes for positioning the panel
   */
  const getPositionClasses = (pos: PanelPosition): string => {
    const baseClasses = 'fixed w-auto sm:w-80 md:w-96 max-w-[calc(100vw-1rem)] sm:max-w-none';
    const positionMap: Record<PanelPosition, string> = {
      'bottom-right': 'bottom-20 right-2 left-2 sm:left-auto',
      'bottom-left': 'bottom-20 left-2 right-2 sm:right-auto',
      'top-right': 'top-20 right-2 left-2 sm:left-auto',
      'top-left': 'top-20 left-2 right-2 sm:right-auto',
      'top-center': 'top-20 left-1/2 -translate-x-1/2 right-2 sm:right-auto',
      'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2 right-2 sm:right-auto',
    };
    return `${baseClasses} ${positionMap[pos]}`;
  };

  /**
   * Gets animation classes based on position
   * Provides smooth entrance/exit animations
   */
  const getAnimationClasses = (pos: PanelPosition, open: boolean): string => {
    if (!open) {
      return 'opacity-0 pointer-events-none';
    }
    
    const animationMap: Record<PanelPosition, string> = {
      'bottom-right': 'translate-y-0 opacity-100 pointer-events-auto',
      'bottom-left': 'translate-y-0 opacity-100 pointer-events-auto',
      'top-right': 'translate-y-0 opacity-100 pointer-events-auto',
      'top-left': 'translate-y-0 opacity-100 pointer-events-auto',
      'top-center': 'translate-y-0 opacity-100 pointer-events-auto',
      'bottom-center': 'translate-y-0 opacity-100 pointer-events-auto',
    };
    
    return animationMap[pos];
  };

  /**
   * Gets the CSS font-family value for the selected font family
   * Supports default fonts and custom fonts passed via props
   * Custom fonts can override default fonts (e.g., 'dyslexia-friendly', 'sans-serif', etc.)
   */
  const getFontFamilyValue = useCallback((font: FontFamily): string => {
    // Check if it's a custom font or if a default font is being overridden
    // This allows applications to override default fonts like 'dyslexia-friendly'
    if (customFonts && customFonts[font]) {
      return customFonts[font];
    }
    
    // Default font families (used only if not overridden by customFonts)
    const fontMap: Record<string, string> = {
      'default': 'inherit',
      'sans-serif': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      'serif': 'Georgia, "Times New Roman", Times, serif',
      // OpenDyslexic is loaded via CDN in index.html (fonts.cdnfonts.com)
      // If the font doesn't load, it will fallback to Comic Sans MS and other dyslexia-friendly fonts
      // Note: The font family name from cdnfonts.com might be "OpenDyslexic" or "Open Dyslexic"
      // If it doesn't work, you can override via customFonts prop in App.tsx
      'dyslexia-friendly': '"OpenDyslexic", "Open Dyslexic", "Comic Sans MS", "Trebuchet MS", "Verdana", sans-serif',
    };
    
    return fontMap[font] || fontMap['default'];
  }, [customFonts]);

  /**
   * Applies font family to the document via CSS variable
   */
  const applyFontFamily = useCallback(() => {
    const fontValue = getFontFamilyValue(fontFamily);
    document.documentElement.style.setProperty('--accessibility-font-family', fontValue);
    // Apply to body as well for global effect
    document.body.style.fontFamily = fontValue;
  }, [fontFamily, getFontFamilyValue]);

  /**
   * Gets the font scale value based on text size selection
   * Maps text size options to scale multipliers
   */
  const getFontScaleValue = useCallback((size: TextSize): string => {
    const scaleMap: Record<TextSize, string> = {
      'default': '1',
      'small': '0.875',
      'medium': '1',
      'large': '1.25',
      'extra-large': '1.5',
    };
    return scaleMap[size];
  }, []);

  /**
   * Applies font scale to the document via CSS variable
   * This affects all text elements while maintaining responsive layout
   */
  const applyFontScale = useCallback(() => {
    const scaleValue = getFontScaleValue(textSize);
    document.documentElement.style.setProperty('--font-scale', scaleValue);
  }, [textSize, getFontScaleValue]);

  /**
   * Gets the line height scale value based on selection
   */
  const getLineHeightValue = useCallback((level: LineHeight): string => {
    const scaleMap: Record<LineHeight, string> = {
      'default': '1',
      'tight': '0.75',
      'normal': '1',
      'relaxed': '1.5',
      'loose': '2',
    };
    return scaleMap[level];
  }, []);

  /**
   * Applies line height to the document via CSS variable
   */
  const applyLineHeight = useCallback(() => {
    const scaleValue = getLineHeightValue(lineHeight);
    document.documentElement.style.setProperty('--line-height-scale', scaleValue);
  }, [lineHeight, getLineHeightValue]);

  /**
   * Gets the letter spacing scale value based on selection
   */
  const getLetterSpacingValue = useCallback((level: LetterSpacing): string => {
    const scaleMap: Record<LetterSpacing, string> = {
      'default': '1',
      'tight': '0.5',
      'normal': '1',
      'wide': '1.5',
      'extra-wide': '2',
    };
    return scaleMap[level];
  }, []);

  /**
   * Applies letter spacing to the document via CSS variable
   */
  const applyLetterSpacing = useCallback(() => {
    const scaleValue = getLetterSpacingValue(letterSpacing);
    document.documentElement.style.setProperty('--letter-spacing-scale', scaleValue);
  }, [letterSpacing, getLetterSpacingValue]);

  /**
   * Gets the word spacing scale value based on selection
   */
  const getWordSpacingValue = useCallback((level: WordSpacing): string => {
    const scaleMap: Record<WordSpacing, string> = {
      'default': '1',
      'tight': '0.5',
      'normal': '1',
      'wide': '1.5',
      'extra-wide': '2',
    };
    return scaleMap[level];
  }, []);

  /**
   * Applies word spacing to the document via CSS variable
   */
  const applyWordSpacing = useCallback(() => {
    const scaleValue = getWordSpacingValue(wordSpacing);
    document.documentElement.style.setProperty('--word-spacing-scale', scaleValue);
  }, [wordSpacing, getWordSpacingValue]);

  /**
   * Applies all active filters to the document
   * Combines monochrome and saturation filters when both are active
   * This ensures filters work together without conflicts
   */
  const applyFilters = useCallback(() => {
    const filters: string[] = [];
    
    // Add grayscale filter if monochrome is enabled
    if (monochrome) {
      filters.push('grayscale(100%)');
    }
    
    // Add saturation filter based on saturation level
    if (saturation === 'low') {
      filters.push('saturate(0.5)');
    } else if (saturation === 'high') {
      filters.push('saturate(1.5)');
    }
    // Normal saturation (1x) doesn't need a filter
    
    // Apply combined filters or remove filter if none are active
    document.documentElement.style.filter = filters.length > 0 ? filters.join(' ') : '';
  }, [monochrome, saturation]);


  /**
   * Applies or removes image hiding feature
   * When enabled, replaces all images with placeholders showing alt text
   * Maintains layout integrity by preserving original image dimensions
   */
  const applyHideImages = (enabled: boolean): void => {
    // Select all images except those marked as decorative (aria-hidden="true")
    // This prevents affecting the accessibility panel's own images
    const images = document.querySelectorAll<HTMLImageElement>('img:not([aria-hidden="true"])');
    
    if (enabled) {
      images.forEach((img) => {
        // Skip if this image has already been processed
        if (img.dataset.originalDisplay !== undefined) return;
        
        // Store original styles to restore later
        img.dataset.originalDisplay = img.style.display || '';
        img.dataset.originalWidth = img.style.width || '';
        img.dataset.originalHeight = img.style.height || '';
        
        // Get image dimensions to maintain layout
        // Try multiple methods to ensure we get accurate dimensions
        const rect = img.getBoundingClientRect();
        const width = rect.width || img.width || img.offsetWidth || 200;
        const height = rect.height || img.height || img.offsetHeight || 150;
        
        // Get alt text for the placeholder, fallback to 'Image' if none
        const altText = img.alt || 'Image';
        
        // Hide the original image
        img.style.display = 'none';
        
        // Create a placeholder div that will show the alt text
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        // Apply inline styles to match image dimensions and create visual placeholder
        placeholder.style.cssText = `
          display: inline-flex;
          width: ${width}px;
          min-width: ${width}px;
          height: ${height}px;
          min-height: ${height}px;
          background-color: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 12px;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #64748b;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
          box-sizing: border-box;
          vertical-align: top;
        `;
        placeholder.textContent = altText;
        placeholder.setAttribute('aria-label', `Image: ${altText}`);
        
        // Insert placeholder in the DOM right after the image
        // This maintains the layout flow
        if (img.parentNode) {
          img.parentNode.insertBefore(placeholder, img.nextSibling);
        }
        
        // Store reference for later cleanup
        imagePlaceholdersRef.current.set(img, placeholder);
      });
    } else {
      // Restore all images when feature is disabled
      images.forEach((img) => {
        if (img.dataset.originalDisplay !== undefined) {
          // Restore original image styles
          img.style.display = img.dataset.originalDisplay;
          img.style.width = img.dataset.originalWidth || '';
          img.style.height = img.dataset.originalHeight || '';
          
          // Remove the placeholder element from DOM
          const placeholder = imagePlaceholdersRef.current.get(img);
          if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
          }
          // Remove from our tracking map
          imagePlaceholdersRef.current.delete(img);
          
          // Clean up data attributes used for restoration
          delete img.dataset.originalDisplay;
          delete img.dataset.originalWidth;
          delete img.dataset.originalHeight;
        }
      });
    }
  };

  /**
   * Applies contrast mode to the entire application
   * - 'default': No contrast modifications (original page styles)
   * - 'low': Reduced contrast for users sensitive to high contrast
   * - 'high': WCAG 2.2 AA compliant high contrast mode
   * - 'dark': Dark theme with high contrast
   * Uses CSS injection to apply globally without modifying application code
   */
  const applyContrast = (level: ContrastLevel): void => {
    const styleId = 'accessibility-contrast-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    
    // Remove existing contrast styles
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
      styleElement = null;
    }
    
    // Default = no modifications, remove any applied styles
    if (level === 'default') {
      document.documentElement.removeAttribute('data-contrast');
      return;
    }
    
    // Create style element for contrast modes
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
    
    // Set data attribute for potential CSS hooks
    document.documentElement.setAttribute('data-contrast', level);
    
    if (level === 'low') {
      // Low contrast mode - softer colors, reduced contrast for users sensitive to high contrast
      styleElement.textContent = `
        /* Low Contrast Mode - Softer, reduced contrast */
        /* Excludes accessibility panel elements */
        :root {
          --accessibility-bg-primary: #f5f5f5 !important;
          --accessibility-bg-secondary: #ebebeb !important;
          --accessibility-text-primary: #4a4a4a !important;
          --accessibility-text-secondary: #6a6a6a !important;
          --accessibility-border-color: #c0c0c0 !important;
          --accessibility-link-color: #5a7cb0 !important;
          --accessibility-link-visited: #7a6a9a !important;
        }
        
        /* Apply low contrast to all elements except accessibility panel */
        body *:not([data-accessibility-panel]):not([data-accessibility-panel] *) {
          background-color: var(--accessibility-bg-primary, #f5f5f5) !important;
          color: var(--accessibility-text-primary, #4a4a4a) !important;
          border-color: var(--accessibility-border-color, #c0c0c0) !important;
        }
        
        /* Softer links */
        a:not([data-accessibility-panel] *):not(.accessibility-panel-link) {
          color: var(--accessibility-link-color, #5a7cb0) !important;
        }
        
        a:visited:not([data-accessibility-panel] *):not(.accessibility-panel-link) {
          color: var(--accessibility-link-visited, #7a6a9a) !important;
        }
        
        /* Softer buttons and inputs */
        button:not([data-accessibility-panel] *),
        input:not([data-accessibility-panel] *),
        select:not([data-accessibility-panel] *),
        textarea:not([data-accessibility-panel] *) {
          background-color: #f0f0f0 !important;
          color: #4a4a4a !important;
          border: 1px solid #c0c0c0 !important;
        }
        
        button:not([data-accessibility-panel] *):hover,
        button:not([data-accessibility-panel] *):focus,
        input:not([data-accessibility-panel] *):focus,
        select:not([data-accessibility-panel] *):focus,
        textarea:not([data-accessibility-panel] *):focus {
          outline: 2px solid #8ab4f8 !important;
          outline-offset: 1px !important;
        }
        
        /* Softer image borders */
        img:not([data-accessibility-panel] *):not([aria-hidden="true"]) {
          border: 1px solid #d0d0d0 !important;
        }
        
        /* Table borders */
        table:not([data-accessibility-panel] *),
        th:not([data-accessibility-panel] *),
        td:not([data-accessibility-panel] *) {
          border: 1px solid #d0d0d0 !important;
        }
        
        /* Softer selection */
        ::selection {
          background-color: #b3d4fc !important;
          color: #4a4a4a !important;
        }
        
        /* Softer focus */
        *:focus-visible:not([data-accessibility-panel] *) {
          outline: 2px solid #8ab4f8 !important;
          outline-offset: 1px !important;
        }
        
        /* Placeholder text */
        ::placeholder {
          color: #8a8a8a !important;
          opacity: 1 !important;
        }
      `;
    } else if (level === 'high') {
      // WCAG 2.2 AA compliant high contrast mode
      // Ensures minimum 4.5:1 contrast ratio for normal text
      // and 3:1 for large text
      styleElement.textContent = `
        /* High Contrast Mode - WCAG 2.2 AA Compliant */
        /* Excludes accessibility panel elements */
        :root {
          --accessibility-bg-primary: #ffffff !important;
          --accessibility-bg-secondary: #f8f8f8 !important;
          --accessibility-text-primary: #000000 !important;
          --accessibility-text-secondary: #1a1a1a !important;
          --accessibility-border-color: #000000 !important;
          --accessibility-link-color: #0000ee !important;
          --accessibility-link-visited: #551a8b !important;
          --accessibility-focus-color: #000000 !important;
        }
        
        /* Apply high contrast to all elements except accessibility panel */
        body *:not([data-accessibility-panel]):not([data-accessibility-panel] *) {
          background-color: var(--accessibility-bg-primary, #ffffff) !important;
          color: var(--accessibility-text-primary, #000000) !important;
          border-color: var(--accessibility-border-color, #000000) !important;
        }
        
        /* Ensure links are visible */
        a:not([data-accessibility-panel] *):not(.accessibility-panel-link) {
          color: var(--accessibility-link-color, #0000ee) !important;
          text-decoration: underline !important;
        }
        
        a:visited:not([data-accessibility-panel] *):not(.accessibility-panel-link) {
          color: var(--accessibility-link-visited, #551a8b) !important;
        }
        
        /* Ensure buttons and inputs are visible */
        button:not([data-accessibility-panel] *),
        input:not([data-accessibility-panel] *),
        select:not([data-accessibility-panel] *),
        textarea:not([data-accessibility-panel] *) {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 2px solid #000000 !important;
        }
        
        button:not([data-accessibility-panel] *):hover,
        button:not([data-accessibility-panel] *):focus,
        input:not([data-accessibility-panel] *):focus,
        select:not([data-accessibility-panel] *):focus,
        textarea:not([data-accessibility-panel] *):focus {
          outline: 3px solid #000000 !important;
          outline-offset: 2px !important;
        }
        
        /* Ensure images have borders for visibility */
        img:not([data-accessibility-panel] *):not([aria-hidden="true"]) {
          border: 1px solid #000000 !important;
        }
        
        /* Table borders */
        table:not([data-accessibility-panel] *),
        th:not([data-accessibility-panel] *),
        td:not([data-accessibility-panel] *) {
          border: 1px solid #000000 !important;
        }
        
        /* Selection contrast */
        ::selection {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        
        /* Focus visible enhancement */
        *:focus-visible:not([data-accessibility-panel] *) {
          outline: 3px solid #000000 !important;
          outline-offset: 2px !important;
        }
        
        /* Placeholder text */
        ::placeholder {
          color: #595959 !important;
          opacity: 1 !important;
        }
      `;
    } else if (level === 'dark') {
      // Dark contrast mode - dark theme with high contrast
      styleElement.textContent = `
        /* Dark Contrast Mode */
        /* Excludes accessibility panel elements */
        :root {
          --accessibility-bg-primary: #121212 !important;
          --accessibility-bg-secondary: #1e1e1e !important;
          --accessibility-text-primary: #ffffff !important;
          --accessibility-text-secondary: #e0e0e0 !important;
          --accessibility-border-color: #ffffff !important;
          --accessibility-link-color: #90caf9 !important;
          --accessibility-link-visited: #ce93d8 !important;
          --accessibility-focus-color: #ffffff !important;
        }
        
        /* Apply dark contrast to all elements except accessibility panel */
        body *:not([data-accessibility-panel]):not([data-accessibility-panel] *) {
          background-color: var(--accessibility-bg-primary, #121212) !important;
          color: var(--accessibility-text-primary, #ffffff) !important;
          border-color: var(--accessibility-border-color, #444444) !important;
        }
        
        /* Dark mode for secondary backgrounds */
        header:not([data-accessibility-panel] *),
        footer:not([data-accessibility-panel] *),
        aside:not([data-accessibility-panel] *),
        nav:not([data-accessibility-panel] *),
        section:not([data-accessibility-panel] *) > div:not([data-accessibility-panel] *) {
          background-color: var(--accessibility-bg-secondary, #1e1e1e) !important;
        }
        
        /* Ensure links are visible in dark mode */
        a:not([data-accessibility-panel] *):not(.accessibility-panel-link) {
          color: var(--accessibility-link-color, #90caf9) !important;
          text-decoration: underline !important;
        }
        
        a:visited:not([data-accessibility-panel] *):not(.accessibility-panel-link) {
          color: var(--accessibility-link-visited, #ce93d8) !important;
        }
        
        /* Ensure buttons and inputs are visible in dark mode */
        button:not([data-accessibility-panel] *),
        input:not([data-accessibility-panel] *),
        select:not([data-accessibility-panel] *),
        textarea:not([data-accessibility-panel] *) {
          background-color: #2d2d2d !important;
          color: #ffffff !important;
          border: 2px solid #555555 !important;
        }
        
        button:not([data-accessibility-panel] *):hover,
        button:not([data-accessibility-panel] *):focus,
        input:not([data-accessibility-panel] *):focus,
        select:not([data-accessibility-panel] *):focus,
        textarea:not([data-accessibility-panel] *):focus {
          outline: 3px solid #90caf9 !important;
          outline-offset: 2px !important;
          border-color: #90caf9 !important;
        }
        
        /* Images in dark mode */
        img:not([data-accessibility-panel] *):not([aria-hidden="true"]) {
          border: 1px solid #444444 !important;
          opacity: 0.9;
        }
        
        /* Table styling in dark mode */
        table:not([data-accessibility-panel] *),
        th:not([data-accessibility-panel] *),
        td:not([data-accessibility-panel] *) {
          border: 1px solid #444444 !important;
        }
        
        th:not([data-accessibility-panel] *) {
          background-color: #2d2d2d !important;
        }
        
        /* Selection in dark mode */
        ::selection {
          background-color: #90caf9 !important;
          color: #000000 !important;
        }
        
        /* Focus visible in dark mode */
        *:focus-visible:not([data-accessibility-panel] *) {
          outline: 3px solid #90caf9 !important;
          outline-offset: 2px !important;
        }
        
        /* Placeholder text in dark mode */
        ::placeholder {
          color: #9e9e9e !important;
          opacity: 1 !important;
        }
        
        /* Scrollbar styling for dark mode */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: #555555;
          border-radius: 6px;
          border: 2px solid #1e1e1e;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background-color: #777777;
        }
      `;
    }
  };

  /**
   * Applies or removes title highlighting
   * Adds a high-contrast outline/background to all heading elements (h1-h6)
   * Uses WCAG AA compliant colors for visibility
   */
  const applyHighlightTitles = (enabled: boolean): void => {
    const styleId = 'accessibility-highlight-titles-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    
    if (enabled) {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      // High-contrast styles for headings using customizable colors
      // Forces text color to ensure readability on background
      const { backgroundColor, textColor, outlineColor } = highlightTitlesColors;
      styleElement.textContent = `
        h1:not([aria-hidden="true"]),
        h2:not([aria-hidden="true"]),
        h3:not([aria-hidden="true"]),
        h4:not([aria-hidden="true"]),
        h5:not([aria-hidden="true"]),
        h6:not([aria-hidden="true"]),
        [role="heading"]:not([aria-hidden="true"]) {
          background-color: ${backgroundColor} !important;
          color: ${textColor} !important;
          outline: 3px solid ${outlineColor} !important;
          outline-offset: 2px !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          box-decoration-break: clone !important;
        }
      `;
    } else {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }
  };

  /**
   * Applies or removes link highlighting
   * Adds a high-contrast outline/background to all interactive links
   * Works for anchor tags and elements with role="link"
   * Handles dynamically loaded content via MutationObserver
   */
  const applyHighlightLinks = (enabled: boolean): void => {
    const styleId = 'accessibility-highlight-links-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    
    if (enabled) {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      // High-contrast styles for links using customizable colors
      // Preserves focus and hover states
      const { backgroundColor, textColor, outlineColor, hoverBackgroundColor, hoverOutlineColor } = highlightLinksColors;
      
      // Convert hex color to rgba for box-shadow (extract RGB values)
      const hexToRgba = (hex: string, alpha: number): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
        }
        return `rgba(14, 116, 144, ${alpha})`; // fallback
      };
      
      styleElement.textContent = `
        a:not([aria-hidden="true"]):not(.accessibility-panel-link),
        [role="link"]:not([aria-hidden="true"]) {
          background-color: ${backgroundColor} !important;
          color: ${textColor} !important;
          outline: 2px solid ${outlineColor} !important;
          outline-offset: 1px !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          box-decoration-break: clone !important;
          text-decoration: underline !important;
          text-decoration-color: ${outlineColor} !important;
        }
        
        a:not([aria-hidden="true"]):not(.accessibility-panel-link):hover,
        a:not([aria-hidden="true"]):not(.accessibility-panel-link):focus,
        [role="link"]:not([aria-hidden="true"]):hover,
        [role="link"]:not([aria-hidden="true"]):focus {
          background-color: ${hoverBackgroundColor} !important;
          outline: 3px solid ${hoverOutlineColor} !important;
          outline-offset: 2px !important;
        }
        
        a:not([aria-hidden="true"]):not(.accessibility-panel-link):focus-visible,
        [role="link"]:not([aria-hidden="true"]):focus-visible {
          outline: 3px solid ${hoverOutlineColor} !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px ${hexToRgba(hoverOutlineColor, 0.3)} !important;
        }
      `;
    } else {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Handles theme mode changes
   * Supports 'light', 'dark', or 'auto' (system preference)
   */
  useEffect(() => {
    const activeTheme = currentTheme;
    if (activeTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent): void => {
        setIsDarkMode(e.matches);
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } else {
      setIsDarkMode(activeTheme === 'dark');
    }
  }, [currentTheme]);

  /**
   * Loads saved settings from storage on component mount
   * Restores monochrome, saturation, hide images, position, theme, font family, and text size preferences if they were previously set
   */
  useEffect(() => {
    const loadSettings = async () => {
      const savedMonochrome = await loadFromStorage('accessibility-monochrome');
      if (savedMonochrome !== null) {
        const isMonochrome = savedMonochrome === 'true';
        setMonochrome(isMonochrome);
      }
      
      const savedSaturation = await loadFromStorage('accessibility-saturation');
      if (savedSaturation !== null && (savedSaturation === 'normal' || savedSaturation === 'low' || savedSaturation === 'high')) {
        setSaturation(savedSaturation as SaturationLevel);
      }
      
      const savedHideImages = await loadFromStorage('accessibility-hide-images');
      if (savedHideImages !== null) {
        const shouldHideImages = savedHideImages === 'true';
        setHideImages(shouldHideImages);
        if (shouldHideImages) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            applyHideImages(true);
          }, 100);
        }
      }
      
      const savedHighlightTitles = await loadFromStorage('accessibility-highlight-titles');
      if (savedHighlightTitles !== null) {
        const shouldHighlightTitles = savedHighlightTitles === 'true';
        setHighlightTitles(shouldHighlightTitles);
        if (shouldHighlightTitles) {
          setTimeout(() => {
            applyHighlightTitles(true);
          }, 100);
        }
      }
      
      const savedHighlightLinks = await loadFromStorage('accessibility-highlight-links');
      if (savedHighlightLinks !== null) {
        const shouldHighlightLinks = savedHighlightLinks === 'true';
        setHighlightLinks(shouldHighlightLinks);
        if (shouldHighlightLinks) {
          setTimeout(() => {
            applyHighlightLinks(true);
          }, 100);
        }
      }
      
      const savedContrast = await loadFromStorage('accessibility-contrast');
      if (savedContrast !== null && (savedContrast === 'default' || savedContrast === 'low' || savedContrast === 'high' || savedContrast === 'dark')) {
        const contrastLevel = savedContrast as ContrastLevel;
        setContrast(contrastLevel);
        if (contrastLevel !== 'default') {
          setTimeout(() => {
            applyContrast(contrastLevel);
          }, 100);
        }
      }
      
      const savedPosition = await loadFromStorage('accessibility-position');
      if (savedPosition !== null && (
        savedPosition === 'bottom-right' || savedPosition === 'bottom-left' ||
        savedPosition === 'top-right' || savedPosition === 'top-left' ||
        savedPosition === 'top-center' || savedPosition === 'bottom-center'
      )) {
        const loadedPosition = savedPosition as PanelPosition;
        setInternalPosition(loadedPosition);
        // Notify parent of loaded position
        if (externalOnPositionChange) {
          externalOnPositionChange(loadedPosition);
        }
      }
      
      const savedTheme = await loadFromStorage('accessibility-theme');
      if (savedTheme !== null && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
        setInternalTheme(savedTheme as ThemeMode);
      }
      
      const savedFontFamily = await loadFromStorage('accessibility-font-family');
      if (savedFontFamily !== null) {
        setFontFamily(savedFontFamily as FontFamily);
      }
      
      const savedTextSize = await loadFromStorage('accessibility-text-size');
      if (savedTextSize !== null && (savedTextSize === 'default' || savedTextSize === 'small' || savedTextSize === 'medium' || savedTextSize === 'large' || savedTextSize === 'extra-large')) {
        setTextSize(savedTextSize as TextSize);
      }
      
      const savedLineHeight = await loadFromStorage('accessibility-line-height');
      if (savedLineHeight !== null && (savedLineHeight === 'default' || savedLineHeight === 'tight' || savedLineHeight === 'normal' || savedLineHeight === 'relaxed' || savedLineHeight === 'loose')) {
        setLineHeight(savedLineHeight as LineHeight);
      }
      
      const savedLetterSpacing = await loadFromStorage('accessibility-letter-spacing');
      if (savedLetterSpacing !== null && (savedLetterSpacing === 'default' || savedLetterSpacing === 'tight' || savedLetterSpacing === 'normal' || savedLetterSpacing === 'wide' || savedLetterSpacing === 'extra-wide')) {
        setLetterSpacing(savedLetterSpacing as LetterSpacing);
      }
      
      const savedWordSpacing = await loadFromStorage('accessibility-word-spacing');
      if (savedWordSpacing !== null && (savedWordSpacing === 'default' || savedWordSpacing === 'tight' || savedWordSpacing === 'normal' || savedWordSpacing === 'wide' || savedWordSpacing === 'extra-wide')) {
        setWordSpacing(savedWordSpacing as WordSpacing);
      }
      
      // Load screen reader setting
      const savedScreenReader = await loadFromStorage('accessibility-screen-reader');
      if (savedScreenReader !== null) {
        const shouldEnableScreenReader = savedScreenReader === 'true';
        setScreenReader(shouldEnableScreenReader);
        // Enable speech synthesis if screen reader is enabled
        setSpeechSynthesis(shouldEnableScreenReader);
        if (shouldEnableScreenReader) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            enableScreenReaderMode({
              enhancedAria: true,
              skipLinks: true,
              enhancedFocus: true,
              landmarkRoles: true,
              liveRegions: true,
            });
          }, 100);
        }
      }
      
      // Mark initial load as complete after a short delay
      // This allows all loaded settings to be applied before switching to manual mode behavior
      setTimeout(() => {
        isInitialLoadRef.current = false;
        // Update shouldApplyEffectsRef based on saveMode
        shouldApplyEffectsRef.current = saveMode === 'auto';
      }, 200);
    };

    loadSettings();
    
    
    // Initialize the global announcer for reliable screen reader announcements
    // Options:
    // - debug: false = don't show visual toast notifications by default
    // - speechSynthesis: false = don't enable text-to-speech by default (enabled when screen reader is turned on)
    initializeAnnouncer({ debug: false, speechSynthesis: false });
  }, [externalOnPositionChange, loadFromStorage, saveMode]);

  /**
   * Applies filters whenever monochrome or saturation state changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyFilters();
    }
  }, [applyFilters]);

  /**
   * Applies font family whenever fontFamily state changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyFontFamily();
    }
  }, [fontFamily, applyFontFamily]);

  /**
   * Applies font scale whenever textSize state changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyFontScale();
    }
  }, [applyFontScale]);

  /**
   * Applies line height whenever lineHeight state changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyLineHeight();
    }
  }, [applyLineHeight]);

  /**
   * Applies letter spacing whenever letterSpacing state changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyLetterSpacing();
    }
  }, [applyLetterSpacing]);

  /**
   * Applies word spacing whenever wordSpacing state changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyWordSpacing();
    }
  }, [applyWordSpacing]);

  /**
   * Watches for dynamically added images when hideImages is enabled
   * Uses MutationObserver to detect new images added to the DOM
   * and automatically applies the hide images feature to them
   * In manual mode, only activates after Save is clicked
   */
  useEffect(() => {
    if (!hideImages) return;
    if (!shouldApplyEffectsRef.current && !isInitialLoadRef.current) return;

    const observer = new MutationObserver(() => {
      // Re-apply hide images when DOM changes
      applyHideImages(true);
    });

    // Observe the entire document body for new nodes
    observer.observe(document.body, {
      childList: true,  // Watch for added/removed child nodes
      subtree: true,    // Watch all descendants, not just direct children
    });

    return () => observer.disconnect();
  }, [hideImages]);

  /**
   * Applies contrast mode styling when the setting changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyContrast(contrast);
    }
  }, [contrast]);

  /**
   * Applies highlight titles styling when the setting changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyHighlightTitles(highlightTitles);
    }
  }, [highlightTitles]);

  /**
   * Applies highlight links styling when the setting changes
   * In manual mode, only applies during initial load or when Save is clicked
   */
  useEffect(() => {
    if (shouldApplyEffectsRef.current || isInitialLoadRef.current) {
      applyHighlightLinks(highlightLinks);
    }
  }, [highlightLinks]);

  /**
   * Closes dropdowns when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        (isPositionDropdownOpen || isThemeDropdownOpen)
      ) {
        setIsPositionDropdownOpen(false);
        setIsThemeDropdownOpen(false);
      }
    };

    if (isPositionDropdownOpen || isThemeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPositionDropdownOpen, isThemeDropdownOpen]);

  /**
   * Manages focus when panel opens
   * Moves focus to the close button for better keyboard navigation
   */
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to ensure panel is visible
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  /**
   * Cleanup screen reader mode on unmount
   * This ensures screen reader enhancements are properly removed
   */
  useEffect(() => {
    return () => {
      if (isScreenReaderModeEnabled()) {
        disableScreenReaderMode();
      }
    };
  }, []);

  /**
   * Handles Escape key press to close the panel
   * Adds event listener when panel is open, removes when closed
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  /**
   * Handles clicks outside the panel to close it
   * Uses capture phase to catch clicks before they bubble
   * Excludes clicks on the accessibility button that opens the panel
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside the panel
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        // Don't close if clicking on the accessibility button that opens the panel
        // This prevents the panel from closing immediately after opening
        !(target instanceof Element && target.closest('[aria-controls="accessibility-panel"]'))
      ) {
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase to catch clicks before they bubble
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isOpen, onClose]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Announces state changes to screen readers
   * Uses a global aria-live region for reliable announcements
   * Only announces when screen reader mode is enabled
   */
  const announceChange = useCallback((message: string): void => {
    // Only announce if screen reader mode is enabled
    if (!screenReader) {
      return;
    }
    
    // Use the global announcement function for reliability
    // This works even when the panel is closed
    announceToScreenReader(message, 'polite');
    
    // Also update the local ref if available (for backwards compatibility)
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, [screenReader]);

  /**
   * Helper function to conditionally save to storage based on saveMode
   */
  const conditionalSave = useCallback(async (key: string, value: string): Promise<void> => {
    if (saveMode === 'auto') {
      await saveToStorage(key, value);
    } else {
      setHasUnsavedChanges(true);
    }
  }, [saveMode, saveToStorage]);

  const handleTextSizeChange = (size: TextSize): void => {
    setTextSize(size);
    conditionalSave('accessibility-text-size', size);
    announceChange(`Text size changed to ${size}`);
  };

  const handleLineHeightChange = (level: LineHeight): void => {
    setLineHeight(level);
    conditionalSave('accessibility-line-height', level);
    const displayName = level === 'default' ? 'default' : level;
    announceChange(`Line height changed to ${displayName}`);
  };

  const handleLetterSpacingChange = (level: LetterSpacing): void => {
    setLetterSpacing(level);
    conditionalSave('accessibility-letter-spacing', level);
    const displayName = level === 'default' ? 'default' : level === 'extra-wide' ? 'extra wide' : level;
    announceChange(`Letter spacing changed to ${displayName}`);
  };

  const handleWordSpacingChange = (level: WordSpacing): void => {
    setWordSpacing(level);
    conditionalSave('accessibility-word-spacing', level);
    const displayName = level === 'default' ? 'default' : level === 'extra-wide' ? 'extra wide' : level;
    announceChange(`Word spacing changed to ${displayName}`);
  };

  const handleContrastChange = (level: ContrastLevel): void => {
    setContrast(level);
    // In auto mode, apply immediately. In manual mode, only apply when Save is clicked
    if (saveMode === 'auto') {
      applyContrast(level);
    } else {
      setHasUnsavedChanges(true);
    }
    conditionalSave('accessibility-contrast', level);
    const levelLabels: Record<ContrastLevel, string> = {
      default: 'Default',
      low: 'Low Contrast',
      high: 'High Contrast',
      dark: 'Dark Mode'
    };
    announceChange(`Contrast changed to ${levelLabels[level]}`);
  };

  const handleSaturationChange = (level: SaturationLevel): void => {
    setSaturation(level);
    conditionalSave('accessibility-saturation', level);
    announceChange(`Saturation changed to ${level}`);
  };

  const handleScreenReaderChange = (checked: boolean): void => {
    setScreenReader(checked);
    
    // If turning off, stop any ongoing speech immediately
    if (!checked) {
      stopSpeaking();
    }
    
    // Enable/disable speech synthesis based on screen reader state
    setSpeechSynthesis(checked);
    
    // In auto mode, apply immediately. In manual mode, only apply when Save is clicked
    if (saveMode === 'auto') {
      if (checked) {
        enableScreenReaderMode({
          enhancedAria: true,
          skipLinks: true,
          enhancedFocus: true,
          landmarkRoles: true,
          liveRegions: true,
        });
      } else {
        disableScreenReaderMode();
      }
    } else {
      setHasUnsavedChanges(true);
    }
    
    conditionalSave('accessibility-screen-reader', checked.toString());
    
    // Announce only if enabling (since we just enabled speech synthesis)
    if (checked) {
      announceChange('Screen reader mode enabled. Enhanced accessibility features are now active.');
    }
  };

  const handleMonochromeChange = (checked: boolean): void => {
    setMonochrome(checked);
    conditionalSave('accessibility-monochrome', checked.toString());
    announceChange(`Monochrome mode ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleHideImagesChange = (checked: boolean): void => {
    setHideImages(checked);
    // In auto mode, apply immediately. In manual mode, only apply when Save is clicked
    if (saveMode === 'auto') {
      applyHideImages(checked);
    } else {
      setHasUnsavedChanges(true);
    }
    conditionalSave('accessibility-hide-images', checked.toString());
    announceChange(`Hide images ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleHighlightTitlesChange = (checked: boolean): void => {
    setHighlightTitles(checked);
    // In auto mode, apply immediately. In manual mode, only apply when Save is clicked
    if (saveMode === 'auto') {
      applyHighlightTitles(checked);
    } else {
      setHasUnsavedChanges(true);
    }
    conditionalSave('accessibility-highlight-titles', checked.toString());
    announceChange(`Highlight titles ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleHighlightLinksChange = (checked: boolean): void => {
    setHighlightLinks(checked);
    // In auto mode, apply immediately. In manual mode, only apply when Save is clicked
    if (saveMode === 'auto') {
      applyHighlightLinks(checked);
    } else {
      setHasUnsavedChanges(true);
    }
    conditionalSave('accessibility-highlight-links', checked.toString());
    announceChange(`Highlight links ${checked ? 'enabled' : 'disabled'}`);
  };

  const handlePositionChange = (newPosition: PanelPosition): void => {
    setInternalPosition(newPosition);
    conditionalSave('accessibility-position', newPosition);
    announceChange(`Panel position changed to ${newPosition.replace('-', ' ')}`);
    // Notify parent component if callback is provided
    if (externalOnPositionChange) {
      externalOnPositionChange(newPosition);
    }
  };

  const handleThemeChange = (newTheme: ThemeMode): void => {
    setInternalTheme(newTheme);
    conditionalSave('accessibility-theme', newTheme);
    announceChange(`Theme changed to ${newTheme}`);
    // Notify parent component if callback is provided
    if (externalOnThemeChange) {
      externalOnThemeChange(newTheme);
    }
  };

  const handleFontFamilyChange = (newFontFamily: FontFamily): void => {
    setFontFamily(newFontFamily);
    conditionalSave('accessibility-font-family', newFontFamily);
    const fontDisplayName = newFontFamily === 'dyslexia-friendly' ? 'dyslexia friendly' : newFontFamily;
    announceChange(`Font family changed to ${fontDisplayName}`);
  };

  /**
   * Saves all current settings to storage (used in manual save mode)
   */
  const handleSaveSettings = async (): Promise<void> => {
    setIsSaving(true);
    
    try {
      // Apply all visual effects when saving in manual mode
      applyFontFamily();
      applyFontScale();
      applyLineHeight();
      applyLetterSpacing();
      applyWordSpacing();
      applyFilters();
      applyHideImages(hideImages);
      applyHighlightTitles(highlightTitles);
      applyHighlightLinks(highlightLinks);
      applyContrast(contrast);
      
      // Apply screen reader mode and speech synthesis
      setSpeechSynthesis(screenReader);
      if (screenReader) {
        enableScreenReaderMode({
          enhancedAria: true,
          skipLinks: true,
          enhancedFocus: true,
          landmarkRoles: true,
          liveRegions: true,
        });
      } else {
        disableScreenReaderMode();
      }
      
      // Save to storage
      await Promise.all([
        saveToStorage('accessibility-text-size', textSize),
        saveToStorage('accessibility-line-height', lineHeight),
        saveToStorage('accessibility-letter-spacing', letterSpacing),
        saveToStorage('accessibility-word-spacing', wordSpacing),
        saveToStorage('accessibility-contrast', contrast),
        saveToStorage('accessibility-saturation', saturation),
        saveToStorage('accessibility-monochrome', monochrome.toString()),
        saveToStorage('accessibility-hide-images', hideImages.toString()),
        saveToStorage('accessibility-highlight-titles', highlightTitles.toString()),
        saveToStorage('accessibility-highlight-links', highlightLinks.toString()),
        saveToStorage('accessibility-font-family', fontFamily),
        saveToStorage('accessibility-screen-reader', screenReader.toString()),
        ...(internalPosition ? [saveToStorage('accessibility-position', internalPosition)] : []),
        ...(internalTheme ? [saveToStorage('accessibility-theme', internalTheme)] : []),
      ]);
      
      setHasUnsavedChanges(false);
      announceChange('Settings saved');
      
      // Call onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
      announceChange('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Resets all accessibility settings to their default values
   * Removes all filters, clears storage, and announces the reset
   */
  const handleReset = async (): Promise<void> => {
    // Reset all values to defaults
    setTextSize('default');
    setLineHeight('default');
    setLetterSpacing('default');
    setWordSpacing('default');
    setContrast('default');
    setSaturation('normal');
    setScreenReader(false);
    setMonochrome(false);
    setHideImages(false);
    setHighlightTitles(false);
    setHighlightLinks(false);
    setFontFamily('default');
    setInternalPosition(null);
    setInternalTheme(null);
    setHasUnsavedChanges(false);
    
    // Apply default visual effects immediately (regardless of save mode)
    // Reset font family to default
    const defaultFontValue = 'inherit';
    document.documentElement.style.setProperty('--accessibility-font-family', defaultFontValue);
    document.body.style.fontFamily = defaultFontValue;
    
    // Reset font scale to default (1)
    document.documentElement.style.setProperty('--font-scale', '1');
    
    // Reset line height to default
    document.documentElement.style.setProperty('--line-height-scale', '1.5');
    
    // Reset letter spacing to default
    document.documentElement.style.setProperty('--letter-spacing-scale', '0');
    
    // Reset word spacing to default
    document.documentElement.style.setProperty('--word-spacing-scale', '0');
    
    // Remove all filters (monochrome, saturation)
    document.documentElement.style.filter = '';
    
    // Restore images
    applyHideImages(false);
    
    // Remove highlight styles
    applyHighlightTitles(false);
    applyHighlightLinks(false);
    
    // Reset contrast to default (low)
    applyContrast('low');
    
    // Disable screen reader mode and speech synthesis if enabled
    setSpeechSynthesis(false);
    if (isScreenReaderModeEnabled()) {
      disableScreenReaderMode();
    }
    
    // Clear storage
    await Promise.all([
      removeFromStorage('accessibility-monochrome'),
      removeFromStorage('accessibility-saturation'),
      removeFromStorage('accessibility-hide-images'),
      removeFromStorage('accessibility-highlight-titles'),
      removeFromStorage('accessibility-highlight-links'),
      removeFromStorage('accessibility-position'),
      removeFromStorage('accessibility-theme'),
      removeFromStorage('accessibility-font-family'),
      removeFromStorage('accessibility-text-size'),
      removeFromStorage('accessibility-line-height'),
      removeFromStorage('accessibility-letter-spacing'),
      removeFromStorage('accessibility-word-spacing'),
      removeFromStorage('accessibility-screen-reader'),
      removeFromStorage('accessibility-contrast'),
    ]);
    
    // Announce reset
    announceChange('All accessibility settings have been reset to default values');
  };

  /**
   * Handles keyboard events for accessibility
   * Allows Enter and Space keys to trigger actions
   */
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const positionClasses = getPositionClasses(currentPosition);
  const animationClasses = getAnimationClasses(currentPosition, isOpen);
  const themeClasses = isDarkMode 
    ? 'bg-secondary-900 text-white border-secondary-700' 
    : 'bg-white text-secondary-900 border-secondary-200';
  
  const defaultRootClasses = `${positionClasses} ${themeClasses} rounded-xl shadow-2xl z-50 transform transition-all duration-300 ease-out ${animationClasses}`;

  return (
    <div
      ref={panelRef}
      className={combineClasses(defaultRootClasses, className || classes.root || '')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
      aria-describedby="accessibility-panel-description"
      aria-hidden={!isOpen}
      id="accessibility-panel"
      data-accessibility-panel="true"
    >
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={combineClasses("sr-only", classes.announcement || '')}
      />

      {/* Decorative gradient background */}
      <div className={combineClasses(`absolute inset-0 bg-gradient-to-br rounded-xl pointer-events-none ${
        isDarkMode 
          ? 'from-primary-900 to-secondary-900' 
          : 'from-primary-50 to-white'
      }`, classes.background || '')} aria-hidden="true"></div>
      
      <div className={combineClasses("relative flex flex-col h-[600px]", classes.container || '')}>
        {/* Header */}
        <div className={combineClasses(`flex flex-col border-b rounded-t-xl ${
          isDarkMode 
            ? 'border-secondary-700 bg-primary-700' 
            : 'border-secondary-200 bg-primary-600'
        }`, classes.header || '')}>
          {/* Main header row */}
          <div className="flex items-center justify-between p-4 sm:p-5">
            <div className={combineClasses("flex items-center justify-center", classes.headerIconContainer || '')} aria-hidden="true">
              <div className={combineClasses("w-8 h-8 rounded-lg bg-primary-600", classes.headerIcon || '')}>
                <img src="/Accessibility-white.svg" alt="" aria-hidden="true" />
              </div>
            </div>
            <h2 id="accessibility-panel-title" className={combineClasses("text-base sm:text-lg font-semibold text-white text-center flex-1", classes.title || '')}>
              Accessibility Settings
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              onKeyDown={(e) => handleKeyDown(e, onClose)}
              className={combineClasses("p-1.5 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-600", classes.closeButton || '')}
              aria-label="Close accessibility settings panel"
            >
              <svg
                className={combineClasses("w-5 h-5 sm:w-6 sm:h-6 text-white", classes.closeIcon || '')}
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
          
          {/* Position and Theme Controls in Header */}
          {(enabledOptions.position || enabledOptions.theme) && (
            <div className="px-4 pb-3 sm:px-5 sm:pb-4  flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Position Dropdown */}
              {enabledOptions.position && currentPosition && (
                <Dropdown
                  label="Position"
                  value={currentPosition}
                  options={['bottom-right', 'bottom-left', 'top-right', 'top-left'] as PanelPosition[]}
                  onChange={handlePositionChange}
                  getDisplayName={(pos) => pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  isOpen={isPositionDropdownOpen}
                  onToggle={setIsPositionDropdownOpen}
                  isDarkMode={isDarkMode}
                  onCloseOther={() => setIsThemeDropdownOpen(false)}
                />
              )}
                
              {/* Theme Dropdown */}
              {enabledOptions.theme && currentTheme && (
                <Dropdown
                  label="Theme"
                  value={currentTheme}
                  options={['light', 'dark', 'auto'] as ThemeMode[]}
                  onChange={handleThemeChange}
                  getDisplayName={(theme) => theme.charAt(0).toUpperCase() + theme.slice(1)}
                  isOpen={isThemeDropdownOpen}
                  onToggle={setIsThemeDropdownOpen}
                  isDarkMode={isDarkMode}
                  minWidth="min-w-[120px]"
                  onCloseOther={() => setIsPositionDropdownOpen(false)}
                />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={combineClasses("overflow-y-auto p-4 sm:p-5 flex-1 custom-scrollbar", classes.content || '')} id="accessibility-panel-description">
          <AccessibilityOptions
            textSize={textSize}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            wordSpacing={wordSpacing}
            contrast={contrast}
            saturation={saturation}
            screenReader={screenReader}
            monochrome={monochrome}
            hideImages={hideImages}
            highlightTitles={highlightTitles}
            highlightLinks={highlightLinks}
            onTextSizeChange={handleTextSizeChange}
            onLineHeightChange={handleLineHeightChange}
            onLetterSpacingChange={handleLetterSpacingChange}
            onWordSpacingChange={handleWordSpacingChange}
            onContrastChange={handleContrastChange}
            onSaturationChange={handleSaturationChange}
            onScreenReaderChange={handleScreenReaderChange}
            onMonochromeChange={handleMonochromeChange}
            onHideImagesChange={handleHideImagesChange}
            onHighlightTitlesChange={handleHighlightTitlesChange}
            onHighlightLinksChange={handleHighlightLinksChange}
            handleKeyDown={handleKeyDown}
            classes={classes.options}
            isDarkMode={isDarkMode}
            fontFamily={fontFamily}
            onFontFamilyChange={handleFontFamilyChange}
            customFonts={customFonts}
            enabledOptions={enabledOptions}
          />
        </div>

        {/* Fixed Buttons at Bottom */}
        <div className={combineClasses(`border-t p-4 sm:p-5 rounded-b-xl ${
          isDarkMode 
            ? 'border-secondary-700 bg-secondary-900' 
            : 'border-secondary-200 bg-white'
        }`, classes.resetContainer || '')}>
          <div className={saveMode === 'manual' ? 'space-y-3' : ''}>
            {/* Save Button (only in manual mode) */}
            {saveMode === 'manual' && (
              <button
                onClick={handleSaveSettings}
                onKeyDown={(e) => handleKeyDown(e, handleSaveSettings)}
                disabled={!hasUnsavedChanges || isSaving}
                className={combineClasses(`w-full relative flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  hasUnsavedChanges && !isSaving
                    ? isDarkMode
                      ? 'border-primary-500 bg-primary-600 text-white hover:bg-primary-700 hover:border-primary-400 focus:ring-offset-secondary-900'
                      : 'border-primary-500 bg-primary-600 text-white hover:bg-primary-700 hover:border-primary-400 focus:ring-offset-white'
                    : isDarkMode
                      ? 'border-secondary-700 bg-secondary-800 text-secondary-500 cursor-not-allowed focus:ring-offset-secondary-900'
                      : 'border-secondary-200 bg-secondary-100 text-secondary-400 cursor-not-allowed focus:ring-offset-white'
                }`, classes.saveButton || '')}
                aria-label={hasUnsavedChanges ? 'Save all accessibility settings' : 'No changes to save'}
                aria-disabled={!hasUnsavedChanges || isSaving}
              >
                {isSaving ? (
                  <>
                    <svg
                      className={combineClasses("w-5 h-5 animate-spin", classes.saveIcon || '')}
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className={combineClasses("", classes.saveText || '')}>Saving...</span>
                  </>
                ) : (
                  <div >
                    <span className={combineClasses("", classes.saveText || '')}>
                      Save
                    </span>
                  </div>
                )}
                {/* Unsaved indicator dot */}
                {hasUnsavedChanges && !isSaving && (
                      <span 
                        className={combineClasses("absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse", classes.unsavedIndicator || '')}
                        aria-hidden="true"
                      />
                    )}
              </button>
            )}
            
            {/* Reset Button */}
            {enabledOptions.resetButton && (
              <button
                onClick={handleReset}
                onKeyDown={(e) => handleKeyDown(e, handleReset)}
                className={combineClasses(`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isDarkMode
                    ? 'border-secondary-600 bg-secondary-800 text-white hover:bg-secondary-700 hover:border-secondary-500 focus:ring-offset-secondary-900'
                    : 'border-secondary-300 bg-white text-secondary-900 hover:bg-secondary-50 hover:border-secondary-400 focus:ring-offset-white'
                }`, classes.resetButton || '')}
                aria-label="Reset all accessibility settings to default values"
              >
                <svg
                  className={combineClasses("w-5 h-5", classes.resetIcon || '')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className={combineClasses("", classes.resetText || '')}>Reset All Settings</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;

