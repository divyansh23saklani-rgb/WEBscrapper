import React from 'react';
import { AlertCircle } from 'lucide-react';
import { InputFieldProps } from '../types/merchant';

const InputField: React.FC<InputFieldProps> = ({ 
  name, 
  label, 
  type = "text", 
  required = false, 
  placeholder, 
  icon: Icon,
  value,
  onChange,
  fieldError,
  loading,
  multiple = false
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        name={name}
        type={type}
        required={required}
        onChange={onChange}
        className={`
          w-full ${Icon && type !== "file" ? "pl-10" : "pl-3"} pr-3 py-3 border-2 rounded-lg 
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 
          focus:border-blue-500 hover:border-gray-400
          ${fieldError 
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20" 
            : "border-gray-200 bg-white"
          }
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        `}
        placeholder={placeholder}
        disabled={loading}
        accept={type === "file" ? "image/*" : undefined}
        multiple={type === "file" ? multiple : undefined}
        {...(type !== "file" ? { value } : {})}
      />
    </div>
    {fieldError && (
      <div className="flex items-center text-sm text-red-600 mt-1 animate-in slide-in-from-left duration-200">
        <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
        {fieldError}
      </div>
    )}
  </div>
);

export default InputField;