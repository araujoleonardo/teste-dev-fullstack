<script setup lang="ts">

</script>

<template>
  <div
    class="bg-white relative rounded-3xl transition-all shadow-xl shadow-slate-200/60 duration-300 border border-slate-100 overflow-hidden"
  >
    <!-- Header -->
    <header
      v-if="$slots.header"
      class="p-4 border-b border-border-1"
    >
      <slot name="header" />
    </header>

    <!-- Body -->
    <div class="p-4">
      <slot />
    </div>

    <!-- Footer -->
    <footer
      v-if="$slots.footer"
      class="p-4 border-t border-border-1"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
