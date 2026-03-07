<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  UtensilsCrossed, 
  Tags, 
  LogOut, 
  Menu, 
  X,
} from 'lucide-vue-next';
import { useAuthStore } from '@/store/useAuthStore';

const router = useRouter();
const auth = useAuthStore();
const isMenuOpen = ref(false);

const navItems = [
  { name: 'Receitas', path: '/receitas', icon: UtensilsCrossed },
  { name: 'Categorias', path: '/categorias', icon: Tags },
];

const logout = async () => {
  await auth.logout();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" @click="router.push('/receitas')">
              <div class="p-2 bg-orange-500 rounded-lg shadow-sm">
                <UtensilsCrossed class="w-6 h-6 text-white" />
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent hidden sm:block">
                MasterCheff
              </span>
            </div>

            <div class="hidden md:ml-8 md:flex md:space-x-4">
              <router-link
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                class="inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md"
                :class="[$route.path.startsWith(item.path) 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-slate-600 hover:text-orange-500 hover:bg-slate-50']"
              >
                <component :is="item.icon" class="w-4 h-4 mr-2" />
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-4">
            <button
              @click="logout"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer"
            >
              <LogOut class="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>

          <!-- Mobile -->
          <div class="flex items-center md:hidden">
            <button
              @click="isMenuOpen = !isMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none cursor-pointer"
            >
              <Menu v-if="!isMenuOpen" class="block h-6 w-6" />
              <X v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-[-10px]"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-[-10px]"
      >
        <div v-show="isMenuOpen" class="md:hidden bg-white border-b border-slate-200 shadow-lg">
          <div class="pt-2 pb-3 space-y-1 px-4">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
              :class="[$route.path.startsWith(item.path)
                ? 'text-orange-600 bg-orange-50'
                : 'text-slate-600 hover:text-orange-500 hover:bg-slate-50']"
              @click="isMenuOpen = false"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </router-link>
          </div>
          <div class="pt-4 pb-3 border-t border-slate-100 px-4">
            <button
              @click="logout"
              class="flex w-full items-center px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut class="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Content -->
    <main class="flex-wrap">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-sm text-slate-400">
          &copy; {{ new Date().getFullYear() }} MasterCheff. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>

</style>