<script setup lang="ts">
import ReceitaTable from "@/pages/(private)/receitas/components/ReceitaTable.vue";
import { UtensilsCrossed } from "lucide-vue-next";
</script>

<template>
  <div class="space-y-6">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 text-orange-600 mb-1">
          <UtensilsCrossed class="size-6" />
          <h1 class="text-3xl font-extrabold tracking-tight">Receitas</h1>
        </div>
      </div>
    </div>

    <ReceitaTable />
  </div>
</template>

<style scoped>
</style>
