interface ConfirmDialogOptions {
  title: string;
  message: string;
  button?: {
    yes?: string;
    no?: string;
  };
  callback: (confirmed: boolean) => void;
}
