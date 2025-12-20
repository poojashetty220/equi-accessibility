/**
 * @fileoverview Screen Reader Utilities
 * @module Accessibility/screenReaderUtils
 * 
 * This module provides utilities for enhancing screen reader support.
 * It includes browser detection, ARIA enhancements, skip links, and
 * live region management for better accessibility.
 */

// ============================================================================
// TYPES
// ============================================================================

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
export type ScreenReaderType = 'nvda' | 'jaws' | 'voiceover' | 'talkback' | 'narrator' | 'orca' | 'unknown';

export interface BrowserInfo {
  type: BrowserType;
  version: string;
  isSupported: boolean;
}

export interface ScreenReaderConfig {
  /** Enable enhanced ARIA attributes */
  enhancedAria: boolean;
  /** Enable skip links for navigation */
  skipLinks: boolean;
  /** Enable enhanced focus indicators */
  enhancedFocus: boolean;
  /** Enable landmark roles */
  landmarkRoles: boolean;
  /** Enable live region announcements */
  liveRegions: boolean;
  /** Announcement delay in milliseconds */
  announcementDelay: number;
  /** Enable reading elements on focus */
  readOnFocus: boolean;
  /** Enable keyboard shortcuts for reading */
  keyboardShortcuts: boolean;
}

// ============================================================================
// BROWSER DETECTION
// ============================================================================

/**
 * Detects the current browser type and version
 * @returns Browser information object
 */
export const detectBrowser = (): BrowserInfo => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { type: 'unknown', version: '', isSupported: false };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  let type: BrowserType = 'unknown';
  let version = '';

  // Edge (Chromium-based)
  if (userAgent.includes('edg/')) {
    type = 'edge';
    const match = userAgent.match(/edg\/(\d+(\.\d+)?)/);
    version = match ? match[1] : '';
  }
  // Opera
  else if (userAgent.includes('opr/') || userAgent.includes('opera')) {
    type = 'opera';
    const match = userAgent.match(/(?:opr|opera)\/(\d+(\.\d+)?)/);
    version = match ? match[1] : '';
  }
  // Chrome
  else if (userAgent.includes('chrome') && !userAgent.includes('chromium')) {
    type = 'chrome';
    const match = userAgent.match(/chrome\/(\d+(\.\d+)?)/);
    version = match ? match[1] : '';
  }
  // Firefox
  else if (userAgent.includes('firefox')) {
    type = 'firefox';
    const match = userAgent.match(/firefox\/(\d+(\.\d+)?)/);
    version = match ? match[1] : '';
  }
  // Safari
  else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    type = 'safari';
    const match = userAgent.match(/version\/(\d+(\.\d+)?)/);
    version = match ? match[1] : '';
  }

  // Check if browser version supports modern accessibility features
  const isSupported = checkBrowserSupport(type, version);

  return { type, version, isSupported };
};

/**
 * Checks if the browser version supports modern accessibility features
 */
const checkBrowserSupport = (type: BrowserType, version: string): boolean => {
  const majorVersion = parseInt(version.split('.')[0], 10);
  
  if (isNaN(majorVersion)) return true; // Assume supported if can't detect

  // Minimum versions for full accessibility support
  const minVersions: Record<BrowserType, number> = {
    chrome: 80,
    firefox: 75,
    safari: 13,
    edge: 80,
    opera: 67,
    unknown: 0,
  };

  return majorVersion >= (minVersions[type] || 0);
};

/**
 * Gets the likely screen reader based on browser and OS
 */
export const detectLikelyScreenReader = (): ScreenReaderType => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';

  // macOS/iOS - VoiceOver
  if (platform.includes('mac') || /iphone|ipad|ipod/.test(userAgent)) {
    return 'voiceover';
  }

  // Android - TalkBack
  if (userAgent.includes('android')) {
    return 'talkback';
  }

  // Windows - Could be NVDA, JAWS, or Narrator
  if (platform.includes('win')) {
    // Default to NVDA as it's most common free screen reader
    return 'nvda';
  }

  // Linux - Orca
  if (platform.includes('linux') && !userAgent.includes('android')) {
    return 'orca';
  }

  return 'unknown';
};

// ============================================================================
// SCREEN READER ENHANCEMENTS
// ============================================================================

/**
 * Default configuration for screen reader enhancements
 */
export const defaultScreenReaderConfig: ScreenReaderConfig = {
  enhancedAria: true,
  skipLinks: true,
  enhancedFocus: true,
  landmarkRoles: true,
  liveRegions: true,
  announcementDelay: 100,
  readOnFocus: true,
  keyboardShortcuts: true,
};

