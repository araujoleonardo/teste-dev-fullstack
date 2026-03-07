<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import AppButton from "@/components/AppButton.vue";

withDefaults(defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  buttonYes?: string;
  buttonNo?: string;
}>(), {
  buttonYes: 'Confirmar',
  buttonNo: 'Cancelar',
});

const emit = defineEmits(['confirm', 'cancel', 'update:isOpen']);

const onConfirm = () => {
  emit('confirm');
  emit('update:isOpen', false);
};

const onCancel = () => {
  emit('cancel');
  emit('update:isOpen', false);
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          @click="onCancel"
        />

        <!-- Content -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-8 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-8 scale-95"
        >
          <div
            v-if="isOpen"
            class="relative z-10 w-full max-w-sm bg-white shadow-2xl shadow-slate-900/20 rounded-2xl border border-slate-100 overflow-hidden flex flex-col p-8 text-center"
            @click.stop
          >
            <!-- Icon -->
            <div class="flex justify-center mb-6">
              <div
                class="p-4 rounded-2xl bg-red-50 text-red-500"
              >
                <AlertTriangle class="w-10 h-10" />
              </div>
            </div>

            <h3 class="text-2xl font-bold text-slate-900 mb-2 leading-tight">
              {{ title }}
            </h3>

            <p class="text-slate-500 text-base mb-8 px-2 leading-relaxed">
              {{ message }}
            </p>

            <div class="flex items-center gap-3">
              <AppButton
                @click="onCancel"
                variant="secondary"
                block
                size="md"
                class="text-slate-400 font-semibold"
              >
                {{ buttonNo }}
              </AppButton>

              <AppButton
                @click="onConfirm"
                variant="danger"
                block
                size="md"
              >
                {{ buttonYes }}
              </AppButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
