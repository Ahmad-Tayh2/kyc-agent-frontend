import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import SearchableSelect from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SummaryCard from './SummaryCard';

const ReviewStep: React.FC = () => {
  // Form state
  const [sourceOfFund, setSourceOfFund] = useState<string | number>('');
  const [reasonForTransfer, setReasonForTransfer] = useState<string | number>(
    ''
  );
  const [extraDetails, setExtraDetails] = useState('');
  const [transactionReference, setTransactionReference] = useState('');

  // Mock data - this should come from previous steps
  const recipientData = {
    name: 'Mohammad Imran',
    phone: '+91 7064137339',
    email: 'imran@gmail.com',
    address: 'Rajgangpur, 770017',
    country: 'India',
  };

  const deliveryData = {
    method: 'Cash Pickup',
    pickupLocation: '323, Metro line 3, New Delhi',
  };

  const summaryData = {
    sendingCustomer: 'John Doe',
    sendingCountryIso: 'USA',
    recipient: 'Mohammad Imran',
    recipientCountryIso: 'USA',
    remittanceMethod: 'Cash Pickup',
    sendingCountry: 'USA',
    receivingCountry: 'Europe',
    sendingAmount: '500.00 USD',
    exchangeRate: '1 USD = 0.95 EUR',
    feesAndCharges: '10.00 USD',
    commission: '10.00 USD',
    extraFees: '10.00 USD',
    recipientGets: '476.00 EUR',
    totalPayableAmount: '511.00 USD',
  };

  // Options for dropdowns
  const sourceOfFundOptions = [
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business Income' },
    { value: 'savings', label: 'Savings' },
    { value: 'investment', label: 'Investment Returns' },
    { value: 'other', label: 'Other' },
  ];

  const reasonForTransferOptions = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'business', label: 'Business Purpose' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className='p-6 space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content - Left Side */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Recipient Details and Delivery Options Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Recipient Details Card */}
            <div className='bg-white rounded-lg border p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Recipient Details
                </h3>
                <button className='flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium cursor-pointer'>
                  <Edit className='w-4 h-4 mr-1' />
                  Edit
                </button>
              </div>

              <hr className='my-3' />

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Name</span>
                  <span className='font-medium text-sm'>
                    {recipientData.name}
                  </span>
                </div>

                <hr className='my-3' />

                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Phone</span>
                  <span className='font-medium text-sm'>
                    {recipientData.phone}
                  </span>
                </div>

                <hr className='my-3' />

                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Email</span>
                  <span className='font-medium text-sm'>
                    {recipientData.email}
                  </span>
                </div>

                <hr className='my-3' />

                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Address</span>
                  <span className='font-medium text-sm'>
                    {recipientData.address}
                  </span>
                </div>

                <hr className='my-3' />

                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Country</span>
                  <span className='font-medium text-sm'>
                    {recipientData.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Options Card */}
            <div className='bg-white rounded-lg border p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Delivery Options
              </h3>
              <hr className='my-3 full-width' />
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Method</span>
                  <span className='font-medium text-sm'>
                    {deliveryData.method}
                  </span>
                </div>

                <hr className='my-3' />

                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Pickup Location</span>
                  <span className='font-medium text-sm'>
                    {deliveryData.pickupLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Source of Fund and Reason for Transfer Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Source of Fund */}
            <div>
              <SearchableSelect
                label='Source of fund'
                placeholder='Selected fund'
                options={sourceOfFundOptions}
                value={sourceOfFund}
                onChange={setSourceOfFund}
              />
            </div>

            {/* Reason for Transfer */}
            <div>
              <SearchableSelect
                label='Reason for transfer'
                placeholder='Selected reason'
                options={reasonForTransferOptions}
                value={reasonForTransfer}
                onChange={setReasonForTransfer}
              />
            </div>
          </div>

          {/* Extra Details */}
          <div className='space-y-4'>
            <Label className='text-sm font-medium'>Extra details</Label>
            <Textarea
              placeholder='Write here'
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              className='min-h-[120px] resize-none'
            />
          </div>

          {/* Transaction Reference */}
          <div className='space-y-4'>
            <Input
              placeholder='Enter description or reference for this transaction (optional)'
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        {/* Summary Card - Right Side */}
        <div className='lg:col-span-1'>
          <SummaryCard data={summaryData} />
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
