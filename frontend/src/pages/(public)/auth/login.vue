<script setup lang="ts">
import {
  UtensilsCrossed,
  Lock,
  User,
} from 'lucide-vue-next';
import AppInput from '@/components/AppInput.vue';
import AppCard from "@/components/AppCard.vue";
import AppButton from "@/components/AppButton.vue";
import { useAuthStore } from '@/store/useAuthStore';

const auth = useAuthStore();

const handleLogin = async () => {
  await auth.login();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <!-- Background Decorativo -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-3xl opacity-50"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Cabeçalho -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 mb-4 transform hover:scale-105 transition-transform duration-300">
          <UtensilsCrossed class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          Bem-vindo ao <span class="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">MasterCheff</span>
        </h2>
        <p class="mt-2 text-sm text-slate-500">
          Gerencie suas receitas com praticidade e estilo
        </p>
      </div>

      <AppCard>
        <form class="space-y-6 m-4" @submit.prevent="handleLogin">
          <AppInput
            v-model="auth.userForm.login"
            label="Usuário"
            placeholder="Seu nome de usuário"
            :icon="User"
            required
            :error="auth.validate.login?.[0]"
          />

          <AppInput
            v-model="auth.userForm.senha"
            type="password"
            label="Senha"
            placeholder="••••••••"
            :icon="Lock"
            required
            :error="auth.validate.senha?.[0]"
          />

          <div>
            <AppButton
              block
              :icon="UtensilsCrossed"
              :loading="auth.isLoading"
              @click="handleLogin"
            >
              Acessar
            </AppButton>
          </div>
        </form>
      </AppCard>

      <p class="text-center text-sm text-slate-500 mt-6">
        Ainda não tem uma conta?
        <router-link to="/register" class="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
          Criar
        </router-link>
      </p>
    </div>
  </div>
</template>


<style scoped>

</style>
