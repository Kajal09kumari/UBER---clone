import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  fullWidth = false,
  size = 'large',
  disabled = false,
  onClick,
  className = '',
  loading = false,
  icon,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:active:scale-100';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 shadow-sm hover:shadow-md',
    success: 'bg-accent-green-500 text-white hover:bg-accent-green-600 focus:ring-accent-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-accent-yellow-500 text-gray-900 hover:bg-accent-yellow-600 focus:ring-accent-yellow-500 shadow-sm hover:shadow-md',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-gray-100 focus:ring-gray-400',
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const disabledStyles = disabled || loading
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${disabledStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {icon && !loading && <i className={icon}></i>}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