/**
 * Stores original element attributes for restoration
 */
const originalAttributes = new Map<Element, Map<string, string | null>>();

/**
 * Stores dynamically created elements for cleanup
 */
const createdElements: HTMLElement[] = [];

/**
 * Live region element for announcements
 */
let liveRegionElement: HTMLElement | null = null;

/**
 * Enables screen reader enhancements on the document
 */
export const enableScreenReaderMode = (config: Partial<ScreenReaderConfig> = {}): void => {
  const fullConfig = { ...defaultScreenReaderConfig, ...config };
  
  if (typeof document === 'undefined') return;

  // Add screen reader mode class to body
  document.body.classList.add('screen-reader-mode');
  document.body.setAttribute('data-screen-reader', 'enabled');

  if (fullConfig.enhancedAria) {
    applyEnhancedAria();
  }

  if (fullConfig.skipLinks) {
    createSkipLinks();
  }

  if (fullConfig.enhancedFocus) {
    applyEnhancedFocus();
  }

  if (fullConfig.landmarkRoles) {
    applyLandmarkRoles();
  }

  if (fullConfig.liveRegions) {
    createGlobalLiveRegion();
  }

  // Enable focus reading if configured (and speech synthesis is enabled)
  if (fullConfig.readOnFocus && useSpeechSynthesis) {
    enableFocusReading();
  }

  // Announce that screen reader mode is enabled
  announceToScreenReader('Screen reader mode enabled. Enhanced accessibility features are now active.');
};

/**
 * Disables screen reader enhancements and restores original state
 */
export const disableScreenReaderMode = (): void => {
  if (typeof document === 'undefined') return;

  // Remove screen reader mode class
  document.body.classList.remove('screen-reader-mode');
  document.body.removeAttribute('data-screen-reader');

  // Restore original attributes
  originalAttributes.forEach((attrs, element) => {
    attrs.forEach((value, attrName) => {
      if (value === null) {
        element.removeAttribute(attrName);
      } else {
        element.setAttribute(attrName, value);
      }
    });
  });
  originalAttributes.clear();

  // Remove created elements
  createdElements.forEach(element => {
    element.remove();
  });
  createdElements.length = 0;

  // Remove live region
  if (liveRegionElement) {
    liveRegionElement.remove();
    liveRegionElement = null;
  }

  // Remove enhanced focus styles
  const focusStyle = document.getElementById('screen-reader-focus-styles');
  if (focusStyle) {
    focusStyle.remove();
  }

  // Disable focus reading
  disableFocusReading();

  announceToScreenReader('Screen reader mode disabled.');
};

/**
 * Applies enhanced ARIA attributes to improve screen reader experience
 */
const applyEnhancedAria = (): void => {
  // Enhance images without alt text
  document.querySelectorAll('img:not([alt])').forEach(img => {
    storeOriginalAttribute(img, 'alt');
    storeOriginalAttribute(img, 'role');
    img.setAttribute('alt', 'Image');
    img.setAttribute('role', 'img');
  });

  // Enhance links without accessible names
  document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])').forEach(link => {
    const text = link.textContent?.trim();
    if (!text || text.length < 2) {
      storeOriginalAttribute(link, 'aria-label');
      const href = link.getAttribute('href') || '';
      link.setAttribute('aria-label', `Link to ${href || 'page'}`);
    }
  });

  // Enhance buttons without accessible names
  document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
    const text = button.textContent?.trim();
    if (!text) {
      storeOriginalAttribute(button, 'aria-label');
      button.setAttribute('aria-label', 'Button');
    }
  });

  // Add aria-current to active navigation items
  document.querySelectorAll('nav a[class*="active"], nav a[class*="current"]').forEach(link => {
    storeOriginalAttribute(link, 'aria-current');
    link.setAttribute('aria-current', 'page');
  });

  // Enhance form inputs without labels
  document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
    const id = input.getAttribute('id');
    const placeholder = input.getAttribute('placeholder');
    const type = input.getAttribute('type') || 'text';
    
    // Check if there's an associated label
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    
    if (!hasLabel) {
      storeOriginalAttribute(input, 'aria-label');
      input.setAttribute('aria-label', placeholder || `${type} input`);
    }
  });

  // Add descriptions to form groups
  document.querySelectorAll('fieldset:not([aria-describedby])').forEach(fieldset => {
    const legend = fieldset.querySelector('legend');
    if (legend && !legend.id) {
      const legendId = `legend-${Math.random().toString(36).substr(2, 9)}`;
      legend.id = legendId;
      storeOriginalAttribute(fieldset, 'aria-labelledby');
      fieldset.setAttribute('aria-labelledby', legendId);
    }
  });

  // Enhance tables for better screen reader navigation
  document.querySelectorAll('table:not([role])').forEach(table => {
    storeOriginalAttribute(table, 'role');
    table.setAttribute('role', 'table');
    
    // Add scope to header cells
    table.querySelectorAll('th:not([scope])').forEach(th => {
      storeOriginalAttribute(th, 'scope');
      const isRowHeader = th.parentElement?.parentElement?.tagName === 'TBODY';
      th.setAttribute('scope', isRowHeader ? 'row' : 'col');
    });
  });

  // Add aria-expanded to collapsible elements
  document.querySelectorAll('[data-collapsed], [data-expanded], .collapsible, .accordion-header').forEach(element => {
    if (!element.hasAttribute('aria-expanded')) {
      storeOriginalAttribute(element, 'aria-expanded');
      const isExpanded = element.classList.contains('expanded') || 
                         element.getAttribute('data-expanded') === 'true';
      element.setAttribute('aria-expanded', String(isExpanded));
    }
  });
};

