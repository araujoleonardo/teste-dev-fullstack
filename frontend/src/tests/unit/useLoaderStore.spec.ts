import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLoaderStore } from '@/store/useLoaderStore';

describe('useLoaderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  it('deve iniciar com isLoading = false', () => {
    const store = useLoaderStore();
    expect(store.isLoading).toBe(false);
  });

  it('deve setar isLoading = true ao chamar start()', () => {
    const store = useLoaderStore();
    store.start();
    expect(store.isLoading).toBe(true);
  });

  it('deve setar isLoading = false após stop() e MIN_VISIBLE_TIME', () => {
    const store = useLoaderStore();
    store.start();
    store.stop();
    // Avança o tempo além do MIN_VISIBLE_TIME (500ms)
    vi.advanceTimersByTime(600);
    expect(store.isLoading).toBe(false);
  });

  it('não deve parar o loader se ainda houver requisições ativas', () => {
    const store = useLoaderStore();
    store.start(); // req 1
    store.start(); // req 2
    store.stop();  // req 2 finaliza
    vi.advanceTimersByTime(600);
    // Ainda tem req 1 ativa, deve continuar carregando
    expect(store.isLoading).toBe(true);
  });

  it('deve parar quando todas as requisições são concluídas', () => {
    const store = useLoaderStore();
    store.start();
    store.start();
    store.stop();
    store.stop();
    vi.advanceTimersByTime(600);
    expect(store.isLoading).toBe(false);
  });

  it('activeRequests não deve ser negativo (stop() em excesso)', () => {
    const store = useLoaderStore();
    // Chamar stop sem start não deve criar contador negativo
    store.stop();
    store.stop();
    // Como activeRequests usa Math.max(0, ...), não deve lançar erro
    expect(store.isLoading).toBe(false);
  });
});
