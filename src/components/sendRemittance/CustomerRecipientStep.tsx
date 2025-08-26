import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import SearchableSelect from '@/components/ui/searchable-select';
import { useGetCustomers } from '@/hooks/data/useCustomers';
import { useRecipients } from '@/hooks/data/useRecipients';
import { useCountries } from '@/hooks/data/useAddress';
import { useRemittanceMethods } from '@/hooks/data/useRemittanceMethod';
import { useCustomerFilters } from '@/hooks/data/useCustomerFilters';
import { useRecipientsFilters } from '@/hooks/data/useRecipientsFilters';
import { ROUTES } from '@/constants/routes';
import type { CustomerType } from '@/types/customers';
import type { Country } from '@/services/address';

const CustomerRecipientStep: React.FC = () => {
  const navigate = useNavigate();
  const [isExpandedText, setIsExpandedText] = useState(false);

  // Form state
  const [customerSender, setCustomerSender] = useState<string | number>('');
  const [recipient, setRecipient] = useState<string | number>('');
  const [sendingCountry, setSendingCountry] = useState<string | number>('');
  const [receivingCountry, setReceivingCountry] = useState<string | number>('');
  const [remittanceMethods, setRemittanceMethods] = useState<string | number>(
    ''
  );

  // Customer filters
  const {
    filtersString: customerSearchFilter,
    updateSearchTerm: updateCustomerSearchTerm,
  } = useCustomerFilters();

  // Recipient filters
  const {
    filtersString: recipientSearchFilter,
    updateSearchTerm: updateRecipientSearchTerm,
  } = useRecipientsFilters();

  // Data hooks with search filters
  const { data: customers, isLoading: customersLoading } =
    useGetCustomers(customerSearchFilter);
  const { data: recipients, isLoading: recipientsLoading } = useRecipients(
    recipientSearchFilter
  );
  const { data: countries } = useCountries();
  const { data: remittanceMethodsData } = useRemittanceMethods();

  // Transform data for dropdowns
  const customerOptions =
    customers?.data?.map((customer: CustomerType) => ({
      label: `${customer.first_name} ${customer.last_name}`,
      value: customer.id.toString(),
    })) || [];

  const recipientOptions =
    recipients?.data?.map(
      (recipient: { id: string; first_name: string; last_name: string }) => ({
        label: `${recipient.first_name} ${recipient.last_name}`,
        value: recipient.id.toString(),
      })
    ) || [];

  const countryOptions =
    countries?.map((country: Country) => ({
      label: country.name,
      value: country.id.toString(),
    })) || [];

  const remittanceMethodOptions =
    remittanceMethodsData?.data?.map(
      (method: { id: string | number; name: string }) => ({
        label: method.name,
        value: method.id.toString(),
      })
    ) || [];

  const handleCreateRecipient = () => {
    navigate(ROUTES.RECIPIENTS.CREATE_FORM);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Customer/Sender and Recipient Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Customer/Sender */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Customer/Sender
          </label>
          <SearchableSelect
            options={customerOptions}
            value={customerSender}
            onChange={setCustomerSender}
            placeholder='Select an existing customer'
            loading={customersLoading}
            enableBackendSearch={true}
            onSearch={updateCustomerSearchTerm}
          />
        </div>

        {/* Recipient */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='block text-sm font-medium text-gray-700'>
              Recipient
            </label>
            <button
              onClick={handleCreateRecipient}
              className='text-sm text-teal-600 hover:text-teal-700 font-medium underline cursor-pointer'
            >
              CREATE A RECIPIENT
            </button>
          </div>
          <SearchableSelect
            options={recipientOptions}
            value={recipient}
            onChange={setRecipient}
            placeholder='Select an existing recipient'
            loading={recipientsLoading}
            enableBackendSearch={true}
            onSearch={updateRecipientSearchTerm}
          />

          {/* Expandable Text Section - directly under recipient field */}
          <div className='mt-2'>
            <button
              onClick={() => setIsExpandedText(!isExpandedText)}
              className='w-full text-left flex'
            >
              <span className='text-sm text-gray-600 underline cursor-pointer'>
                Search recipient for another customer and add it to the selected
                customer
              </span>
              {isExpandedText ? (
                <ChevronUpIcon className='ml-2 h-4 w-4 text-gray-500' />
              ) : (
                <ChevronDownIcon className='ml-2 h-4 w-4 text-gray-500' />
              )}
            </button>

            {isExpandedText && (
              <div className='mt-3 pt-3 border-gray-200'>
                <p className='text-sm text-gray-600'>
                  This functionality will allow you to search for recipients
                  from other customers and add them to the currently selected
                  customer. This feature will be implemented later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sending Country and Receiving Country Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Sending Country */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Sending country
          </label>
          <SearchableSelect
            options={countryOptions}
            value={sendingCountry}
            onChange={setSendingCountry}
            placeholder='Select sending country'
          />
        </div>

        {/* Receiving Country */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Receiving Country
          </label>
          <SearchableSelect
            options={countryOptions}
            value={receivingCountry}
            onChange={setReceivingCountry}
            placeholder='Serbia'
          />
        </div>
      </div>

      {/* Recipient's Remittance Methods */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700'>
          Recipient's Remittance Methods
        </label>
        <SearchableSelect
          options={remittanceMethodOptions}
          value={remittanceMethods}
          onChange={setRemittanceMethods}
          placeholder='Select recipient remittance methods'
        />
      </div>
    </div>
  );
};

export default CustomerRecipientStep;