/**
 * Creates skip links for keyboard navigation
 */
const createSkipLinks = (): void => {
  // Check if skip links already exist
  if (document.getElementById('skip-links-container')) return;

  const skipLinksContainer = document.createElement('div');
  skipLinksContainer.id = 'skip-links-container';
  skipLinksContainer.className = 'sr-skip-links';
  skipLinksContainer.setAttribute('role', 'navigation');
  skipLinksContainer.setAttribute('aria-label', 'Skip links');

  // Define skip link targets
  const skipTargets = [
    { id: 'main-content', label: 'Skip to main content', selector: 'main, [role="main"], #main, #content, .main-content' },
    { id: 'main-navigation', label: 'Skip to navigation', selector: 'nav, [role="navigation"], #nav, #navigation, .navigation' },
    { id: 'search', label: 'Skip to search', selector: '[role="search"], #search, .search-form, input[type="search"]' },
    { id: 'footer', label: 'Skip to footer', selector: 'footer, [role="contentinfo"], #footer, .footer' },
  ];

  skipTargets.forEach(({ id, label, selector }) => {
    const target = document.querySelector(selector);
    if (target) {
      // Ensure target has an ID
      if (!target.id) {
        target.id = id;
      }

      // Ensure target is focusable
      if (!target.hasAttribute('tabindex')) {
        storeOriginalAttribute(target, 'tabindex');
        target.setAttribute('tabindex', '-1');
      }

      const skipLink = document.createElement('a');
      skipLink.href = `#${target.id}`;
      skipLink.className = 'sr-skip-link';
      skipLink.textContent = label;
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById(target.id);
        if (targetElement) {
          targetElement.focus();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      skipLinksContainer.appendChild(skipLink);
    }
  });

  // Only add if we have skip links
  if (skipLinksContainer.children.length > 0) {
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    createdElements.push(skipLinksContainer);

    // Add styles for skip links
    addSkipLinkStyles();
  }
};

/**
 * Adds CSS styles for skip links
 */
const addSkipLinkStyles = (): void => {
  if (document.getElementById('skip-link-styles')) return;

  const style = document.createElement('style');
  style.id = 'skip-link-styles';
  style.textContent = `
    .sr-skip-links {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px;
    }

    .sr-skip-link {
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
      background: #1a56db;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: none;
    }

    .sr-skip-link:focus {
      position: fixed;
      left: 16px;
      top: 16px;
      width: auto;
      height: auto;
      overflow: visible;
      outline: 3px solid #fbbf24;
      outline-offset: 2px;
    }

    .sr-skip-link:hover {
      background: #1e40af;
    }
  `;
  document.head.appendChild(style);
  createdElements.push(style);
};

/**
 * Applies enhanced focus indicators for better visibility
 */
const applyEnhancedFocus = (): void => {
  if (document.getElementById('screen-reader-focus-styles')) return;

  const style = document.createElement('style');
  style.id = 'screen-reader-focus-styles';
  style.textContent = `
    /* Enhanced focus styles for screen reader mode */
    body.screen-reader-mode *:focus {
      outline: 3px solid #1a56db !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 6px rgba(26, 86, 219, 0.25) !important;
    }

    body.screen-reader-mode *:focus:not(:focus-visible) {
      outline: none !important;
      box-shadow: none !important;
    }

    body.screen-reader-mode *:focus-visible {
      outline: 3px solid #1a56db !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 6px rgba(26, 86, 219, 0.25) !important;
    }

    /* High contrast focus for buttons and links */
    body.screen-reader-mode a:focus-visible,
    body.screen-reader-mode button:focus-visible {
      outline-color: #1a56db !important;
      background-color: rgba(26, 86, 219, 0.1) !important;
    }

    /* Enhanced focus for form elements */
    body.screen-reader-mode input:focus-visible,
    body.screen-reader-mode select:focus-visible,
    body.screen-reader-mode textarea:focus-visible {
      border-color: #1a56db !important;
      outline: 3px solid #1a56db !important;
    }

    /* Screen reader only text utility */
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }

    /* Focus within for complex components */
    body.screen-reader-mode [role="menu"]:focus-within,
    body.screen-reader-mode [role="listbox"]:focus-within,
    body.screen-reader-mode [role="dialog"]:focus-within {
      outline: 2px solid #1a56db !important;
      outline-offset: 4px !important;
    }
  `;
  document.head.appendChild(style);
  createdElements.push(style);
};

/**
 * Applies ARIA landmark roles to semantic sections
 */
const applyLandmarkRoles = (): void => {
  // Main content
  const main = document.querySelector('main:not([role])');
  if (main) {
    storeOriginalAttribute(main, 'role');
    main.setAttribute('role', 'main');
  }

  // Navigation
  document.querySelectorAll('nav:not([role])').forEach((nav, index) => {
    storeOriginalAttribute(nav, 'role');
    storeOriginalAttribute(nav, 'aria-label');
    nav.setAttribute('role', 'navigation');
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : `Navigation ${index + 1}`);
    }
  });

  // Header
  const header = document.querySelector('header:not([role])');
  if (header) {
    storeOriginalAttribute(header, 'role');
    header.setAttribute('role', 'banner');
  }

  // Footer
  const footer = document.querySelector('footer:not([role])');
  if (footer) {
    storeOriginalAttribute(footer, 'role');
    footer.setAttribute('role', 'contentinfo');
  }

  // Aside/Sidebar
  document.querySelectorAll('aside:not([role])').forEach((aside, index) => {
    storeOriginalAttribute(aside, 'role');
    storeOriginalAttribute(aside, 'aria-label');
    aside.setAttribute('role', 'complementary');
    if (!aside.getAttribute('aria-label')) {
      aside.setAttribute('aria-label', `Sidebar ${index + 1}`);
    }
  });

  // Search forms
  document.querySelectorAll('form[action*="search"], form.search, .search-form').forEach(form => {
    if (!form.getAttribute('role')) {
      storeOriginalAttribute(form, 'role');
      form.setAttribute('role', 'search');
    }
  });

  // Sections with headings
  document.querySelectorAll('section:not([aria-labelledby])').forEach(section => {
    const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      if (!heading.id) {
        heading.id = `section-heading-${Math.random().toString(36).substr(2, 9)}`;
      }
      storeOriginalAttribute(section, 'aria-labelledby');
      section.setAttribute('aria-labelledby', heading.id);
    }
  });
};

