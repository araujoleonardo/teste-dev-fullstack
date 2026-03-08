<script setup lang="ts">
import { computed, type Component } from 'vue';

type TypesButton = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type TypesSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  variant?: TypesButton;
  size?: TypesSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: Component;
  iconRight?: Component;
  block?: boolean;
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
});

const variants = {
  primary: 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-200/50 hover:from-orange-500 hover:to-orange-400 focus:ring-orange-500',
  secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300 shadow-sm shadow-slate-100',
  outline: 'bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200',
  danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-100 hover:from-red-500 hover:to-red-400 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-8 py-4 text-base rounded-2xl gap-2.5',
};

const classes = computed(() => {
  return [
    'inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none disabled:grayscale-[30%] cursor-pointer',
    variants[props.variant],
    sizes[props.size],
    props.block ? 'w-full' : '',
  ];
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    :class="classes"
  >
    <!-- Loading State -->
    <template v-if="loading">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      <span>Carregando...</span>
    </template>

    <!-- Normal Content -->
    <template v-else>
      <component
        :is="icon"
        v-if="icon"
        class="shrink-0"
        :class="[size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5']"
      />

      <slot />

      <component
        :is="iconRight"
        v-if="iconRight"
        class="shrink-0"
        :class="[size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5']"
      />
    </template>
  </button>
</template>
