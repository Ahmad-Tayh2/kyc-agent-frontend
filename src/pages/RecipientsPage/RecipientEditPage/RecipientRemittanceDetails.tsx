import DeleteIcon from '@/assets/icons/delete.svg?react';
import EditIcon from '@/assets/icons/edit.svg?react';
import PlusIcon from '@/assets/icons/upload-icon.svg?react';
import ActionButton from '@/components/shared/ActionButton';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import PhoneInput from '@/components/shared/PhoneInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';
import { useCountries } from '@/hooks/data/useAddress';
import { usePayoutLocations } from '@/hooks/data/usePayoutLocation';
import { usePayoutLocationFilters } from '@/hooks/data/usePayoutLocationFilters';
import {
  useCreateRecipientPayout,
  useDeleteRecipientPayout,
  useRecipientPayouts,
} from '@/hooks/data/useRecipientPayout';
import {
  useCreateRecipientRemittanceMethod,
  useDeleteRecipientRemittanceMethod,
  useRecipientRemittanceMethods,
  useUpdateRecipientRemittanceMethod,
} from '@/hooks/data/useRecipientRemittanceMethods';
import { useRemittanceMethods } from '@/hooks/data/useRemittanceMethod';
import type { RecipientRemittanceMethod } from '@/types/recipientRemittanceMethod/RecipientRemittanceMethod';
import type { RecipientDataType } from '@/types/recipients';
import type { Country } from '@/types/shared/location';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RecipientRemittanceDetailsProps {
  data: RecipientDataType | null;
  editMode: boolean;
}

interface PayoutAgent {
  id: number;
  business_name: string;
  code: string;
  address: {
    location: string;
    country: string;
  };
  description?: string;
  enabled?: boolean;
}

