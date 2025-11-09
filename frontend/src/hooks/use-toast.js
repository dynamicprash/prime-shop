import { useCallback } from 'react';

export const useToast = () => {
  const toast = useCallback(({ title, description }) => {
    const message = [title, description].filter(Boolean).join('\n\n');
    if (message) {
      window.alert(message);
    }
  }, []);

  return { toast };
};

