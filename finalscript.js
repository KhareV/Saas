/**
 * Final Animation & Functionality Script
 * Includes all animations and removes webpack dependencies
 * Standalone, framework-agnostic implementation
 */

(function () {
  "use strict";

  // ============================================
  // 1. INITIALIZATION
  // ============================================

  const init = () => {
    console.log("🚀 Initializing Final Script");

    setupAnimations();
    setupInteractions();
    setupScrollEvents();
    setupImageLazyLoading();
    setupNavigation();
    setupButtons();
  };

  // ============================================
  // 2. ANIMATIONS
  // ============================================

  const setupAnimations = () => {
    // Define animation keyframes in CSS
    const animationStyles = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Default animation classes */
      .animate-fade-in {
        animation: fadeIn 0.6s ease-out forwards;
      }
      
      .animate-slide-up {
        animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .animate-slide-down {
        animation: slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .animate-scale {
        animation: scaleIn 0.6s ease-out forwards;
      }
      
      .animate-pulse {
        animation: pulse 2s ease-in-out infinite;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Animate sections with opacity-0
    animateSections();

    // Animate other elements
    animateElements();
  };

  const animateSections = () => {
    const sections = document.querySelectorAll("section");

    sections.forEach((section, index) => {
      // Remove opacity-0 class if present
      if (section.classList.contains("opacity-0")) {
        section.classList.remove("opacity-0");
      }

      // Set initial state
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

      // Stagger animation
      setTimeout(() => {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }, 100 + index * 150);
    });
  };

  const animateElements = () => {
    // Animate elements with opacity-0 class (non-sections)
    const elements = document.querySelectorAll(
      '[class*="opacity-0"]:not(section)'
    );

    elements.forEach((el, index) => {
      if (!el.classList.contains("opacity-100")) {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

        setTimeout(() => {
          el.style.opacity = "1";
        }, 200 + index * 100);
      }
    });
  };

  // ============================================
  // 3. SCROLL ANIMATIONS (Intersection Observer)
  // ============================================

  const setupScrollEvents = () => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class
          entry.target.classList.add("animate-slide-up");

          // Make visible
          if (entry.target.classList.contains("opacity-0")) {
            entry.target.classList.remove("opacity-0");
          }

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          // Optional: unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections and major containers
    document
      .querySelectorAll('section, [class*="2xl:pb"], [class*="md:pb"]')
      .forEach((el) => {
        observer.observe(el);
      });
  };

  // ============================================
  // 4. IMAGE LAZY LOADING & ANIMATIONS
  // ============================================

  const setupImageLazyLoading = () => {
    const images = document.querySelectorAll("img");

    images.forEach((img, index) => {
      img.style.opacity = "0";
      img.style.transition = "opacity 0.6s ease-out";

      if (img.complete) {
        // Image already loaded (from cache)
        img.style.opacity = "1";
      } else {
        // Wait for image to load
        img.addEventListener("load", () => {
          setTimeout(() => {
            img.style.opacity = "1";
          }, 100 + index * 50);
        });

        img.addEventListener("error", () => {
          img.style.opacity = "0.5"; // Show half-opacity on error
        });
      }
    });
  };

  // ============================================
  // 5. NAVIGATION BAR ANIMATIONS
  // ============================================

  const setupNavigation = () => {
    const nav = document.querySelector("nav");

    if (nav) {
      nav.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      let lastScrollY = 0;
      let ticking = false;

      window.addEventListener(
        "scroll",
        () => {
          lastScrollY = window.scrollY;

          if (!ticking) {
            window.requestAnimationFrame(() => {
              updateNavAppearance(lastScrollY);
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );

      // Initial state
      updateNavAppearance(0);
    }
  };

  const updateNavAppearance = (scrollY) => {
    const nav = document.querySelector("nav");
    if (!nav) return;

    if (scrollY > 50) {
      nav.style.opacity = "1";
      nav.style.backdropFilter = "blur(10px)";
      nav.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      nav.style.opacity = "0.95";
      nav.style.backdropFilter = "blur(9px)";
    }
  };

  // ============================================
  // 6. BUTTON INTERACTIONS
  // ============================================

  const setupButtons = () => {
    const buttons = document.querySelectorAll(
      'button, [role="button"], a[href*="#"]'
    );

    buttons.forEach((btn) => {
      btn.style.transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";

      // Hover effects
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "translateY(-2px)";
        btn.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translateY(0)";
        btn.style.boxShadow = "";
      });

      // Click ripple effect
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        btn.style.position = "relative";
        btn.style.overflow = "hidden";
      });
    });
  };

  // ============================================
  // 7. INTERACTIVE ELEMENTS
  // ============================================

  const setupInteractions = () => {
    // Mobile menu toggle
    setupMobileMenu();

    // Smooth scroll for anchor links
    setupSmoothScroll();

    // Form interactions
    setupFormInteractions();

    // Link hover effects
    setupLinkHovers();
  };

  const setupMobileMenu = () => {
    const menuButton = document.querySelector(
      'button[aria-label="Toggle menu"]'
    );
    const mobileMenu = document.querySelector('[class*="lg:hidden"]');

    if (menuButton) {
      menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("data-menu-open") === "true";
        menuButton.setAttribute("data-menu-open", !isOpen);

        if (mobileMenu) {
          mobileMenu.style.transition = "all 0.3s ease-out";
          mobileMenu.style.pointerEvents = isOpen ? "none" : "auto";
        }
      });
    }
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  };

  const setupFormInteractions = () => {
    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.style.transition = "all 0.2s ease-out";
        input.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
      });

      input.addEventListener("blur", () => {
        input.style.boxShadow = "";
      });
    });
  };

  const setupLinkHovers = () => {
    document.querySelectorAll('a:not([href^="#"])').forEach((link) => {
      link.style.transition = "opacity 0.2s ease-out";

      link.addEventListener("mouseenter", () => {
        link.style.opacity = "0.7";
      });

      link.addEventListener("mouseleave", () => {
        link.style.opacity = "1";
      });
    });
  };

  // ============================================
  // 8. UTILITY FUNCTIONS
  // ============================================

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // ============================================
  // 9. START
  // ============================================

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Re-run animations after content loads
  setTimeout(init, 1000);
  setTimeout(init, 2000);

  // Expose utilities globally for debugging
  window.FinalScript = {
    init,
    debounce,
    throttle,
    version: "1.0.0",
  };

  console.log("✅ Final Script Loaded - No webpack dependencies!");
})();
