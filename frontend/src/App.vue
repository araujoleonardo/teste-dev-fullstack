<script setup lang="ts">
import AppLoader from "@/components/AppLoader.vue";
import {useLoaderStore} from "@/store/useLoaderStore.ts";

const loader = useLoaderStore();
</script>

<template>
  <AppLoader v-if="loader.isLoading" />
  <RouterView />
</template>
