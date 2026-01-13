/**
 * @fileoverview Accessibility Options Component
 * @module Accessibility/AccessibilityOptions
 * 
 * This component renders all the accessibility option controls within the panel.
 * It displays sections for font family, text size, contrast, saturation, visual options, and preferences.
 * Uses reusable components (OptionCarousel, CheckboxOption, SectionHeading) for consistency and maintainability.
 * All options are presented as clickable cards/boxes for better accessibility.
 * 
 * @component
 * @example
 * ```tsx
 * <AccessibilityOptions
 *   textSize="medium"
 *   contrast="normal"
 *   monochrome={false}
 *   onTextSizeChange={handleChange}
 *   classes={{ root: "custom-spacing" }}
 * />
 * ```
 */

import React from 'react';
import { combineClasses } from './utils';
import OptionCarousel from './OptionCarousel';
import CheckboxOption from './CheckboxOption';
import SectionHeading from './SectionHeading';
import type { AccessibilityOptionsProps, TextSize, LineHeight, LetterSpacing, WordSpacing, ContrastLevel, SaturationLevel, FontFamily, EnabledOptions } from './types';
import { defaultEnabledOptions } from './types';

/**
 * AccessibilityOptions Component
 * 
 * Renders all accessibility option controls organized into sections:
 * - Font Family: Default, Sans-serif, Serif, Dyslexia-friendly (via OptionCarousel)
 * - Font Size: Small, Medium, Large options (via OptionCarousel)
 * - Contrast: Normal, High options (via OptionCarousel)
 * - Color Saturation: Normal, Low, High options (via OptionCarousel)
 * - Visual Options: Monochrome mode, Hide images toggles (via CheckboxOption)
 * - Preferences: Screen reader toggle (via CheckboxOption)
 * 
 * Uses reusable components for consistency:
 * - OptionCarousel: For multi-option selections (Font Family, Font Size, Contrast, Saturation)
 * - CheckboxOption: For toggleable boolean settings (Visual Options, Preferences)
 * - SectionHeading: For consistent section titles
 * 
 * All options use clickable card/box design for better UX and accessibility.
 * Supports custom styling via classes prop.
 */