/**
 * Creates a global live region for screen reader announcements
 */
const createGlobalLiveRegion = (): void => {
  if (liveRegionElement) return;

  liveRegionElement = document.createElement('div');
  liveRegionElement.id = 'screen-reader-live-region';
  liveRegionElement.setAttribute('role', 'status');
  liveRegionElement.setAttribute('aria-live', 'polite');
  liveRegionElement.setAttribute('aria-atomic', 'true');
  liveRegionElement.className = 'sr-only';
  liveRegionElement.style.cssText = `
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `;

  document.body.appendChild(liveRegionElement);
  createdElements.push(liveRegionElement);
};

/**
 * Global announcer container ID
 * Contains separate regions for polite and assertive announcements
 * This approach works better across different browsers including Chrome
 */
const ANNOUNCER_CONTAINER_ID = 'accessibility-announcer-container';
const POLITE_ANNOUNCER_ID = 'accessibility-announcer-polite';
const ASSERTIVE_ANNOUNCER_ID = 'accessibility-announcer-assertive';

/**
 * Styles for visually hidden but screen reader accessible elements
 * Uses clip-path (modern) instead of clip (deprecated) for better Chrome support
 */
const SR_ONLY_STYLES = `
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip-path: inset(50%) !important;
  white-space: nowrap !important;
  border: 0 !important;
`;

/**
 * Creates a live region element with proper attributes for screen readers
 */
