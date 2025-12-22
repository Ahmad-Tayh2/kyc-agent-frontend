import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import PrivateRoute from "./PrivateRoute";

import Loader from "@/components/shared/Loader";
import AuthPage from "@/pages/AuthPage";
import CustomerFormPage from "@/pages/CustomerFormPage";
import PaymentCancelledPage from "@/pages/PaymentCancelledPage";
import PaymentFailedPage from "@/pages/PaymentFailedPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UserProfilePage from "@/pages/UserProfilePage";
import UserSettingsPage from "@/pages/UserSettingsPage";
import VerificationEmailPage from "@/pages/VerificationEmailPage";
import { DashboardLayout } from "../layouts/DashboardLayout";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const SendRemittancePage = lazy(() => import("../pages/SendRemittancePage"));
const CustomersPage = lazy(() => import("../pages/CustomersPage/CustomerList"));
const CustomerEditPage = lazy(
  () => import("../pages/CustomersPage/CustomerEditPage/CustomerEditPage")
);
const CustomerCreatePage = lazy(
  () => import("../pages/CustomersPage/CustomerCreatePage")
);
const CustomerCreateFormPage = lazy(
  () =>
    import("../pages/CustomersPage/CustomerCreatePage/CustomerCreateFormPage")
);

const RecipientCreateFormPage = lazy(
  () =>
    import("../pages/RecipientsPage/RecipientCreatePage/RecipientCreateForm")
);
const RecipientsPage = lazy(
  () => import("../pages/RecipientsPage/RecipientList")
);
const RecipientEditPage = lazy(
  () => import("../pages/RecipientsPage/RecipientEditPage")
);
const RecipientCreatePage = lazy(
  () => import("../pages/RecipientsPage/RecipientCreatePage")
);
const PayoutLocationsPage = lazy(() => import("../pages/PayoutLocationsPage"));
const TransfersPage = lazy(() => import("../pages/TransfersPage/TransferList"));
const TransfersDetailsPage = lazy(
  () => import("../pages/TransfersPage/TransfersDetails")
);
const CommissionEarnedPage = lazy(
  () => import("../pages/CommissionEarnedPage")
);
const MoneyWithdrawalsPage = lazy(
  () => import("../pages/MoneyWithdrawalsPage/MoneyWithdrawalList")
);

const RequestMoneyWithdrawalsPage = lazy(
  () => import("../pages/MoneyWithdrawalsPage/RequestMoneyWithdrawalsPage")
);

const AddMoneyPage = lazy(() => import("../pages/AddMoneyPage"));
const AccountStatementsPage = lazy(
  () => import("../pages/AccountStatementsPage")
);
const MyWalletPage = lazy(() => import("../pages/MyWalletPage"));
const RemittanceCartPage = lazy(() => import("../pages/RemittanceCartPage"));
const CustomerFormsPage = lazy(() => import("../pages/CustomerFormsPage"));
const PaymentPage = lazy(() => import("../pages/PaymentPage"));
const PaymentLinksPage = lazy(() => import("../pages/PaymentLinksPage"));
const PaymentLinkValidationPage = lazy(
  () => import("../pages/PaymentLinkValidation")
);
const SupportPage = lazy(() => import("../pages/SupportPage/IssueList"));
const SupportIssuePage = lazy(() => import("../pages/SupportPage/Issue"));
const HelpPage = lazy(() => import("../pages/HelpPage"));

export const AppRoutes = () => (
  <Suspense fallback={<Loader className="h-screen w-screen" />}>
    <Routes>
      {/* Public customer form route */}
      <Route path="/customer-form/:token" element={<CustomerFormPage />} />

      <Route path={ROUTES.AUTH.LOGIN} element={<AuthPage />} />
      <Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />
      <Route
        path={ROUTES.AUTH.RESET_PASSWORD}
        element={<ResetPasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.VERIFY_EMAIL}
        element={<VerificationEmailPage />}
      />

      {/* Payment routes - These should be public or protected based on your requirements */}
      <Route
        path="/payment/transaction/:transactionId"
        element={<PaymentPage />}
      />

      {/* Unified Payment Route */}
      <Route path="/payment/:token" element={<PaymentPage />} />

      <Route
        path={ROUTES.PAYMENT_LINKS.VALIDATION(":token")}
        element={<PaymentLinkValidationPage />}
      />

      {/* Payment callback routes */}
      <Route path={ROUTES.PAYMENT.SUCCESS} element={<PaymentSuccessPage />} />
      <Route path={ROUTES.PAYMENT.FAILED} element={<PaymentFailedPage />} />
      <Route
        path={ROUTES.PAYMENT.CANCELLED}
        element={<PaymentCancelledPage />}
      />

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<UserProfilePage />} />
          <Route
            path={ROUTES.SETTINGS.TAB(":tabKey")}
            element={<UserSettingsPage />}
          />
          <Route
            path={ROUTES.SETTINGS.DEFAULT}
            element={<UserSettingsPage />}
          />
          <Route
            path={ROUTES.SEND_REMITTANCE.CREATE()}
            element={<SendRemittancePage mode={"create"} />}
          />
          <Route
            path={ROUTES.SEND_REMITTANCE.EDIT(":reference_number")}
            element={<SendRemittancePage mode={"edit"} />}
          />
          {/* customers routes */}
          <Route path={ROUTES.CUSTOMERS.LIST} element={<CustomersPage />} />

          <Route
            path={ROUTES.CUSTOMERS.DETAILS(":id")}
            element={<CustomerEditPage />}
          />
          <Route
            path={ROUTES.CUSTOMERS.CREATE}
            element={<CustomerCreatePage />}
          />
          <Route
            path={ROUTES.CUSTOMERS.CREATE_FORM}
            element={<CustomerCreateFormPage />}
          />
          {/* recipients routes */}
          <Route path={ROUTES.RECIPIENTS.LIST} element={<RecipientsPage />} />
          <Route
            path={ROUTES.RECIPIENTS.DETAILS(":id")}
            element={<RecipientEditPage />}
          />
          <Route
            path={ROUTES.RECIPIENTS.CREATE}
            element={<RecipientCreatePage />}
          />
          <Route
            path={ROUTES.RECIPIENTS.CREATE_FORM}
            element={<RecipientCreateFormPage />}
          />

          <Route
            path={ROUTES.PAYOUT_LOCATIONS}
            element={<PayoutLocationsPage />}
          />
          <Route path={ROUTES.TRANSFERS.LIST} element={<TransfersPage />} />
          <Route
            path={ROUTES.TRANSFERS.DETAILS(":id")}
            element={<TransfersDetailsPage />}
          />

          <Route
            path={ROUTES.COMMISSION_EARNED}
            element={<CommissionEarnedPage />}
          />
          <Route
            path={ROUTES.MONEY_WITHDRAWALS.LIST}
            element={<MoneyWithdrawalsPage />}
          />
          <Route
            path={ROUTES.MONEY_WITHDRAWALS.REQUEST}
            element={<RequestMoneyWithdrawalsPage />}
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
          <Route
            path={ROUTES.PAYMENT_LINKS.LIST}
            element={<PaymentLinksPage />}
          />

          <Route path={ROUTES.SUPPORT.LIST} element={<SupportPage />} />
          <Route
            path={ROUTES.SUPPORT.ISSUE(":id")}
            element={<SupportIssuePage />}
          />

          <Route path={ROUTES.HELP} element={<HelpPage />} />
          <Route
            path="*"
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);
