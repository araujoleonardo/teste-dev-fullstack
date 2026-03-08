import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppInput from '@/components/AppInput.vue';

describe('AppInput', () => {
  it('deve renderizar sem erros', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '' },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('deve exibir a label quando fornecida', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', label: 'Nome' },
    });
    expect(wrapper.text()).toContain('Nome');
  });

  it('não deve exibir label quando não fornecida', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '' },
    });
    expect(wrapper.find('label').exists()).toBe(false);
  });

  it('deve exibir asterisco quando required = true', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', label: 'Campo', required: true },
    });
    expect(wrapper.text()).toContain('*');
  });

  it('não deve exibir asterisco quando required = false', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', label: 'Campo', required: false },
    });
    expect(wrapper.find('span.text-red-500').exists()).toBe(false);
  });

  it('deve renderizar com o type correto no input', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', type: 'password' },
    });
    expect(wrapper.find('input').attributes('type')).toBe('password');
  });

  it('deve usar type="text" por padrão', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '' },
    });
    expect(wrapper.find('input').attributes('type')).toBe('text');
  });

  it('deve emitir update:modelValue ao digitar', async () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '' },
    });
    await wrapper.find('input').setValue('novo valor');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['novo valor']);
  });

  it('deve exibir a mensagem de erro quando error é fornecido', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', error: 'Campo obrigatório' },
    });
    expect(wrapper.text()).toContain('Campo obrigatório');
  });

  it('não deve exibir mensagem de erro quando error não é fornecido', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '' },
    });
    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('deve aplicar class de erro na label quando error for fornecido', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', label: 'Email', error: 'Inválido' },
    });
    expect(wrapper.find('label').classes()).toContain('text-red-500');
  });

  it('deve ser desabilitado quando disabled = true', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', disabled: true },
    });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
  });

  it('deve aplicar placeholder quando fornecido', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', placeholder: 'Digite aqui...' },
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Digite aqui...');
  });

  it('deve respeitar o maxlength', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', maxlength: 50 },
    });
    expect(wrapper.find('input').attributes('maxlength')).toBe('50');
  });
});
