/**
 * equi-accessibility - Accessibility Library
 * 
 * A comprehensive accessibility library for React applications.
 * Provides features like contrast modes, font scaling, screen reader support, and more.
 * 
 * @packageDocumentation
 */

// Main Components
export { default as AccessibilityPanel } from './AccessibilityPanel';
export { default as AccessibilityOptions } from './AccessibilityOptions';
export { default as AccessibilityCustomizationPanel } from './AccessibilityCustomizationPanel';

// Reusable UI Components
export { default as OptionCarousel } from './OptionCarousel';
export { default as CheckboxOption } from './CheckboxOption';
export { default as Dropdown } from './Dropdown';
export { default as SectionHeading } from './SectionHeading';

// Utilities
export { combineClasses } from './utils';

// Screen Reader Utilities
export {
  detectBrowser,
  detectLikelyScreenReader,
  getScreenReaderInstructions,
  initializeAnnouncer,
  announceToScreenReader,
  setSpeechSynthesis,
  stopSpeaking,
  enableScreenReaderMode,
  disableScreenReaderMode,
  isScreenReaderModeEnabled,
  enableFocusReading,
  disableFocusReading,
  readElement,
  readMainContent,
  setAnnouncerDebugMode,
  defaultScreenReaderConfig,
} from './screenReaderUtils';

// Types
export type {
  TextSize,
  LineHeight,
  LetterSpacing,
  WordSpacing,
  ContrastLevel,
  SaturationLevel,
  PanelPosition,
  ThemeMode,
  FontFamily,
  SaveMode,
  StorageType,
  StorageHandler,
  EnabledOptions,
  HighlightTitlesColors,
  HighlightLinksColors,
  AccessibilityPanelClasses,
  AccessibilityOptionsClasses,
  AccessibilityPanelProps,
  AccessibilityOptionsProps,
  BrowserType,
  ScreenReaderType,
  BrowserInfo,
  ScreenReaderConfig,
} from './types';

// Default Values
export {
  defaultEnabledOptions,
  defaultHighlightTitlesColors,
  defaultHighlightLinksColors,
} from './types';

// Component Props Types (for reusable components)
export type { OptionCarouselProps } from './OptionCarousel';
export type { CheckboxOptionProps } from './CheckboxOption';
export type { DropdownProps } from './Dropdown';
export type { SectionHeadingProps } from './SectionHeading';
