<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(defineProps<{
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxlength?: number;
  icon?: Component;
  error?: string;
  rows?: number;
}>(), {
  disabled: false,
  required: false,
  rows: 4,
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-semibold text-slate-700 mb-1 ml-1 transition-colors"
      :class="{ 'text-red-500': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative group">
      <!-- Icon -->
      <div
        v-if="icon"
        class="absolute left-3 top-3 flex items-start pointer-events-none transition-colors duration-200"
        :class="[
          error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-orange-500'
        ]"
      >
        <component :is="icon" class="h-5 w-5" />
      </div>

      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxlength"
        :rows="rows"
        class="block w-full py-3 border rounded-xl leading-relaxed transition-all duration-200 text-slate-900 sm:text-sm resize-none"
        :class="[
          icon ? 'pl-10' : 'pl-4',
          'pr-4',
          error
            ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
            : 'border-slate-200 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white',
          disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
        ]"
      ></textarea>
    </div>

    <!-- Error -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <p v-if="error" class="mt-1.5 ml-1 text-xs text-red-500 font-medium flex items-center gap-1">
        <span class="w-1 h-1 bg-red-500 rounded-full"></span>
        {{ error }}
      </p>
    </Transition>
  </div>
</template>
