import {ref, reactive} from 'vue';
import { defineStore } from 'pinia';
import api from '@/services/api.ts';
import Cookie from '@/utils/cookie';
import type {ResponseToken, UserAuth} from '@/types/user-auth';
import type { ValidationErrors } from '@/types/error-data';
import {UserAuthModel} from "@/models/UserAuthModel.ts";
import router from "@/router";
import {toast} from "@/components/toast/toast.ts";

const TOKEN = 'auth_token';
const USER = 'auth_user';

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref<boolean>(false);
  const validate = ref<ValidationErrors>({})
  const token = ref<string | null>(Cookie.get(TOKEN));
  const user = ref<UserAuth|null>(readUserCookie());
  const userForm = reactive<UserAuth>(new UserAuthModel());

  function setToken(newData: ResponseToken): void {
    token.value = newData.access_token;
    Cookie.add(TOKEN, newData.access_token, {
      seconds: newData.expires_in,
      secure: true,
      sameSite: 'Strict',
    })
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  function clearToken(): void {
    token.value = null
    Cookie.remove(TOKEN)
  }

  function setUser(newUser: UserAuth): void {
    user.value = newUser
    Cookie.add(USER, JSON.stringify(user.value), {
      seconds: 60 * 60 * 24 * 7, // 7 dias
      secure: true,
      sameSite: 'Strict',
    })
  }

  function clearUser(): void {
    user.value = null;
    Cookie.remove(USER)
  }

  function readUserCookie(): UserAuth | null {
    try {
      const raw = Cookie.get(USER)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function clear(): void {
    clearToken();
    clearUser();
    delete (api.defaults.headers.common as any)['Authorization'];
  }

  async function login(): Promise<void> {
    isLoading.value = true;
    try {
      const { data } = await api.post('/auth/login', {
        login: userForm.login,
        senha: userForm.senha,
      })
      setToken(data)
      await checkUser();
      await router.push('/receitas');
      isLoading.value = false
    } catch (error: any) {
      validate.value = error.response?.data?.errors || {}
      toast.error('Erro no login:', error?.response?.data || error.message)
      isLoading.value = false
      throw error
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error: any) {
      toast.error('Erro no logout:', error?.response?.data || error.message)
    } finally {
      clear()
      window.location.reload()
    }
  }

  async function checkUser(): Promise<UserAuth | null> {
    if (!token.value) {
      console.warn('Nenhum token encontrado.')
      clear();
      return null
    }

    try {
      const { data } = await api.get<UserAuth>('/auth/me')
      setUser(data);
      return user.value;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error?.response?.data || error.message)
      clear()
      return null
    }
  }

  return {
    token,
    user,
    userForm,
    login,
    logout,
    checkUser,
    clear,
    validate,
    isLoading,
    readUserCookie,
  }
})
