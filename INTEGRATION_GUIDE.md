# Integration Guide for 3D Fluid Glass Effect

## Step 1: Install Dependencies

Run this command in your terminal:

```bash
npm install
```

This will install all required packages from package.json.

## Step 2: Add Required Assets

### 3D Models

You need to add 3 GLB files to `/public/assets/3d/`:

- `lens.glb` - A cylinder shape (recommended for the fluid lens effect)
- `cube.glb` - A cube shape
- `bar.glb` - A rectangular bar shape

See `/public/assets/3D_MODELS_README.md` for instructions on creating these.

### Images

Add 3 images to `/public/assets/demo/`:

- `cs1.webp`
- `cs2.webp`
- `cs3.webp`

Or modify `src/FluidGlass.jsx` to use your existing images.

## Step 3: Build the 3D Component

Run:

```bash
npm run build
```

This creates `dist/hero-3d.js` and `dist/hero-3d.css`

## Step 4: Add to index.html

Add these lines to the `<head>` section of your `index.html`:

```html
<link rel="stylesheet" href="dist/hero-3d.css" />
```

Then, in the hero section (around line 706-710), add the 3D canvas container:

```html
<div
  class="flex relative min-h-[800px] lg:min-h-auto flex-col justify-start items-start pt-20 w-full"
  style="aspect-ratio: 1553/1450"
>
  <!-- ADD THIS DIV FOR 3D CANVAS -->
  <div
    id="hero-3d-canvas"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; pointer-events: none;"
  ></div>

  <!-- existing hero images below -->
  <img id="hero-desktop-1" ... />
  ...
</div>
```

Add the script before the closing `</body>` tag:

```html
<script type="module" src="dist/hero-3d.js"></script>
```

## Step 5: Development Mode

For development with hot reload:

```bash
npm run dev
```

Visit http://localhost:3000/hero-3d.html to test the 3D effect standalone.

## Customization

### Change the effect mode:

Edit `src/main.jsx`:

```javascript
// Lens mode (glass lens that follows cursor)
<FluidGlass mode="lens" lensProps={{ ... }} />

// Cube mode (glass cube that follows cursor)
<FluidGlass mode="cube" cubeProps={{ ... }} />

// Bar mode (glass bar at bottom with nav items)
<FluidGlass mode="bar" barProps={{
  navItems: [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' }
  ]
}} />
```

### Adjust glass properties:

```javascript
lensProps={{
  ior: 1.2,              // Index of refraction (glass realism)
  thickness: 5,          // Glass thickness
  chromaticAberration: 0.15,  // Color dispersion
  scale: 0.2             // Size of the lens
}}
```

### Change background images:

Edit the `Images` component in `src/FluidGlass.jsx` to use your own image paths.

### Modify text:

Edit the `Typography` component in `src/FluidGlass.jsx` to change the centered text.

## Troubleshooting

1. **3D models not loading**: Make sure GLB files are in `/public/assets/3d/`
2. **Canvas not visible**: Check z-index and positioning in your HTML
3. **Performance issues**: Reduce `chromaticAberration` or `thickness` values
4. **Module errors**: Make sure all dependencies are installed with `npm install`

## Performance Tips

- The effect works best on desktop/modern browsers
- Consider adding a mobile detection to disable on mobile devices
- You can adjust the `pages` prop in ScrollControls to match your page length
