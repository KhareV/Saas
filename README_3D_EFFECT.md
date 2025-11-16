# 🎨 Fluid Glass 3D Effect - Quick Start

## What This Does

Adds a stunning 3D fluid glass lens effect to your hero section that:

- ✨ Follows your mouse cursor with smooth animations
- 🔮 Creates a realistic glass lens with refraction and chromatic aberration
- 🌊 Has scrolling parallax effects with background images
- 📱 Responsive and works on all screen sizes

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Test the Effect

```bash
npm run dev
```

This will open http://localhost:3000/hero-3d.html where you can see the effect in action!

### 3. Integrate into Your Site

#### Option A: Simple Integration (Recommended)

Add this to your `index.html` in the hero section (around line 706):

```html
<!-- Inside the hero container div -->
<div
  class="flex relative min-h-[800px] lg:min-h-auto flex-col justify-start items-start pt-20 w-full"
  style="aspect-ratio: 1553/1450"
>
  <!-- ADD THIS 3D CANVAS OVERLAY -->
  <div
    id="hero-3d-canvas"
    style="position: absolute; 
              top: 0; 
              left: 0; 
              width: 100%; 
              height: 100%; 
              z-index: 5; 
              pointer-events: none;"
  ></div>

  <!-- Your existing hero images continue below -->
  <img id="hero-desktop-1" ... />
</div>
```

Then add before closing `</body>`:

```html
<script type="module" src="/dist/hero-3d.js"></script>
```

#### Option B: Build for Production

```bash
npm run build
```

Copy `dist/hero-3d.js` and `dist/hero-3d.css` to your production server.

## Customization

### Change Glass Properties

Edit `src/main-simple.jsx`:

```javascript
<FluidGlassSimple
  ior={1.2} // Higher = more refraction (1.0-2.0)
  thickness={5} // Glass thickness (1-10)
  chromaticAberration={0.15} // Color split effect (0-1)
  scale={0.15} // Lens size (0.1-0.3)
/>
```

### Change Background Images

Edit `src/FluidGlassSimple.jsx` in the `Images` component:

```javascript
const img1 = "/your-image-1.jpg";
const img2 = "/your-image-2.jpg";
const img3 = "/your-image-3.jpg";
```

### Change Center Text

Edit the `Typography` component in `src/FluidGlassSimple.jsx`:

```javascript
<Text ...>
  Your Custom Text Here
</Text>
```

## Two Versions Available

### 1. Simple Version (No external files needed)

- **File**: `src/FluidGlassSimple.jsx`
- **Entry**: `src/main-simple.jsx`
- Uses built-in cylinder geometry
- ✅ Works immediately
- Perfect for getting started

### 2. Advanced Version (Custom 3D models)

- **File**: `src/FluidGlass.jsx`
- **Entry**: `src/main.jsx`
- Requires `.glb` 3D model files
- More customization options
- See `INTEGRATION_GUIDE.md` for details

## Modes

The advanced version supports different modes:

```javascript
// Lens mode (glass lens that follows cursor)
<FluidGlass mode="lens" />

// Cube mode (glass cube that follows cursor)
<FluidGlass mode="cube" />

// Bar mode (glass bar at bottom)
<FluidGlass mode="bar" />
```

## Performance Tips

1. **Reduce on mobile**: Add this to detect mobile and disable:

```javascript
const isMobile = window.innerWidth < 768;
if (!isMobile) {
  // render canvas
}
```

2. **Lower settings**: Reduce `thickness` and `chromaticAberration` for better performance

3. **Adjust scroll pages**: In the component, change `pages={3}` to match your page length

## Troubleshooting

**Canvas not showing?**

- Check that `#hero-3d-canvas` div exists in your HTML
- Verify the z-index is correct
- Make sure the parent container has `position: relative`

**Performance issues?**

- Lower the `thickness` value
- Reduce `chromaticAberration`
- Set `pointer-events: none` on the canvas

**Images not loading?**

- Check image paths in `FluidGlassSimple.jsx`
- Make sure images are in the `public` folder or accessible

## Need Help?

1. Check `INTEGRATION_GUIDE.md` for detailed instructions
2. View `public/assets/3D_MODELS_README.md` for 3D model info
3. Look at the example in `hero-3d.html`

## Files Overview

```
/src
  ├── FluidGlass.jsx         # Advanced version (needs .glb files)
  ├── FluidGlassSimple.jsx   # Simple version (recommended)
  ├── main.jsx               # Entry for advanced
  ├── main-simple.jsx        # Entry for simple (default)
  └── index.css              # Styles

/public/assets
  ├── /3d                    # Put .glb models here (optional)
  └── /demo                  # Put demo images here (optional)

hero-3d.html                 # Standalone demo page
vite.config.js               # Build configuration
package.json                 # Dependencies
```

Enjoy your new 3D fluid glass effect! 🎉
