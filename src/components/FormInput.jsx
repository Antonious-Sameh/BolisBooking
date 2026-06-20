import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FormInput = ({ label, id, type = 'text', value, onChange, placeholder, required = false, error }) => {
  return (
    <div className="space-y-2 group">
      <Label 
        htmlFor={id} 
        className="text-sm font-bold text-slate-700 group-focus-within:text-primary transition-colors duration-200"
      >
        {label} {required && <span className="text-red-500 mr-0.5">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-13 px-4 rounded-xl text-slate-900 bg-white border border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all duration-200 shadow-sm placeholder:text-slate-400"
      />
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;