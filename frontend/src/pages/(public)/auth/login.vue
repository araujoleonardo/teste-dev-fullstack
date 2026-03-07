<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  UtensilsCrossed,
  Lock,
  User,
} from 'lucide-vue-next';
import AppInput from '@/components/AppInput.vue';
import AppCard from "@/components/AppCard.vue";

const router = useRouter();

const login = ref('');
const senha = ref('');
const error = ref('');

const handleLogin = (e: Event) => {
  e.preventDefault();
  if (!login.value || !senha.value) {
    error.value = 'Por favor, preencha todos os campos.';
    return;
  }
  router.push('/receitas');
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
        <form class="space-y-6" @submit="handleLogin">
          <AppInput
            v-model="login"
            label="Usuário"
            placeholder="Seu nome de usuário"
            :icon="User"
            required
            :error="error && !login ? 'Usuário é obrigatório' : ''"
          />

          <AppInput
            v-model="senha"
            type="password"
            label="Senha"
            placeholder="••••••••"
            :icon="Lock"
            required
            :error="error && !senha ? 'Senha é obrigatória' : ''"
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 rounded cursor-pointer"
              />
              <label for="remember-me" class="ml-2 block text-xs text-slate-500 cursor-pointer">
                Lembrar de mim
              </label>
            </div>
            <div class="text-xs">
              <a href="#" class="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-lg shadow-orange-200/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span class="flex items-center gap-2">
                Acessar
              </span>
            </button>
          </div>
        </form>
      </AppCard>

      <p class="text-center text-sm text-slate-500 mt-6">
        Ainda não tem uma conta?
        <a href="#" class="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
          Criar
        </a>
      </p>
    </div>
  </div>
</template>


<style scoped>

</style>
