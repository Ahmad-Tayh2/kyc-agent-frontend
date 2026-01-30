import ActionButton from '@/components/shared/ActionButton';
import PhoneInput from '@/components/shared/PhoneInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';
import { useCountries } from '@/hooks/data/useAddress';
import { useInfinitePayoutLocations } from '@/hooks/data/usePayoutLocation';
import { usePayoutLocationFilters } from '@/hooks/data/usePayoutLocationFilters';
import { useCreateRecipientPayout } from '@/hooks/data/useRecipientPayout';
import { useCreateRecipientRemittanceMethod } from '@/hooks/data/useRecipientRemittanceMethods';
import { useRemittanceMethods as useRemittanceMethodsAvailability } from '@/hooks/data/useRemittanceAvailability';
import {
  useRemittanceMethods,
  useVerifyAccountInfo,
} from '@/hooks/data/useRemittanceMethod';
import type { PayoutLocation } from '@/types/payoutLocation/PayoutLocation';
import type { RemittanceMethodAvailability } from '@/types/remittanceAvailability';
import type { RemittanceMethod } from '@/types/remittanceMethod/RemittanceMethod';
import type { Country } from '@/types/shared/location';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: number;
  receiveCountryId: number | null;
  onMethodAdded: () => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  receiveCountryId,
  onMethodAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'remittance' | 'payout'>(
    'remittance',
  );

  // Remittance Method States
  const [selectedRmId, setSelectedRmId] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('');

  // Validation states
  const [accountNamePrefix, setAccountNamePrefix] = useState('');
  const [accountIdPrefix, setAccountIdPrefix] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'verified' | 'failed'
  >('pending');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for payout agent
  const [selectedPayoutId, setSelectedPayoutId] = useState<number | null>(null);

  // Local state for country filters
  const [rmCountryFilter, setRmCountryFilter] = useState<number | undefined>(
    receiveCountryId || undefined,
  );

  // API Hooks - Use new remittance availability endpoints for filtering by country
  const { data: remittanceMethodsData = [] } =
    useRemittanceMethodsAvailability(rmCountryFilter);

  // Get full remittance methods data with validator info
  const { data: fullRemittanceMethodsData } = useRemittanceMethods();

  const { data: countries } = useCountries();

  // Payout location filtering
  const { filtersString, updateCountryFilter, filters } =
    usePayoutLocationFilters();

  useEffect(() => {
    if (countries?.length && receiveCountryId) {
      const countryCode: string =
        countries?.find((c: Country) => c?.id === receiveCountryId)?.iso2 ?? '';
      if (countryCode) {
        updateCountryFilter([countryCode]);
      }
    }
  }, [receiveCountryId, countries]);
  const {
    data: payoutLocationsInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePayoutLocations(filtersString);

  // Flatten all pages into a single array
  const payoutLocationsData = React.useMemo(() => {
    if (!payoutLocationsInfiniteData) return { data: [] };
    const allData = payoutLocationsInfiniteData.pages.flatMap(
      (page) => page.data || [],
    );
    return { data: allData };
  }, [payoutLocationsInfiniteData]);

  const createRmMutation = useCreateRecipientRemittanceMethod();
  const createPayoutMutation = useCreateRecipientPayout();
  const verifyAccountMutation = useVerifyAccountInfo();

  // Transform countries for PhoneInput and filtering
  const countryPhoneOptions =
    countries?.map((country: Country) => ({
      label: country.name,
      value: country.phone_code,
      code: country.phone_code,
      countryCode: country.iso2,
    })) || [];

  // Country options for filtering - need both iso2 for payout and id for remittance
  const countryOptions =
    countries?.map((country: Country) => ({
      value: country.iso2,
      label: country.name,
    })) || [];

  const countryOptionsById =
    countries?.map((country: Country) => ({
      value: country.id.toString(),
      label: country.name,
    })) || [];

  // Set default country filter to recipient's country - Commented out as country filter is disabled
  // React.useEffect(() => {
  //   if (
  //     recipientData?.data?.address?.country?.id &&
  //     (countries?.length ?? 0) > 0
  //   ) {
  //     const recipientCountry = countries?.find(
  //       (country: Country) =>
  //         country.id === recipientData.data.address.country.id
  //     );
  //     if (recipientCountry?.iso2) {
  //       updateCountryFilter([recipientCountry.iso2]);
  //     }
  //   }
  // }, [
  //   recipientData?.data?.address?.country?.id,
  //   countries,
  //   updateCountryFilter,
  // ]);

  // Get selected method details - use full data for validator info
  const selectedMethod = fullRemittanceMethodsData?.data?.find(
    (rm: RemittanceMethod) => rm.id === selectedRmId,
  );

  const hasValidator = selectedMethod?.validator?.name;

  const rmOptions =
    remittanceMethodsData
      ?.filter(
        (rm: RemittanceMethodAvailability) =>
          !rm.name.toLowerCase().includes('cash') &&
          !rm.description.toLowerCase().includes('cash pickup'),
      )
      .map((rm: RemittanceMethodAvailability) => ({
        label: rm.name,
        value: rm.id.toString(),
      })) || [];

  const payoutOptions =
    payoutLocationsData?.data?.map((payout: PayoutLocation) => ({
      label: `${payout.business_name} - ${payout.address?.location || ''}, ${
        payout.address?.country || ''
      }`,
      value: payout.id.toString(),
    })) || [];

  // Validation function
  const handleVerifyAccount = async () => {
    if (
      !selectedRmId ||
      !phoneNumber ||
      !accountNamePrefix ||
      !accountIdPrefix ||
      !selectedMethod?.validator?.name
    ) {
      return;
    }

    setIsVerifying(true);
    try {
      const verificationRequest = {
        validation_type: selectedMethod.validator.name,
        service_data: {
          serviceCode: '00003',
          phoneNumber: `+${countryPhoneCode}${phoneNumber}`,
        },
        verification_data: {
          expected_account_name_prefix: accountNamePrefix,
          expected_account_id_prefix: accountIdPrefix,
        },
      };

      const response =
        await verifyAccountMutation.mutateAsync(verificationRequest);

      if (response.status && response.data.status === 'success') {
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Add method to recipient
  const handleAddToRecipient = async () => {
    if (!selectedRmId) return;

    setIsSubmitting(true);
    try {
      await createRmMutation.mutateAsync({
        recipient_id: recipientId,
        remittance_method_id: selectedRmId,
        account_number: accountNumber,
        phone_number: phoneNumber,
        country_phone_code: countryPhoneCode,
      });

      onMethodAdded();
      handleClose();
    } catch (error) {
      console.error('Error adding remittance method:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add payout agent
  const handleAddPayoutAgent = async () => {
    if (!selectedPayoutId) return;

    setIsSubmitting(true);
    try {
      await createPayoutMutation.mutateAsync({
        recipient_id: recipientId,
        payout_agent_id: selectedPayoutId,
      });

      onMethodAdded();
      handleClose();
    } catch (error) {
      console.error('Error adding payout agent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === 'payout') {
      await handleAddPayoutAgent();
    } else if (activeTab === 'remittance') {
      if (hasValidator && verificationStatus !== 'verified') {
        // For methods with validators, require verification first
        return;
      }
      await handleAddToRecipient();
    }
  };

  const handleClose = () => {
    setActiveTab('remittance');
    setSelectedRmId(null);
    setAccountNumber('');
    setPhoneNumber('');
    setCountryPhoneCode('');
    setAccountNamePrefix('');
    setAccountIdPrefix('');
    setVerificationStatus('pending');
    setIsVerifying(false);
    setIsSubmitting(false);
    setSelectedPayoutId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/15 bg-opacity-50'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 z-50'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Add Payment Method</h2>
          <button
            type='button'
            onClick={handleClose}
            className='p-1 hover:bg-gray-100 rounded'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tabs */}
        <div className='flex border-b'>
          <button
            type='button'
            onClick={() => setActiveTab('remittance')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'remittance'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mobile/Bank Method
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('payout')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'payout'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cash Pickup
          </button>
        </div>

        {/* Content */}
        <div className='p-4 space-y-4'>
          {activeTab === 'remittance' ? (
            <>
              {/* Country Filter for Remittance Methods */}
              <div className='space-y-2 mb-4'>
                <Label>Filter by Country</Label>
                <SearchableSelect
                  value={rmCountryFilter?.toString() || ''}
                  onChange={(value: string | number) => {
                    const countryId = value
                      ? parseInt(value.toString())
                      : undefined;
                    setRmCountryFilter(countryId);
                    // Reset selected method when changing country filter
                    setSelectedRmId(null);
                  }}
                  options={countryOptionsById}
                  placeholder='All countries'
                />
              </div>

              {/* Select Remittance Method */}
              <div className='space-y-2 mb-6'>
                <Label>Select Payment Method *</Label>
                <SearchableSelect
                  options={rmOptions}
                  value={selectedRmId?.toString() || ''}
                  onChange={(value) => {
                    setSelectedRmId(parseInt(value.toString()));
                    // Reset validation states when changing method
                    setVerificationStatus('pending');
                    setAccountNamePrefix('');
                    setAccountIdPrefix('');
                  }}
                  placeholder='Choose a payment method'
                />
              </div>

              {/* Show method details if selected */}
              {selectedMethod && (
                <div className='border rounded-lg p-4 space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4 border border-gray-300 rounded-full'></div>
                    <h4 className='font-medium text-gray-900'>
                      {selectedMethod.name}
                    </h4>
                  </div>

                  {/* Phone Number Input */}
                  <div className='space-y-2'>
                    <Label>Phone Number *</Label>
                    <PhoneInput
                      countryOptions={countryPhoneOptions}
                      selectedCountry={countryPhoneCode}
                      phoneNumber={phoneNumber}
                      onCountryChange={setCountryPhoneCode}
                      onPhoneChange={setPhoneNumber}
                      placeholder='Enter phone number'
                    />
                  </div>

                  {/* Account Number for non-validator methods */}

                  <div className='space-y-2'>
                    <Label>Account Number</Label>
                    <Input
                      type='text'
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder='Enter account number'
                    />
                  </div>

                  {/* Validation Section for methods with validators */}
                  {hasValidator && verificationStatus === 'pending' && (
                    <>
                      <div className='flex gap-2 items-end'>
                        <div className='flex-1 space-y-1'>
                          <Label className='text-xs'>
                            Account Name Prefix *
                          </Label>
                          <Input
                            className='h-8 text-xs'
                            value={accountNamePrefix}
                            onChange={(e) =>
                              setAccountNamePrefix(e.target.value)
                            }
                            placeholder='e.g., Joh'
                          />
                        </div>

                        <div className='flex-1 space-y-1'>
                          <Label className='text-xs'>Account ID Prefix *</Label>
                          <Input
                            className='h-8 text-xs'
                            value={accountIdPrefix}
                            onChange={(e) => setAccountIdPrefix(e.target.value)}
                            placeholder='e.g., 1-1'
                          />
                        </div>

                        <ActionButton
                          title={isVerifying ? 'Verifying...' : 'Verify'}
                          onClick={handleVerifyAccount}
                          buttonProps={{
                            disabled:
                              !phoneNumber ||
                              !accountNamePrefix ||
                              !accountIdPrefix ||
                              isVerifying,
                            className: 'h-8 px-3 text-xs',
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* Verification Success */}
                  {hasValidator && verificationStatus === 'verified' && (
                    <div className='p-3 bg-green-50 border border-green-200 rounded'>
                      <p className='text-green-800 text-sm'>
                        ✅ <strong>Account Verified Successfully!</strong>
                      </p>
                    </div>
                  )}

                  {/* Verification Failed */}
                  {hasValidator && verificationStatus === 'failed' && (
                    <div className='p-3 bg-red-50 border border-red-200 rounded'>
                      <p className='text-red-800 text-sm'>
                        ❌ <strong>Verification Failed:</strong> Please check
                        your details and try again.
                      </p>
                    </div>
                  )}

                  {/* Warning for non-validator methods */}
                  {!hasValidator && (
                    <div className='p-3 bg-yellow-50 border border-yellow-200 rounded'>
                      <p className='text-yellow-800 text-sm'>
                        ⚠️ <strong>No Validator Available:</strong> You are
                        adding this information at your own responsibility.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Country Filter */}
              <div className='space-y-2 mb-4'>
                <Label>Filter by Country</Label>
                <SearchableSelect
                  value={filters.country_codes?.[0] || ''}
                  onChange={(value: string | number) => {
                    const countryCode = value.toString();
                    updateCountryFilter(countryCode ? [countryCode] : []);
                  }}
                  options={countryOptions}
                  placeholder='Select a country to filter payout locations'
                />
              </div>

              {/* Payout Location Selection */}
              <div className='space-y-2 mb-6'>
                <Label>Select Payout Location *</Label>
                <SearchableSelect
                  options={payoutOptions}
                  value={selectedPayoutId?.toString() || ''}
                  onChange={(value) =>
                    setSelectedPayoutId(parseInt(value.toString()))
                  }
                  placeholder={
                    payoutLocationsData?.data?.length === 0
                      ? 'No payout locations available'
                      : 'Choose a payout location'
                  }
                  onLoadMore={fetchNextPage}
                  hasMore={hasNextPage}
                  isLoadingMore={isFetchingNextPage}
                />
                {payoutLocationsData?.data?.length === 0 && (
                  <p className='text-sm text-gray-500'>
                    No payout locations found. Try adjusting your filters.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className='flex justify-end space-x-2 p-4 border-t bg-gray-50'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (activeTab === 'remittance' &&
                (!selectedRmId ||
                  (hasValidator && verificationStatus !== 'verified'))) ||
              (activeTab === 'payout' && !selectedPayoutId)
            }
          >
            {isSubmitting ? 'Adding...' : 'Add Method'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;
