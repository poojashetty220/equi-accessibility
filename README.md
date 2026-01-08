# equi-accessibility

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive accessibility library for React applications. Provides contrast modes, font scaling, screen reader support, highlight features, and more - all with WCAG 2.2 AA compliance.

## ✨ Features

- 🎨 **Contrast Modes**: Default, Low, High (WCAG AA), and Dark modes
- 📝 **Typography Controls**: Font family, size, line height, letter & word spacing
- 🔍 **Visual Aids**: Monochrome mode, hide images, highlight titles/links
- 🔊 **Screen Reader Support**: ARIA live regions, Web Speech API integration
- 💾 **Persistence**: Auto-save or manual save modes with localStorage/sessionStorage
- ⚡ **Lightweight**: < 50KB minified + gzipped
- 📦 **TypeScript**: Full type definitions included
- 🎯 **Zero Dependencies**: Only React as peer dependency

## 📦 Installation

```bash
# npm
npm install equi-accessibility

# yarn
yarn add equi-accessibility

# pnpm
pnpm add equi-accessibility
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { AccessibilityPanel } from 'equi-accessibility';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Accessibility Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility settings"
      >
        ♿ Accessibility
      </button>

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Your app content */}
      <main>
        <h1>Welcome to My App</h1>
        <p>Your content here...</p>
      </main>
    </div>
  );
}

export default App;
```

### With All Options

```tsx
import { AccessibilityPanel } from 'equi-accessibility';
import type { PanelPosition, ThemeMode, EnabledOptions } from 'equi-accessibility';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PanelPosition>('bottom-right');
  const [theme, setTheme] = useState<ThemeMode>('auto');

  // Customize which options are visible
  const enabledOptions: EnabledOptions = {
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
    screenReader: true,
    position: true,
    theme: true,
    resetButton: true,
  };

  return (
    <AccessibilityPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      position={position}
      theme={theme}
      onPositionChange={setPosition}
      onThemeChange={setTheme}
      saveMode="auto" // or "manual"
      storageType="localStorage" // or "sessionStorage"
      enabledOptions={enabledOptions}
      // Custom highlight colors
      highlightTitlesColors={{
        backgroundColor: '#fef08a',
        textColor: '#1a1a1a',
        outlineColor: '#ca8a04',
      }}
      highlightLinksColors={{
        backgroundColor: '#a5f3fc',
        textColor: '#0e7490',
        outlineColor: '#0891b2',
        hoverBackgroundColor: '#67e8f9',
        hoverOutlineColor: '#0e7490',
      }}
    />
  );
}
```

### TypeScript Support

```tsx
import type {
  AccessibilityPanelProps,
  TextSize,
  ContrastLevel,
  SaturationLevel,
  PanelPosition,
  ThemeMode,
  FontFamily,
  SaveMode,
  StorageType,
  EnabledOptions,
  HighlightTitlesColors,
  HighlightLinksColors,
} from 'equi-accessibility';

// Import default values
import {
  defaultEnabledOptions,
  defaultHighlightTitlesColors,
  defaultHighlightLinksColors,
} from 'equi-accessibility';
```

## 📚 API Reference

### AccessibilityPanel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls panel visibility |
| `onClose` | `() => void` | Required | Callback when panel closes |
| `position` | `PanelPosition` | `'bottom-right'` | Panel position on screen |
| `theme` | `ThemeMode` | `'auto'` | Panel theme (light/dark/auto) |
| `saveMode` | `SaveMode` | `'auto'` | Save preferences automatically or manually |
| `storageType` | `StorageType` | `'localStorage'` | Storage mechanism |
| `storageHandler` | `StorageHandler` | - | Custom storage implementation |
| `enabledOptions` | `EnabledOptions` | All enabled | Control which options are visible |
| `highlightTitlesColors` | `HighlightTitlesColors` | Yellow theme | Custom colors for title highlighting |
| `highlightLinksColors` | `HighlightLinksColors` | Cyan theme | Custom colors for link highlighting |
| `customFonts` | `Record<string, string>` | - | Add custom font families |
| `classes` | `AccessibilityPanelClasses` | - | Custom CSS classes |
| `onPositionChange` | `(position: PanelPosition) => void` | - | Position change callback |
| `onThemeChange` | `(theme: ThemeMode) => void` | - | Theme change callback |
| `onSave` | `() => void` | - | Manual save callback |

### Contrast Levels

| Mode | Description |
|------|-------------|
| `'default'` | No contrast modifications |
| `'low'` | Reduced contrast for light sensitivity |
| `'high'` | WCAG 2.2 AA compliant high contrast |
| `'dark'` | Dark theme with high contrast |

### Panel Positions

`'bottom-right'` | `'bottom-left'` | `'top-right'` | `'top-left'` | `'top-center'` | `'bottom-center'`

## 🔧 Advanced Usage

### Custom Storage Handler

