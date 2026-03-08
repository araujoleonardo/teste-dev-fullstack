import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppButton from '@/components/AppButton.vue';

describe('AppButton', () => {
  it('deve renderizar sem erros', () => {
    const wrapper = mount(AppButton);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('deve exibir o slot de texto', () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Salvar' },
    });
    expect(wrapper.text()).toContain('Salvar');
  });

  it('deve usar variant="primary" por padrão', () => {
    const wrapper = mount(AppButton);
    expect(wrapper.find('button').classes().join(' ')).toContain('from-orange-600');
  });

  it('deve aplicar a classe danger', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'danger' },
    });
    expect(wrapper.find('button').classes().join(' ')).toContain('from-red-600');
  });

  it('deve aplicar a classe secondary', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'secondary' },
    });
    expect(wrapper.find('button').classes().join(' ')).toContain('bg-white');
  });

  it('deve exibir "Carregando..." quando loading = true', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
    });
    expect(wrapper.text()).toContain('Carregando...');
  });

  it('deve desabilitar o botão quando loading = true', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
    });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('deve desabilitar o botão quando disabled = true', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true },
    });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('não deve exibir "Carregando..." quando loading = false', () => {
    const wrapper = mount(AppButton, {
      props: { loading: false },
      slots: { default: 'Enviar' },
    });
    expect(wrapper.text()).not.toContain('Carregando...');
    expect(wrapper.text()).toContain('Enviar');
  });

  it('deve aplicar w-full quando block = true', () => {
    const wrapper = mount(AppButton, {
      props: { block: true },
    });
    expect(wrapper.find('button').classes()).toContain('w-full');
  });

  it('não deve aplicar w-full quando block = false', () => {
    const wrapper = mount(AppButton, {
      props: { block: false },
    });
    expect(wrapper.find('button').classes()).not.toContain('w-full');
  });

  it('deve aplicar tamanho sm', () => {
    const wrapper = mount(AppButton, {
      props: { size: 'sm' },
    });
    expect(wrapper.find('button').classes().join(' ')).toContain('px-3');
  });

  it('deve aplicar tamanho lg', () => {
    const wrapper = mount(AppButton, {
      props: { size: 'lg' },
    });
    expect(wrapper.find('button').classes().join(' ')).toContain('px-8');
  });

  it('deve emitir click quando clicado e não desabilitado', async () => {
    const wrapper = mount(AppButton);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