export default function RecipientRemittanceDetails({
  data,
  editMode,
}: RecipientRemittanceDetailsProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedPayoutAgentId, setSelectedPayoutAgentId] = useState<
    number | null
  >(null);
  const [newMethodData, setNewMethodData] = useState({
    account_number: '',
    phone_number: '',
    country_phone_code: data?.country_phone_code || '+1',
  });

  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] =
    useState<RecipientRemittanceMethod | null>(null);
  const [editMethodData, setEditMethodData] = useState({
    account_number: '',
    phone_number: '',
    country_phone_code: '+1',
  });

  // Hooks
  const { data: countriesData } = useCountries();
  const { data: remittanceMethodsData } = useRemittanceMethods();
  const { data: recipientRemittanceMethods, refetch: refetchRecipientMethods } =
    useRecipientRemittanceMethods(data?.id || 0);

  // Get existing recipient payout agents
  const { data: recipientPayouts, refetch: refetchRecipientPayouts } =
    useRecipientPayouts(data?.id ? { recipient_id: data.id } : {});

  // Payout location filtering
  const { filtersString, updateCountryFilter, filters } =
    usePayoutLocationFilters();
  const { data: payoutLocationsResponse, isLoading: payoutLocationsLoading } =
    usePayoutLocations(filtersString);

  // Mutations
  const createMutation = useCreateRecipientRemittanceMethod();
  const updateMutation = useUpdateRecipientRemittanceMethod();
  const deleteMutation = useDeleteRecipientRemittanceMethod();
  const createPayoutMutation = useCreateRecipientPayout();
  const deletePayoutMutation = useDeleteRecipientPayout();

  const countries = React.useMemo(
    () => (countriesData as Country[]) || [],
    [countriesData]
  );
  const remittanceMethods = React.useMemo(
    () => remittanceMethodsData?.data || [],
    [remittanceMethodsData?.data]
  );
  const existingMethods = React.useMemo(
    () => recipientRemittanceMethods || [],
    [recipientRemittanceMethods]
  );
  const existingPayouts = React.useMemo(
    () => recipientPayouts?.data || [],
    [recipientPayouts?.data]
  );
  const payoutAgents = React.useMemo(
    () => payoutLocationsResponse?.data || [],
    [payoutLocationsResponse?.data]
  );

  // Set default country filter to recipient's country
  React.useEffect(() => {
    if (data?.address?.country?.id && countries.length > 0) {
      const recipientCountry = countries.find(
        (country) => country.id === data.address.country.id
      );
      if (recipientCountry?.iso2) {
        updateCountryFilter([recipientCountry.iso2]);
      }
    }
  }, [data?.address?.country?.id, countries, updateCountryFilter]);

  const countryOptions = React.useMemo(
    () =>
      countries.map((country) => ({
        value: country.iso2,
        label: country.name,
        iso2: country.iso2,
      })),
    [countries]
  );

  const countryPhoneOptions = React.useMemo(
    () =>
      countries.map((country) => ({
        value: country.phone_code,
        label: country.name,
        code: country.phone_code,
        countryCode: country.iso2,
      })),
    [countries]
  );

  const methodOptions = React.useMemo(
    () =>
      remittanceMethods.map((method: { id: number; name: string }) => ({
        value: method.id.toString(),
        label: method.name,
      })),
    [remittanceMethods]
  );

  const payoutAgentOptions = payoutAgents.map((agent: PayoutAgent) => ({
    value: agent.id.toString(),
    label: `${agent.business_name} - ${agent.address.location}, ${agent.address.country}`,
  }));

  const handleAddMethod = async () => {
    if (!selectedMethodId || !data?.id) return;

    try {
      await createMutation.mutateAsync({
        recipient_id: data.id,
        remittance_method_id: selectedMethodId,
        account_number: newMethodData.account_number || undefined,
        phone_number: newMethodData.phone_number || undefined,
        country_phone_code: newMethodData.country_phone_code || undefined,
      });

      toast.success('Remittance method added successfully!');
      setSelectedMethodId(null);
      setNewMethodData({
        account_number: '',
        phone_number: '',
        country_phone_code: data?.country_phone_code || '+1',
      });
      refetchRecipientMethods();
    } catch {
      toast.error('Failed to add remittance method');
    }
  };

  const handleAddPayoutAgent = async () => {
    if (!selectedPayoutAgentId || !data?.id) return;

    try {
      await createPayoutMutation.mutateAsync({
        recipient_id: data.id,
        payout_agent_id: selectedPayoutAgentId,
      });

      toast.success('Payout location added successfully!');
      setSelectedPayoutAgentId(null);
      refetchRecipientPayouts();
    } catch {
      toast.error('Failed to add payout location');
    }
  };

  const handleDeletePayoutAgent = async (payoutId: number) => {
    try {
      await deletePayoutMutation.mutateAsync(payoutId);
      toast.success('Payout location deleted successfully!');
      refetchRecipientPayouts();
    } catch {
      toast.error('Failed to delete payout location');
    }
  };

  const handleDeleteMethod = async (methodId: number) => {
    try {
      await deleteMutation.mutateAsync(methodId);
      toast.success('Remittance method deleted successfully!');
      refetchRecipientMethods();
    } catch {
      toast.error('Failed to delete remittance method');
    }
  };

  const handleEditMethod = (method: RecipientRemittanceMethod) => {
    setEditingMethod(method);
    setEditMethodData({
      account_number: method.account_number || '',
      phone_number: method.phone_number || '',
      country_phone_code: method.country_phone_code || '+1',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMethod) return;

    try {
      await updateMutation.mutateAsync({
        id: editingMethod.id,
        data: {
          account_number: editMethodData.account_number,
          phone_number: editMethodData.phone_number,
          country_phone_code: editMethodData.country_phone_code,
        },
      });
      toast.success('Remittance method updated successfully!');
      setEditModalOpen(false);
      setEditingMethod(null);
      refetchRecipientMethods();
    } catch {
      toast.error('Failed to update remittance method');
    }
  };

  const renderExistingMethod = (method: RecipientRemittanceMethod) => {
    return (
      <div key={method.id} className='bg-gray-50 rounded-lg p-4'>
        <div className='flex justify-between items-start mb-3'>
          <div className='flex items-center space-x-3'>
            <div className='w-4 h-4 border border-gray-300 rounded-full'></div>
            <div>
              <h4 className='font-medium text-gray-900'>
                {method.remittance_method?.name}
              </h4>
              <p className='text-sm text-gray-600'>
                {method.formatted_phone ||
                  `${method.country_phone_code}${method.phone_number}`}
                {method.account_number && ` • ${method.account_number}`}
              </p>
            </div>
          </div>
          {editMode && (
            <div className='flex space-x-2'>
              <button
                onClick={() => handleEditMethod(method)}
                className='text-primary p-1 hover:bg-gray-100 rounded'
                title='Edit remittance method'
              >
                <EditIcon className='w-4 h-4' />
              </button>
              <ConfirmationDialog
                trigger={
                  <button
                    className='text-red-500 p-1 hover:bg-gray-100 rounded'
                    title='Delete remittance method'
                    disabled={deleteMutation.isPending}
                  >
                    <DeleteIcon className='w-4 h-4' />
                  </button>
                }
                title='Delete Remittance Method'
                description='Are you sure you want to delete this remittance method? This action cannot be undone.'
                onConfirm={() => handleDeleteMethod(method.id)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderExistingPayoutAgent = (payout: {
    id: number;
    payout_agent?: {
      business_name: string;
      address?: {
        location: string;
        country: string;
      };
    };
  }) => {
    return (
      <div key={payout.id} className='bg-gray-50 rounded-lg p-4'>
        <div className='flex justify-between items-start mb-3'>
          <div className='flex items-center space-x-3'>
            <div className='w-4 h-4 border border-gray-300 rounded-full'></div>
            <div>
              <h4 className='font-medium text-gray-900'>
                {payout.payout_agent?.business_name}
              </h4>
              <p className='text-sm text-gray-600'>
                {payout.payout_agent?.address?.location},{' '}
                {payout.payout_agent?.address?.country}
              </p>
            </div>
          </div>
          {editMode && (
            <div className='flex space-x-2'>
              <ConfirmationDialog
                trigger={
                  <button
                    className='text-red-500 p-1 hover:bg-gray-100 rounded'
                    title='Delete payout location'
                    disabled={deletePayoutMutation.isPending}
                  >
                    <DeleteIcon className='w-4 h-4' />
                  </button>
                }
                title='Delete Payout Location'
                description='Are you sure you want to delete this payout location? This action cannot be undone.'
                onConfirm={() => handleDeletePayoutAgent(payout.id)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!data) {
    return <div className='space-y-6 p-5'>Loading...</div>;
  }

  return (
    <div className='space-y-6 p-5'>
      {/* Cash Pick up addresses section */}
      <div className='border border-dashed border-primary rounded-lg p-4'>
        <h3 className='text-lg font-medium mb-4'>Cash Pick up addresses</h3>

        {/* Show existing payout agents */}
        <div className='space-y-4 mb-6'>
          {existingPayouts.length > 0 ? (
            existingPayouts.map(renderExistingPayoutAgent)
          ) : (
            <p className='text-sm text-gray-500'>
              No cash pickup locations added yet.
            </p>
          )}
        </div>

        {editMode && (
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 text-primary'>
              <PlusIcon className='w-5 h-5' />
              <span className='font-medium'>Add New Pickup Location</span>
            </div>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Filter by Country</Label>
                <SearchableSelect
                  value={filters.country_codes?.[0] || ''}
                  onChange={(value: string | number) => {
                    const countryCode = value.toString();
                    updateCountryFilter(countryCode ? [countryCode] : []);
                  }}
                  options={countryOptions}
                  placeholder='Select a country to filter'
                />
              </div>

              <div className='space-y-2'>
                <Label>Select Payout Location</Label>
                <SearchableSelect
                  value={selectedPayoutAgentId?.toString() || ''}
                  onChange={(value: string | number) =>
                    setSelectedPayoutAgentId(parseInt(value.toString()))
                  }
                  options={payoutAgentOptions}
                  placeholder={
                    payoutLocationsLoading
                      ? 'Loading...'
                      : 'Select a payout location'
                  }
                  disabled={payoutLocationsLoading}
                />
              </div>

              <ActionButton
                title={
                  createPayoutMutation.isPending ? 'Adding...' : 'Add Location'
                }
                onClick={handleAddPayoutAgent}
                buttonProps={{
                  disabled:
                    !selectedPayoutAgentId || createPayoutMutation.isPending,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Wallet Account section */}
      <div className='border border-dashed border-primary rounded-lg p-4'>
        <h3 className='text-lg font-medium mb-4'>Remittance Methods</h3>

        {/* Existing Methods */}
        <div className='space-y-4 mb-6'>
          {existingMethods.length > 0 ? (
            existingMethods.map(renderExistingMethod)
          ) : (
            <p className='text-sm text-gray-500'>
              No remittance methods added yet.
            </p>
          )}
        </div>

        {/* Add New Method */}
        {editMode && (
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 text-primary'>
              <PlusIcon className='w-5 h-5' />
              <span className='font-medium'>Add New Remittance Method</span>
            </div>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Select Remittance Method *</Label>
                <SearchableSelect
                  value={selectedMethodId?.toString() || ''}
                  onChange={(value: string | number) =>
                    setSelectedMethodId(parseInt(value.toString()))
                  }
                  options={methodOptions}
                  placeholder='Select a payment method'
                />
              </div>

              {selectedMethodId && (
                <>
                  <div className='space-y-2'>
                    <Label>Phone Number</Label>
                    <PhoneInput
                      countryOptions={countryPhoneOptions}
                      selectedCountry={newMethodData.country_phone_code}
                      phoneNumber={newMethodData.phone_number}
                      onCountryChange={(countryCode) =>
                        setNewMethodData((prev) => ({
                          ...prev,
                          country_phone_code: `+${countryCode}`,
                        }))
                      }
                      onPhoneChange={(phoneNumber) =>
                        setNewMethodData((prev) => ({
                          ...prev,
                          phone_number: phoneNumber,
                        }))
                      }
                      placeholder='Enter phone number'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Account Number</Label>
                    <Input
                      value={newMethodData.account_number}
                      onChange={(e) =>
                        setNewMethodData((prev) => ({
                          ...prev,
                          account_number: e.target.value,
                        }))
                      }
                      placeholder='Enter account number'
                    />
                  </div>
                </>
              )}

              <ActionButton
                title={createMutation.isPending ? 'Adding...' : 'Add Method'}
                onClick={handleAddMethod}
                buttonProps={{
                  disabled: !selectedMethodId || createMutation.isPending,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Remittance Method Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Remittance Method</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>Method</Label>
              <Input
                value={editingMethod?.remittance_method?.name || ''}
                disabled
                className='bg-gray-50'
              />
            </div>

            <div className='space-y-2'>
              <Label>Phone Number</Label>
              <PhoneInput
                countryOptions={countryPhoneOptions}
                selectedCountry={editMethodData.country_phone_code}
                phoneNumber={editMethodData.phone_number}
                onCountryChange={(countryCode) =>
                  setEditMethodData((prev) => ({
                    ...prev,
                    country_phone_code: `+${countryCode}`,
                  }))
                }
                onPhoneChange={(phoneNumber) =>
                  setEditMethodData((prev) => ({
                    ...prev,
                    phone_number: phoneNumber,
                  }))
                }
                placeholder='Enter phone number'
              />
            </div>

            <div className='space-y-2'>
              <Label>Account Number</Label>
              <Input
                value={editMethodData.account_number}
                onChange={(e) =>
                  setEditMethodData((prev) => ({
                    ...prev,
                    account_number: e.target.value,
                  }))
                }
                placeholder='Enter account number'
              />
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                variant='outline'
                onClick={() => setEditModalOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