const createLiveRegion = (id: string, ariaLive: 'polite' | 'assertive'): HTMLElement => {
  const region = document.createElement('div');
  region.id = id;
  region.setAttribute('role', ariaLive === 'assertive' ? 'alert' : 'status');
  region.setAttribute('aria-live', ariaLive);
  region.setAttribute('aria-atomic', 'true');
  region.style.cssText = SR_ONLY_STYLES;
  return region;
};

/**
 * Gets or creates the announcer container with both polite and assertive regions
 * Having separate regions improves reliability across browsers
 */
const getOrCreateAnnouncerContainer = (): { polite: HTMLElement; assertive: HTMLElement } => {
  let container = document.getElementById(ANNOUNCER_CONTAINER_ID);
  let politeRegion = document.getElementById(POLITE_ANNOUNCER_ID);
  let assertiveRegion = document.getElementById(ASSERTIVE_ANNOUNCER_ID);
  
  if (!container) {
    container = document.createElement('div');
    container.id = ANNOUNCER_CONTAINER_ID;
    container.style.cssText = SR_ONLY_STYLES;
    document.body.appendChild(container);
  }
  
  if (!politeRegion) {
    politeRegion = createLiveRegion(POLITE_ANNOUNCER_ID, 'polite');
    container.appendChild(politeRegion);
  }
  
  if (!assertiveRegion) {
    assertiveRegion = createLiveRegion(ASSERTIVE_ANNOUNCER_ID, 'assertive');
    container.appendChild(assertiveRegion);
  }
  
  return { 
    polite: politeRegion, 
    assertive: assertiveRegion 
  };
};

/**
 * Initializes the global announcer elements
 * Call this early in your app to ensure the live regions exist before any announcements
 * This is especially important for Chrome where live regions need to exist beforehand
 * 
 * @param options - Configuration options
 * @param options.debug - Enable visual debug toasts for testing (default: false)
 * @param options.speechSynthesis - Enable browser's text-to-speech for audio announcements (default: false)
 */
export const initializeAnnouncer = (options?: { debug?: boolean; speechSynthesis?: boolean }): void => {
  if (typeof document === 'undefined') return;
  
  // Enable debug mode if requested
  if (options?.debug) {
    debugMode = true;
  }
  
  // Enable speech synthesis if requested
  if (options?.speechSynthesis) {
    useSpeechSynthesis = true;
    
    // Pre-load voices (Chrome loads them asynchronously)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      // Chrome needs this event to populate voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }
  
  // Create regions immediately
  getOrCreateAnnouncerContainer();
  
  // Force a layout recalculation to ensure Chrome registers the live regions
  // This is a Chrome-specific workaround
  requestAnimationFrame(() => {
    const container = document.getElementById(ANNOUNCER_CONTAINER_ID);
    if (container) {
      // Reading offsetHeight forces layout calculation
      void container.offsetHeight;
    }
  });
};

/**
 * Debug mode flag - set to true to show visual announcements for testing
 */
let debugMode = false;

/**
 * Speech synthesis mode - when true, uses browser's speech synthesis API
 * This provides audio output without needing a screen reader
 */
let useSpeechSynthesis = false;

/**
 * Enables or disables debug mode for visual announcement feedback
 * When enabled, announcements are shown as toast notifications
 * @param enabled - Whether to enable debug mode
 */
export const setAnnouncerDebugMode = (enabled: boolean): void => {
  debugMode = enabled;
};

/**
 * Enables or disables speech synthesis for audio announcements
 * When enabled, uses the browser's built-in text-to-speech
 * This works without needing an external screen reader
 * @param enabled - Whether to enable speech synthesis
 */
export const setSpeechSynthesis = (enabled: boolean): void => {
  useSpeechSynthesis = enabled;
};

/**
 * Speaks a message using the Web Speech API
 * This provides audio output directly from the browser
 */
const speakMessage = (message: string, priority: 'polite' | 'assertive'): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech for assertive announcements
  if (priority === 'assertive') {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.0; // Normal speed
  utterance.pitch = 1.0; // Normal pitch
  utterance.volume = 1.0; // Full volume
  
  // Try to use a good quality voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith('en') && voice.localService
  ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};

/**
 * Shows a visual toast notification for debugging announcements
 */
const showDebugToast = (message: string, priority: 'polite' | 'assertive'): void => {
  const toastId = 'accessibility-debug-toast';
  let toast = document.getElementById(toastId);
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = toastId;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${priority === 'assertive' ? '#dc2626' : '#2563eb'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 99999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
      max-width: 80%;
      text-align: center;
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = `🔊 ${message}`;
  toast.style.opacity = '1';
  toast.style.background = priority === 'assertive' ? '#dc2626' : '#2563eb';
  
  setTimeout(() => {
    if (toast) toast.style.opacity = '0';
  }, 3000);
};

/**
 * Announces a message to screen readers
 * Uses separate live regions for polite and assertive announcements
 * Optimized for Chrome, Firefox, Safari, and Edge compatibility
 * 
 * When speech synthesis is enabled, also speaks the message using
 * the browser's built-in text-to-speech (no screen reader needed)
 * 
 * @param message - The message to announce
 * @param priority - 'polite' (default) or 'assertive' for urgent messages
 */
export const announceToScreenReader = (
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  if (typeof document === 'undefined' || !message) return;

  // Show visual debug toast if enabled
  if (debugMode) {
    showDebugToast(message, priority);
  }

  // Use speech synthesis if enabled (provides audio without screen reader)
  if (useSpeechSynthesis) {
    speakMessage(message, priority);
  }

  const { polite, assertive } = getOrCreateAnnouncerContainer();
  const announcer = priority === 'assertive' ? assertive : polite;
  
  // Chrome fix: Clear content and wait for DOM update before setting new content
  // This two-step process helps Chrome detect the change reliably
  
  // Step 1: Clear the announcer
  while (announcer.firstChild) {
    announcer.removeChild(announcer.firstChild);
  }
  
  // Step 2: Wait for next frame, then add new content
  // Using double requestAnimationFrame for Chrome reliability
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Create a new text node (more reliable than textContent in Chrome)
      const textNode = document.createTextNode(message);
      announcer.appendChild(textNode);
      
      // Clear after announcement is complete (give screen reader time to read)
      setTimeout(() => {
        while (announcer.firstChild) {
          announcer.removeChild(announcer.firstChild);
        }
      }, 5000);
    });
  });
};

