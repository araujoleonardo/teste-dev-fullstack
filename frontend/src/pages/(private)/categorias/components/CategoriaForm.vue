<script setup lang="ts">
import type {PropsCategoria} from "@/types/categoria-data";
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";
import AppButton from "@/components/AppButton.vue";
import useCategoriaForm from "@/pages/(private)/categorias/composables/useCategoriaForm.ts";

const props = defineProps<PropsCategoria>();
const emit = defineEmits(['reload']);

const {
  title,
  btnTitulo,
  loading,
  validate,
  formData,
  handleSubmit,
} = useCategoriaForm(props, emit);
</script>

<template>
  <AppModal size="md" v-model="props.visible" :onClose="props.handleClose" :click="false">
    <template #header>
      {{ title }}
    </template>

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <AppInput
            v-model="formData.nome"
            label="Nome"
            placeholder="Digite o nome do setor"
            :error="validate?.nome?.[0]"
            required
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <AppButton :loading="loading" @click="props.handleClose" variant="ghost">
          Cancelar
        </AppButton>
        <AppButton :loading="loading" @click="handleSubmit" variant="primary">
          {{ btnTitulo }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<style scoped>

</style>
