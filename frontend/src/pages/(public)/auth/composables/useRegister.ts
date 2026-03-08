import { ref, reactive } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { toast } from '@/components/toast/toast'
import { UserModel } from '@/models/UserModel'
import type { ValidationErrors } from '@/types/error-data'

export function useRegister() {
  const router = useRouter()
  const isLoading = ref(false)
  const validate = ref<ValidationErrors>({})
  const form = reactive(new UserModel())

  const register = async () => {
    isLoading.value = true
    validate.value = {}

    try {
      await api.post('/usuarios', form)
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      router.push('/login')
    } catch (error: any) {
      validate.value = error.response?.data?.errors || {}
      if (!Object.keys(validate.value).length) {
        toast.error('Erro ao realizar cadastro. Tente novamente.')
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    form,
    isLoading,
    validate,
    register
  }
}