/**
 * Gets browser-specific screen reader instructions
 */
export const getScreenReaderInstructions = (browser: BrowserType): string => {
  const instructions: Record<BrowserType, string> = {
    chrome: 'For Chrome users: ChromeVox can be enabled as an extension. NVDA and JAWS work well with Chrome.',
    firefox: 'For Firefox users: NVDA is recommended. Firefox also supports VoiceOver on macOS.',
    safari: 'For Safari users: VoiceOver is built-in. Press Command+F5 to toggle VoiceOver.',
    edge: 'For Edge users: Narrator is built into Windows. Press Windows+Ctrl+Enter to start Narrator.',
    opera: 'For Opera users: NVDA is recommended for the best screen reader experience.',
    unknown: 'Please use a screen reader compatible with your browser for the best experience.',
  };

  return instructions[browser];
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Stores the original attribute value for later restoration
 */
const storeOriginalAttribute = (element: Element, attrName: string): void => {
  if (!originalAttributes.has(element)) {
    originalAttributes.set(element, new Map());
  }
  
  const attrs = originalAttributes.get(element)!;
  if (!attrs.has(attrName)) {
    attrs.set(attrName, element.getAttribute(attrName));
  }
};

/**
 * Checks if screen reader mode is currently enabled
 */
export const isScreenReaderModeEnabled = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('screen-reader-mode');
};

// ============================================================================
// FOCUS READING FUNCTIONALITY
// ============================================================================

/**
 * Flag to track if focus reading is enabled
 */
let focusReadingEnabled = false;

/**
 * Bound event handler reference for cleanup
 */
/* eslint-disable no-unused-vars */
type FocusEventHandler = (e: FocusEvent) => void;
type KeyboardEventHandler = (e: KeyboardEvent) => void;
/* eslint-enable no-unused-vars */

let focusHandler: FocusEventHandler | null = null;
let keyboardHandler: KeyboardEventHandler | null = null;

/**
 * Gets the accessible name of an element
 * Follows the accessible name computation algorithm
 */
const getAccessibleName = (element: Element): string => {
  // Check aria-labelledby first
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElements = labelledBy.split(' ')
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (labelElements.length > 0) {
      return labelElements.map(el => el?.textContent?.trim()).join(' ');
    }
  }
  
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for associated label (for form elements)
  if (element instanceof HTMLInputElement || 
      element instanceof HTMLSelectElement || 
      element instanceof HTMLTextAreaElement) {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return label.textContent?.trim() || '';
      }
    }
  }
  
  // Check title attribute
  const title = element.getAttribute('title');
  if (title) {
    return title;
  }
  
  // Check alt attribute for images
  if (element instanceof HTMLImageElement) {
    return element.alt || 'Image';
  }
  
  // Use text content
  return element.textContent?.trim() || '';
};

