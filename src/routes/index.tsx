import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import { DashboardLayout } from '../layouts/DashboardLayout';
import AuthPage from '@/pages/AuthPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import UserProfilePage from '@/pages/UserProfilePage';
import Loader from '@/components/Loader';
import CustomerFormPage from '@/pages/CustomerFormPage';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const SendRemittancePage = lazy(() => import('../pages/SendRemittancePage'));
const CustomersPage = lazy(() => import('../pages/CustomersPage'));
const RecipientsPage = lazy(() => import('../pages/RecipientsPage'));
const PayoutLocationsPage = lazy(() => import('../pages/PayoutLocationsPage'));
const TransfersPage = lazy(() => import('../pages/TransfersPage'));
const CommissionEarnedPage = lazy(
  () => import('../pages/CommissionEarnedPage')
);
const MoneyWithdrawalsPage = lazy(
  () => import('../pages/MoneyWithdrawalsPage')
);
const AddMoneyPage = lazy(() => import('../pages/AddMoneyPage'));
const AccountStatementsPage = lazy(
  () => import('../pages/AccountStatementsPage')
);
const MyWalletPage = lazy(() => import('../pages/MyWalletPage'));
const RemittanceCartPage = lazy(() => import('../pages/RemittanceCartPage'));
import CustomerFormsPage from '../pages/CustomerFormsPage';
const PaymentLinksPage = lazy(() => import('../pages/PaymentLinksPage'));
const SupportPage = lazy(() => import('../pages/SupportPage'));
const HelpPage = lazy(() => import('../pages/HelpPage'));

export const AppRoutes = () => (
  <Suspense
    fallback={
      <div className='h-screen w-screen'>
        <Loader />
      </div>
    }
  >
    <Routes>
      {/* Public customer form route */}
      <Route path='/customer-form/:token' element={<CustomerFormPage />} />

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.AUTH.LOGIN} element={<AuthPage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
        <Route
          path={ROUTES.AUTH.RESET_PASSWORD}
          element={<ResetPasswordPage />}
        />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<UserProfilePage />} />
          <Route
            path={ROUTES.SEND_REMITTANCE}
            element={<SendRemittancePage />}
          />
          <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
          <Route path={ROUTES.RECIPIENTS} element={<RecipientsPage />} />
          <Route
            path={ROUTES.PAYOUT_LOCATIONS}
            element={<PayoutLocationsPage />}
          />
          <Route path={ROUTES.TRANSFERS} element={<TransfersPage />} />
          <Route
            path={ROUTES.COMMISSION_EARNED}
            element={<CommissionEarnedPage />}
          />
          <Route
            path={ROUTES.MONEY_WITHDRAWALS}
            element={<MoneyWithdrawalsPage />}
          />
          <Route path={ROUTES.ADD_MONEY} element={<AddMoneyPage />} />
          <Route
            path={ROUTES.ACCOUNT_STATEMENTS}
            element={<AccountStatementsPage />}
          />
          <Route path={ROUTES.MY_WALLET} element={<MyWalletPage />} />
          <Route
            path={ROUTES.REMITTANCE_CART}
            element={<RemittanceCartPage />}
          />
          <Route path={ROUTES.CUSTOMER_FORMS} element={<CustomerFormsPage />} />
          <Route path={ROUTES.PAYMENT_LINKS} element={<PaymentLinksPage />} />
          <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
          <Route path={ROUTES.HELP} element={<HelpPage />} />
          <Route
            path='*'
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);
