import React from 'react';
import ReactDOM from 'react-dom/client';
import FluidGlassSimple from './FluidGlassSimple';
import './index.css';

// Mount the simplified FluidGlass component (no external models needed)
const root = ReactDOM.createRoot(document.getElementById('hero-3d-canvas'));
root.render(
  <React.StrictMode>
    <FluidGlassSimple mode="lens" />
  </React.StrictMode>
);
