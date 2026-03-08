<script setup lang="ts">
import {
  UtensilsCrossed,
  Lock,
  User,
  UserPlus,
  ArrowLeft,
} from 'lucide-vue-next';
import AppInput from '@/components/AppInput.vue';
import AppCard from "@/components/AppCard.vue";
import AppButton from "@/components/AppButton.vue";
import { useRegister } from './composables/useRegister';

const { form, isLoading, validate, register } = useRegister();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <!-- Background Decorativo -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-3xl opacity-50"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Cabeçalho -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-lg shadow-slate-200 mb-4 transform hover:rotate-3 transition-transform duration-300">
          <UserPlus class="w-8 h-8 text-orange-500" />
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          Criar sua <span class="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Conta</span>
        </h2>
        <p class="mt-2 text-sm text-slate-500">
          Crie uma conta para ter acesso ao sistema
        </p>
      </div>

      <AppCard>
        <form class="space-y-5 m-4" @submit.prevent="register">
          <AppInput
            v-model="form.nome"
            label="Nome Completo"
            placeholder="Qual é o seu nome?"
            :icon="User"
            required
            :error="validate.nome?.[0]"
          />

          <AppInput
            v-model="form.login"
            label="Usuário"
            placeholder="Escolha um nome de usuário"
            :icon="User"
            required
            :error="validate.login?.[0]"
          />

          <AppInput
            v-model="form.senha"
            type="password"
            label="Senha"
            placeholder="No mínimo 6 caracteres"
            :icon="Lock"
            required
            :error="validate.senha?.[0]"
          />

          <div class="pt-2">
            <AppButton
              block
              :icon="UtensilsCrossed"
              :loading="isLoading"
              @click="register"
            >
              Criar Conta
            </AppButton>
          </div>
        </form>
      </AppCard>

      <div class="text-center">
        <router-link
          to="/login"
          class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          Voltar para o login
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
