import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';

// Mock da API axios
vi.mock('@/services/api', () => {
  const instance = {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  };
  return { default: instance };
});

// Mock do router
vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}));

// Mock do toast
vi.mock('@/components/toast/toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const apiMock = api as any;

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    document.cookie = '';
  });

  it('deve inicializar com token null quando não há cookie', () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
  });

  it('deve inicializar com user null quando não há cookie', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
  });

  it('deve inicializar isLoading como false', () => {
    const store = useAuthStore();
    expect(store.isLoading).toBe(false);
  });

  // setToken / clearToken são funções internas testadas via login / clear
  describe('clear()', () => {
    it('deve limpar token e usuário', async () => {
      const store = useAuthStore();

      // Simula que houve login bem-sucedido
      apiMock.post.mockResolvedValue({
        data: {
          access_token: 'tok123',
          expires_in: 3600,
          usuario: { id: 1, nome: 'Leo', login: 'leo' },
        },
      });
      apiMock.get.mockResolvedValue({ data: { id: 1, nome: 'Leo', login: 'leo' } });

      store.userForm.login = 'leo';
      store.userForm.senha = '123456';
      await store.login();

      // Confirma que ficou logado
      expect(store.token).not.toBeNull();

      // Agora limpa
      store.clear();

      expect(store.token).toBeNull();
      expect(store.user).toBeNull();
    });
  });

  describe('login()', () => {
    it('deve setar token após login bem-sucedido', async () => {
      const store = useAuthStore();

      apiMock.post.mockResolvedValue({
        data: {
          access_token: 'meu_token',
          expires_in: 3600,
        },
      });
      apiMock.get.mockResolvedValue({
        data: { id: 1, nome: 'Leonardo', login: 'leo' },
      });

      store.userForm.login = 'leo';
      store.userForm.senha = 'Senha@123';
      await store.login();

      expect(store.token).toBe('meu_token');
      expect(apiMock.post).toHaveBeenCalledWith('/auth/login', {
        login: 'leo',
        senha: 'Senha@123',
      });
    });

    it('deve setar o usuário após login bem-sucedido', async () => {
      const store = useAuthStore();

      apiMock.post.mockResolvedValue({
        data: { access_token: 'tok', expires_in: 3600 },
      });
      apiMock.get.mockResolvedValue({
        data: { id: 1, nome: 'Leonardo', login: 'leo' },
      });

      store.userForm.login = 'leo';
      store.userForm.senha = 'Senha@123';
      await store.login();

      expect(store.user).toMatchObject({ id: 1, nome: 'Leonardo', login: 'leo' });
    });

    it('deve lançar erro e setar validate em caso de falha', async () => {
      const store = useAuthStore();

      apiMock.post.mockRejectedValue({
        response: { data: { errors: { login: ['Credenciais inválidas'] } } },
      });

      store.userForm.login = 'errado';
      store.userForm.senha = 'errada';

      await expect(store.login()).rejects.toBeDefined();
      expect(store.validate).toMatchObject({ login: ['Credenciais inválidas'] });
    });

    it('deve setar isLoading corretamente durante o processo', async () => {
      const store = useAuthStore();
      const loadingStates: boolean[] = [];

      apiMock.post.mockImplementation(async () => {
        loadingStates.push(store.isLoading);
        return { data: { access_token: 'tok', expires_in: 3600 } };
      });
      apiMock.get.mockResolvedValue({ data: { id: 1, nome: 'Leo', login: 'leo' } });

      store.userForm.login = 'leo';
      store.userForm.senha = '123456';
      await store.login();

      // Durante a chamada, isLoading deveria ter sido true
      expect(loadingStates).toContain(true);
      // Ao final, isLoading deve ser false
      expect(store.isLoading).toBe(false);
    });
  });

  describe('checkUser()', () => {
    it('deve retornar null se não houver token', async () => {
      const store = useAuthStore();
      const result = await store.checkUser();
      expect(result).toBeNull();
    });

    it('deve buscar o usuário se houver token', async () => {
      const store = useAuthStore();

      // Simula token via login
      apiMock.post.mockResolvedValue({
        data: { access_token: 'tok123', expires_in: 3600 },
      });
      apiMock.get.mockResolvedValue({
        data: { id: 2, nome: 'Maria', login: 'maria' },
      });

      store.userForm.login = 'maria';
      store.userForm.senha = '123';
      await store.login();

      const result = await store.checkUser();

      expect(result).toMatchObject({ id: 2, nome: 'Maria' });
    });
  });
});
