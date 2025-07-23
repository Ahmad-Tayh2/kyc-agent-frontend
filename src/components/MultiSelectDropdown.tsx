import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string | React.ReactElement;
}

interface MultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder = 'Select options',
  options,
  value = [],
  onChange,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // const handleSelectAll = () => {
  //   if (value.length === options.length) {
  //     onChange([]);
  //   } else {
  //     onChange(options.map((option) => option.value));
  //   }
  // };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === options.length) return 'All';
    if (value.length === 1) {
      const option = options.find((opt) => opt.value === value[0]);
      if (!option) return placeholder;

      // If the label is a JSX element, return a simplified string representation
      return typeof option.label === 'string' ? option.label : option.value; // Fallback to value if label is JSX
    }
    return `${value.length} selected`;
  };

  // const isAllSelected = value.length === options.length;
  // const isIndeterminate = value.length > 0 && value.length < options.length;

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <Label className='block text-sm font-medium text-gray-700'>
          {label}
        </Label>
      )}
      <Button
        variant='outline'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-[120px] justify-between h-[40px] bg-white border border-gray-300 rounded-md px-3 py-2 text-left',
          isOpen && 'border-blue-500 ring-1 ring-blue-500'
        )}
      >
        <span className={cn('truncate', value.length === 0 && 'text-gray-500')}>
          {getDisplayText()}
        </span>
        {isOpen ? (
          <ChevronUpIcon className='h-4 w-4 text-gray-400' />
        ) : (
          <ChevronDownIcon className='h-4 w-4 text-gray-400' />
        )}
      </Button>

      {isOpen && (
        <div className='absolute z-50 w-max mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          <div className='p-2'>
            {options.map((option) => (
              <div
                key={option.value}
                className='flex items-center space-x-2 py-2 px-1 hover:bg-gray-50 rounded cursor-pointer'
                onClick={() => handleOptionToggle(option.value)}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleOptionToggle(option.value)}
                  className='data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600'
                />
                <span className='text-sm text-gray-700'>
                  {typeof option.label === 'string'
                    ? option.label
                    : option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
