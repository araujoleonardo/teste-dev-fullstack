<script setup lang="ts">
import type { Receita } from "@/types/receita-data";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import {
  Printer,
  Clock,
  Users,
  Utensils,
  BookOpen,
  ClipboardList,
  Calendar,
  ChefHat
} from "lucide-vue-next";

const props = defineProps<{
  visible: boolean;
  handleClose: () => void;
  receita?: Receita;
}>();

const handlePrint = () => {
  window.print();
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('pt-BR');
};
</script>

<template>
  <AppModal size="lg" v-model="props.visible" :onClose="props.handleClose" :click="true">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 bg-orange-100 rounded-lg">
          <Utensils class="size-5 text-orange-600" />
        </div>
        <span>Detalhes da Receita</span>
      </div>
    </template>

    <div v-if="receita" class="recipe-details selection:bg-orange-100">
      <!-- Header -->
      <div class="mb-8 border-b border-slate-100 pb-8">
        <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div class="space-y-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-600 uppercase tracking-wider">
              {{ receita.categoria?.nome || 'Geral' }}
            </span>
            <h1 class="text-4xl font-black text-slate-900 leading-tight">
              {{ receita.nome }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
              <div class="flex items-center gap-1.5">
                <ChefHat class="size-4" />
                <span>Por: <span class="text-slate-600">{{ receita.usuario?.nome || 'Mestre Cuca' }}</span></span>
              </div>
              <div class="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                <Calendar class="size-4" />
                <span>{{ formatDate(receita.criadoEm) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500">
              <Clock class="size-5" />
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Preparo</p>
              <p class="text-sm font-bold text-slate-700">{{ receita.tempoPreparoMinutos }} min</p>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500">
              <Users class="size-5" />
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Rendimento</p>
              <p class="text-sm font-bold text-slate-700">{{ receita.porcoes }} porções</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div class="md:col-span-4">
          <div class="flex items-center gap-2 mb-4 text-slate-800">
            <ClipboardList class="size-5 text-orange-500" />
            <h2 class="text-lg font-bold">Ingredientes</h2>
          </div>
          <div class="bg-orange-50/30 rounded-2xl p-6 border border-orange-100">
            <div class="prose prose-sm whitespace-pre-wrap text-slate-600 leading-relaxed font-medium">
              {{ receita.ingredientes }}
            </div>
          </div>
        </div>

        <div class="md:col-span-8">
          <div class="flex items-center gap-2 mb-4 text-slate-800">
            <BookOpen class="size-5 text-orange-500" />
            <h2 class="text-lg font-bold">Modo de Preparo</h2>
          </div>
          <div class="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-loose text-base">
            {{ receita.modoPreparo }}
          </div>
        </div>
      </div>
    </div>

    <!-- Layout de Impressão -->
    <div class="hidden print:block print-container print:p-0">
      <div v-if="receita" class="bg-white">
        <h1 class="text-3xl font-bold mb-2">{{ receita.nome }}</h1>
        <p class="text-sm text-gray-500 mb-6 font-medium">
          Categoria: {{ receita.categoria?.nome }} |
          Autor: {{ receita.usuario?.nome }} |
          Tempo: {{ receita.tempoPreparoMinutos }}min |
          Rendimento: {{ receita.porcoes }} porções
        </p>

        <div class="mb-6">
          <h2 class="text-xl font-bold border-b-2 border-gray-100 pb-2 mb-3">Ingredientes</h2>
          <p class="whitespace-pre-wrap text-gray-700">{{ receita.ingredientes }}</p>
        </div>

        <div>
          <h2 class="text-xl font-bold border-b-2 border-gray-100 pb-2 mb-3">Modo de Preparo</h2>
          <p class="whitespace-pre-wrap text-gray-700">{{ receita.modoPreparo }}</p>
        </div>

        <div class="mt-20 border-t pt-4 text-center text-xs text-gray-400">
          Documento gerado pelo sistema MasterCheff em {{ new Date().toLocaleDateString('pt-BR') }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <AppButton @click="props.handleClose" variant="ghost">
          Fechar
        </AppButton>
        <AppButton variant="primary" @click="handlePrint" class="print:hidden">
          <Printer class="size-4 mr-2" />
          Imprimir
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<style>
/*Usando css para criar pagina de impressao*/
@media print {
  body * {
    visibility: hidden !important;
  }

  .print-container,
  .print-container * {
    visibility: visible !important;
  }

  .print-container {
    visibility: visible !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
    background: white !important;
  }

  body {
    background: white !important;
  }

  @page {
    margin: 1cm;
    size: auto;
  }
}
</style>
