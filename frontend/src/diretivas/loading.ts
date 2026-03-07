export default {
  mounted(el: any, binding: any) {
    el.classList.add("relative");

    // Criar overlay
    const overlay = document.createElement("div");
    overlay.className = `
      absolute inset-0 
      bg-background-1/30 backdrop-blur-sm
      rounded-md 
      flex items-center justify-center 
      z-10
    `;

    // Spinner
    overlay.innerHTML = `
      <div>
        <div
          class="inline-block h-5 w-5 border-3 border-border-1 border-t-primary rounded-full animate-spin"
          role="status"
        >
          <span class="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    `;

    el.loadingOverlay = overlay;

    if (binding.value) {
      el.appendChild(overlay);
    }
  },

  updated(el: any, binding: any) {
    if (binding.value) {
      if (!el.contains(el.loadingOverlay)) {
        el.appendChild(el.loadingOverlay);
      }
    } else {
      el.loadingOverlay.remove();
    }
  },

  unmounted(el: any) {
    el.loadingOverlay?.remove();
  }
};