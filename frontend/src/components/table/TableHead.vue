<script setup lang="ts">
import { ArrowDownUp } from 'lucide-vue-next';

withDefaults(defineProps<{
  sortable?: boolean;
  width?: string
}>(), {
  sortable: false,
  width: "100"
})
</script>
<template>
  <th scope="col"
      :style="{ width: width + 'px', minWidth: width + 'px' }"
      :class="sortable ? 'cursor-pointer hover:text-orange-600' : ''"
      class="py-4 px-6 text-left rtl:text-right transition-colors duration-200">
    <span class="flex items-center gap-1.5">
      <slot></slot>
      <ArrowDownUp class="size-3.5 opacity-50" v-if="sortable"/>
    </span>
  </th>
</template>