```tsx
const customStorageHandler = {
  getItem: async (key: string) => {
    // Fetch from your API
    return await api.getPreference(key);
  },
  setItem: async (key: string, value: string) => {
    // Save to your API
    await api.setPreference(key, value);
  },
  removeItem: async (key: string) => {
    // Delete from your API
    await api.deletePreference(key);
  },
};

<AccessibilityPanel
  isOpen={isOpen}
  onClose={onClose}
  storageHandler={customStorageHandler}
/>
```

### Screen Reader Utilities

```tsx
import {
  initializeAnnouncer,
  announceToScreenReader,
  enableScreenReaderMode,
  disableScreenReaderMode,
} from 'equi-accessibility';

// Initialize announcer on app start
initializeAnnouncer({ speechSynthesis: false });

// Make announcements
announceToScreenReader('Page loaded successfully', 'polite');
announceToScreenReader('Error occurred', 'assertive');

// Enable/disable screen reader enhancements
enableScreenReaderMode({
  enhancedAria: true,
  skipLinks: true,
  enhancedFocus: true,
  landmarkRoles: true,
  liveRegions: true,
});
```

### Using Individual Components

```tsx
import {
  OptionCarousel,
  CheckboxOption,
  Dropdown,
  SectionHeading,
} from 'equi-accessibility';

// Build your own custom accessibility panel
function CustomPanel() {
  const [fontSize, setFontSize] = useState('medium');

  return (
    <div>
      <SectionHeading id="font-size" isDarkMode={false}>
        Font Size
      </SectionHeading>
      <OptionCarousel
        options={['small', 'medium', 'large']}
        currentValue={fontSize}
        onChange={setFontSize}
        getDisplayName={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
        ariaLabel="font size"
        sectionId="font-size"
      />
    </div>
  );
}
```

## 🎨 Styling

The library uses Tailwind CSS classes. Make sure you have Tailwind CSS configured in your project, or override styles using the `classes` prop.

### Custom Styling Example

```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={onClose}
  classes={{
    root: 'my-custom-panel',
    header: 'bg-blue-600',
    content: 'p-4',
    resetButton: 'bg-red-500 hover:bg-red-600',
  }}
/>
```

## 📋 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License
MIT

---

## 🔧 Features

### 1. Text Size Adjustment
- **Options**: Default (1x), Small (0.875x), Medium (1x), Large (1.25x), Extra Large (1.5x)
- **Implementation**: Uses CSS variable `--font-scale` applied to root element
- **Global Effect**: Scales all text elements via root variable while maintaining responsive layout
- **Persistence**: Selected text size persists in sessionStorage and restores on page reload
- **Layout Preservation**: Responsive layout remains intact as scaling uses CSS variables and rem/em units
- **Visual Feedback**: Selected state clearly indicated in UI
- **Screen Reader**: Announces text size changes for accessibility

### 2. Line Height Adjustment
- **Options**: Default (1x), Tight (0.75x), Normal (1x), Relaxed (1.5x), Loose (2x)
- **Implementation**: Uses CSS variable `--line-height-scale` applied to all text elements
- **Global Effect**: Adjusts line spacing for improved readability while maintaining layout
- **Persistence**: Selected line height persists in sessionStorage and restores on page reload
- **Accessibility**: Helps users with dyslexia, ADHD, and visual impairments read more comfortably
- **Visual Feedback**: Selected state clearly indicated in UI
- **Screen Reader**: Announces line height changes for accessibility

### 3. Letter Spacing Adjustment
- **Options**: Default (0em), Tight (-0.0125em), Normal (0em), Wide (0.0125em), Extra Wide (0.025em)
- **Implementation**: Uses CSS variable `--letter-spacing-scale` applied to all text elements
- **Global Effect**: Adjusts spacing between letters for improved readability
- **Persistence**: Selected letter spacing persists in sessionStorage and restores on page reload
- **Accessibility**: Helps users with dyslexia and visual impairments distinguish letters better
- **Visual Feedback**: Selected state clearly indicated in UI
- **Screen Reader**: Announces letter spacing changes for accessibility

### 4. Word Spacing Adjustment
- **Options**: Default (0em), Tight (-0.05em), Normal (0em), Wide (0.05em), Extra Wide (0.1em)
- **Implementation**: Uses CSS variable `--word-spacing-scale` applied to all text elements
- **Global Effect**: Adjusts spacing between words for improved readability
- **Persistence**: Selected word spacing persists in sessionStorage and restores on page reload
- **Accessibility**: Helps users with dyslexia, ADHD, and reading difficulties parse text more easily
- **Visual Feedback**: Selected state clearly indicated in UI
- **Screen Reader**: Announces word spacing changes for accessibility

