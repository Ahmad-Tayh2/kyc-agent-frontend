import React from 'react';
import { DataTable } from '../components/DataTable';
import { useCustomerForm } from '@/hooks/customerForm';
import type { CustomerForm } from '@/types/customerForm/CustomerForm';
import copyIcon from '@/assets/icons/clipboard.svg';
import { Button } from '@/components/ui/button';
import CustomerFormDialog from '@/components/CustomerForm/CustomerFormDialog';

type CustomerFormTableData = {
  id: number;
  fullName: string;
  status: string;
  frontendFormUrl: string;
  createdAt: string;
};

const CustomerFormsPage: React.FC = () => {
  const { data: customerForms } = useCustomerForm();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      // You could add a toast notification here if you have a toast system
      console.log('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'valid_link':
        return 'Valid Link';
      case 'expired_link':
        return 'Expired Link';
      case 'successful_registration':
        return 'Successful Registration';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid_link':
        return 'text-green-600';
      case 'expired_link':
        return 'text-red-600';
      case 'successful_registration':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Prepare the data for the table
  const customerFormData: CustomerFormTableData[] = Array.isArray(customerForms)
    ? customerForms.map((item: CustomerForm) => ({
        id: item.id,
        fullName: `${item.first_name} ${item.last_name}`,
        status: item.status,
        frontendFormUrl: item.form_urls.frontend_form_url,
        createdAt: item.created_at,
      }))
    : [];

  // Define columns for the DataTable
  const columns = [
    {
      header: 'Full Name',
      accessorKey: 'fullName',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: { original: CustomerFormTableData } }) => (
        <span className={getStatusColor(row.original.status)}>
          {formatStatus(row.original.status)}
        </span>
      ),
    },
    {
      header: 'Frontend Form URL',
      accessorKey: 'frontendFormUrl',
      cell: ({ row }: { row: { original: CustomerFormTableData } }) => (
        <div>
          <span className='text-sm text-gray-600 break-all'>
            {row.original.frontendFormUrl}
          </span>
          <button
            onClick={() => copyToClipboard(row.original.frontendFormUrl)}
            className='p-1 hover:bg-gray-100 rounded ml-[10px] cursor-pointer group'
            title='Copy URL'
          >
            <img
              src={copyIcon}
              alt='Copy'
              className='w-4 h-4 group-hover:cursor-pointer'
              style={{ cursor: 'inherit' }}
            />
          </button>
        </div>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: { original: CustomerFormTableData } }) => {
        const date = new Date(row.original.createdAt);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <span>
            {formattedDate} {formattedTime}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: ({ row }: { row: { original: CustomerFormTableData } }) => {
        const renderActions = () => {
          switch (row.original.status) {
            case 'valid_link':
              return (
                <div className='flex gap-2'>
                  <button
                    onClick={() =>
                      console.log('Resend clicked for:', row.original.id)
                    }
                    className='text-[#00B386] hover:text-[#009973] underline text-sm'
                  >
                    RESEND
                  </button>
                </div>
              );
            case 'expired_link':
              return (
                <div className='flex gap-2'>
                  <button
                    onClick={() =>
                      console.log(
                        'Generate new link clicked for:',
                        row.original.id
                      )
                    }
                    className='text-[#00B386] hover:text-[#009973] underline text-sm'
                  >
                    GENERATE NEW LINK AND SEND IT
                  </button>
                </div>
              );
            case 'successful_registration':
              return (
                <div className='flex gap-2'>
                  <a
                    href={`/customer-forms/${row.original.id}`}
                    className='text-[#00B386] hover:text-[#009973] underline text-sm'
                  >
                    Customer Details
                  </a>
                </div>
              );
            default:
              return (
                <a
                  href={`/customer-forms/${row.original.id}`}
                  className='text-[#00B386] hover:text-[#009973] underline text-sm'
                >
                  View
                </a>
              );
          }
        };

        return <div>{renderActions()}</div>;
      },
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center p-2'>
        <h1 className='text-2xl font-bold'>Customer Forms</h1>
        <CustomerFormDialog trigger={<Button>Generate New Link</Button>} />
      </div>
      <div className='p-5'>
        <DataTable
          data={customerFormData}
          columns={columns}
          enablePagination={true}
          rowsPerPage={10}
          tableTitle='Customer Forms'
        />
      </div>
    </div>
  );
};

export default CustomerFormsPage;
