import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  onSearch?: (searchTerm: string) => void; // New prop for backend search
  enableBackendSearch?: boolean; // Flag to enable backend search
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled = false,
  loading = false,
  required = false,
  onSearch,
  enableBackendSearch = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [t] = useTranslation('global');

  // Find selected option based on value
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  // Filter options based on search term (local or backend search)
  const filteredOptions = enableBackendSearch
    ? options // When using backend search, show all options returned from API
    : options?.filter((option) =>
        option?.label?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );

  // Trigger backend search when search term changes (with backend search enabled)
  useEffect(() => {
    if (enableBackendSearch && onSearch && searchTerm !== '') {
      onSearch(searchTerm);
    }
  }, [searchTerm, enableBackendSearch, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className='flex flex-col gap-1 mb-4' ref={containerRef}>
      <Label className='text-[14px] font-medium'>
        {label}
        {required && <span className='text-red-500'>*</span>}
      </Label>
      <div className='relative'>
        <Input
          type='text'
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ''}
          onChange={(e) => {
            if (isOpen) {
              setSearchTerm(e.target.value);
            }
          }}
          onClick={handleInputClick}
          // onFocus={() => {
          // if (!disabled) {
          //   setIsOpen(true);
          //   setSearchTerm("");
          // }
          // }}
          disabled={disabled}
          className='cursor-pointer'
        />
        <ChevronDownIcon
          className={cn(
            'absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />

        {isOpen && (
          <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
            {loading ? (
              <div className='px-3 py-2 text-sm text-gray-500'>
                {t('common.messages.loading')}
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className='px-3 py-2 text-sm text-gray-500'>
                {t('common.messages.noOptionsFound')}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between',
                    selectedOption?.value === option.value && 'bg-blue-50'
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <CheckIcon className='h-4 w-4 text-blue-600' />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <span className='text-destructive text-xs'>{error}</span>}
    </div>
  );
};

export default SearchableSelect;
