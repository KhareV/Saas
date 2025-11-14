// cardswap.js - 3D Tilt Card Effect (Vanilla JavaScript)

class TiltCard {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      enableTilt: options.enableTilt !== false,
      enableMobileTilt: options.enableMobileTilt || false,
      mobileTiltSensitivity: options.mobileTiltSensitivity || 5,
      initialDuration: 1200,
      initialXOffset: 70,
      initialYOffset: 60,
      deviceBetaOffset: 20,
      enterTransitionMs: 180,
      ...options,
    };

    this.wrapper = element;
    this.shell = element.querySelector(".tilt-card-shell");

    if (!this.shell) {
      console.error("TiltCard: .tilt-card-shell not found");
      return;
    }

    this.rafId = null;
    this.running = false;
    this.lastTs = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.initialUntil = 0;
    this.enterTimer = null;
    this.leaveRaf = null;

    this.DEFAULT_TAU = 0.14;
    this.INITIAL_TAU = 0.6;

    if (this.options.enableTilt) {
      this.init();
    }
  }

  clamp(v, min = 0, max = 100) {
    return Math.min(Math.max(v, min), max);
  }

  round(v, precision = 3) {
    return parseFloat(v.toFixed(precision));
  }

  adjust(v, fMin, fMax, tMin, tMax) {
    return this.round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));
  }

  setVarsFromXY(x, y) {
    const width = this.shell.clientWidth || 1;
    const height = this.shell.clientHeight || 1;

    const percentX = this.clamp((100 / width) * x);
    const percentY = this.clamp((100 / height) * y);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      "--pointer-x": `${percentX}%`,
      "--pointer-y": `${percentY}%`,
      "--background-x": `${this.adjust(percentX, 0, 100, 35, 65)}%`,
      "--background-y": `${this.adjust(percentY, 0, 100, 35, 65)}%`,
      "--pointer-from-center": `${this.clamp(
        Math.hypot(percentY - 50, percentX - 50) / 50,
        0,
        1
      )}`,
      "--pointer-from-top": `${percentY / 100}`,
      "--pointer-from-left": `${percentX / 100}`,
      "--rotate-x": `${this.round(-(centerX / 5))}deg`,
      "--rotate-y": `${this.round(centerY / 4)}deg`,
    };

    for (const [k, v] of Object.entries(properties)) {
      this.wrapper.style.setProperty(k, v);
    }
  }

  step = (ts) => {
    if (!this.running) return;

    if (this.lastTs === 0) this.lastTs = ts;
    const dt = (ts - this.lastTs) / 1000;
    this.lastTs = ts;

    const tau = ts < this.initialUntil ? this.INITIAL_TAU : this.DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);

    this.currentX += (this.targetX - this.currentX) * k;
    this.currentY += (this.targetY - this.currentY) * k;

    this.setVarsFromXY(this.currentX, this.currentY);

    const stillFar =
      Math.abs(this.targetX - this.currentX) > 0.05 ||
      Math.abs(this.targetY - this.currentY) > 0.05;

    if (stillFar || document.hasFocus()) {
      this.rafId = requestAnimationFrame(this.step);
    } else {
      this.running = false;
      this.lastTs = 0;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTs = 0;
    this.rafId = requestAnimationFrame(this.step);
  }

  setImmediate(x, y) {
    this.currentX = x;
    this.currentY = y;
    this.setVarsFromXY(this.currentX, this.currentY);
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.start();
  }

  toCenter() {
    this.setTarget(this.shell.clientWidth / 2, this.shell.clientHeight / 2);
  }

  beginInitial(durationMs) {
    this.initialUntil = performance.now() + durationMs;
    this.start();
  }

  getOffsets(evt) {
    const rect = this.shell.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  handlePointerMove = (event) => {
    const { x, y } = this.getOffsets(event);
    this.setTarget(x, y);
  };

  handlePointerEnter = (event) => {
    this.shell.classList.add("active");
    this.shell.classList.add("entering");

    if (this.enterTimer) clearTimeout(this.enterTimer);
    this.enterTimer = setTimeout(() => {
      this.shell.classList.remove("entering");
    }, this.options.enterTransitionMs);

    const { x, y } = this.getOffsets(event);
    this.setTarget(x, y);
  };

  handlePointerLeave = () => {
    this.toCenter();

    const checkSettle = () => {
      const settled =
        Math.hypot(this.targetX - this.currentX, this.targetY - this.currentY) <
        0.6;

      if (settled) {
        this.shell.classList.remove("active");
        this.leaveRaf = null;
      } else {
        this.leaveRaf = requestAnimationFrame(checkSettle);
      }
    };

    if (this.leaveRaf) cancelAnimationFrame(this.leaveRaf);
    this.leaveRaf = requestAnimationFrame(checkSettle);
  };

  handleDeviceOrientation = (event) => {
    const { beta, gamma } = event;
    if (beta == null || gamma == null) return;

    const centerX = this.shell.clientWidth / 2;
    const centerY = this.shell.clientHeight / 2;

    const x = this.clamp(
      centerX + gamma * this.options.mobileTiltSensitivity,
      0,
      this.shell.clientWidth
    );
    const y = this.clamp(
      centerY +
        (beta - this.options.deviceBetaOffset) *
          this.options.mobileTiltSensitivity,
      0,
      this.shell.clientHeight
    );

    this.setTarget(x, y);
  };

  handleClick = () => {
    if (!this.options.enableMobileTilt || location.protocol !== "https:")
      return;

    const DeviceMotionEvent = window.DeviceMotionEvent;
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener(
              "deviceorientation",
              this.handleDeviceOrientation
            );
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener(
        "deviceorientation",
        this.handleDeviceOrientation
      );
    }
  };

  init() {
    this.shell.addEventListener("pointerenter", this.handlePointerEnter);
    this.shell.addEventListener("pointermove", this.handlePointerMove);
    this.shell.addEventListener("pointerleave", this.handlePointerLeave);
    this.shell.addEventListener("click", this.handleClick);

    // Initial animation
    const initialX =
      (this.shell.clientWidth || 0) - this.options.initialXOffset;
    const initialY = this.options.initialYOffset;
    this.setImmediate(initialX, initialY);
    this.toCenter();
    this.beginInitial(this.options.initialDuration);
  }

  destroy() {
    if (this.shell) {
      this.shell.removeEventListener("pointerenter", this.handlePointerEnter);
      this.shell.removeEventListener("pointermove", this.handlePointerMove);
      this.shell.removeEventListener("pointerleave", this.handlePointerLeave);
      this.shell.removeEventListener("click", this.handleClick);
    }

    window.removeEventListener(
      "deviceorientation",
      this.handleDeviceOrientation
    );

    if (this.enterTimer) clearTimeout(this.enterTimer);
    if (this.leaveRaf) cancelAnimationFrame(this.leaveRaf);
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.shell.classList.remove("entering", "active");
  }
}

// Auto-initialize all tilt cards on page load
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".tilt-card-wrapper");
  cards.forEach((card) => new TiltCard(card));
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = TiltCard;
}
