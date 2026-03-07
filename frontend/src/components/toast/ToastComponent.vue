<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Info, AlertTriangle, X, CheckCircle, XCircle } from 'lucide-vue-next'
import type { ToastType } from "@/components/toast/toast.ts";

const props = withDefaults(defineProps<{
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}>(), {
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
let timeoutId: number

const toastConfigs = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    shadowColor: 'shadow-green-500/20',
    label: 'Sucesso'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    shadowColor: 'shadow-red-500/20',
    label: 'Erro'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    shadowColor: 'shadow-amber-500/20',
    label: 'Aviso'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    shadowColor: 'shadow-blue-500/20',
    label: 'Informação'
  },
  primary: {
    icon: Info,
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    shadowColor: 'shadow-orange-500/20',
    label: 'Notificação'
  },
  default: {
    icon: Info,
    bgColor: 'bg-slate-800',
    textColor: 'text-white',
    iconColor: 'text-white',
    shadowColor: 'shadow-slate-800/20',
    label: 'Mensagem'
  }
}

const config = computed(() => toastConfigs[props.type] || toastConfigs.default)

const close = () => {
  visible.value = false
  clearTimeout(timeoutId)
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  // Use nextTick or small delay to ensure transition works
  setTimeout(() => {
    visible.value = true
  }, 10)
  
  if (props.duration > 0) {
    timeoutId = window.setTimeout(close, props.duration)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="translate-x-full opacity-0 scale-90"
    enter-to-class="translate-x-0 opacity-100 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-x-0 opacity-100 scale-100"
    leave-to-class="translate-x-full opacity-0 scale-90"
  >
    <div
      v-if="visible"
      class="group relative flex items-start gap-4 p-4 min-w-[320px] max-w-md rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md transition-all duration-300 pointer-events-auto overflow-hidden"
      :class="[config.bgColor, config.textColor, config.shadowColor]"
    >
      <!-- Background Ornament -->
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
      
      <!-- Icon Container -->
      <div class="shrink-0 p-2 bg-white/20 rounded-xl">
        <component
          :is="config.icon"
          class="w-5 h-5"
          :class="[config.iconColor]"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 pt-0.5">
        <h4 v-if="title || config.label" class="text-sm font-bold uppercase tracking-widest opacity-90 mb-1">
          {{ title || config.label }}
        </h4>
        <p class="text-sm font-medium leading-relaxed opacity-100 underline-offset-4 decoration-white/30">
          {{ message }}
        </p>
      </div>

      <!-- Close Button -->
      <button
        @click="close"
        class="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 active:scale-90 cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Progress Line Placeholder (Optional) -->
      <div 
        class="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-linear"
        :style="{ width: '100%', animation: `toast-progress ${duration}ms linear forwards` }"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
