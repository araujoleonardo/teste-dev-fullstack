<script setup lang="ts">
import AppCard from "@/components/AppCard.vue";
import AppInput from "@/components/AppInput.vue";
import {Search, RefreshCw, Plus} from "lucide-vue-next";
import AppTable from "@/components/table/AppTable.vue";
import TableHeader from "@/components/table/TableHeader.vue";
import TableRow from "@/components/table/TableRow.vue";
import TableHead from "@/components/table/TableHead.vue";
import TableBody from "@/components/table/TableBody.vue";
import TableCell from "@/components/table/TableCell.vue";
import AppButton from "@/components/AppButton.vue";
import useCategoriaTable from "@/pages/(private)/categorias/composables/useCategoriaTable.ts";
import CategoriaForm from "@/pages/(private)/categorias/components/CategoriaForm.vue";
import AppPagination from "@/components/AppPagination.vue";

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
  categoria,
} = useCategoriaTable('/categorias');
</script>

<template>
  <div>
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
                  Nova Categoria
                </AppButton>
              </div>
            </div>
          </div>
          <div class="col-span-4 lg:col-span-6">
            <div class="md:flex md:justify-end">
              <div class="w-full max-w-sm">
                <AppInput
                  v-model="params.search"
                  placeholder="Pesquisar categoria..."
                  :icon="Search"
                  clearable
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <div>
        <AppTable>
          <TableHeader>
            <TableRow>
              <TableHead sortable @click="handleSort('id')">
                ID
              </TableHead>
              <TableHead width="200" sortable @click="handleSort('nome')">
                Nome
              </TableHead>
              <TableHead>
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody v-if="dataSet.itens?.length">
            <TableRow v-for="(item) in dataSet.itens" :key="item.id">
              <TableCell class="font-bold text-slate-400">
                #{{ item.id }}
              </TableCell>
              <TableCell class="font-semibold text-slate-700">
                {{ item.nome }}
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
              <TableCell colspan="3" class="py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <span class="text-sm font-medium">Nenhuma categoria encontrada</span>
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

    <CategoriaForm
      :visible="openDialog.isOpen"
      :handleClose="() => openDialog.isOpen = false"
      :tipoForm="openDialog.tipoForm"
      :categoria="categoria"
      @reload="getData(1)"
    />
  </div>
</template>

<style scoped>

</style>
