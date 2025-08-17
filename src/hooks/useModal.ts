import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

/**
 * Custom hook for confirmation modal with promise-based API
 */
export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info' | 'success';
    resolve?: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback(
    (config: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      type?: 'warning' | 'danger' | 'info' | 'success';
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setModalConfig({ ...config, resolve });
        setIsOpen(true);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    modalConfig?.resolve?.(true);
    setIsOpen(false);
    setModalConfig(null);
  }, [modalConfig]);

  const handleCancel = useCallback(() => {
    modalConfig?.resolve?.(false);
    setIsOpen(false);
    setModalConfig(null);
  }, [modalConfig]);

  return {
    isOpen,
    modalConfig,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export default useModal;
