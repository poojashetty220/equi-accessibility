# equi-accessible

[![npm version](https://badge.fury.io/js/equi-accessible.svg)](https://www.npmjs.com/package/equi-accessible)
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
npm install equi-accessible

# yarn
yarn add equi-accessible

# pnpm
pnpm add equi-accessible
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { AccessibilityPanel } from 'equi-accessible';

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
import { AccessibilityPanel } from 'equi-accessible';
import type { PanelPosition, ThemeMode, EnabledOptions } from 'equi-accessible';

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
} from 'equi-accessible';

// Import default values
import {
  defaultEnabledOptions,
  defaultHighlightTitlesColors,
  defaultHighlightLinksColors,
} from 'equi-accessible';
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
} from 'equi-accessible';

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
} from 'equi-accessible';

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

MIT © [Your Name](https://github.com/yourusername)

---

## 📁 Detailed Documentation

For detailed documentation on component internals, architecture, and file structure, continue reading below.

## 📁 File Structure

```
src/components/ui/Accessibility/
├── AccessibilityPanel.tsx    # Main panel component (container)
├── AccessibilityOptions.tsx   # Options display component
├── OptionCarousel.tsx          # Reusable carousel component for multi-option selections
├── Dropdown.tsx                # Reusable dropdown component for option selection
├── CheckboxOption.tsx           # Reusable checkbox-style option component
├── SectionHeading.tsx          # Reusable section heading component
├── screenReaderUtils.ts        # Screen reader utilities and browser detection
├── types.ts                    # TypeScript type definitions
├── utils.ts                    # Utility functions for class merging
└── README.md                   # This documentation
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Root                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AccessibilityPanel (Container)               │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  • State Management                             │ │  │
│  │  │  • Session Persistence                          │ │  │
│  │  │  • Global Filters (monochrome, hide images)     │ │  │
│  │  │  • Event Handlers                               │ │  │
│  │  │  • Dropdown (Position & Theme)                  │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │     AccessibilityOptions (Presentation)         │ │  │
│  │  │  ┌──────────────────────────────────────────┐   │ │  │
│  │  │  │  • SectionHeading (Section Titles)        │   │ │  │
│  │  │  │  • OptionCarousel (Multi-option)          │   │ │  │
│  │  │  │    - Font Family                           │   │ │  │
│  │  │  │    - Font Size                             │   │ │  │
│  │  │  │    - Line Height                           │   │ │  │
│  │  │  │    - Letter Spacing                        │   │ │  │
│  │  │  │    - Word Spacing                          │   │ │  │
│  │  │  │    - Contrast                              │   │ │  │
│  │  │  │    - Saturation                            │   │ │  │
│  │  │  │  • CheckboxOption (Toggles)                 │   │ │  │
│  │  │  │    - Visual Options                        │   │ │  │
│  │  │  │    - Preferences                           │   │ │  │
│  │  │  └──────────────────────────────────────────┘   │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │         Reset Button (Fixed Bottom)            │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Reusable Components:
├── OptionCarousel    → Used for Font Family, Font Size, Contrast, Saturation
├── Dropdown          → Used for Position and Theme selection in header
├── CheckboxOption    → Used for Visual Options and Preferences toggles
└── SectionHeading    → Used for all section titles
```

## 📄 File Usage & Documentation

### 1. `AccessibilityPanel.tsx`

**Purpose**: Main container component that manages all accessibility state and global effects.

**TypeScript**: Fully typed with TypeScript interfaces and types.

**Responsibilities**:
- Manages all accessibility state (text size, contrast, saturation, toggles)
- Applies global CSS filters (monochrome grayscale)
- Handles image hiding/replacement
- Manages sessionStorage persistence
- Handles panel open/close logic
- Provides screen reader announcements

**Key Features**:
- ✅ Click outside to close
- ✅ Escape key to close
- ✅ Focus management
- ✅ Screen reader support
- ✅ Session persistence
- ✅ Customizable styling

**Visual Structure**:
```
┌─────────────────────────────────────────┐
│  Header (Primary Blue)                  │
│  [Icon]  Accessibility Settings  [X]    │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ Position     │  │ Theme        │   │
│  │ [Bottom Right▼]│ [Auto ▼]      │   │
│  └──────────────┘  └──────────────┘   │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Scrollable Content Area          │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Font Size Section          │ │ │
│  │  │  [Default] [Small] [Medium] [Large] [Extra Large] │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Line Height Section         │ │ │
│  │  │  [Default] [Tight] [Normal] [Relaxed] [Loose] │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Letter Spacing Section      │ │ │
│  │  │  [Default] [Tight] [Normal] [Wide] [Extra Wide] │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Word Spacing Section        │ │ │
│  │  │  [Default] [Tight] [Normal] [Wide] [Extra Wide] │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Contrast Section           │ │ │
│  │  │  [Default] [Low] [High] [Dark] │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Saturation Section         │ │ │
│  │  │  [Normal] [Low] [High]      │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Visual Options             │ │ │
│  │  │  ☑ Monochrome Mode [On]     │ │ │
│  │  │  ☐ Hide Images [Off]        │ │ │
│  │  │  ☐ Highlight Titles [Off]   │ │ │
│  │  │  ☐ Highlight Links [Off]    │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Preferences                │ │ │
│  │  │  ☐ Screen Reader            │ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  Reset All Settings Button (Fixed)     │
│  [🔄 Reset All Settings]               │
└─────────────────────────────────────────┘
```

**Usage Example**:
```tsx
import { useState } from 'react';
import AccessibilityPanel from './components/ui/Accessibility/AccessibilityPanel';
import type { PanelPosition, ThemeMode } from './components/ui/Accessibility/types';

function App(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <AccessibilityPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      position="bottom-right"
      theme="auto"
      className="custom-panel"
      customFonts={{
        // Override default fonts or add custom fonts
        'dyslexia-friendly': '"OpenDyslexic", "Comic Sans MS", sans-serif',
        'my-custom-font': '"MyCustomFont", sans-serif'
      }}
      classes={{
        root: "shadow-2xl",
        header: "bg-gradient-to-r from-blue-600 to-purple-600",
        title: "text-xl font-bold"
      }}
    />
  );
}
```

**Position Options**:
- `'bottom-right'` (default) - Panel appears at bottom-right corner
- `'bottom-left'` - Panel appears at bottom-left corner
- `'top-right'` - Panel appears at top-right corner
- `'top-left'` - Panel appears at top-left corner
- `'top-center'` - Panel appears at top center
- `'bottom-center'` - Panel appears at bottom center

**Theme Options**:
- `'light'` - Always use light mode styling
- `'dark'` - Always use dark mode styling
- `'auto'` (default) - Automatically switches based on system preference

### 2. `AccessibilityOptions.tsx`

**Purpose**: Presentation component that renders all accessibility option controls using reusable components.

**TypeScript**: Fully typed with TypeScript interfaces and types.

**Responsibilities**:
- Displays all option sections (Font Family, Font Size, Contrast, Saturation, etc.)
- Uses reusable components: `OptionCarousel`, `CheckboxOption`, `SectionHeading`
- Handles visual feedback for selected/checked states
- Applies custom styling via classes prop
- Provides accessible markup (ARIA labels, roles)

**Reusable Components Used**:
- `OptionCarousel` - For Font Family, Font Size, Line Height, Letter Spacing, Word Spacing, Contrast, and Saturation selections
- `CheckboxOption` - For Visual Options and Preferences toggles
- `SectionHeading` - For consistent section titles

**Visual Structure**:
```
┌─────────────────────────────────────┐
│  FONT FAMILY                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │Default│ │Sans  │ │Serif │ │Dyslex││
│  └──────┘ └──────┘ └──────┘ └──────┘│
├─────────────────────────────────────┤
│  FONT SIZE                          │
│  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐│
│  │Default │ │Small │ │Medium│ │Large │ │Extra Large││
│  └────────┘ └──────┘ └──────┘ └──────┘ └──────────┘│
├─────────────────────────────────────┤
│  LINE HEIGHT                        │
│  ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌──────┐ │
│  │Default │ │Tight │ │Normal│ │Relaxed │ │Loose │ │
│  └────────┘ └──────┘ └──────┘ └────────┘ └──────┘ │
├─────────────────────────────────────┤
│  LETTER SPACING                     │
│  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐│
│  │Default │ │Tight │ │Normal│ │ Wide │ │Extra Wide││
│  └────────┘ └──────┘ └──────┘ └──────┘ └──────────┘│
├─────────────────────────────────────┤
│  WORD SPACING                       │
│  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐│
│  │Default │ │Tight │ │Normal│ │ Wide │ │Extra Wide││
│  └────────┘ └──────┘ └──────┘ └──────┘ └──────────┘│
├─────────────────────────────────────┤
│  CONTRAST                           │
│  ┌──────────┐ ┌──────────┐         │
│  │  Normal  │ │   High   │         │
│  └──────────┘ └──────────┘         │
├─────────────────────────────────────┤
│  COLOR SATURATION                   │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Normal│ │ Low  │ │ High │        │
│  └──────┘ └──────┘ └──────┘        │
├─────────────────────────────────────┤
│  VISUAL OPTIONS                     │
│  ┌───────────────────────────────┐ │
│  │ ☑ Monochrome Mode        [On] │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ ☐ Hide Images            [Off]│ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ ☐ Highlight Titles       [Off]│ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ ☐ Highlight Links        [Off]│ │
│  └───────────────────────────────┘ │
├─────────────────────────────────────┤
│  PREFERENCES                       │
│  ┌───────────────────────────────┐ │
│  │ ☐ Screen Reader              │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Usage Example**:
```tsx
import type { TextSize, ContrastLevel } from './components/ui/Accessibility/types';

<AccessibilityOptions
  textSize="default"
  contrast="normal"
  saturation="normal"
  screenReader={false}
  monochrome={false}
  hideImages={false}
  onTextSizeChange={(size: TextSize) => handleChange(size)}
  onContrastChange={(level: ContrastLevel) => handleContrastChange(level)}
  onSaturationChange={(level) => handleSaturationChange(level)}
  onScreenReaderChange={(checked) => handleScreenReaderChange(checked)}
  onMonochromeChange={(checked) => handleMonochromeChange(checked)}
  onHideImagesChange={(checked) => handleHideImagesChange(checked)}
  handleKeyDown={(e, action) => handleKeyDown(e, action)}
  classes={{
    root: "space-y-8",
    sectionHeading: "text-lg font-bold",
    textSizeOption: "hover:scale-105"
  }}
/>
```

### 3. `OptionCarousel.tsx`

**Purpose**: Reusable banner carousel component for multi-option selections.

**TypeScript**: Fully typed with TypeScript generics for type safety.

**Responsibilities**:
- Displays one option at a time in a clickable banner-like box
- Shows bottom indicator dots for current position
- Handles keyboard navigation (Arrow Left/Right, Enter/Space)
- Cycles through options on click
- Provides accessible markup (ARIA labels, roles)

**Features**:
- ✅ Generic component supporting any string-based option type
- ✅ Keyboard navigation support
- ✅ Visual indicator dots showing current position
- ✅ Smooth transitions and hover effects
- ✅ Dark mode support
- ✅ Customizable styling via customClasses prop

**Usage Example**:
```tsx
import OptionCarousel from './components/ui/Accessibility/OptionCarousel';

<OptionCarousel
  options={['default', 'small', 'medium', 'large', 'extra-large']}
  currentValue="default"
  onChange={(value) => setTextSize(value)}
  getDisplayName={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
  ariaLabel="font size"
  sectionId="font-size-heading"
  isDarkMode={false}
  customClasses={{
    container: "my-custom-container",
    currentOption: "my-custom-option"
  }}
/>
```

**Used In**:
- Font Family selection
- Font Size selection
- Line Height selection
- Letter Spacing selection
- Word Spacing selection
- Contrast level selection
- Color Saturation selection

### 4. `Dropdown.tsx`

**Purpose**: Reusable dropdown component for selecting from a list of options.

**TypeScript**: Fully typed with TypeScript generics for type safety.

**Responsibilities**:
- Displays a dropdown button with current selection
- Shows dropdown menu with all available options
- Handles keyboard navigation (Enter/Space to open, Escape to close)
- Closes when clicking outside or selecting an option
- Provides accessible markup (ARIA labels, roles)

**Features**:
- ✅ Generic component supporting any string-based option type
- ✅ Keyboard navigation support
- ✅ Click outside to close
- ✅ Customizable display names
- ✅ Dark mode support
- ✅ Customizable minimum width

**Usage Example**:
```tsx
import Dropdown from './components/ui/Accessibility/Dropdown';

const [isOpen, setIsOpen] = useState(false);

<Dropdown
  label="Position"
  value="bottom-right"
  options={['bottom-right', 'top-left', 'top-right', 'bottom-left']}
  onChange={(value) => setPosition(value)}
  getDisplayName={(val) => val.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
  isOpen={isOpen}
  onToggle={setIsOpen}
  isDarkMode={false}
  onCloseOther={() => setIsOtherDropdownOpen(false)}
/>
```

**Used In**:
- Position selection in panel header
- Theme selection in panel header

### 5. `CheckboxOption.tsx`

**Purpose**: Reusable checkbox-style option component for toggleable settings.

**TypeScript**: Fully typed with TypeScript interfaces.

**Responsibilities**:
- Displays a checkbox-style toggle option
- Shows checked/unchecked visual state
- Displays badge text (e.g., "On"/"Off")
- Handles keyboard navigation
- Provides accessible markup (ARIA labels, roles)

**Features**:
- ✅ Visual checkbox with checkmark icon
- ✅ Customizable badge text
- ✅ Keyboard navigation support
- ✅ Dark mode support
- ✅ Customizable styling via className prop
- ✅ Hover and focus states

**Usage Example**:
```tsx
import CheckboxOption from './components/ui/Accessibility/CheckboxOption';

<CheckboxOption
  label="Monochrome Mode"
  checked={monochrome}
  onChange={setMonochrome}
  isDarkMode={false}
  onKeyDown={(e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }}
  badgeText="On"
  ariaLabel="Monochrome mode enabled"
/>
```

**Used In**:
- Visual Options section (Monochrome Mode, Hide Images, Highlight Titles, Highlight Links)
- Preferences section (Screen Reader)

### 6. `SectionHeading.tsx`

**Purpose**: Reusable section heading component for accessibility option sections.

**TypeScript**: Fully typed with TypeScript interfaces.

**Responsibilities**:
- Displays consistent section headings
- Supports dark mode styling
- Provides semantic HTML (h3 element)
- Customizable styling via className prop

**Features**:
- ✅ Consistent styling across all sections
- ✅ Dark mode support
- ✅ Semantic HTML (h3)
- ✅ Customizable via className prop

**Usage Example**:
```tsx
import SectionHeading from './components/ui/Accessibility/SectionHeading';

<SectionHeading id="font-size-heading" isDarkMode={false} className="my-custom-heading">
  Font Size
</SectionHeading>
```

**Used In**:
- All option sections (Font Family, Font Size, Contrast, Saturation, Visual Options, Preferences)

### 7. `utils.ts`

**Purpose**: Utility functions for class name management and merging.

**TypeScript**: Fully typed with proper TypeScript function signatures.

**Functions**:

#### `mergeClasses(...classes: (string | null | undefined | false)[]): string`
Merges multiple class name strings, filtering out falsy values.

```typescript
mergeClasses('btn', 'btn-primary', null, 'active')
// Returns: 'btn btn-primary active'
```

#### `combineClasses(defaultClasses: string, customClasses?: string): string`
Combines default and custom classes, with custom classes appended last to allow overrides.

```typescript
combineClasses('bg-primary-600 text-white', 'bg-red-500')
// Returns: 'bg-primary-600 text-white bg-red-500'
// Tailwind will use bg-red-500 (last one wins)
```

**Usage Example**:
```typescript
import { combineClasses, mergeClasses } from './utils';

const classes = combineClasses(
  'default-class-1 default-class-2',
  'custom-class-1 custom-class-2'
);
// Result: 'default-class-1 default-class-2 custom-class-1 custom-class-2'
```

### 8. `screenReaderUtils.ts`

**Purpose**: Utilities for enhancing screen reader support with browser detection and ARIA enhancements.

**TypeScript**: Fully typed with proper TypeScript interfaces.

**Types**:
```typescript
type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
type ScreenReaderType = 'nvda' | 'jaws' | 'voiceover' | 'talkback' | 'narrator' | 'orca' | 'unknown';

interface BrowserInfo {
  type: BrowserType;
  version: string;
  isSupported: boolean;
}

interface ScreenReaderConfig {
  enhancedAria: boolean;      // Add missing ARIA attributes
  skipLinks: boolean;          // Create skip navigation links
  enhancedFocus: boolean;      // Enhanced focus indicators
  landmarkRoles: boolean;      // Add landmark roles
  liveRegions: boolean;        // Enable live region announcements
  announcementDelay: number;   // Delay for announcements (ms)
}
```

**Functions**:

#### `detectBrowser(): BrowserInfo`
Detects the current browser type and version.

```typescript
const browser = detectBrowser();
// { type: 'chrome', version: '120.0', isSupported: true }
```

#### `detectLikelyScreenReader(): ScreenReaderType`
Gets the likely screen reader based on browser and OS.

```typescript
const screenReader = detectLikelyScreenReader();
// 'voiceover' on macOS, 'nvda' on Windows, 'talkback' on Android
```

#### `enableScreenReaderMode(config?: Partial<ScreenReaderConfig>): void`
Enables screen reader enhancements on the document.

```typescript
enableScreenReaderMode({
  enhancedAria: true,
  skipLinks: true,
  enhancedFocus: true,
});
```

#### `disableScreenReaderMode(): void`
Disables screen reader enhancements and restores original state.

```typescript
disableScreenReaderMode();
```

#### `initializeAnnouncer(): void`
Initializes the global announcer element early for reliable announcements.
Call this on app startup to ensure the live region exists before any announcements.

```typescript
// Call early in your app (e.g., in App.tsx or main.tsx)
initializeAnnouncer();
```

#### `announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void`
Announces a message to screen readers using a persistent global live region.

```typescript
announceToScreenReader('Settings saved successfully');
announceToScreenReader('Error: Invalid input', 'assertive');
```

#### `getScreenReaderInstructions(browser: BrowserType): string`
Gets browser-specific screen reader instructions.

```typescript
const instructions = getScreenReaderInstructions('safari');
// 'For Safari users: VoiceOver is built-in. Press Command+F5 to toggle VoiceOver.'
```

#### `isScreenReaderModeEnabled(): boolean`
Checks if screen reader mode is currently enabled.

```typescript
if (isScreenReaderModeEnabled()) {
  // Screen reader mode is active
}
```

**Usage Example**:
```typescript
import { 
  enableScreenReaderMode, 
  disableScreenReaderMode,
  detectBrowser,
  announceToScreenReader,
  initializeAnnouncer
} from './screenReaderUtils';

// Initialize announcer early for reliable announcements
initializeAnnouncer();

// Enable screen reader mode with custom config
enableScreenReaderMode({
  enhancedAria: true,
  skipLinks: true,
  enhancedFocus: true,
  landmarkRoles: true,
  liveRegions: true,
});

// Announce changes (works even when screen reader mode is off)
announceToScreenReader('Page loaded successfully');
announceToScreenReader('Error occurred', 'assertive'); // Urgent announcement

// Disable when done
disableScreenReaderMode();
```

## 🔄 Data Flow

```
User Interaction
    │
    ├─► Click Option
    │       │
    │       ▼
    │   Reusable Component (OptionCarousel/CheckboxOption/Dropdown)
    │       │
    │       ▼
    │   AccessibilityOptions
    │       │
    │       ▼
    │   Calls Handler (e.g., onTextSizeChange)
    │       │
    │       ▼
    │   AccessibilityPanel
    │       │
    │       ├─► Updates State
    │       ├─► Applies Global Effects (if needed)
    │       ├─► Saves to sessionStorage
    │       └─► Announces to Screen Reader
    │
    └─► Keyboard Navigation
            │
            ▼
        Reusable Component handles keyboard events
            │
            ▼
        Same flow as click
```

**Component Hierarchy**:
```
AccessibilityPanel
  ├── Dropdown (Position & Theme)
  └── AccessibilityOptions
      ├── SectionHeading
      ├── OptionCarousel (Font Family, Font Size, Line Height, Letter Spacing, Word Spacing, Contrast, Saturation)
      └── CheckboxOption (Visual Options, Preferences)
```

## 🎨 Customization Guide

### AccessibilityPanel Classes

```typescript
interface AccessibilityPanelClasses {
  root?: string;              // Root panel container
  announcement?: string;       // Screen reader announcement area
  background?: string;         // Decorative background gradient
  container?: string;          // Inner container
  header?: string;             // Header section
  headerIconContainer?: string; // Icon container in header
  headerIcon?: string;         // Header icon wrapper
  title?: string;             // Panel title
  closeButton?: string;       // Close button
  closeIcon?: string;         // Close icon SVG
  content?: string;            // Scrollable content area
  resetContainer?: string;    // Reset button container
  resetButton?: string;       // Reset button
  resetIcon?: string;         // Reset icon SVG
  resetText?: string;         // Reset button text
  options?: AccessibilityOptionsClasses; // Classes object for AccessibilityOptions
}
```

### AccessibilityOptions Classes

```typescript
interface AccessibilityOptionsClasses {
  root?: string;                    // Root container
  sectionHeading?: string;          // All section headings (h3)
  textSizeSection?: string;         // Text Size section
  textSizeGrid?: string;            // Text Size grid container
  textSizeOption?: string;          // Text Size option buttons
  textSizeOption_default?: string;  // Default text size option
  textSizeOption_small?: string;    // Small text size option
  textSizeOption_medium?: string;   // Medium text size option
  textSizeOption_large?: string;    // Large text size option
  textSizeOption_extra_large?: string; // Extra Large text size option
  contrastSection?: string;         // Contrast section
  contrastGrid?: string;            // Contrast grid container
  contrastOption?: string;          // Contrast option buttons
  saturationSection?: string;       // Color Saturation section
  saturationGrid?: string;          // Saturation grid container
  saturationOption?: string;        // Saturation option buttons
  visualOptionsSection?: string;    // Visual Options section
  monochromeOption?: string;        // Monochrome mode option
  hideImagesOption?: string;        // Hide Images option
  highlightTitlesOption?: string;   // Highlight Titles option
  highlightLinksOption?: string;    // Highlight Links option
  preferencesSection?: string;      // Preferences section
  preferenceOption?: string;        // Preference option buttons
  checkbox?: string;                // Checkbox wrapper
  checkboxIcon?: string;            // Checkbox checkmark icon
  checkboxLabel?: string;           // Checkbox label text
  checkboxBadge?: string;           // Checkbox On/Off badge
  // ... and more (see types.ts for complete interface)
}
```

### Complete Example

```tsx
import { useState } from 'react';
import AccessibilityPanel from './components/ui/Accessibility/AccessibilityPanel';
import type { AccessibilityPanelClasses, PanelPosition, ThemeMode } from './components/ui/Accessibility/types';

function App(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const customClasses: AccessibilityPanelClasses = {
    root: "shadow-2xl border-4",
    header: "bg-gradient-to-r from-blue-600 to-purple-600",
    title: "text-xl font-bold",
    closeButton: "hover:bg-red-500",
    options: {
      root: "space-y-8",
      sectionHeading: "text-lg font-bold text-blue-900",
      textSizeOption: "hover:scale-105 transition-transform",
      checkbox: "border-4 rounded-lg"
    }
  };

  return (
    <AccessibilityPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      position="top-left"
      theme="dark"
      className="my-custom-panel"
      classes={customClasses}
    />
  );
}
```

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

### 11. Preferences

#### Screen Reader Mode
The Screen Reader option provides enhanced accessibility features for users who rely on screen readers. When enabled:

- **Enhanced ARIA Attributes**: Automatically adds missing ARIA labels, roles, and descriptions to improve screen reader navigation
- **Skip Links**: Creates skip navigation links to jump to main content, navigation, search, and footer
- **Enhanced Focus Indicators**: Provides high-visibility focus outlines (3px solid blue with shadow)
- **Landmark Roles**: Adds semantic landmark roles (main, navigation, banner, contentinfo) to page sections
- **Live Regions**: Creates global ARIA live region for dynamic announcements

**Browser Support**:
- **Chrome**: Works with ChromeVox extension, NVDA, and JAWS
- **Firefox**: Works with NVDA and VoiceOver (macOS)
- **Safari**: Optimized for VoiceOver (built-in)
- **Edge**: Works with Narrator (built-in) and NVDA
- **Opera**: Works with NVDA

**Default State**: Off (disabled by default)

**Features When Enabled**:
- Images without alt text get descriptive labels
- Links and buttons without accessible names get ARIA labels
- Form inputs without labels get ARIA labels
- Tables get proper scope attributes for headers
- Collapsible elements get aria-expanded states
- Sections with headings get aria-labelledby attributes

### 10. Font Family Selection
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

### 11. Panel Settings (Header Controls)
- **Position Dropdown**: Change where the panel appears (bottom-right, top-left, etc.)
  - Located in the panel header for easy access
  - Dropdown menu with 6 position options
  - Shows current selection with clear labels
- **Theme Dropdown**: Switch between light, dark, or auto (system preference)
  - Located in the panel header next to position
  - Dropdown menu with 3 theme options
  - Auto mode adapts to system preference
- Settings persist in sessionStorage
- Changes apply immediately with smooth animations
- Dropdowns close automatically when clicking outside

### 12. Reset All Settings
- Fixed button at bottom of panel
- Resets all options to defaults including position, theme, and font family
- Clears storage

### 13. Save Mode (Auto/Manual)

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
- ✅ Shows "Save Settings" when there are unsaved changes
- ✅ Shows "All Changes Saved" when no pending changes
- ✅ Disabled state when no changes to save
- ✅ Loading spinner during save operation
- ✅ Visual indicator (pulsing dot) for unsaved changes
- ✅ Keyboard accessible

#### Storage Configuration

Choose the storage type for persisting preferences:

```tsx
<AccessibilityPanel
  // Use localStorage (default) - persists across browser sessions
  storageType="localStorage"
/>

<AccessibilityPanel
  // Use sessionStorage - persists only for current session
  storageType="sessionStorage"
/>
```

#### Custom Storage Handler

For advanced use cases (e.g., storing in a database, using cookies, or custom API), provide a custom storage handler:

```tsx
<AccessibilityPanel
  storageHandler={{
    getItem: async (key) => await api.getPreference(key),
    setItem: async (key, value) => await api.setPreference(key, value),
    removeItem: async (key) => await api.deletePreference(key)
  }}
/>
```

**Storage Handler Interface**:
```typescript
interface StorageHandler {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}
```

### 14. Configurable Options (enabledOptions)

The library provides a configuration system that allows developers to control which accessibility options are displayed in the UI via the `enabledOptions` prop.

#### Default Behavior
By default, all options are enabled. You only need to specify options you want to disable.

#### EnabledOptions Interface

```typescript
interface EnabledOptions {
  // Typography options
  fontFamily?: boolean;      // Font family selection
  fontSize?: boolean;        // Font size adjustment
  lineHeight?: boolean;      // Line height adjustment
  letterSpacing?: boolean;   // Letter spacing adjustment
  wordSpacing?: boolean;     // Word spacing adjustment
  
  // Visual options
  contrast?: boolean;        // Contrast level adjustment
  saturation?: boolean;      // Color saturation adjustment
  monochrome?: boolean;      // Monochrome mode toggle
  hideImages?: boolean;      // Hide images toggle
  highlightTitles?: boolean; // Highlight page titles toggle
  highlightLinks?: boolean;  // Highlight links toggle
  
  // Preferences
  screenReader?: boolean;    // Screen reader mode toggle
  
  // Panel settings (in header)
  position?: boolean;        // Position selector
  theme?: boolean;           // Theme selector
  
  // Footer actions
  resetButton?: boolean;     // Reset button
}
```

#### Usage Examples

**Show only typography and contrast options:**
```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  enabledOptions={{
    // Only these options will be visible
    fontFamily: true,
    fontSize: true,
    lineHeight: true,
    contrast: true,
    // All others disabled
    letterSpacing: false,
    wordSpacing: false,
    saturation: false,
    monochrome: false,
    hideImages: false,
    screenReader: false,
  }}
/>
```

**Minimal configuration (font size and contrast only):**
```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  enabledOptions={{
    fontFamily: false,
    fontSize: true,
    lineHeight: false,
    letterSpacing: false,
    wordSpacing: false,
    contrast: true,
    saturation: false,
    monochrome: false,
    hideImages: false,
    screenReader: false,
    keyboardNav: false,
    reduceMotion: false,
    position: false,
    theme: false,
    resetButton: false,
  }}
/>
```

**Hide panel settings from header:**
```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  enabledOptions={{
    position: false,  // Hide position dropdown
    theme: false,     // Hide theme dropdown
  }}
/>
```

**Combined with saveMode:**
```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  saveMode="manual"
  enabledOptions={{
    fontFamily: true,
    fontSize: true,
    contrast: true,
    screenReader: true,
    // Disable all other options
    lineHeight: false,
    letterSpacing: false,
    wordSpacing: false,
    saturation: false,
    monochrome: false,
    hideImages: false,
  }}
/>
```

## 📊 State Management

```
AccessibilityPanel State:
├── textSize: 'default' | 'small' | 'medium' | 'large' | 'extra-large'
├── lineHeight: 'default' | 'tight' | 'normal' | 'relaxed' | 'loose'
├── letterSpacing: 'default' | 'tight' | 'normal' | 'wide' | 'extra-wide'
├── wordSpacing: 'default' | 'tight' | 'normal' | 'wide' | 'extra-wide'
├── contrast: 'default' | 'low' | 'high' | 'dark'
├── saturation: 'normal' | 'low' | 'high'
├── fontFamily: 'default' | 'sans-serif' | 'serif' | 'dyslexia-friendly' | string
├── screenReader: boolean
├── monochrome: boolean
├── hideImages: boolean
├── highlightTitles: boolean
├── highlightLinks: boolean
├── hasUnsavedChanges: boolean  // For manual save mode
└── isSaving: boolean           // For manual save mode loading state

Storage Keys (localStorage by default, configurable):
├── 'accessibility-contrast': 'default' | 'low' | 'high' | 'dark'
├── 'accessibility-monochrome': 'true' | 'false'
├── 'accessibility-saturation': 'normal' | 'low' | 'high'
├── 'accessibility-hide-images': 'true' | 'false'
├── 'accessibility-highlight-titles': 'true' | 'false'
├── 'accessibility-highlight-links': 'true' | 'false'
├── 'accessibility-position': PanelPosition
├── 'accessibility-theme': ThemeMode
├── 'accessibility-font-family': FontFamily
├── 'accessibility-text-size': 'default' | 'small' | 'medium' | 'large' | 'extra-large'
├── 'accessibility-line-height': 'default' | 'tight' | 'normal' | 'relaxed' | 'loose'
├── 'accessibility-letter-spacing': 'default' | 'tight' | 'normal' | 'wide' | 'extra-wide'
├── 'accessibility-word-spacing': 'default' | 'tight' | 'normal' | 'wide' | 'extra-wide'
└── 'accessibility-screen-reader': 'true' | 'false'

Storage Options:
├── storageType: 'localStorage' (default, persists across sessions)
│                'sessionStorage' (clears when browser closes)
└── storageHandler: Custom handler for API/database storage
```

## 🎯 Accessibility Features

- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Focus management
- ✅ Semantic HTML
- ✅ High contrast support
- ✅ Reduced motion support

## 🧩 Reusable Components Architecture

The library uses a modular architecture with reusable components to ensure consistency, maintainability, and code reusability:

### Component Reusability Benefits

1. **Consistency**: All similar UI elements use the same component, ensuring visual and behavioral consistency
2. **Maintainability**: Changes to a component automatically apply to all usages
3. **Type Safety**: Generic components provide full TypeScript support
4. **Accessibility**: All components follow WCAG guidelines with proper ARIA attributes
5. **Customization**: All components support custom styling via props

### Component Usage Map

| Component | Used For | Location |
|-----------|----------|----------|
| `OptionCarousel` | Font Family, Font Size, Line Height, Letter Spacing, Word Spacing, Contrast, Saturation | `AccessibilityOptions.tsx` |
| `Dropdown` | Position, Theme selection | `AccessibilityPanel.tsx` (header) |
| `CheckboxOption` | Visual Options, Preferences | `AccessibilityOptions.tsx` |
| `SectionHeading` | All section titles | `AccessibilityOptions.tsx` |

### Extending Components

All reusable components are designed to be extensible:

- **OptionCarousel**: Can be used for any multi-option selection with string-based values
- **Dropdown**: Can be used for any dropdown selection with string-based values
- **CheckboxOption**: Can be used for any toggleable boolean setting
- **SectionHeading**: Can be used for any section title

## 📝 Notes

- **TypeScript**: The library is fully typed with TypeScript. All components, props, and utilities have proper type definitions.
- **JavaScript Compatibility**: The library maintains JavaScript compatibility through TypeScript's `allowJs` configuration.
- **Reusable Components**: The library uses modular, reusable components for consistency and maintainability.
- **Position**: The panel position is fully responsive and works consistently across all screen sizes with smooth animations.
- **Theme**: When using `theme="auto"`, the panel automatically adapts to system dark/light mode preferences and updates in real-time.
- **Save Mode**: Configurable via `saveMode` prop - 'auto' (default) saves immediately, 'manual' shows a Save button
- **Storage**: Settings persist in localStorage by default (across sessions). Can be configured to use sessionStorage or a custom storage handler.
- All custom classes are optional
- Custom classes override defaults when provided
- Use Tailwind's `!` prefix for important overrides
- Panel closes on outside click or Escape key
- All options are fully keyboard accessible
- Color saturation filter is applied globally and works in combination with monochrome mode
- Position changes are animated smoothly with CSS transitions
- All reusable components support dark mode and are fully accessible
- Text size scaling uses CSS variable `--font-scale` applied to root element, maintaining responsive layout while scaling all text elements
- Line height, letter spacing, and word spacing adjustments use CSS variables (`--line-height-scale`, `--letter-spacing-scale`, `--word-spacing-scale`) applied globally to all text elements
- All typography adjustments (text size, line height, letter spacing, word spacing) persist in storage and restore on page reload

## 🚀 Quick Start

```tsx
import { useState } from 'react';
import AccessibilityPanel from './components/ui/Accessibility/AccessibilityPanel';

function App(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  return (
    <>
      <button onClick={() => setIsPanelOpen(true)}>
        Open Accessibility Settings
      </button>
      
      <AccessibilityPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        position="bottom-right"
        theme="auto"
        // Save mode: 'auto' (default) or 'manual' (shows Save button)
        saveMode="auto"
        // Storage: 'localStorage' (default) or 'sessionStorage'
        storageType="localStorage"
        // Enabled options: control which features are visible (all enabled by default)
        // enabledOptions={{ fontSize: true, contrast: true, screenReader: false }}
      />
    </>
  );
}
```

## 🎨 Position & Theme Configuration

### Position Configuration

The `position` prop allows you to control where the accessibility panel appears on the screen:

```tsx
// Bottom-right (default)
<AccessibilityPanel position="bottom-right" />

// Top-left
<AccessibilityPanel position="top-left" />

// Center positions
<AccessibilityPanel position="top-center" />
<AccessibilityPanel position="bottom-center" />
```

**Features**:
- ✅ Responsive positioning on all screen sizes
- ✅ Smooth animations when opening/closing
- ✅ Consistent positioning across devices
- ✅ Mobile-friendly with proper spacing

### Theme Configuration

The `theme` prop controls the color scheme of the accessibility panel:

```tsx
// Auto-detect from system preference (default)
<AccessibilityPanel theme="auto" />

// Force light mode
<AccessibilityPanel theme="light" />

// Force dark mode
<AccessibilityPanel theme="dark" />
```

**Features**:
- ✅ Automatic system preference detection (`auto` mode)
- ✅ Real-time theme switching when system preference changes
- ✅ Full dark mode support with proper contrast
- ✅ Smooth transitions between themes
- ✅ Can be changed from within the panel (Panel Settings section)
- ✅ Settings persist in sessionStorage

### Changing Position & Theme from Panel

Users can now change the panel position and theme directly from within the accessibility panel header:

1. Open the accessibility panel
2. In the header, find the "Position" and "Theme" dropdowns
3. Click on either dropdown to see available options
4. Select desired position (6 options: Bottom Right, Bottom Left, Top Right, Top Left, Top Center, Bottom Center)
5. Select desired theme (Light, Dark, or Auto)
6. Changes apply immediately with smooth animations
7. Settings are saved and persist across sessions

**UI Features**:
- Clean dropdown interface with labels
- Current selection clearly displayed
- Dropdowns close when clicking outside or selecting an option
- Keyboard accessible (Enter/Space to open, Escape to close)
- Responsive design that works on all screen sizes

**Note**: Settings changed within the panel override any props passed to the component. This allows users to customize their experience independently of developer configuration.

### Font Family Configuration

The `customFonts` prop allows you to add custom fonts or override default fonts:

```tsx
// Add custom fonts
<AccessibilityPanel
  customFonts={{
    'my-custom-font': '"MyCustomFont", sans-serif',
    'monospace': '"Roboto Mono", monospace'
  }}
/>

// Override default fonts (e.g., dyslexia-friendly)
<AccessibilityPanel
  customFonts={{
    'dyslexia-friendly': '"OpenDyslexic", "Comic Sans MS", sans-serif'
  }}
/>
```

**Adding Fonts via @font-face**:

1. **Place font files** in `/public/fonts/` directory
2. **Define @font-face** in `src/index.css`:
   ```css
   @font-face {
     font-family: 'YourFontName';
     src: url('/fonts/YourFont-Regular.woff2') format('woff2'),
          url('/fonts/YourFont-Regular.woff') format('woff');
     font-weight: normal;
     font-style: normal;
     font-display: swap;
   }
   ```
3. **Add to customFonts prop** - The font will automatically appear in the Font Family selection

**Features**:
- ✅ Default fonts: Default, Sans-serif, Serif, Dyslexia-friendly
- ✅ Custom fonts support via `customFonts` prop
- ✅ Override default fonts (e.g., provide your own dyslexia-friendly font)
- ✅ Global application via CSS variable `--accessibility-font-family`
- ✅ Persists in sessionStorage
- ✅ Automatic UI integration - custom fonts appear in selection

### Highlight Colors Configuration

The `highlightTitlesColors` and `highlightLinksColors` props allow you to customize the highlight colors:

```tsx
<AccessibilityPanel
  isOpen={isOpen}
  onClose={handleClose}
  // Custom colors for highlighting titles (headings)
  highlightTitlesColors={{
    backgroundColor: '#fef08a',  // Yellow (default)
    textColor: '#1a1a1a',        // Dark text (default)
    outlineColor: '#ca8a04'      // Orange outline (default)
  }}
  // Custom colors for highlighting links
  highlightLinksColors={{
    backgroundColor: '#a5f3fc',       // Cyan (default)
    textColor: '#0e7490',             // Teal text (default)
    outlineColor: '#0891b2',          // Teal outline (default)
    hoverBackgroundColor: '#67e8f9',  // Lighter cyan on hover (default)
    hoverOutlineColor: '#0e7490'      // Darker outline on hover (default)
  }}
/>
```

**HighlightTitlesColors Interface:**
```typescript
interface HighlightTitlesColors {
  backgroundColor?: string;  // Background color for highlighted titles
  textColor?: string;        // Text color (ensures readability)
  outlineColor?: string;     // Outline/border color
}
```

**HighlightLinksColors Interface:**
```typescript
interface HighlightLinksColors {
  backgroundColor?: string;      // Background color for highlighted links
  textColor?: string;            // Text color
  outlineColor?: string;         // Outline/border color
  hoverBackgroundColor?: string; // Background on hover/focus
  hoverOutlineColor?: string;    // Outline on hover/focus
}
```

**Example - Red Theme for Titles:**
```tsx
<AccessibilityPanel
  highlightTitlesColors={{
    backgroundColor: '#fee2e2',
    textColor: '#7f1d1d',
    outlineColor: '#dc2626'
  }}
/>
```

**Example - Purple Theme for Links:**
```tsx
<AccessibilityPanel
  highlightLinksColors={{
    backgroundColor: '#f3e8ff',
    textColor: '#6b21a8',
    outlineColor: '#9333ea',
    hoverBackgroundColor: '#e9d5ff',
    hoverOutlineColor: '#7c3aed'
  }}
/>
```

**See `/public/fonts/README.md` for detailed step-by-step instructions on adding custom fonts.**

## 📦 TypeScript Support

This library is fully written in TypeScript and provides complete type definitions.

### Importing Types

```tsx
import type { 
  AccessibilityPanelProps,
  AccessibilityOptionsProps,
  TextSize,
  ContrastLevel,
  SaturationLevel,
  AccessibilityPanelClasses,
  AccessibilityOptionsClasses,
  SaveMode,
  StorageType,
  StorageHandler,
  EnabledOptions,
  HighlightTitlesColors,
  HighlightLinksColors
} from './components/ui/Accessibility/types';

// Import default values
import { 
  defaultEnabledOptions,
  defaultHighlightTitlesColors,
  defaultHighlightLinksColors
} from './components/ui/Accessibility/types';

// Reusable component types
import type { 
  OptionCarouselProps,
  DropdownProps,
  CheckboxOptionProps,
  SectionHeadingProps
} from './components/ui/Accessibility/OptionCarousel'; // etc.
```

### Type-Safe Usage

```tsx
import { useState } from 'react';
import AccessibilityPanel from './components/ui/Accessibility/AccessibilityPanel';
import type { AccessibilityPanelProps } from './components/ui/Accessibility/types';

const MyComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const panelProps: AccessibilityPanelProps = {
    isOpen,
    onClose: () => setIsOpen(false),
    className: "custom-panel",
    classes: {
      header: "bg-blue-600",
      title: "text-white"
    }
  };

  return <AccessibilityPanel {...panelProps} />;
};
```

## 🔍 Component Details

### OptionCarousel Component

**File**: `OptionCarousel.tsx`

A banner-style carousel that displays one option at a time. Users can click to cycle through options or use keyboard navigation.

**Props**:
- `options: T[]` - Array of option values
- `currentValue: T` - Currently selected value
- `onChange: (value: T) => void` - Callback when value changes
- `getDisplayName: (value: T) => string` - Function to format display name
- `ariaLabel: string` - ARIA label for accessibility
- `sectionId: string` - ID of the section heading (for ARIA)
- `isDarkMode?: boolean` - Dark mode styling
- `customClasses?: {...}` - Custom CSS classes

**Keyboard Support**:
- `Enter` or `Space` - Cycle to next option
- `Arrow Left` - Previous option
- `Arrow Right` - Next option

### Dropdown Component

**File**: `Dropdown.tsx`

A dropdown menu component for selecting from a list of options. Used in the panel header for position and theme selection.

**Props**:
- `label: string` - Label text displayed above dropdown
- `value: T` - Currently selected value
- `options: T[]` - Array of available options
- `onChange: (value: T) => void` - Callback when value changes
- `getDisplayName?: (value: T) => string` - Optional function to format display name
- `isOpen: boolean` - Whether dropdown is open
- `onToggle: (open: boolean) => void` - Callback to toggle dropdown
- `isDarkMode?: boolean` - Dark mode styling
- `minWidth?: string` - Minimum width (default: `min-w-[140px]`)
- `onCloseOther?: () => void` - Callback to close other dropdowns

**Keyboard Support**:
- `Enter` or `Space` - Toggle dropdown
- `Escape` - Close dropdown
- Arrow keys navigate options when open

### CheckboxOption Component

**File**: `CheckboxOption.tsx`

A checkbox-style toggle component for boolean settings. Used for visual options and preferences.

**Props**:
- `label: string` - Label text
- `checked: boolean` - Checked state
- `onChange: (checked: boolean) => void` - Callback when state changes
- `isDarkMode?: boolean` - Dark mode styling
- `onKeyDown?: (e: React.KeyboardEvent, action: () => void) => void` - Keyboard handler
- `className?: string` - Custom CSS classes
- `badgeText?: string` - Custom badge text (default: "On"/"Off")
- `ariaLabel?: string` - Custom ARIA label

**Keyboard Support**:
- `Enter` or `Space` - Toggle state

### SectionHeading Component

**File**: `SectionHeading.tsx`

A consistent section heading component used throughout the accessibility options.

**Props**:
- `id: string` - Unique ID for the heading (used for ARIA)
- `children: React.ReactNode` - Heading text
- `isDarkMode?: boolean` - Dark mode styling
- `className?: string` - Custom CSS classes

## 📚 Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