/**
 * Gets the role of an element for announcement
 */
const getElementRole = (element: Element): string => {
  // Check explicit role
  const role = element.getAttribute('role');
  if (role) {
    return role;
  }
  
  // Implicit roles based on element type
  const tagName = element.tagName.toLowerCase();
  const roleMap: Record<string, string> = {
    'a': element.hasAttribute('href') ? 'link' : '',
    'button': 'button',
    'input': getInputRole(element as HTMLInputElement),
    'select': 'combobox',
    'textarea': 'textbox',
    'img': 'image',
    'h1': 'heading level 1',
    'h2': 'heading level 2',
    'h3': 'heading level 3',
    'h4': 'heading level 4',
    'h5': 'heading level 5',
    'h6': 'heading level 6',
    'nav': 'navigation',
    'main': 'main',
    'header': 'banner',
    'footer': 'content info',
    'aside': 'complementary',
    'section': 'region',
    'article': 'article',
    'form': 'form',
    'table': 'table',
    'ul': 'list',
    'ol': 'list',
    'li': 'list item',
  };
  
  return roleMap[tagName] || '';
};

/**
 * Gets the role for an input element based on its type
 */
const getInputRole = (input: HTMLInputElement): string => {
  const type = input.type.toLowerCase();
  const inputRoles: Record<string, string> = {
    'text': 'text field',
    'password': 'password field',
    'email': 'email field',
    'tel': 'telephone field',
    'url': 'URL field',
    'search': 'search field',
    'number': 'number field',
    'checkbox': input.checked ? 'checkbox checked' : 'checkbox not checked',
    'radio': input.checked ? 'radio button selected' : 'radio button',
    'submit': 'submit button',
    'reset': 'reset button',
    'button': 'button',
    'file': 'file upload',
    'range': `slider, value ${input.value}`,
  };
  return inputRoles[type] || 'text field';
};

/**
 * Gets additional state information for an element
 */
const getElementState = (element: Element): string => {
  const states: string[] = [];
  
  // Check disabled state
  if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
    states.push('disabled');
  }
  
  // Check required state
  if (element.hasAttribute('required') || element.getAttribute('aria-required') === 'true') {
    states.push('required');
  }
  
  // Check expanded state
  const expanded = element.getAttribute('aria-expanded');
  if (expanded !== null) {
    states.push(expanded === 'true' ? 'expanded' : 'collapsed');
  }
  
  // Check selected state
  if (element.getAttribute('aria-selected') === 'true') {
    states.push('selected');
  }
  
  // Check pressed state (for toggle buttons)
  const pressed = element.getAttribute('aria-pressed');
  if (pressed !== null) {
    states.push(pressed === 'true' ? 'pressed' : 'not pressed');
  }
  
  // Check current state
  const current = element.getAttribute('aria-current');
  if (current && current !== 'false') {
    states.push(`current ${current}`);
  }
  
  return states.join(', ');
};

/**
 * Builds the announcement text for an element
 */
const buildElementAnnouncement = (element: Element): string => {
  const name = getAccessibleName(element);
  const role = getElementRole(element);
  const state = getElementState(element);
  
  const parts: string[] = [];
  
  if (name) {
    parts.push(name);
  }
  
  if (role) {
    parts.push(role);
  }
  
  if (state) {
    parts.push(state);
  }
  
  // Add value for form fields
  if (element instanceof HTMLInputElement && 
      !['checkbox', 'radio', 'submit', 'reset', 'button', 'file'].includes(element.type)) {
    if (element.value) {
      parts.push(`value: ${element.value}`);
    }
  }
  
  if (element instanceof HTMLSelectElement) {
    const selectedOption = element.options[element.selectedIndex];
    if (selectedOption) {
      parts.push(`selected: ${selectedOption.text}`);
    }
  }
  
  return parts.join(', ') || 'element';
};

/**
 * Handles focus events to read element content
 */
const handleFocusForReading = (e: FocusEvent): void => {
  if (!focusReadingEnabled || !useSpeechSynthesis) return;
  
  const target = e.target as Element;
  if (!target || !(target instanceof Element)) return;
  
  // Skip if it's not a focusable element
  const focusableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY'];
  const hasFocusableRole = target.hasAttribute('tabindex') || 
                           target.hasAttribute('role') ||
                           focusableElements.includes(target.tagName);
  
  if (!hasFocusableRole) return;
  
  const announcement = buildElementAnnouncement(target);
  
  // Use a slight delay to avoid interrupting rapid focus changes
  setTimeout(() => {
    if (document.activeElement === target) {
      speakMessage(announcement, 'polite');
    }
  }, 100);
};

