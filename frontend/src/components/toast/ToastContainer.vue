<script setup lang="ts">
import {removeToast, toasts} from "@/components/toast/toast.ts";
import ToastComponent from "@/components/toast/ToastComponent.vue";
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[99999] flex flex-col gap-3 pointer-events-none">
      <ToastComponent
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </Teleport>
</template>
