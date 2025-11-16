// Simplified Glass Lens Effect for Hero Section
// Pure CSS + JavaScript implementation (no Three.js required)

class HeroGlassEffect {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      lensSize: options.lensSize || 200,
      intensity: options.intensity || 30,
      blur: options.blur || 10,
      ...options,
    };

    this.lens = null;
    this.pointer = { x: 0, y: 0 };
    this.lensPosition = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0 };

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Container not found");
      return;
    }

    // Make container position relative if not already
    const containerStyle = window.getComputedStyle(this.container);
    if (containerStyle.position === "static") {
      this.container.style.position = "relative";
    }

    // Create lens element
    this.createLens();

    // Setup event listeners
    this.setupEventListeners();

    // Start animation loop
    this.animate();
  }

  createLens() {
    this.lens = document.createElement("div");
    this.lens.className = "glass-lens";

    const size = this.options.lensSize;
    const scale = this.options.scale || 1;
    const blur = this.options.blur !== undefined ? this.options.blur : 10;
    const ior = this.options.ior || 1.15;
    const thickness = this.options.thickness || 5;
    const chromaticAberration = this.options.chromaticAberration || 0.05;
    const anisotropy = this.options.anisotropy || 0.01;

    // Calculate effects based on optical properties
    const brightness = 1 + (ior - 1) * 0.5; // Higher IOR = more brightness
    const saturation = 1 + thickness * 0.1; // Thickness affects color saturation
    const hueRotate = chromaticAberration * 10; // Chromatic aberration creates hue shift
    const contrast = 1 + anisotropy * 2; // Anisotropy affects contrast

    // Build filter string with all optical properties
    const filterEffects = [
      blur > 0 ? `blur(${blur}px)` : "",
      `brightness(${brightness})`,
      `saturate(${saturation})`,
      hueRotate > 0 ? `hue-rotate(${hueRotate}deg)` : "",
      `contrast(${contrast})`,
    ]
      .filter(Boolean)
      .join(" ");

    Object.assign(this.lens.style, {
      position: "absolute",
      width: `${size * scale}px`,
      height: `${size * scale}px`,
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "100",
      transform: "translate(-50%, -50%)",
      backdropFilter: filterEffects,
      WebkitBackdropFilter: filterEffects,
      background: `radial-gradient(circle, rgba(255,255,255,${
        0.1 * thickness * 0.1
      }) 0%, rgba(255,255,255,0) 70%)`,
      border: `${Math.max(1, thickness * 0.5)}px solid rgba(255, 255, 255, ${
        0.2 + chromaticAberration * 0.3
      })`,
      boxShadow: `
        inset 0 0 ${40 * scale}px rgba(255, 255, 255, ${0.1 * brightness}),
        0 0 ${40 * scale}px rgba(255, 255, 255, ${0.1 * brightness}),
        0 ${4 * scale}px ${20 * scale}px rgba(0, 0, 0, ${0.2 * thickness * 0.1})
      `,
      opacity: "0",
      transition: "opacity 0.3s ease-out",
      willChange: "transform",
    });

    this.container.appendChild(this.lens);
  }

  setupEventListeners() {
    const updatePointer = (x, y) => {
      const rect = this.container.getBoundingClientRect();
      this.pointer.x = x - rect.left;
      this.pointer.y = y - rect.top;
      this.targetPosition.x = this.pointer.x;
      this.targetPosition.y = this.pointer.y;
    };

    this.container.addEventListener("mousemove", (e) => {
      updatePointer(e.clientX, e.clientY);
      this.lens.style.opacity = "1";
    });

    this.container.addEventListener("mouseleave", () => {
      this.lens.style.opacity = "0";
    });

    this.container.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      updatePointer(touch.clientX, touch.clientY);
      this.lens.style.opacity = "1";
    });

    this.container.addEventListener("touchend", () => {
      this.lens.style.opacity = "0";
    });

    window.addEventListener("resize", () => this.onResize());
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth damping
    const damping = 0.15;
    this.lensPosition.x +=
      (this.targetPosition.x - this.lensPosition.x) * damping;
    this.lensPosition.y +=
      (this.targetPosition.y - this.lensPosition.y) * damping;

    // Update lens position
    this.lens.style.left = `${this.lensPosition.x}px`;
    this.lens.style.top = `${this.lensPosition.y}px`;
  }

  onResize() {
    // Handle responsive sizing if needed
  }

  destroy() {
    if (this.lens && this.lens.parentNode) {
      this.lens.parentNode.removeChild(this.lens);
    }
  }
}

// Alternative: CSS-only glass effect using mix-blend-mode
class HeroGlassOverlay {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      intensity: options.intensity || "medium", // 'low', 'medium', 'high'
      ...options,
    };

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Container not found");
      return;
    }

    // Add glass overlay class
    this.container.classList.add("glass-overlay-container");

    // Inject CSS if not already present
    if (!document.getElementById("hero-glass-styles")) {
      this.injectStyles();
    }
  }

  injectStyles() {
    const style = document.createElement("style");
    style.id = "hero-glass-styles";
    style.textContent = `
      .glass-overlay-container {
        position: relative;
        overflow: hidden;
      }

      .glass-overlay-container::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0) 50%,
          rgba(255, 255, 255, 0.05) 100%
        );
        backdrop-filter: blur(8px) saturate(150%);
        -webkit-backdrop-filter: blur(8px) saturate(150%);
        pointer-events: none;
        z-index: 1;
      }

      .glass-overlay-container::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 70%
        );
        mix-blend-mode: overlay;
        pointer-events: none;
        z-index: 2;
      }

      .glass-overlay-container > * {
        position: relative;
        z-index: 3;
      }

      /* Animated glass shimmer effect */
      @keyframes glass-shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      .glass-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: glass-shimmer 8s linear infinite;
        pointer-events: none;
        z-index: 2;
      }
    `;
    document.head.appendChild(style);
  }

  destroy() {
    this.container.classList.remove("glass-overlay-container");
  }
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { HeroGlassEffect, HeroGlassOverlay };
}
