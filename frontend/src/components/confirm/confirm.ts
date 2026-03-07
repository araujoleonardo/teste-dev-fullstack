import {createApp, h, type Ref, ref, watch} from 'vue';
import ConfirmDialog from "@/components/confirm/ConfirmDialog.vue";

const showConfirm = ({ title, message, button = {}, callback }: ConfirmDialogOptions): void => {
  const isOpen: Ref<boolean> = ref(true);

  const confirmInstance = createApp({
    setup() {
      return {
        isOpen,
        title,
        message,
        buttonYes: button.yes || 'Yes',
        buttonNo: button.no || 'Cancel',
      };
    },
    render() {
      return h(ConfirmDialog, {
        isOpen: this.isOpen,
        title: this.title,
        message: this.message,
        buttonYes: this.buttonYes,
        buttonNo: this.buttonNo,
        onConfirm: () => {
          callback(true);
          this.isOpen = false; // Close dialog
        },
        onCancel: () => {
          callback(false);
          this.isOpen = false; // Close dialog
        },
        'onUpdate:isOpen': (value: boolean) => {
          this.isOpen = value;
        },
      });
    },
  });

  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  confirmInstance.mount(mountNode);

  watch(isOpen, (newValue) => {
    if (!newValue) {
      confirmInstance.unmount();
      document.body.removeChild(mountNode);
    }
  });
};

export default showConfirm;
