import React from 'react';

/**
 * Reusable Button Component with consistent Tailwind styling
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} disabled - Disable button
 * @param {function} onClick - Click handler
 * @param {string} className - Additional custom classes
 * @param {ReactNode} children - Button content
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  children,
  ...props 
}) => {
  
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-10 py-3 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
