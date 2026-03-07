<script setup lang="ts">
import type { PropsReceita } from "@/types/receita-data";
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";
import AppButton from "@/components/AppButton.vue";
import AppSelect from "@/components/AppSelect.vue";
import AppTextarea from "@/components/AppTextarea.vue";
import { Clock, Users, Tags, Utensils, BookOpen, ClipboardList } from "lucide-vue-next";
import useReceitaForm from "@/pages/(private)/receitas/composables/useReceitaForm.ts";
import { computed } from "vue";

const props = defineProps<PropsReceita>();
const emit = defineEmits(['reload']);

const {
  title,
  btnTitulo,
  loading,
  validate,
  formData,
  categorias,
  handleSubmit,
} = useReceitaForm(props, emit);

const categoriasOptions = computed(() =>
  categorias.value.map(c => ({ label: c.nome || 'Sem Nome', value: c.id }))
);
</script>

<template>
  <AppModal size="lg" v-model="props.visible" :onClose="props.handleClose" :click="false">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 bg-orange-100 rounded-lg">
          <Utensils class="size-5 text-orange-600" />
        </div>
        <span>{{ title }}</span>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="p-1">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12">
          <AppInput
            v-model="formData.nome"
            label="Nome da Receita"
            placeholder="Ex: Lasanha à Bolonhesa"
            :error="validate?.nome?.[0]"
            required
            :icon="Utensils"
          />
        </div>

        <div class="col-span-12 md:col-span-6">
          <AppSelect
            v-model="formData.idCategorias"
            label="Categoria"
            :options="categoriasOptions"
            placeholder="Selecione a categoria"
            :error="validate?.idCategorias?.[0]"
            required
            :icon="Tags"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <AppInput
            v-model="formData.tempoPreparoMinutos"
            type="number"
            label="Tempo (min)"
            placeholder="0"
            :error="validate?.tempoPreparoMinutos?.[0]"
            required
            :icon="Clock"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <AppInput
            v-model="formData.porcoes"
            type="number"
            label="Porções"
            placeholder="0"
            :error="validate?.porcoes?.[0]"
            required
            :icon="Users"
          />
        </div>

        <div class="col-span-12">
          <AppTextarea
            v-model="formData.ingredientes"
            label="Ingredientes"
            placeholder="Liste os ingredientes e quantidades..."
            :error="validate?.ingredientes?.[0]"
            required
            :rows="6"
            :icon="ClipboardList"
          />
        </div>

        <div class="col-span-12">
          <AppTextarea
            v-model="formData.modoPreparo"
            label="Modo de Preparo"
            placeholder="Descreva o passo a passo da receita..."
            :error="validate?.modoPreparo?.[0]"
            required
            :rows="8"
            :icon="BookOpen"
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
