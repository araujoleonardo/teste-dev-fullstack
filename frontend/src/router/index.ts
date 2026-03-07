import {createRouter, createWebHistory} from "vue-router";
import Public from "@/layouts/public.vue";
import Receitas from "@/pages/(private)/receitas/receitas.vue";
import Categorias from "@/pages/(private)/categorias/categorias.vue";
import Private from "@/layouts/private.vue";
import Login from "@/pages/(public)/auth/login.vue";
import authMiddleware from "@/router/middleware";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/receitas'
    },
    {
      path: '/',
      component: Public,
      children: [
        {
          path: '/login',
          name: 'login',
          component: Login,
          meta: { guestOnly: true }
        },
      ]
    },
    {
      path: '/',
      component: Private,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/receitas',
          name: 'receitas',
          component: Receitas,
        },
        {
          path: '/categorias',
          name: 'categorias',
          component: Categorias,
        },
      ]
    }
  ]
});

router.beforeEach(authMiddleware);

export default router;