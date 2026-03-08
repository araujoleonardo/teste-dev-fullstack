import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import useCategoriaTable from '@/pages/(private)/categorias/composables/useCategoriaTable';
import api from '@/services/api';

vi.mock('@/services/api', () => {
  const instance = {
    get: vi.fn(),
    delete: vi.fn(),
    defaults: { headers: { common: {} } },
  };
  return { default: instance };
});

vi.mock('@/components/toast/toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/components/confirm/confirm', () => ({
  default: vi.fn(),
}));

const apiMock = api as any;

const mockPaginatedResponse = {
  data: {
    page: 1,
    page_size: 10,
    total_itens: 2,
    total_pages: 1,
    itens: [
      { id: 1, nome: 'Doces', receitas: [] },
      { id: 2, nome: 'Salgados', receitas: [] },
    ],
  },
};

describe('useCategoriaTable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    apiMock.get.mockResolvedValue(mockPaginatedResponse);
  });

  it('deve inicializar com loading = false', () => {
    const { loading } = useCategoriaTable('/categorias');
    expect(loading.value).toBe(false);
  });

  it('deve inicializar com openDialog.isOpen = false', () => {
    const { openDialog } = useCategoriaTable('/categorias');
    expect(openDialog.value.isOpen).toBe(false);
  });

  it('deve inicializar params com valores padrão', () => {
    const { params } = useCategoriaTable('/categorias');
    expect(params.page).toBe(1);
    expect(params.page_size).toBe(10);
    expect(params.field).toBe('id');
    expect(params.direction).toBe('DESC');
  });

  it('deve carregar dados ao chamar getData()', async () => {
    const { getData, dataSet } = useCategoriaTable('/categorias');
    await getData();

    expect(apiMock.get).toHaveBeenCalledWith('/categorias', { params: expect.any(Object) });
    expect(dataSet.total_itens).toBe(2);
    expect(dataSet.itens).toHaveLength(2);
  });

  it('deve atualizar a página ao chamar getData(page)', async () => {
    const { getData, params } = useCategoriaTable('/categorias');
    await getData(3);
    expect(params.page).toBe(3);
  });

  it('handleOpen deve abrir o dialog em modo "novo"', () => {
    const { handleOpen, openDialog } = useCategoriaTable('/categorias');
    handleOpen();
    expect(openDialog.value.isOpen).toBe(true);
    expect(openDialog.value.tipoForm).toBe('novo');
  });

  it('handleEdit deve abrir o dialog em modo "update" com a categoria', () => {
    const categoria = { id: 1, nome: 'Doces', receitas: [] };
    const { handleEdit, openDialog, categoria: selectedCategoria } = useCategoriaTable('/categorias');
    handleEdit(categoria);

    expect(openDialog.value.isOpen).toBe(true);
    expect(openDialog.value.tipoForm).toBe('update');
    expect(selectedCategoria.value).toEqual(categoria);
  });

  it('handleSort deve alternar direção quando o campo já está ativo', async () => {
    const { handleSort, params } = useCategoriaTable('/categorias');
    expect(params.direction).toBe('DESC');

    await handleSort('id');
    expect(params.direction).toBe('ASC');

    await handleSort('id');
    expect(params.direction).toBe('DESC');
  });

  it('handleSort deve mudar o campo e resetar direction para ASC', async () => {
    const { handleSort, params } = useCategoriaTable('/categorias');
    await handleSort('nome');

    expect(params.field).toBe('nome');
    expect(params.direction).toBe('ASC');
  });

  it('handleSort deve resetar page para 1', async () => {
    const { handleSort, params } = useCategoriaTable('/categorias');
    params.page = 5;
    await handleSort('nome');
    expect(params.page).toBe(1);
  });

  it('handlePerPage deve atualizar page_size e resetar page para 1', async () => {
    const { handlePerPage, params } = useCategoriaTable('/categorias');
    params.page = 3;
    await handlePerPage(25);
    expect(params.page_size).toBe(25);
    expect(params.page).toBe(1);
  });

  it('getData deve setar loading = false mesmo em caso de erro', async () => {
    apiMock.get.mockRejectedValue(new Error('Falha'));
    const { getData, loading } = useCategoriaTable('/categorias');
    await getData();
    expect(loading.value).toBe(false);
  });
});
