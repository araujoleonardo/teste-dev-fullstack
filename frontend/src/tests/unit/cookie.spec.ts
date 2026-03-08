import { describe, it, expect, beforeEach } from 'vitest';
import Cookie from '@/utils/cookie';

// Reseta os cookies antes de cada teste
beforeEach(() => {
  document.cookie = '';
});

describe('Cookie.add()', () => {
  it('deve adicionar um cookie', () => {
    Cookie.add('teste', 'valor');
    expect(document.cookie).toContain('teste=');
  });

  it('deve codificar o valor com encodeURIComponent', () => {
    Cookie.add('chave', 'valor com espaço');
    expect(document.cookie).toContain('valor%20com%20espa%C3%A7o');
  });
});

describe('Cookie.get()', () => {
  it('deve retornar o valor do cookie existente', () => {
    Cookie.add('usuario', 'leonardo');
    expect(Cookie.get('usuario')).toBe('leonardo');
  });

  it('deve retornar null para cookie inexistente', () => {
    expect(Cookie.get('cookie_que_nao_existe')).toBeNull();
  });

  it('deve retornar null quando não há cookies', () => {
    document.cookie = '';
    expect(Cookie.get('qualquer')).toBeNull();
  });
});

describe('Cookie.remove()', () => {
  it('deve remover o cookie existente', () => {
    Cookie.add('temp', 'valor');
    expect(Cookie.get('temp')).toBe('valor');
    Cookie.remove('temp');

    const val = Cookie.get('temp');
    expect(val === null || val === '').toBe(true);
  });
});

describe('Cookie.update()', () => {
  it('deve atualizar o valor de um cookie existente', () => {
    Cookie.add('versao', '1');
    Cookie.update('versao', '2');
    expect(Cookie.get('versao')).toBe('2');
  });
});
