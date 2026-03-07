import { ref, reactive, watch } from 'vue'
import type {ValidationErrors} from "@/types/error-data";
import api from "@/services/api.ts";
import type {CategoriaForm, PropsCategoria} from "@/types/categoria-data";
import {CategoriaModel} from "@/models/CategoriaModel.ts";
import {toast} from "@/components/toast/toast.ts";

export default function useCategoriaForm(props: PropsCategoria, emit: (event: 'reload') => void) {
  const title = ref<string>('Título');
  const btnTitulo = ref<string>('Salvar');
  const urlSubmit = ref<string>('');
  const method = ref<"post"|"put">("post");
  const loading = ref<boolean>(false);
  const validate = ref<ValidationErrors>({});

  const formData = reactive<CategoriaForm>(new CategoriaModel());

  const resetForm = (): void => {
    Object.assign(formData, new CategoriaModel());
  }

  const handleSubmit = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await api[method.value](urlSubmit.value, formData)
      toast.success(response?.data?.success || 'Dados cadastrados com sucesso!')
      emit('reload')
      props.handleClose()
    } catch (error: any) {
      validate.value = error.response?.data?.errors || {}
      if (!validate.value || Object.keys(validate.value).length === 0) {
        toast.error('Erro ao salvar, tente mais tarde!')
      }
    } finally {
      loading.value = false
    }
  }

  watch(
    () => props.visible,
    (newVisible: boolean) => {
      if (newVisible) {
        validate.value = {};
        if (props.tipoForm === 'novo') {
          title.value = 'Novo Categoria'
          btnTitulo.value = 'Salvar'
          urlSubmit.value = '/categorias'
          method.value = 'post'
          resetForm();
        } else if (props.tipoForm === 'update' && props.categoria) {
          title.value = 'Editar Categoria'
          btnTitulo.value = 'Atualizar'
          urlSubmit.value = `/categorias/${props.categoria.id}`
          method.value = 'put'
          Object.assign(formData, {
            nome: props.categoria.nome,
          })
        }
      }
    }
  )

  return {
    title,
    btnTitulo,
    urlSubmit,
    loading,
    validate,
    formData,
    handleSubmit,
  }
}
