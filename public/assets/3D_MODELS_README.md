# 3D Models Required

You need to add the following 3D model files to `/public/assets/3d/`:

## Option 1: Create Simple Models with Blender

1. Download Blender (free): https://www.blender.org/download/
2. Create these simple shapes:
   - **lens.glb**: Create a cylinder object, export as GLB
   - **cube.glb**: Create a cube object, export as GLB
   - **bar.glb**: Create a rectangular cube (bar shape), export as GLB

## Option 2: Use Online 3D Model Generators

Visit https://gltf.pmnd.rs/ to create simple primitives

## Option 3: Download Free Models

- Sketchfab: https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount
- Poly Pizza: https://poly.pizza/

## Quick Setup (Temporary)

For now, you can use simple geometric shapes. The component will work with basic GLB files.

### Export Settings (if using Blender):

- File > Export > glTF 2.0 (.glb/.gltf)
- Format: glTF Binary (.glb)
- Remember Forward: -Z Forward
- Up: Y Up

## Also Required: Demo Images

Add these images to `/public/assets/demo/`:

- cs1.webp
- cs2.webp
- cs3.webp

You can use placeholder images from:

- Unsplash: https://unsplash.com/
- Pexels: https://www.pexels.com/

Or use your existing hero images temporarily.
