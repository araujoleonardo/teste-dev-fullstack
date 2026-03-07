<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  UtensilsCrossed, 
  Lock, 
  User,
} from 'lucide-vue-next';

const router = useRouter();

const login = ref('');
const senha = ref('');

const handleLogin = () => {
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

      <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
        <form class="space-y-6" @submit="handleLogin">
          <div>
            <label for="login" class="block text-sm font-semibold text-slate-700 mb-1 ml-1">Usuário</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <User class="h-5 w-5" />
              </div>
              <input
                id="login"
                v-model="login"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200 text-slate-900 sm:text-sm"
                placeholder="Seu nome de usuário"
              />
            </div>
          </div>

          <div>
            <label for="senha" class="block text-sm font-semibold text-slate-700 mb-1 ml-1">Senha</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <Lock class="h-5 w-5" />
              </div>
              <input
                id="senha"
                v-model="senha"
                type="password"
                required
                class="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200 text-slate-900 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

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
      </div>

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