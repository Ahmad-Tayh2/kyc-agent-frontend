import { ROUTES } from '@/constants/routes';
import type { Transfer } from '@/types/transfers';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import ActionButton from '../shared/ActionButton';

// Format date as YYYY-MM-DD HH:MM
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const draftTransfersTableColum = (): ColumnDef<Transfer>[] => {
  const [t] = useTranslation('global');
  const navigate = useNavigate();

  return [
    {
      accessorKey: 'customer',
      header: t('modules.pages.transfers.table.columns.customer'),
      cell: ({ row }) => {
        const customer = (row.original as any).customer;
        return (
          <span className='font-medium'>
            <Link
              to={ROUTES.CUSTOMERS.DETAILS(customer.id)}
              className='hover:underline'
            >
              {customer.first_name + ' ' + customer.last_name}
            </Link>
          </span>
        );
      },
    },
    {
      accessorKey: 'send_country',
      header: t('modules.pages.transfers.table.columns.send_country'),
      cell: ({ row }) => {
        const send_country = (row.original as any).send_country;
        return <span className='font-medium'>{send_country.name}</span>;
      },
    },
    {
      accessorKey: 'receive_country',
      header: t('modules.pages.transfers.table.columns.receive_country'),
      cell: ({ row }) => {
        const receive_country = (row.original as any).receive_country;
        return <span className='font-medium'>{receive_country.name}</span>;
      },
    },
    {
      accessorKey: 'recipient',
      header: t('modules.pages.transfers.table.columns.recipient'),
      cell: ({ row }) => {
        const recipient = (row.original as any).recipient;
        return (
          <span className='font-medium'>
            <Link
              to={ROUTES.RECIPIENTS.DETAILS(recipient.id)}
              className='hover:underline'
            >
              {recipient.first_name + ' ' + recipient.last_name}
            </Link>
          </span>
        );
      },
    },

    {
      accessorKey: 'remittance_method',
      header: t('modules.pages.transfers.table.columns.remittance_method'),
      cell: ({ row }) => {
        const remittance_method = (row.original as any).remittance_method;
        return (
          <span className='font-medium'>{remittance_method?.name || '-'}</span>
        );
      },
    },
    {
      accessorKey: 'account number',
      header: 'Account Number',
    },

    {
      accessorKey: 'sent_amount',
      header: 'Total to send',
      cell: ({ row }) => {
        const amount = row.getValue('sent_amount') as string;
        const currency = (row.original as any).send_currency;
        return (
          <span className='font-medium'>
            {amount} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: 'receive_amount',
      header: 'Recipient Gets',
      cell: ({ row }) => {
        const amount = row.getValue('receive_amount') as string;
        const currency = (row.original as any).receive_currency;
        return (
          <span className='font-medium'>
            {amount} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: 'sending_agent_commission_amount',
      header: t(
        'modules.pages.transfers.table.columns.sending_agent_commission_amount'
      ),
      cell: ({ row }) => {
        const amount = row.getValue(
          'sending_agent_commission_amount'
        ) as number;
        const currency = (row.original as any).send_currency;
        return (
          <span className='font-medium'>
            {amount} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: 'extra_fees_amount',
      header: t('modules.pages.transfers.table.columns.extra_fees_amount'),
      cell: ({ row }) => {
        const amount = row.getValue('extra_fees_amount') as number;
        const currency = (row.original as any).send_currency;
        return (
          <span className='font-medium'>
            {amount} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: 'total_payable_amount',
      header: 'Total To Pay',
      cell: ({ row }) => {
        const amount = row.getValue('total_payable_amount') as number;
        const currency = (row.original as any).send_currency;
        return (
          <span className='font-medium'>
            {amount} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Time',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string;
        return <span className='font-medium'>{formatDateTime(date)}</span>;
      },
    },
    {
      id: 'actions',
      header: t('modules.pages.transfers.table.columns.actions'),
      enableHiding: false,
      cell: ({ row }) => {
        const draftTransfer = row.original;
        return (
          <ActionButton
            type='link'
            title='Continue'
            onClick={() =>
              navigate(
                ROUTES.SEND_REMITTANCE.EDIT(draftTransfer.reference_number)
              )
            }
          />
        );
      },
    },
  ];
};
