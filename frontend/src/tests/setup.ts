import { config } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach } from 'vitest';

// Ativa Pinia antes de cada teste
beforeEach(() => {
  setActivePinia(createPinia());
});

// Mock global do document.cookie para testes de cookie em jsdom
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Silencia warnings para testes
config.global.config.warnHandler = () => null;
