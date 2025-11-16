import React from 'react';
import ReactDOM from 'react-dom/client';
import FluidGlass from './FluidGlass';
import './index.css';

// Mount the FluidGlass component
const root = ReactDOM.createRoot(document.getElementById('hero-3d-canvas'));
root.render(
  <React.StrictMode>
    <FluidGlass 
      mode="lens" 
      lensProps={{
        ior: 1.2,
        thickness: 5,
        chromaticAberration: 0.15
      }}
    />
  </React.StrictMode>
);
