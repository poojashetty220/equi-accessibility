# Font Files Directory

This directory contains custom font files that are loaded via `@font-face` in CSS.

## OpenDyslexic Font

### How to add OpenDyslexic fonts:

1. Download OpenDyslexic font files from:
   - Official website: https://opendyslexic.org/
   - GitHub repository: https://github.com/antijingoist/opendyslexic

2. Place the following font files in this directory:
   - `OpenDyslexic-Regular.woff` (or .otf, .ttf)
   - `OpenDyslexic-Bold.woff` (or .otf, .ttf)
   - `OpenDyslexic-Italic.woff` (or .otf, .ttf)
   - `OpenDyslexic-BoldItalic.woff` (or .otf, .ttf)

3. The fonts will be automatically loaded via `@font-face` in `src/index.css`

## Adding Custom Fonts via @font-face

You can add any custom font to your application by following these steps:

### Step 1: Add Font Files

Place your font files in this directory (`/public/fonts/`). Supported formats:
- `.woff` / `.woff2` (recommended - best compression)
- `.otf` (OpenType)
- `.ttf` (TrueType)

### Step 2: Add @font-face Declaration

Open `src/index.css` and add your `@font-face` declaration. Here's the template:

```css
@font-face {
  font-family: 'YourFontName';
  src: url('/fonts/YourFont-Regular.woff2') format('woff2'),
       url('/fonts/YourFont-Regular.woff') format('woff'),
       url('/fonts/YourFont-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'YourFontName';
  src: url('/fonts/YourFont-Bold.woff2') format('woff2'),
       url('/fonts/YourFont-Bold.woff') format('woff'),
       url('/fonts/YourFont-Bold.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

/* Add more variants as needed (Italic, BoldItalic, etc.) */
```

### Step 3: Use the Font in Accessibility Panel

After adding the `@font-face` declaration, you can use your custom font in the accessibility panel in two ways:

#### Option A: Override Default Fonts

Update the `customFonts` prop in `src/App.tsx`:

```tsx
<AccessibilityPanel
  customFonts={{
    'dyslexia-friendly': '"YourFontName", sans-serif',
    // or add a new custom font option
    'my-custom-font': '"YourFontName", sans-serif'
  }}
/>
```

#### Option B: Add as New Font Option

1. Add your font to the `customFonts` prop in `src/App.tsx`:
```tsx
customFonts={{
  'my-custom-font': '"YourFontName", sans-serif'
}}
```

2. The font will automatically appear in the Font Family selection in the accessibility panel.

### Example: Adding a Custom Font

Let's say you want to add "Roboto Mono" as a custom font:

1. **Download and place font files** in `/public/fonts/`:
   - `RobotoMono-Regular.woff2`
   - `RobotoMono-Bold.woff2`

2. **Add @font-face in `src/index.css`**:
```css
@font-face {
  font-family: 'Roboto Mono';
  src: url('/fonts/RobotoMono-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto Mono';
  src: url('/fonts/RobotoMono-Bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
```

3. **Add to `customFonts` in `src/App.tsx`**:
```tsx
customFonts={{
  'monospace': '"Roboto Mono", monospace'
}}
```

4. The font will now be available in the accessibility panel!

### Best Practices

- **Use WOFF2 format** when possible - it has the best compression
- **Include multiple formats** for better browser compatibility:
  ```css
  src: url('/fonts/font.woff2') format('woff2'),
       url('/fonts/font.woff') format('woff'),
       url('/fonts/font.otf') format('opentype');
  ```
- **Use `font-display: swap`** to prevent invisible text during font load
- **Organize font files** by placing them in this `/public/fonts/` directory
- **Test font loading** in the browser DevTools Network tab

### Alternative: Using CDN

If you prefer to use a CDN instead of hosting fonts locally, you can use CDN URLs in your `@font-face` declarations:

```css
@font-face {
  font-family: 'YourFontName';
  src: url('https://cdn.example.com/fonts/YourFont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

**Note:** Make sure the CDN supports CORS (Cross-Origin Resource Sharing) for font files.

