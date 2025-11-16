// hero-time-switch.js - Time-based Hero Image Switcher

(function () {
  "use strict";

  // Configuration - Time periods
  const MORNING_START = 6; // 6 AM
  const AFTERNOON_START = 12; // 12 PM
  const EVENING_START = 17; // 5 PM
  const NIGHT_START = 20; // 8 PM

  const IMAGES = {
    morning: {
      desktop: "hero-2.avif",
      mobile: "hero-mobile-2.avif",
    },
    afternoon: {
      desktop: "hero-3.avif",
      mobile: "hero-3.avif", // Using desktop image for mobile
    },
    evening: {
      desktop: "hero-eve.avif",
      mobile: "hero-eve.avif", // Using desktop image for mobile
    },
    night: {
      desktop: "hero-4.avif",
      mobile: "hero-mobile-4.avif",
    },
  };

  function getCurrentTimeOfDay() {
    const hour = new Date().getHours();

    if (hour >= MORNING_START && hour < AFTERNOON_START) {
      return "morning";
    } else if (hour >= AFTERNOON_START && hour < EVENING_START) {
      return "afternoon";
    } else if (hour >= EVENING_START && hour < NIGHT_START) {
      return "evening";
    } else {
      return "night";
    }
  }

  function updateHeroImages() {
    const timeOfDay = getCurrentTimeOfDay();
    const imageSet = IMAGES[timeOfDay];

    // Update desktop images
    const desktop1 = document.getElementById("hero-desktop-1");
    const desktop2 = document.getElementById("hero-desktop-2");

    if (desktop1) {
      desktop1.src = imageSet.desktop;
    }
    if (desktop2) {
      desktop2.src = imageSet.desktop;
    }

    // Update mobile images
    const mobile1 = document.getElementById("hero-mobile");
    const mobile2 = document.getElementById("hero-mobile-2");

    if (mobile1) {
      mobile1.src = imageSet.mobile;
    }
    if (mobile2) {
      mobile2.src = imageSet.mobile;
    }

    // Update preload link
    const preloadLink = document.querySelector(
      'link[rel="preload"][href*="hero-"]'
    );
    if (preloadLink) {
      preloadLink.href = imageSet.desktop;
    }

    console.log(
      `Hero images updated: ${
        timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
      } mode`
    );
  }

  // Check and update on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateHeroImages);
  } else {
    updateHeroImages();
  }

  // Check every minute for time changes
  setInterval(updateHeroImages, 60000);

  // Optional: Update immediately when visibility changes (tab becomes active)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      updateHeroImages();
    }
  });
})();
