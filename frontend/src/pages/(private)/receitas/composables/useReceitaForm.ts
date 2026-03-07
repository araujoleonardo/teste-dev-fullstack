import { ref, reactive, watch } from 'vue'
import type { ValidationErrors } from "@/types/error-data";
import api from "@/services/api.ts";
import type { ReceitaForm, PropsReceita } from "@/types/receita-data";
import { ReceitaModel } from "@/models/ReceitaModel.ts";
import { toast } from "@/components/toast/toast.ts";
import type { Categoria } from "@/types/categoria-data";
import { useAuthStore } from "@/store/useAuthStore";

export default function useReceitaForm(props: PropsReceita, emit: (event: 'reload') => void) {
  const auth = useAuthStore();
  const title = ref<string>('Receita');
  const btnTitulo = ref<string>('Salvar');
  const urlSubmit = ref<string>('');
  const method = ref<"post" | "put">("post");
  const loading = ref<boolean>(false);
  const validate = ref<ValidationErrors>({});
  
  const categorias = ref<Categoria[]>([]);

  const formData = reactive<ReceitaForm>(new ReceitaModel());

  const resetForm = (): void => {
    Object.assign(formData, new ReceitaModel({
      idUsuarios: auth.user?.id ? Number(auth.user.id) : null
    }));
    validate.value = {};
  }

  const loadCategorias = async () => {
    try {
      const { data } = await api.get('/categorias/dropdown');
      categorias.value = data || [];
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    }
  }

  const handleSubmit = async (): Promise<void> => {
    loading.value = true
    validate.value = {}
    
    try {
      // Garante que o usuário logado é o dono se for novo
      if (method.value === 'post') {
        formData.idUsuarios = auth.user?.id ? Number(auth.user.id) : null;
      }

      await api[method.value](urlSubmit.value, {
        ...formData,
        tempoPreparoMinutos: Number(formData.tempoPreparoMinutos),
        porcoes: Number(formData.porcoes),
        idCategorias: Number(formData.idCategorias),
      })
      toast.success(method.value === 'post' ? 'Receita cadastrada com sucesso!' : 'Receita atualizada com sucesso!')
      emit('reload')
      props.handleClose()
    } catch (error: any) {
      validate.value = error.response?.data?.errors || {}
      if (!validate.value || Object.keys(validate.value).length === 0) {
        toast.error('Erro ao salvar receita. Verifique os campos.')
      }
    } finally {
      loading.value = false
    }
  }

  watch(
    () => props.visible,
    async (newVisible: boolean) => {
      if (newVisible) {
        await loadCategorias();
        validate.value = {};
        if (props.tipoForm === 'novo') {
          title.value = 'Nova Receita'
          btnTitulo.value = 'Salvar'
          urlSubmit.value = '/receitas'
          method.value = 'post'
          resetForm();
        } else if (props.tipoForm === 'update' && props.receita) {
          title.value = 'Editar Receita'
          btnTitulo.value = 'Atualizar'
          urlSubmit.value = `/receitas/${props.receita.id}`
          method.value = 'put'
          Object.assign(formData, {
            id: props.receita.id,
            nome: props.receita.nome,
            tempoPreparoMinutos: props.receita.tempoPreparoMinutos,
            porcoes: props.receita.porcoes,
            modoPreparo: props.receita.modoPreparo,
            ingredientes: props.receita.ingredientes,
            idUsuarios: props.receita.idUsuarios,
            idCategorias: props.receita.idCategorias,
          })
        }
      }
    }
  )

  return {
    title,
    btnTitulo,
    loading,
    validate,
    formData,
    categorias,
    handleSubmit,
  }
}