/**
 * Handles keyboard shortcuts for reading
 */
const handleKeyboardShortcuts = (e: KeyboardEvent): void => {
  if (!focusReadingEnabled) return;
  
  // Alt + R: Read current focused element
  if (e.altKey && e.key.toLowerCase() === 'r') {
    e.preventDefault();
    const focused = document.activeElement;
    if (focused && focused !== document.body) {
      const announcement = buildElementAnnouncement(focused);
      speakMessage(announcement, 'assertive');
    }
  }
  
  // Alt + H: Read page heading structure
  if (e.altKey && e.key.toLowerCase() === 'h') {
    e.preventDefault();
    readHeadings();
  }
  
  // Alt + L: Read all links on page
  if (e.altKey && e.key.toLowerCase() === 'l') {
    e.preventDefault();
    readLinks();
  }
  
  // Alt + S: Stop speaking
  if (e.altKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    stopSpeaking();
  }
  
  // Alt + P: Read current paragraph/text block
  if (e.altKey && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    readCurrentParagraph();
  }
};

/**
 * Reads all headings on the page
 */
const readHeadings = (): void => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) {
    speakMessage('No headings found on this page', 'polite');
    return;
  }
  
  const headingTexts = Array.from(headings).map(h => {
    const level = h.tagName.toLowerCase();
    const text = h.textContent?.trim() || 'Empty heading';
    return `${level}: ${text}`;
  });
  
  speakMessage(`Page headings: ${headingTexts.join('. ')}`, 'polite');
};

/**
 * Reads all links on the page
 */
const readLinks = (): void => {
  const links = document.querySelectorAll('a[href]');
  if (links.length === 0) {
    speakMessage('No links found on this page', 'polite');
    return;
  }
  
  const linkTexts = Array.from(links).slice(0, 10).map(link => {
    return link.textContent?.trim() || link.getAttribute('aria-label') || 'Unnamed link';
  });
  
  const message = links.length > 10 
    ? `First 10 of ${links.length} links: ${linkTexts.join(', ')}`
    : `${links.length} links: ${linkTexts.join(', ')}`;
  
  speakMessage(message, 'polite');
};

/**
 * Reads the current paragraph near the focused element
 */
const readCurrentParagraph = (): void => {
  const focused = document.activeElement;
  
  // Find nearest paragraph or text content
  let textElement = focused?.closest('p, article, section, main, div');
  if (!textElement) {
    textElement = document.querySelector('main p, article p, .content p, p');
  }
  
  if (textElement) {
    const text = textElement.textContent?.trim();
    if (text) {
      speakMessage(text.substring(0, 500), 'polite'); // Limit to 500 chars
      return;
    }
  }
  
  speakMessage('No text content found', 'polite');
};

/**
 * Stops any ongoing speech
 */
export const stopSpeaking = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Enables focus reading mode
 * When enabled, elements are read aloud when they receive focus
 */
export const enableFocusReading = (): void => {
  if (focusReadingEnabled) return;
  
  focusReadingEnabled = true;
  
  // Add focus handler
  focusHandler = handleFocusForReading;
  document.addEventListener('focusin', focusHandler, true);
  
  // Add keyboard shortcut handler
  keyboardHandler = handleKeyboardShortcuts;
  document.addEventListener('keydown', keyboardHandler, true);
};

/**
 * Disables focus reading mode
 */
export const disableFocusReading = (): void => {
  if (!focusReadingEnabled) return;
  
  focusReadingEnabled = false;
  
  // Remove handlers
  if (focusHandler) {
    document.removeEventListener('focusin', focusHandler, true);
    focusHandler = null;
  }
  
  if (keyboardHandler) {
    document.removeEventListener('keydown', keyboardHandler, true);
    keyboardHandler = null;
  }
  
  // Stop any ongoing speech
  stopSpeaking();
};

/**
 * Reads a specific element aloud
 */
export const readElement = (element: Element): void => {
  if (!useSpeechSynthesis) return;
  
  const announcement = buildElementAnnouncement(element);
  speakMessage(announcement, 'polite');
};

/**
 * Reads the main content of the page
 */
export const readMainContent = (): void => {
  const main = document.querySelector('main, [role="main"], #main, #content, .main-content');
  
  if (main) {
    const text = main.textContent?.trim();
    if (text) {
      // Read first 1000 characters to avoid extremely long readings
      speakMessage(text.substring(0, 1000), 'polite');
      return;
    }
  }
  
  speakMessage('No main content found on this page', 'polite');
};
