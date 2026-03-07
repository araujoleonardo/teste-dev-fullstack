<script setup lang="ts">
import AppLoader from "@/components/AppLoader.vue";
import {useLoaderStore} from "@/store/useLoaderStore.ts";
import ToastContainer from "@/components/toast/ToastContainer.vue";

const loader = useLoaderStore();
</script>

<template>
  <AppLoader v-if="loader.isLoading" />
  <RouterView />
  <ToastContainer />
</template>
