import React from 'react';

/**
 * Reusable Input Component with consistent Tailwind styling
 * 
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {function} onBlur - Blur handler
 * @param {function} onClick - Click handler
 * @param {boolean} required - Required field
 * @param {boolean} disabled - Disabled state
 * @param {string} icon - Icon class name (e.g., 'ri-user-line')
 * @param {string} className - Additional custom classes
 * @param {string} label - Input label
 * @param {string} error - Error message
 */
const Input = ({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  onClick,
  required = false,
  disabled = false,
  icon = null,
  className = '',
  label = '',
  error = '',
  ...props 
}) => {
  
  const baseClasses = 'bg-gray-100 px-4 py-2.5 rounded-lg w-full border-2 border-transparent focus:border-green-500 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const errorClasses = error ? 'border-red-500 focus:border-red-500' : '';
  
  const iconPaddingClass = icon ? 'pl-12' : '';
  
  const combinedClasses = `
    ${baseClasses}
    ${errorClasses}
    ${iconPaddingClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <i className={`${icon} absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-600`}></i>
        )}
        
        <input
          type={type}
          className={combinedClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          required={required}
          disabled={disabled}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
