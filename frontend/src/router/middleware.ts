import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

export default async function authMiddleware(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> {
  const auth = useAuthStore()

  const redirectToLogin = () => {
    auth.clear()
    return next({ name: 'login' })
  }

  try {
    if (auth.token && !auth.user) {
      await auth.checkUser()
    }

    const isAuthenticated = !!auth.token && !!auth.user

    // Redireciona usuários logados para a lista de receitas
    if (isAuthenticated && to.meta.guestOnly) {
      return next({ name: 'receitas' })
    }

    // Protege rotas que exigem autenticação
    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        console.warn('Acesso negado: Usuário não autenticado.')
        return redirectToLogin()
      }
    }

    // Rota permitida
    return next()
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error)
    return redirectToLogin()
  }
}
