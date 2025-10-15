import { Toaster as SonnerToaster } from 'sonner';

/**
 * Componente de Toast Notifications
 * Usar: import { toast } from 'sonner'
 * toast.success('Mensagem de sucesso')
 * toast.error('Mensagem de erro')
 * toast.info('Mensagem informativa')
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
        },
        className: 'shadow-lg',
      }}
    />
  );
}

export default Toaster;
