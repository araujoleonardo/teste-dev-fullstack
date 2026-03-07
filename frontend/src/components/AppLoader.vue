<script setup lang="ts">
import { ref, onMounted } from "vue";

const visible = ref(true);

onMounted(() => {
  // Oculta após carregar a página
  window.addEventListener("load", () => {
    setTimeout(() => (visible.value = false), 300);
  });
});

defineExpose({ visible });
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-background-1/50 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-border-1 border-t-primary rounded-full animate-spin"></div>
        <p class="text-font-2 font-medium">Carregando...</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
