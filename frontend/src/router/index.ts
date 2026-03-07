import {createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized} from "vue-router";
import Public from "@/layouts/public.vue";
import Receitas from "@/pages/(private)/receitas/receitas.vue";
import Categorias from "@/pages/(private)/categorias/categorias.vue";
import Private from "@/layouts/private.vue";
import Login from "@/pages/(public)/auth/login.vue";
import authMiddleware from "@/router/middleware";
import {useLoaderStore} from "@/store/useLoaderStore.ts";

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

// Middleware para loader
router.beforeEach((
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const loader = useLoaderStore();
  loader.start();
  next();
});
router.afterEach(() => {
  const loader = useLoaderStore();
  loader.stop();
});

export default router;
