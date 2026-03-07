<script setup lang="ts">
import AppCard from "@/components/AppCard.vue";
import AppInput from "@/components/AppInput.vue";
import { Search, RefreshCw, Plus, Clock, Users } from "lucide-vue-next";
import AppTable from "@/components/table/AppTable.vue";
import TableHeader from "@/components/table/TableHeader.vue";
import TableRow from "@/components/table/TableRow.vue";
import TableHead from "@/components/table/TableHead.vue";
import TableBody from "@/components/table/TableBody.vue";
import TableCell from "@/components/table/TableCell.vue";
import AppButton from "@/components/AppButton.vue";
import useReceitaTable from "@/pages/(private)/receitas/composables/useReceitaTable.ts";
import AppPagination from "@/components/AppPagination.vue";
import ReceitaForm from "@/pages/(private)/receitas/components/ReceitaForm.vue";

const {
  loading,
  params,
  dataSet,
  getData,
  handleSort,
  handlePerPage,
  handleOpen,
  handleEdit,
  handleDelete,
  openDialog,
  receita,
} = useReceitaTable('/receitas');
</script>

<template>
  <div class="space-y-6">
    <AppCard>
      <template #header>
        <div class="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
          <div class="col-span-4 lg:col-span-6">
            <div class="flex flex-col md:flex-row gap-2">
              <div class="flex gap-2">
                <AppButton variant="secondary" :disabled="loading" @click="getData(1)">
                  <RefreshCw class="size-4" :class="{ 'animate-spin': loading }" />
                </AppButton>
                <AppButton variant="primary" :disabled="loading" @click="handleOpen">
                  <Plus class="size-5 mr-1" />
                  Nova Receita
                </AppButton>
              </div>
            </div>
          </div>
          <div class="col-span-4 lg:col-span-6">
            <div class="md:flex md:justify-end">
              <div class="w-full max-w-sm">
                <AppInput
                  v-model="params.search"
                  placeholder="Pesquisar por nome ou ingrediente..."
                  :icon="Search"
                  clearable
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <div>
        <AppTable v-loading="loading">
          <TableHeader>
            <TableRow>
              <TableHead sortable @click="handleSort('nome')">
                Nome
              </TableHead>
              <TableHead sortable @click="handleSort('idCategorias')">
                Categoria
              </TableHead>
              <TableHead sortable @click="handleSort('tempoPreparoMinutos')" width="140">
                Preparo
              </TableHead>
              <TableHead sortable @click="handleSort('porcoes')" width="100">
                Porções
              </TableHead>
              <TableHead>
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody v-if="dataSet.itens?.length">
            <TableRow v-for="(item) in dataSet.itens" :key="item.id">
              <TableCell>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700">{{ item.nome }}</span>
                  <span class="text-xs text-slate-400">Por: {{ item.usuario?.nome || 'Anônimo' }}</span>
                </div>
              </TableCell>
              <TableCell>
                <span v-if="item.categoria" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  {{ item.categoria.nome }}
                </span>
                <span v-else class="text-slate-300 italic text-xs">Sem categoria</span>
              </TableCell>
              <TableCell class="text-slate-600 font-medium text-sm">
                {{ item.tempoPreparoMinutos }} min
              </TableCell>
              <TableCell class="text-slate-600 font-medium text-sm">
                {{ item.porcoes }} un
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-3">
                  <AppButton variant="outline" size="sm" @click="handleEdit(item)">
                    Editar
                  </AppButton>
                  <AppButton variant="danger" size="sm" @click="handleDelete(item)">
                    Excluir
                  </AppButton>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody v-else>
            <TableRow>
              <TableCell colspan="5" class="py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <span class="text-sm font-medium">Nenhuma receita encontrada</span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </AppTable>
      </div>

      <template #footer v-if="dataSet.itens?.length">
        <AppPagination :data="dataSet" @page="getData" @perPage="handlePerPage"/>
      </template>
    </AppCard>

    <ReceitaForm
      :visible="openDialog.isOpen"
      :handleClose="() => openDialog.isOpen = false"
      :tipoForm="openDialog.tipoForm"
      :receita="receita"
      @reload="getData(1)"
    />
  </div>
</template>
