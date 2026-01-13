/* eslint-disable no-unused-vars */
/**
 * Type definitions for Accessibility components
 */

export type TextSize = 'default' | 'small' | 'medium' | 'large' | 'extra-large';
export type LineHeight = 'default' | 'tight' | 'normal' | 'relaxed' | 'loose';
export type LetterSpacing = 'default' | 'tight' | 'normal' | 'wide' | 'extra-wide';
export type WordSpacing = 'default' | 'tight' | 'normal' | 'wide' | 'extra-wide';
export type ContrastLevel = 'default' | 'low' | 'high' | 'dark';
export type SaturationLevel = 'normal' | 'low' | 'high';
export type PanelPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type FontFamily = 'default' | 'sans-serif' | 'serif' | 'dyslexia-friendly' | string; // string allows custom fonts
export type SaveMode = 'auto' | 'manual';
export type StorageType = 'localStorage' | 'sessionStorage';
import type React from 'react';

// Re-export screen reader types for convenience
export type { BrowserType, ScreenReaderType, BrowserInfo, ScreenReaderConfig } from './screenReaderUtils';

/**
 * Custom storage handler interface for developers who want to use their own storage solution
 */
export interface StorageHandler {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}

/**
 * Configuration for which accessibility options are enabled/visible in the UI.
 * All options default to true if not specified.
 * 
 * @example
 * // Show only font and contrast options
 * enabledOptions={{
 *   fontFamily: true,
 *   fontSize: true,
 *   contrast: true,
 *   // All other options will be hidden
 *   saturation: false,
 *   monochrome: false,
 *   hideImages: false,
 *   screenReader: false,
 * }}
 */
export interface EnabledOptions {
  // Typography options
  /** Show font family selection (Default, Sans-serif, Serif, Dyslexia-friendly) */
  fontFamily?: boolean;
  /** Show font size adjustment (Small, Medium, Large, Extra Large) */
  fontSize?: boolean;
  /** Show line height adjustment */
  lineHeight?: boolean;
  /** Show letter spacing adjustment */
  letterSpacing?: boolean;
  /** Show word spacing adjustment */
  wordSpacing?: boolean;
  
  // Visual options
  /** Show contrast level adjustment (Normal, High) */
  contrast?: boolean;
  /** Show color saturation adjustment (Normal, Low, High) */
  saturation?: boolean;
  /** Show monochrome mode toggle */
  monochrome?: boolean;
  /** Show hide images toggle */
  hideImages?: boolean;
  /** Show highlight titles toggle */
  highlightTitles?: boolean;
  /** Show highlight links toggle */
  highlightLinks?: boolean;
  /** Show reduce motion toggle (disables animations and transitions) */
  reduceMotion?: boolean;
  
  // Preferences
  /** Show screen reader mode toggle */
  screenReader?: boolean;
  
  // Panel settings (in header)
  /** Show position selector in header */
  position?: boolean;
  /** Show theme selector in header */
  theme?: boolean;
  
  // Footer actions
  /** Show reset button */
  resetButton?: boolean;
}

/**
 * Default enabled options - all features enabled
 */
/**
 * Configuration for highlight titles colors
 */
export interface HighlightTitlesColors {
  /** Background color for highlighted titles */
  backgroundColor?: string;
  /** Text color for highlighted titles (ensures readability) */
  textColor?: string;
  /** Outline/border color for highlighted titles */
  outlineColor?: string;
}

/**
 * Configuration for highlight links colors
 */
export interface HighlightLinksColors {
  /** Background color for highlighted links */
  backgroundColor?: string;
  /** Text color for highlighted links */
  textColor?: string;
  /** Outline/border color for highlighted links */
  outlineColor?: string;
  /** Background color on hover/focus */
  hoverBackgroundColor?: string;
  /** Outline color on hover/focus */
  hoverOutlineColor?: string;
}

/**
 * Default colors for highlight titles (yellow theme)
 */
export const defaultHighlightTitlesColors: Required<HighlightTitlesColors> = {
  backgroundColor: '#fef08a',
  textColor: '#1a1a1a',
  outlineColor: '#ca8a04',
};

/**
 * Default colors for highlight links (cyan/teal theme)
 */
export const defaultHighlightLinksColors: Required<HighlightLinksColors> = {
  backgroundColor: '#a5f3fc',
  textColor: '#0e7490',
  outlineColor: '#0891b2',
  hoverBackgroundColor: '#67e8f9',
  hoverOutlineColor: '#0e7490',
};

