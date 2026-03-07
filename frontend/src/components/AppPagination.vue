<script setup lang="ts">
import { PaginateDataModel } from "@/models/PaginateDataModel";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "page", value: number): void;
  (e: "perPage", value: number): void;
}>();

const props = defineProps({
  data: {
    type: Object as () => PaginateDataModel<any>,
    default: () => new PaginateDataModel<any>(),
  },
});

const handlePage = (page: number): void => {
  if (page >= 1 && page <= props.data.total_pages) {
    emit("page", page);
  }
};

const handlePerPage = (event: Event): void => {
  const select = event.target as HTMLSelectElement;
  emit("perPage", parseInt(select.value, 10));
};

const startItem = (data: PaginateDataModel<any>) => {
  return data.total_itens === 0 ? 0 : (data.page - 1) * data.page_size + 1;
};

const endItem = (data: PaginateDataModel<any>) => {
  return Math.min(data.page * data.page_size, data.total_itens);
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
    <!-- Items per page & Total info -->
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3">
        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider" for="itemsPerPage">
          Por página
        </label>
        <div class="relative group">
          <select
            id="itemsPerPage"
            class="appearance-none h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none cursor-pointer transition-all duration-300 hover:border-orange-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm"
            @change="handlePerPage"
            :value="data?.page_size || 10"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-orange-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      <div v-if="data.total_itens" class="hidden md:block text-sm font-medium text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-100">
        Exibindo <span class="font-bold text-slate-900">{{ startItem(data) }}</span> - <span class="font-bold text-slate-900">{{ endItem(data) }}</span> de <span class="font-bold text-slate-900">{{ data.total_itens }}</span>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center gap-1.5">
      <button
        class="h-9 w-9 inline-flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 transition-all duration-300 shadow-sm hover:border-orange-500 hover:text-orange-600 hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:shadow-none"
        title="Primeira página"
        :disabled="data.page === 1"
        @click="handlePage(1)"
      >
        <ChevronsLeft class="size-4" />
      </button>

      <button
        class="h-9 w-9 inline-flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 transition-all duration-300 shadow-sm hover:border-orange-500 hover:text-orange-600 hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:shadow-none"
        title="Página anterior"
        :disabled="data.page === 1"
        @click="handlePage(data.page - 1)"
      >
        <ChevronLeft class="size-4" />
      </button>

      <div class="flex items-center px-4 h-9 bg-white border border-slate-200 rounded-xl shadow-sm">
        <span class="text-sm font-bold text-slate-700">
          Página {{ data.page }} <span class="text-slate-300 font-normal mx-1">/</span> {{ data.total_pages }}
        </span>
      </div>

      <button
        class="h-9 w-9 inline-flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 transition-all duration-300 shadow-sm hover:border-orange-500 hover:text-orange-600 hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:shadow-none"
        title="Próxima página"
        :disabled="data.page >= data.total_pages"
        @click="handlePage(data.page + 1)"
      >
        <ChevronRight class="size-4" />
      </button>

      <button
        class="h-9 w-9 inline-flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 transition-all duration-300 shadow-sm hover:border-orange-500 hover:text-orange-600 hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:shadow-none"
        title="Última página"
        :disabled="data.page >= data.total_pages"
        @click="handlePage(data.total_pages)"
      >
        <ChevronsRight class="size-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>