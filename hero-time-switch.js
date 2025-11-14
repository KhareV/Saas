// hero-time-switch.js - Day/Night Hero Image Switcher

(function () {
  "use strict";

  // Configuration
  const DAY_START = 6; // 6 AM
  const NIGHT_START = 18; // 6 PM

  const IMAGES = {
    day: {
      desktop: "hero-2.avif",
      mobile: "hero-mobile-2.avif",
    },
    night: {
      desktop: "hero-4.avif",
      mobile: "hero-mobile-4.avif",
    },
  };

  function isNightTime() {
    const hour = new Date().getHours();
    return hour < DAY_START || hour >= NIGHT_START;
  }

  function updateHeroImages() {
    const isNight = isNightTime();
    const imageSet = isNight ? IMAGES.night : IMAGES.day;

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

    console.log(`Hero images updated: ${isNight ? "Night" : "Day"} mode`);
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