export const defaultEnabledOptions: Required<EnabledOptions> = {
  fontFamily: true,
  fontSize: true,
  lineHeight: true,
  letterSpacing: true,
  wordSpacing: true,
  contrast: true,
  saturation: true,
  monochrome: true,
  hideImages: true,
  highlightTitles: true,
  highlightLinks: true,
  reduceMotion: true,
  screenReader: true,
  position: true,
  theme: true,
  resetButton: true,
};

export interface AccessibilityPanelClasses {
  root?: string;
  container?: string;
  header?: string;
  headerIconContainer?: string;
  headerIcon?: string;
  title?: string;
  closeButton?: string;
  closeIcon?: string;
  content?: string;
  announcement?: string;
  background?: string;
  resetContainer?: string;
  resetButton?: string;
  resetIcon?: string;
  resetText?: string;
  saveButton?: string;
  saveIcon?: string;
  saveText?: string;
  unsavedIndicator?: string;
  options?: AccessibilityOptionsClasses;
}

export interface AccessibilityOptionsClasses {
  root?: string;
  typographySection?: string;
  textSizeSection?: string;
  sectionHeading?: string;
  subsectionHeading?: string;
  textSizeGrid?: string;
  textSizeOption?: string;
  textSizeOption_default?: string;
  textSizeOption_small?: string;
  textSizeOption_medium?: string;
  textSizeOption_large?: string;
  textSizeOption_extra_large?: string;
  textSizeOptionContent?: string;
  textSizeOptionText?: string;
  contrastSection?: string;
  contrastGrid?: string;
  contrastOption?: string;
  contrastOption_normal?: string;
  contrastOption_high?: string;
  contrastOptionContent?: string;
  contrastOptionText?: string;
  saturationSection?: string;
  saturationGrid?: string;
  saturationOption?: string;
  saturationOption_normal?: string;
  saturationOption_low?: string;
  saturationOption_high?: string;
  saturationOptionContent?: string;
  saturationOptionText?: string;
  visualOptionsSection?: string;
  visualOptionsGroup?: string;
  monochromeOption?: string;
  hideImagesOption?: string;
  highlightTitlesOption?: string;
  highlightLinksOption?: string;
  reduceMotionOption?: string;
  checkboxOptionContent?: string;
  checkbox?: string;
  checkboxIcon?: string;
  checkboxLabel?: string;
  checkboxBadge?: string;
  preferencesSection?: string;
  preferencesGroup?: string;
  preferenceOption?: string;
  preferenceOption_screenReader?: string;
  panelSettingsSection?: string;
  positionSection?: string;
  positionGrid?: string;
  positionOption?: string;
  positionOption_bottom_right?: string;
  positionOption_bottom_left?: string;
  positionOption_top_right?: string;
  positionOption_top_left?: string;
  positionOption_top_center?: string;
  positionOption_bottom_center?: string;
  positionOptionContent?: string;
  positionOptionText?: string;
  themeSection?: string;
  themeGrid?: string;
  themeOption?: string;
  themeOption_light?: string;
  themeOption_dark?: string;
  themeOption_auto?: string;
  themeOptionContent?: string;
  themeOptionText?: string;
  fontFamilySection?: string;
  fontFamilyGrid?: string;
  fontFamilyOption?: string;
  fontFamilyOption_default?: string;
  fontFamilyOption_sans_serif?: string;
  fontFamilyOption_serif?: string;
  fontFamilyOption_dyslexia_friendly?: string;
  fontFamilyOptionContent?: string;
  fontFamilyOptionText?: string;
  lineHeightSection?: string;
  lineHeightGrid?: string;
  lineHeightOption?: string;
  lineHeightOption_default?: string;
  lineHeightOption_tight?: string;
  lineHeightOption_normal?: string;
  lineHeightOption_relaxed?: string;
  lineHeightOption_loose?: string;
  lineHeightOptionContent?: string;
  lineHeightOptionText?: string;
  letterSpacingSection?: string;
  letterSpacingGrid?: string;
  letterSpacingOption?: string;
  letterSpacingOption_default?: string;
  letterSpacingOption_tight?: string;
  letterSpacingOption_normal?: string;
  letterSpacingOption_wide?: string;
  letterSpacingOption_extra_wide?: string;
  letterSpacingOptionContent?: string;
  letterSpacingOptionText?: string;
  wordSpacingSection?: string;
  wordSpacingGrid?: string;
  wordSpacingOption?: string;
  wordSpacingOption_default?: string;
  wordSpacingOption_tight?: string;
  wordSpacingOption_normal?: string;
  wordSpacingOption_wide?: string;
  wordSpacingOption_extra_wide?: string;
  wordSpacingOptionContent?: string;
  wordSpacingOptionText?: string;
}

export interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  classes?: AccessibilityPanelClasses;
  position?: PanelPosition;
  theme?: ThemeMode;
  onPositionChange?: (position: PanelPosition) => void;
  onThemeChange?: (theme: ThemeMode) => void;
  /**
   * Custom font definitions. Can override default fonts or add new ones.
   * 
   * @example
   * // Override dyslexia-friendly font (useful when font script is loaded separately)
   * customFonts={{
   *   'dyslexia-friendly': '"OpenDyslexic", "Comic Sans MS", sans-serif'
   * }}
   * 
   * @example
   * // Add a new custom font
   * customFonts={{
   *   'custom-font': '"My Custom Font", sans-serif'
   * }}
   */
  customFonts?: Record<string, string>; // Map of font family names to CSS font-family values
  
  /**
   * Save mode for accessibility preferences.
   * - 'auto': Preferences are saved immediately when changed (default)
   * - 'manual': A Save button appears to persist preferences on user action
   * 
   * @default 'auto'
   */
  saveMode?: SaveMode;
  
  /**
   * Storage type for persisting preferences.
   * - 'localStorage': Persists across browser sessions (default)
   * - 'sessionStorage': Persists only for the current session
   * 
   * @default 'localStorage'
   */
  storageType?: StorageType;
  
  /**
   * Custom storage handler for developers who want to use their own storage solution.
   * When provided, this overrides the storageType option.
   * 
   * @example
   * // Using a custom API storage
   * storageHandler={{
   *   getItem: async (key) => await api.getPreference(key),
   *   setItem: async (key, value) => await api.setPreference(key, value),
   *   removeItem: async (key) => await api.deletePreference(key)
   * }}
   */
  storageHandler?: StorageHandler;
  
  /**
   * Callback fired when preferences are saved in manual mode
   */
  onSave?: () => void;
  
  /**
   * Configuration for which accessibility options are enabled/visible in the UI.
   * All options default to true if not specified.
   * 
   * @example
   * // Show only typography and contrast options
   * enabledOptions={{
   *   fontFamily: true,
   *   fontSize: true,
   *   contrast: true,
   *   saturation: false,
   *   monochrome: false,
   *   hideImages: false,
   *   screenReader: false,
   * }}
   */
  enabledOptions?: EnabledOptions;
  
  /**
   * Custom colors for the Highlight Titles feature.
   * 
   * @example
   * highlightTitlesColors={{
   *   backgroundColor: '#fef08a',
   *   textColor: '#1a1a1a',
   *   outlineColor: '#ca8a04'
   * }}
   */
  highlightTitlesColors?: HighlightTitlesColors;
  
  /**
   * Custom colors for the Highlight Links feature.
   * 
   * @example
   * highlightLinksColors={{
   *   backgroundColor: '#a5f3fc',
   *   textColor: '#0e7490',
   *   outlineColor: '#0891b2',
   *   hoverBackgroundColor: '#67e8f9',
   *   hoverOutlineColor: '#0e7490'
   * }}
   */
  highlightLinksColors?: HighlightLinksColors;
}

export interface AccessibilityOptionsProps {
  textSize: TextSize;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  wordSpacing?: WordSpacing;
  contrast: ContrastLevel;
  saturation: SaturationLevel;
  screenReader: boolean;
  monochrome: boolean;
  hideImages: boolean;
  highlightTitles: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
  onTextSizeChange: (size: TextSize) => void;
  onLineHeightChange?: (level: LineHeight) => void;
  onLetterSpacingChange?: (level: LetterSpacing) => void;
  onWordSpacingChange?: (level: WordSpacing) => void;
  onContrastChange: (level: ContrastLevel) => void;
  onSaturationChange: (level: SaturationLevel) => void;
  onScreenReaderChange: (checked: boolean) => void;
  onMonochromeChange: (checked: boolean) => void;
  onHideImagesChange: (checked: boolean) => void;
  onHighlightTitlesChange: (checked: boolean) => void;
  onHighlightLinksChange: (checked: boolean) => void;
  onReduceMotionChange: (checked: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent, action: () => void) => void;
  classes?: AccessibilityOptionsClasses;
  isDarkMode?: boolean;
  position?: PanelPosition;
  theme?: ThemeMode;
  onPositionChange?: (position: PanelPosition) => void;
  onThemeChange?: (theme: ThemeMode) => void;
  fontFamily?: FontFamily;
  onFontFamilyChange?: (fontFamily: FontFamily) => void;
  customFonts?: Record<string, string>; // Map of font family names to CSS font-family values
  /** Configuration for which options are enabled/visible */
  enabledOptions?: EnabledOptions;
}

