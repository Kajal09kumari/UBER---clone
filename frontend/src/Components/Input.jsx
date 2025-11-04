import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  name,
  id,
  size = 'md',
  className = '',
  containerClassName = '',
  labelClassName = '',
  halfWidth = false,
  error = '',
  icon,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg',
  };

  const baseStyles = `bg-gray-50 rounded-xl border-2 transition-all duration-200 w-full
    ${error 
      ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
      : isFocused 
        ? 'border-primary-500 ring-2 ring-primary-500/20' 
        : 'border-gray-200 hover:border-gray-300'
    }
    focus:outline-none placeholder:text-gray-400`;
    
  const widthStyles = halfWidth ? 'w-1/2' : 'w-full';
  
  return (
    <motion.div 
      className={`mb-5 ${widthStyles} ${containerClassName}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label 
          htmlFor={inputId}
          className={`text-base font-semibold mb-2 block text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className={`${icon} text-lg`}></i>
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`
            ${baseStyles}
            ${sizeStyles[size] || sizeStyles.md}
            ${icon ? 'pl-12' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-error text-sm mt-1 flex items-center gap-1"
        >
          <i className="ri-error-warning-line"></i>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Input;
