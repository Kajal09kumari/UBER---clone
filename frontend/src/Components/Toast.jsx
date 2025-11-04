import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: 'bg-accent-green-500 text-white',
    error: 'bg-error text-white',
    warning: 'bg-accent-yellow-500 text-gray-900',
    info: 'bg-info text-white',
  };

  const icons = {
    success: 'ri-checkbox-circle-line',
    error: 'ri-error-warning-line',
    warning: 'ri-alert-line',
    info: 'ri-information-line',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 safe-top"
        >
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-strong ${typeStyles[type]} min-w-[280px]`}
          >
            <i className={`${icons[type]} text-xl`}></i>
            <p className="font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto hover:opacity-80 transition-opacity"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for easier toast management
export const useToast = () => {
  const [toast, setToast] = React.useState({
    isVisible: false,
    message: '',
    type: 'info',
  });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return { toast, showToast, hideToast };
};

export default Toast;
