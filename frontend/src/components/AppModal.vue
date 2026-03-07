<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X } from "lucide-vue-next";

type SizeType = 'sm' | 'md' | 'lg' | 'xl' | 'full-screen'

const props = withDefaults(defineProps<{
  size?: SizeType
  modelValue: boolean
  click: boolean
  onClose: () => void
}>(), {
  size: 'full-screen',
  modelValue: false,
  click: false,
  onClose: () => {}
})

const emit = defineEmits(["update:modelValue"]);
const isOpen = ref<boolean>(false);

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
  { immediate: true }
);

const closeModal = (): void => {
  emit('update:modelValue', false);
  props.onClose();
};

const closeClick = (): void => {
  if (!props.click) {
    return;
  }
  emit('update:modelValue', false);
  props.onClose();
};

const modalSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-full md:w-[30rem]'
    case 'md':
      return 'w-full md:w-[45rem]'
    case 'lg':
      return 'w-full md:w-[60rem]'
    case 'xl':
      return 'w-full lg:w-[75rem]'
    case 'full-screen':
      return 'w-full h-full min-h-screen max-h-screen flex flex-col' // Adicionado flex flex-col
    default:
      return ''
  }
})

const isFull = computed(() => {
  return props.size === 'full-screen';
})
</script>

<template>
  <div class="relative z-50">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="closeClick"
        class="fixed inset-0 overflow-y-auto bg-slate-900/50 backdrop-blur-sm transition duration-300"
      >
        <div class="fixed inset-0 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <!-- Content -->
            <Transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                v-if="isOpen"
                @click.stop
                :class="[
                  modalSizeClass,
                'relative z-10 bg-white shadow-2xl shadow-slate-900/20 rounded-3xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 text-left align-middle'
                ]"
              >
                <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                  <div class="flex flex-col gap-0.5">
                    <h3 class="text-xl font-bold text-slate-900 tracking-tight">
                      <slot name="header"></slot>
                    </h3>
                  </div>
                  <button
                    @click="closeModal"
                    class="group p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 active:scale-90 cursor-pointer"
                  >
                    <X class="w-5 h-5 transition-transform group-hover:rotate-90" />
                  </button>
                </div>

                <!-- Body -->
                <main
                  class="flex-1 overflow-y-auto px-6 py-6"
                  :class="{ 'scrollbar-thin scrollbar-thumb-slate-200': !isFull }"
                >
                  <slot />
                </main>

                <!-- Footer -->
                <footer
                  v-if="$slots.footer"
                  class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0"
                >
                  <slot name="footer" />
                </footer>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for better UX inside the modal */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0; /* slate-200 */
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1; /* slate-300 */
}
</style>