const AccessibilityOptions: React.FC<AccessibilityOptionsProps> = ({
  textSize,
  lineHeight = 'default',
  letterSpacing = 'default',
  wordSpacing = 'default',
  contrast,
  saturation,
  screenReader,
  monochrome,
  hideImages,
  highlightTitles,
  highlightLinks,
  reduceMotion,
  onTextSizeChange,
  onLineHeightChange,
  onLetterSpacingChange,
  onWordSpacingChange,
  onContrastChange,
  onSaturationChange,
  onScreenReaderChange,
  onMonochromeChange,
  onHideImagesChange,
  onHighlightTitlesChange,
  onHighlightLinksChange,
  onReduceMotionChange,
  handleKeyDown,
  classes = {},
  isDarkMode = false,
  fontFamily = 'default',
  onFontFamilyChange,
  customFonts = {},
  enabledOptions: userEnabledOptions = {},
}) => {
  // Merge user-provided enabled options with defaults
  const enabledOptions: Required<EnabledOptions> = {
    ...defaultEnabledOptions,
    ...userEnabledOptions
  };

  // Check if any typography options are enabled
  const hasTypographyOptions = enabledOptions.fontFamily || enabledOptions.fontSize || 
    enabledOptions.lineHeight || enabledOptions.letterSpacing || enabledOptions.wordSpacing;

  // Check if any visual options are enabled
  const hasVisualOptions = enabledOptions.monochrome || enabledOptions.hideImages || 
    enabledOptions.highlightTitles || enabledOptions.highlightLinks || enabledOptions.reduceMotion;

  // Check if any preferences are enabled
  const hasPreferences = enabledOptions.screenReader;
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================


  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={combineClasses("space-y-6", classes.root)}>
      {/* Typography Group Section */}
      {hasTypographyOptions && (
        <section aria-labelledby="typography-heading" className={combineClasses("space-y-4", classes.typographySection)}>
          <SectionHeading id="typography-heading" isDarkMode={isDarkMode} className={classes.sectionHeading}>
            Typography
          </SectionHeading>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Font Family Subsection */}
            {enabledOptions.fontFamily && (
              <section aria-labelledby="font-family-heading" className={combineClasses("space-y-3", classes.fontFamilySection)}>
                <SectionHeading id="font-family-heading" isDarkMode={isDarkMode} className={combineClasses("text-xs font-medium normal-case tracking-normal", classes.subsectionHeading || classes.sectionHeading)}>
                  Font Family
                </SectionHeading>
                <OptionCarousel
                  options={(() => {
                    const defaultFonts: FontFamily[] = ['default', 'sans-serif', 'serif', 'dyslexia-friendly'];
                    const customFontKeys = Object.keys(customFonts || {}).filter(key => !defaultFonts.includes(key as FontFamily));
                    return [...defaultFonts, ...customFontKeys] as FontFamily[];
                  })()}
                  currentValue={fontFamily}
                  onChange={(value) => onFontFamilyChange?.(value)}
                  getDisplayName={(font) => {
                    if (font === 'dyslexia-friendly') return 'Dyslexia Friendly';
                    if (font === 'sans-serif') return 'Sans Serif';
                    if (font === 'default') return 'Default';
                    return font.charAt(0).toUpperCase() + font.slice(1).replace(/-/g, ' ');
                  }}
                  ariaLabel="font family"
                  sectionId="font-family-heading"
                  isDarkMode={isDarkMode}
                  customClasses={{
                    container: classes.fontFamilyGrid,
                    carousel: classes.fontFamilyOption,
                    currentOption: classes.fontFamilyOptionContent
                  }}
                />
              </section>
            )}

            {/* Text Size Subsection */}
            {enabledOptions.fontSize && (
              <section aria-labelledby="text-size-heading" className={combineClasses("space-y-3", classes.textSizeSection)}>
                <SectionHeading id="text-size-heading" isDarkMode={isDarkMode} className={combineClasses("text-xs font-medium normal-case tracking-normal", classes.subsectionHeading || classes.sectionHeading)}>
                  Font Size
                </SectionHeading>
                <OptionCarousel
                  options={['default', 'small', 'medium', 'large', 'extra-large'] as TextSize[]}
                  currentValue={textSize}
                  onChange={onTextSizeChange}
                  getDisplayName={(size) => {
                    if (size === 'default') return 'Default';
                    if (size === 'extra-large') return 'Extra Large';
                    return size.charAt(0).toUpperCase() + size.slice(1);
                  }}
                  ariaLabel="font size"
                  sectionId="text-size-heading"
                  isDarkMode={isDarkMode}
                  customClasses={{
                    container: classes.textSizeGrid,
                    carousel: classes.textSizeOption,
                    currentOption: classes.textSizeOptionContent
                  }}
                />
              </section>
            )}

            {/* Line Height Subsection */}
            {enabledOptions.lineHeight && (
              <section aria-labelledby="line-height-heading" className={combineClasses("space-y-3", classes.lineHeightSection)}>
                <SectionHeading id="line-height-heading" isDarkMode={isDarkMode} className={combineClasses("text-xs font-medium normal-case tracking-normal", classes.subsectionHeading || classes.sectionHeading)}>
                  Line Height
                </SectionHeading>
                <OptionCarousel
                  options={['default', 'tight', 'normal', 'relaxed', 'loose'] as LineHeight[]}
                  currentValue={lineHeight}
                  onChange={(value) => onLineHeightChange?.(value)}
                  getDisplayName={(level) => {
                    if (level === 'default') return 'Default';
                    return level.charAt(0).toUpperCase() + level.slice(1);
                  }}
                  ariaLabel="line height"
                  sectionId="line-height-heading"
                  isDarkMode={isDarkMode}
                  customClasses={{
                    container: classes.lineHeightGrid,
                    carousel: classes.lineHeightOption,
                    currentOption: classes.lineHeightOptionContent
                  }}
                />
              </section>
            )}

            {/* Letter Spacing Subsection */}
            {enabledOptions.letterSpacing && (
              <section aria-labelledby="letter-spacing-heading" className={combineClasses("space-y-3", classes.letterSpacingSection)}>
                <SectionHeading id="letter-spacing-heading" isDarkMode={isDarkMode} className={combineClasses("text-xs font-medium normal-case tracking-normal", classes.subsectionHeading || classes.sectionHeading)}>
                  Letter Spacing
                </SectionHeading>
                <OptionCarousel
                  options={['default', 'tight', 'normal', 'wide', 'extra-wide'] as LetterSpacing[]}
                  currentValue={letterSpacing}
                  onChange={(value) => onLetterSpacingChange?.(value)}
                  getDisplayName={(level) => {
                    if (level === 'default') return 'Default';
                    if (level === 'extra-wide') return 'Extra Wide';
                    return level.charAt(0).toUpperCase() + level.slice(1);
                  }}
                  ariaLabel="letter spacing"
                  sectionId="letter-spacing-heading"
                  isDarkMode={isDarkMode}
                  customClasses={{
                    container: classes.letterSpacingGrid,
                    carousel: classes.letterSpacingOption,
                    currentOption: classes.letterSpacingOptionContent
                  }}
                />
              </section>
            )}

            {/* Word Spacing Subsection */}
            {enabledOptions.wordSpacing && (
              <section aria-labelledby="word-spacing-heading" className={combineClasses("space-y-3", classes.wordSpacingSection)}>
                <SectionHeading id="word-spacing-heading" isDarkMode={isDarkMode} className={combineClasses("text-xs font-medium normal-case tracking-normal", classes.subsectionHeading || classes.sectionHeading)}>
                  Word Spacing
                </SectionHeading>
                <OptionCarousel
                  options={['default', 'tight', 'normal', 'wide', 'extra-wide'] as WordSpacing[]}
                  currentValue={wordSpacing}
                  onChange={(value) => onWordSpacingChange?.(value)}
                  getDisplayName={(level) => {
                    if (level === 'default') return 'Default';
                    if (level === 'extra-wide') return 'Extra Wide';
                    return level.charAt(0).toUpperCase() + level.slice(1);
                  }}
                  ariaLabel="word spacing"
                  sectionId="word-spacing-heading"
                  isDarkMode={isDarkMode}
                  customClasses={{
                    container: classes.wordSpacingGrid,
                    carousel: classes.wordSpacingOption,
                    currentOption: classes.wordSpacingOptionContent
                  }}
                />
              </section>
            )}
          </div>
        </section>
      )}

      {/* Contrast Section */}
      {enabledOptions.contrast && (
        <section aria-labelledby="contrast-heading" className={combineClasses("space-y-3", classes.contrastSection)}>
          <SectionHeading id="contrast-heading" isDarkMode={isDarkMode} className={classes.sectionHeading}>
            Contrast
          </SectionHeading>
          <OptionCarousel
            options={['default', 'low', 'high', 'dark'] as ContrastLevel[]}
            currentValue={contrast}
            onChange={onContrastChange}
            getDisplayName={(level) => {
              const displayNames: Record<ContrastLevel, string> = {
                default: 'Default',
                low: 'Low',
                high: 'High',
                dark: 'Dark'
              };
              return displayNames[level];
            }}
            ariaLabel="contrast level"
            sectionId="contrast-heading"
            isDarkMode={isDarkMode}
            customClasses={{
              container: classes.contrastGrid,
              carousel: classes.contrastOption,
              currentOption: classes.contrastOptionContent
            }}
          />
        </section>
      )}

      {/* Color Saturation Section */}
      {enabledOptions.saturation && (
        <section aria-labelledby="saturation-heading" className={combineClasses("space-y-3", classes.saturationSection)}>
          <SectionHeading id="saturation-heading" isDarkMode={isDarkMode} className={classes.sectionHeading}>
            Color Saturation
          </SectionHeading>
          <OptionCarousel
            options={['normal', 'low', 'high'] as SaturationLevel[]}
            currentValue={saturation}
            onChange={onSaturationChange}
            getDisplayName={(level) => level.charAt(0).toUpperCase() + level.slice(1)}
            ariaLabel="color saturation"
            sectionId="saturation-heading"
            isDarkMode={isDarkMode}
            customClasses={{
              container: classes.saturationGrid,
              carousel: classes.saturationOption,
              currentOption: classes.saturationOptionContent
            }}
          />
        </section>
      )}

      {/* Visual Options Section */}
      {hasVisualOptions && (
        <section aria-labelledby="visual-options-heading" className={combineClasses("space-y-3", classes.visualOptionsSection)}>
          <SectionHeading id="visual-options-heading" isDarkMode={isDarkMode} className={classes.sectionHeading}>
            Visual Options
          </SectionHeading>
          <div className={combineClasses("space-y-2", classes.visualOptionsGroup)} role="group" aria-labelledby="visual-options-heading">
            {enabledOptions.monochrome && (
              <CheckboxOption
                label="Monochrome Mode"
                checked={monochrome}
                onChange={onMonochromeChange}
                isDarkMode={isDarkMode}
                onKeyDown={handleKeyDown}
                className={classes.monochromeOption}
                ariaLabel={`Monochrome mode ${monochrome ? 'enabled' : 'disabled'}`}
              />
            )}
            {enabledOptions.hideImages && (
              <CheckboxOption
                label="Hide Images"
                checked={hideImages}
                onChange={onHideImagesChange}
                isDarkMode={isDarkMode}
                onKeyDown={handleKeyDown}
                className={classes.hideImagesOption}
                ariaLabel={`Hide images ${hideImages ? 'enabled' : 'disabled'}`}
              />
            )}
            {enabledOptions.highlightTitles && (
              <CheckboxOption
                label="Highlight Titles"
                checked={highlightTitles}
                onChange={onHighlightTitlesChange}
                isDarkMode={isDarkMode}
                onKeyDown={handleKeyDown}
                className={classes.highlightTitlesOption}
                ariaLabel={`Highlight titles ${highlightTitles ? 'enabled' : 'disabled'}. When enabled, all headings on the page will be visually highlighted.`}
              />
            )}
            {enabledOptions.highlightLinks && (
              <CheckboxOption
                label="Highlight Links"
                checked={highlightLinks}
                onChange={onHighlightLinksChange}
                isDarkMode={isDarkMode}
                onKeyDown={handleKeyDown}
                className={classes.highlightLinksOption}
                ariaLabel={`Highlight links ${highlightLinks ? 'enabled' : 'disabled'}. When enabled, all links on the page will be visually highlighted.`}
              />
            )}
            {enabledOptions.reduceMotion && (
              <CheckboxOption
                label="Reduce Animation"
                checked={reduceMotion}
                onChange={onReduceMotionChange}
                isDarkMode={isDarkMode}
                onKeyDown={handleKeyDown}
                className={classes.reduceMotionOption}
                ariaLabel={`Reduce animation ${reduceMotion ? 'enabled' : 'disabled'}. When enabled, all animations, transitions, GIFs, and autoplay videos will be reduced for a calmer experience.`}
              />
            )}
          </div>
        </section>
      )}

      {/* Preferences Section */}
      {hasPreferences && (
        <section aria-labelledby="preferences-heading" className={combineClasses("space-y-3", classes.preferencesSection)}>
          <SectionHeading id="preferences-heading" isDarkMode={isDarkMode} className={classes.sectionHeading}>
            Preferences
          </SectionHeading>
          <div className={combineClasses("space-y-2", classes.preferencesGroup)} role="group" aria-labelledby="preferences-heading">
            {enabledOptions.screenReader && (
              <CheckboxOption
                label="Screen Reader"
                checked={screenReader}
                onChange={onScreenReaderChange}
                isDarkMode={isDarkMode}
                onKeyDown={handleKeyDown}
                className={combineClasses(classes.preferenceOption || '', classes.preferenceOption_screenReader || '')}
                ariaLabel={`Screen Reader ${screenReader ? 'enabled' : 'disabled'}`}
              />
            )}
          </div>
        </section>
      )}

    </div>
  );
};

export default AccessibilityOptions;

