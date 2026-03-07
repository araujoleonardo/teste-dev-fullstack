import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoaderStore = defineStore("loader", () => {
  const isLoading = ref(false);
  let activeRequests = 0;
  let lastStartTime = 0;

  // Tempo mínimo visível
  const MIN_VISIBLE_TIME = 500;

  function start() {
    activeRequests++;
    if (activeRequests === 1) {
      lastStartTime = Date.now();
      isLoading.value = true;
    }
  }

  function stop() {
    activeRequests = Math.max(0, activeRequests - 1);

    if (activeRequests === 0) {
      const elapsed = Date.now() - lastStartTime;
      const remaining = Math.max(0, MIN_VISIBLE_TIME - elapsed);

      setTimeout(() => {
        // evita ocilacao em navegacao muito rápidas
        if (activeRequests === 0) {
          isLoading.value = false;
        }
      }, remaining);
    }
  }

  return { isLoading, start, stop };
});
