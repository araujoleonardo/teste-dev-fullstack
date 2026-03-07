import {ref, reactive, onMounted, watch} from 'vue';
import api from "@/services/api.ts";
import type {Categoria} from "@/types/categoria-data";
import type {IParams} from "@/types/pagination-data";
import {PaginateDataModel} from "@/models/PaginateDataModel.ts";
import {toast} from "@/components/toast/toast.ts";
import showConfirm from "@/components/confirm/confirm.ts";

export default function useCategoriaTable(baseEndpoint: string) {
  const loading = ref<boolean>(false);
  const openDialog = ref({ isOpen: false, tipoForm: 'novo' });
  const openShow = ref({ isOpen: false });
  const categoria = ref<Categoria|undefined>(undefined);
  const debounceTimeout = ref<number|undefined>(undefined);

  const params = reactive<IParams>({
    page: 1,
    page_size: 10,
    search: undefined,
    field: 'id',
    direction: 'DESC',
  });

  const dataSet = reactive(new PaginateDataModel<Categoria>());

  const getData = async (page?: number) => {
    loading.value = true;

    if (page) {
      params.page = page;
    }

    try {
      const { data } = await api.get(baseEndpoint, {
        params: params
      });
      Object.assign(dataSet, data);
    } catch (error) {
      toast.error('Não foi possível carregar os dados.');
    } finally {
      loading.value = false;
    }
  };

  const handleSort = async (field: string) => {
    if (params.field === field) {
      params.direction = params.direction === 'ASC' ? 'DESC' : 'ASC';
    } else {
      params.field = field;
      params.direction = 'ASC';
    }
    params.page = 1;
    await getData();
  };

  watch(() => params.search, () => {
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
    }

    debounceTimeout.value = window.setTimeout(async () => {
      params.page = 1;
      await getData();
    }, 500);
  });

  const handlePerPage = async (val: number) => {
    params.page_size = val;
    params.page = 1;
    await getData();
  };

  const handleOpen = () => {
    openDialog.value.tipoForm = 'novo';
    openDialog.value.isOpen = true;
  };

  const handleEdit = (row: any) => {
    openDialog.value.tipoForm = 'update';
    categoria.value = row;
    openDialog.value.isOpen = true;
  };

  const handleDelete = (row: { id:number | string }) => {
    showConfirm({
      title: 'Atenção!',
      message: 'Esta ação não poderá ser desfeita. Deseja continuar?',
      button: {
        yes: 'Sim',
        no: 'Não',
      },
      callback: async (confirm: boolean) => {
        if (!confirm) return;

        try {
          const response = await api.delete(`/categorias/${row.id}`);
          toast.success(response?.data?.success || 'Categoria excluída com sucesso!');
          await getData();
        } catch (error: any) {
          toast.error(error?.response?.data?.error || 'Não foi possível excluir.');
        }
      },
    });
  };

  onMounted(async () => {
    await getData();
  });

  return {
    loading,
    dataSet,
    params,
    getData,
    handleSort,
    handlePerPage,
    handleOpen,
    handleEdit,
    handleDelete,
    openDialog,
    openShow,
    categoria,
  };
}