### 5. Contrast Levels
- **Default**: No contrast modifications (original page styles)
- **Low**: Reduced contrast for users sensitive to high contrast
  - Softer gray backgrounds (#f5f5f5) with muted text (#4a4a4a)
  - Reduced border prominence
  - Gentler focus indicators
  - Ideal for users with light sensitivity or migraines
- **High**: WCAG 2.2 AA compliant high contrast mode
  - White backgrounds with black text
  - Enhanced borders on all interactive elements
  - Minimum 4.5:1 contrast ratio for normal text
  - Blue links with proper visited state styling
  - Enhanced focus indicators (3px solid black outline)
- **Dark**: Dark theme with high contrast
  - Dark backgrounds (#121212) with white text
  - Enhanced readability in low-light conditions
  - Blue accent colors for links and focus states
  - Custom scrollbar styling for dark mode
- Applied globally via CSS injection without modifying application code
- Persists across page reloads
- Improves readability for users with various visual needs

### 6. Color Saturation
- Options: Normal (1x), Low (0.5x), High (1.5x)
- Globally adjusts color saturation to reduce eye strain or enhance clarity
- Applied via CSS `saturate()` filter
- Persists in sessionStorage
- Helps users with color vision deficiencies or sensitivity to vibrant colors

### 7. Monochrome Mode
- Converts entire page to grayscale
- Reduces visual clutter
- Persists in sessionStorage

### 8. Hide Images
- Replaces images with alt text placeholders
- Maintains layout integrity
- Shows descriptive text instead of images

### 9. Highlight Titles
- Visually highlights all heading elements (h1-h6) on the page
- Uses high-contrast yellow background with orange outline (default, customizable)
- Helps users with cognitive impairments or attention difficulties identify page structure
- Meets WCAG AA contrast requirements
- Does not alter page layout or content flow
- Works with dynamically loaded content
- Includes elements with `role="heading"` attribute
- **Customizable colors** via `highlightTitlesColors` prop

**Custom Colors Example:**
```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  highlightTitlesColors={{
    backgroundColor: '#fef08a',  // Yellow background
    textColor: '#1a1a1a',        // Dark text for readability
    outlineColor: '#ca8a04'      // Orange outline
  }}
/>
```

### 10. Highlight Links
- Visually highlights all interactive links on the page
- Uses high-contrast cyan/teal background with outline (default, customizable)
- Distinguishes links from normal text even without underlines
- Preserves and enhances focus and hover states
- Works with anchor tags (`<a>`) and elements with `role="link"`
- Handles dynamically loaded content
- Helps users quickly identify navigation elements
- **Customizable colors** via `highlightLinksColors` prop

**Custom Colors Example:**
```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  highlightLinksColors={{
    backgroundColor: '#a5f3fc',       // Cyan background
    textColor: '#0e7490',             // Teal text
    outlineColor: '#0891b2',          // Teal outline
    hoverBackgroundColor: '#67e8f9',  // Lighter cyan on hover
    hoverOutlineColor: '#0e7490'      // Darker outline on hover
  }}
/>

### 11. Font Family Selection
- **Options**: Default, Sans-serif, Serif, Dyslexia-friendly
- **Custom Fonts**: Applications can add custom fonts via props
- **Global Application**: Font family applied globally via CSS variable
- **Persistence**: Selected font family persists in sessionStorage
- **Accessibility**: Improves readability for users with different visual/cognitive needs

**Default Font Options**:
- `'default'` - Inherits from parent element
- `'sans-serif'` - System sans-serif font stack
- `'serif'` - Georgia, Times New Roman, serif stack
- `'dyslexia-friendly'` - OpenDyslexic font (requires font files in `/public/fonts/`)

**Adding Custom Fonts**:
1. Add font files to `/public/fonts/` directory
2. Define `@font-face` in `src/index.css`:
   ```css
   @font-face {
     font-family: 'YourFontName';
     src: url('/fonts/YourFont-Regular.woff2') format('woff2');
     font-weight: normal;
     font-style: normal;
     font-display: swap;
   }
   ```
3. Add to `customFonts` prop in your application:
   ```tsx
   <AccessibilityPanel
     customFonts={{
       'my-custom-font': '"YourFontName", sans-serif'
     }}
   />
   ```
4. The custom font will appear in the Font Family selection

See `/public/fonts/README.md` for detailed instructions on adding custom fonts.

### 11. Reset All Settings
- Fixed button at bottom of panel
- Resets all options to defaults including position, theme, and font family
- Clears storage

### 12. Save Mode (Auto/Manual)

The library provides a configurable save mode via the `saveMode` prop that determines how user preferences are persisted:

#### Auto Save Mode (Default)
- User changes are persisted immediately when changed
- Settings are saved to storage without user action
- Best for applications where users expect instant persistence

```tsx
<AccessibilityPanel
  saveMode="auto"  // Default - saves immediately on change
/>
```

#### Manual Save Mode
- A visible **Save** button appears at the bottom of the panel
- User changes are applied immediately (for preview) but not persisted until Save is clicked
- Visual indicator shows when there are unsaved changes
- Best for applications where users want explicit control over saving

```tsx
<AccessibilityPanel
  saveMode="manual"  // Shows Save button, user must click to persist
  onSave={() => console.log('Settings saved!')}  // Optional callback
/>
```

**Save Button Features**:
- Shows "Save Settings" when there are unsaved changes
- Shows "All Changes Saved" when no pending changes
- Disabled state when no changes to save
- Loading spinner during save operation
- Visual indicator (pulsing dot) for unsaved changes
- Keyboard accessible
