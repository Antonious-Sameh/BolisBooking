import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FormSelect = ({ label, id, value, onChange, options, placeholder, required = false, error }) => {
  return (
    <div className="space-y-2 group">
      <Label 
        htmlFor={id} 
        className="text-sm font-bold text-slate-700 group-focus-within:text-primary transition-colors duration-200"
      >
        {label} {required && <span className="text-red-500 mr-0.5">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          id={id} 
          className="h-13 px-4 rounded-xl text-slate-900 bg-white border border-slate-200 hover:border-slate-300 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 shadow-sm text-right flex justify-between items-center"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-slate-100 bg-white shadow-xl max-h-[280px] p-1">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="py-3 px-4 rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary font-medium transition-colors duration-150 text-right"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;