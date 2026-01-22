import DatePicker from '@/components/shared/DatePicker';
import ErrorField from '@/components/shared/ErrorField';
import PhoneInput from '@/components/shared/PhoneInput';
import RadioInput from '@/components/shared/RadioInput';
import { SingleSelectDropdown } from '@/components/shared/SingleSelectDropdown';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';
import { genderOptions } from '@/constants/options';
import React from 'react';

interface RecipientBasicDetailsProps {
  formData: {
    customer_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    street_name: string;
    house_number: string;
    postal_code: string;
    city_id: string;
    country_id: string;
    gender: string;
    country_phone_code: string;
    phone_number: string;
  };
  handleInputChange: (field: string, value: any) => void;
  handleDateChange: (field: string, date: string) => void;
  customerOptions: Array<{ value: string; label: string }>;
  extraCustomerOption: { label: string; value: string };
  countryOptions: Array<{ value: string; label: string }>;
  cityOptions: Array<{ value: string; label: string }>;
  countryPhoneOptions: Array<{
    value: string;
    label: string;
    code: string;
    countryCode: string;
  }>;
  disableCstomerSelection?: boolean;
  validationErrors?: any;
}

const RecipientBasicDetails: React.FC<RecipientBasicDetailsProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  customerOptions,
  extraCustomerOption,
  countryOptions,
  cityOptions,
  countryPhoneOptions,
  validationErrors,
}) => {
  return (
    <div className='space-y-6 p-5'>
      {/* Add recipient details */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Add recipient details</h3>
        <SingleSelectDropdown
          label='Customer'
          placeholder='Select customer'
          options={customerOptions}
          extraOption={extraCustomerOption}
          selectedValue={formData.customer_id || ''}
          onValueChange={(value: string) =>
            handleInputChange('customer_id', value)
          }
          required
        />
      </div>

      {/* Recipient Details */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Recipient Details</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='first_name'>
              First Name<span className='text-red-500'>*</span>
            </Label>
            <Input
              id='first_name'
              name='first_name'
              placeholder='Enter first name'
              value={formData.first_name || ''}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
            />
            {validationErrors?.first_name && (
              <ErrorField errors={validationErrors?.first_name} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='last_name'>
              Last Name<span className='text-red-500'>*</span>
            </Label>
            <Input
              id='last_name'
              name='last_name'
              placeholder='Enter last name'
              value={formData.last_name || ''}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
            />
            {validationErrors?.last_name && (
              <ErrorField errors={validationErrors?.last_name} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='Enter email'
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {validationErrors?.email && (
              <ErrorField errors={[validationErrors?.email[0]]} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='date_of_birth'>
              Date of Birth<span className='text-red-500'>*</span>
            </Label>
            <DatePicker
              value={formData.date_of_birth || ''}
              onChange={(date: string) =>
                handleDateChange('date_of_birth', date)
              }
              disabledAfter={new Date()}
            />
            {validationErrors?.date_of_birth && (
              <ErrorField errors={[validationErrors?.date_of_birth[0]]} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]'>
              Gender<span className='text-red-500'>*</span>
            </Label>
            <RadioInput
              options={genderOptions}
              selectedValue={formData.gender}
              onSelectValue={(value: string) =>
                handleInputChange('gender', value)
              }
              // disabled={!editMode}
            />
            {validationErrors?.gender && (
              <ErrorField errors={[validationErrors?.gender[0]]} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='phone'>
              Phone Number<span className='text-red-500'>*</span>
            </Label>
            <PhoneInput
              phoneNumber={formData.phone_number || ''}
              selectedCountry={formData.country_phone_code || ''}
              onPhoneChange={(phone) =>
                handleInputChange('phone_number', phone)
              }
              onCountryChange={(countryCode) =>
                handleInputChange('country_phone_code', countryCode)
              }
              countryOptions={countryPhoneOptions}
              placeholder='Enter phone number'
            />
            {validationErrors?.phone_number && (
              <ErrorField errors={[validationErrors.phone_number[0]]} />
            )}
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Address Details</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='street_name'>
              Street Name<span className='text-red-500'>*</span>
            </Label>
            <Input
              id='street_name'
              name='street_name'
              placeholder='Enter street name'
              value={formData.street_name || ''}
              onChange={(e) => handleInputChange('street_name', e.target.value)}
            />
            {validationErrors?.street_name && (
              <ErrorField errors={[validationErrors?.street_name[0]]} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='house_number'>
              House Number<span className='text-red-500'>*</span>
            </Label>
            <Input
              id='house_number'
              name='house_number'
              placeholder='Enter house number'
              value={formData.house_number || ''}
              onChange={(e) =>
                handleInputChange('house_number', e.target.value)
              }
            />
            {validationErrors?.house_number && (
              <ErrorField errors={[validationErrors?.house_number[0]]} />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-[14px]' htmlFor='postal_code'>
              Postal Code
            </Label>
            <Input
              id='postal_code'
              name='postal_code'
              placeholder='Enter postal code'
              value={formData.postal_code || ''}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
            />
            {validationErrors?.postal_code && (
              <ErrorField errors={[validationErrors?.postal_code[0]]} />
            )}
          </div>

          <SearchableSelect
            label='Country'
            options={countryOptions}
            value={formData.country_id}
            onChange={(value) => {
              handleInputChange('country_id', value);
            }}
            required
            error={validationErrors?.country_id}
          />

          <SearchableSelect
            label='City'
            options={cityOptions}
            value={formData.city_id}
            onChange={(value) => handleInputChange('city_id', value)}
            disabled={!formData.country_id}
            required
            error={validationErrors?.city_id}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientBasicDetails;
