document.addEventListener("DOMContentLoaded", () => {
  const ava = document.getElementById("ava");
  const overlay = document.getElementById("fullscreen");
  const fullImg = document.getElementById("full-img");
  const closeBtn = document.getElementById("closeBtn");

  if (!ava || !overlay || !fullImg) {
    console.error("Required elements not found: #ava, #fullscreen, #full-img");
    return;
  }

  // Open overlay on click
  ava.addEventListener("click", async (e) => {
    // set the image src
    fullImg.src = ava.src;

    // show overlay
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
    closeBtn.style.display = "block";
    closeBtn.setAttribute("aria-hidden", "false");

    // Try the Fullscreen API (some browsers require user gesture)
    try {
      // request fullscreen on the image (or overlay)
      if (overlay.requestFullscreen) {
        await overlay.requestFullscreen();
      } else if (overlay.webkitRequestFullscreen) {
        await overlay.webkitRequestFullscreen();
      }
      // Note: if fullscreen is allowed, the overlay will fill the screen
    } catch (err) {
      // If fullscreen is blocked for any reason, overlay still shows (fallback)
      console.warn("Fullscreen API failed or denied:", err);
    }
  });

  // Close when clicking outside the image (overlay background)
  overlay.addEventListener("click", (ev) => {
    // if clicked exactly on overlay (not the image), close
    if (ev.target === overlay) closeOverlay();
  });

  // Do not close when clicking the image itself
  fullImg.addEventListener("click", (ev) => {
    ev.stopPropagation();
    // optionally exit fullscreen if you want when image clicked:
    // closeOverlay();
  });

  // close button
  closeBtn.addEventListener("click", closeOverlay);

  // close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });

  // helper to close overlay and exit fullscreen if active
  async function closeOverlay() {
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
    closeBtn.style.display = "none";
    closeBtn.setAttribute("aria-hidden", "true");
    // clear src to free memory (optional)
    // fullImg.src = '';

    // exit fullscreen if needed
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        await document.webkitExitFullscreen();
      }
    } catch (err) {
      console.warn("Error exiting fullscreen:", err);
    }
  }
});
ava.addEventListener("click", () => {
  fullImg.src = ava.src;
  overlay.style.display = "flex";

  // Push a new state so the back button can exit fullscreen
  history.pushState({ fullscreen: true }, "");
});

// Listen for back button (popstate)
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.fullscreen) {
    closeOverlay();
  }
});

// Your closeOverlay() function
function closeOverlay() {
  overlay.style.display = "none";
  fullImg.src = "";

  // Go back one step so the browser returns to normal state
  if (history.state && history.state.fullscreen) {
    history.back();
  }
}
