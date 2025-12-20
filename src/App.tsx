import React, { useState } from 'react'
import './App.css'
import type { PanelPosition, ThemeMode, SaveMode, EnabledOptions } from './Accessibility/types';
import { AccessibilityPanel } from './Accessibility';

function App() {
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState<boolean>(false);
  
  // Initialize panel position from localStorage or default
  const [panelPosition, setPanelPosition] = useState<PanelPosition>(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('accessibility-position');
      if (savedPosition !== null && (
        savedPosition === 'bottom-right' || savedPosition === 'bottom-left' ||
        savedPosition === 'top-right' || savedPosition === 'top-left' ||
        savedPosition === 'top-center' || savedPosition === 'bottom-center'
      )) {
        return savedPosition as PanelPosition;
      }
    }
    return 'bottom-right';
  });

  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('accessibility-theme');
      if (savedTheme !== null && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
        return savedTheme as ThemeMode;
      }
    }
    return 'auto';
  });

  // Initialize save mode from localStorage or default
  const [saveMode] = useState<SaveMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('accessibility-save-mode');
      if (savedMode === 'auto' || savedMode === 'manual') {
        return savedMode as SaveMode;
      }
    }
    return 'auto';
  });

  // Initialize enabled options from localStorage or default (all enabled)
  const [enabledOptions] = useState<EnabledOptions>(() => {
    if (typeof window !== 'undefined') {
      const savedOptions = localStorage.getItem('accessibility-enabled-options');
      if (savedOptions) {
        try {
          return JSON.parse(savedOptions) as EnabledOptions;
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  const toggleAccessibilityPanel = (): void => {
    setIsAccessibilityPanelOpen(prev => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAccessibilityPanel();
    }
  };

  const handlePositionChange = (position: PanelPosition): void => {
    setPanelPosition(position);
    localStorage.setItem('accessibility-position', position);
  };

  const handleThemeChange = (newTheme: ThemeMode): void => {
    setTheme(newTheme);
    localStorage.setItem('accessibility-theme', newTheme);
  };

  /**
   * Gets button position classes based on panel position
   * Button should be near the panel but not overlap
   */
  const getButtonPositionClasses = (position: PanelPosition): string => {
    const baseClasses = 'fixed w-10 h-10 sm:w-12 sm:h-12 z-50 cursor-pointer hover:opacity-80 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:p-2 rounded-lg z-30';
    const positionMap: Record<PanelPosition, string> = {
      'bottom-right': 'bottom-2 right-2',
      'bottom-left': 'bottom-2 left-2',
      'top-right': 'top-2 right-2',
      'top-left': 'top-2 left-2',
      'top-center': 'top-2 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2',
    };
    return `${baseClasses} ${positionMap[position]}`;
  };

  return (
    <>
      <button
        onClick={toggleAccessibilityPanel}
        onKeyDown={handleKeyDown}
        className={getButtonPositionClasses(panelPosition)}
        aria-label="Open accessibility settings"
        aria-expanded={isAccessibilityPanelOpen}
        aria-controls="accessibility-panel"
      >
        <img src="/Accessibility-blue.svg" alt="" aria-hidden="true" className='ml-1.5' />
      </button>
      <AccessibilityPanel
        isOpen={isAccessibilityPanelOpen}
        onClose={() => setIsAccessibilityPanelOpen(false)}
        position={panelPosition}
        theme={theme}
        onPositionChange={handlePositionChange}
        onThemeChange={handleThemeChange}
        customFonts={{
          // OpenDyslexic font is loaded via CDN in index.html (fonts.cdnfonts.com)
          // If the font doesn't work, you can override it here:
          // 'dyslexia-friendly': '"OpenDyslexic", "Comic Sans MS", sans-serif'
          // Or use a different font name if the CDN uses a different name
        }}
        // Save mode - controlled via customization panel
        saveMode={saveMode}
        // Storage type configuration
        storageType="localStorage"
        // Optional callback when preferences are saved in manual mode
        onSave={() => console.log('Accessibility preferences saved!')}
        // Enabled options - controlled via customization panel
        enabledOptions={enabledOptions}
      />
    </>
  )
}

export default App
