import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants/routes";
import DashboardIcon from "../../assets/icons/dashboard.svg?react";
import SendRemittanceIcon from "../../assets/icons/send-remittance.svg?react";
import CustomersIcon from "../../assets/icons/customers.svg?react";
import RecipientsIcon from "../../assets/icons/recipients.svg?react";
import PayoutLocationsIcon from "../../assets/icons/payout-locations.svg?react";
import TransfersIcon from "../../assets/icons/transfers.svg?react";
import CustomerFormsIcon from "../../assets/icons/customer-forms.svg?react";
import RemittanceCartIcon from "../../assets/icons/remittance-cart.svg?react";
import MyWalletIcon from "../../assets/icons/my-wallet.svg?react";
import AccountStatementsIcon from "../../assets/icons/account-statements.svg?react";
import AddMoneyIcon from "../../assets/icons/add-money.svg?react";
import MoneyWithdrawalsIcon from "../../assets/icons/money-withdrawals.svg?react";
import CommissionEarnedIcon from "../../assets/icons/commission-earned.svg?react";
import PaymentLinksIcon from "../../assets/icons/payment-links.svg?react";
import HelpIcon from "../../assets/icons/help.svg?react";
import SupportIcon from "../../assets/icons/support.svg?react";

export const Sidebar: React.FC<{
  mobileOpen?: boolean;
  onClose?: () => void;
}> = ({ mobileOpen = false, onClose }) => {
  const { t } = useTranslation("global");

  const navLinks = [
    {
      label: t("modules.navigation.dashboard"),
      to: ROUTES.DASHBOARD,
      icon: <DashboardIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.sendRemittance"),
      to: ROUTES.SEND_REMITTANCE.CREATE(),
      icon: <SendRemittanceIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.customers"),
      to: ROUTES.CUSTOMERS.LIST,
      icon: <CustomersIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.recipients"),
      to: ROUTES.RECIPIENTS.LIST,
      icon: <RecipientsIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.payoutLocations"),
      to: ROUTES.PAYOUT_LOCATIONS,
      icon: <PayoutLocationsIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.transfers"),
      to: ROUTES.TRANSFERS.LIST,
      icon: <TransfersIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.commissionEarned"),
      to: ROUTES.COMMISSION_EARNED,
      icon: <CommissionEarnedIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.moneyWithdrawals"),
      to: ROUTES.MONEY_WITHDRAWALS.LIST,
      icon: <MoneyWithdrawalsIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.addMoney"),
      to: ROUTES.ADD_MONEY,
      icon: <AddMoneyIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.accountStatements"),
      to: ROUTES.ACCOUNT_STATEMENTS,
      icon: <AccountStatementsIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.myWallet"),
      to: ROUTES.MY_WALLET,
      icon: <MyWalletIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.remittanceCart"),
      to: ROUTES.REMITTANCE_CART,
      icon: <RemittanceCartIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.customerForms"),
      to: ROUTES.CUSTOMER_FORMS,
      icon: <CustomerFormsIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.paymentLinks"),
      to: ROUTES.PAYMENT_LINKS.LIST,
      icon: <PaymentLinksIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.help"),
      to: ROUTES.HELP,
      icon: <HelpIcon color="inherit" />,
    },
    {
      label: t("modules.navigation.support"),
      to: ROUTES.SUPPORT,
      icon: <SupportIcon color="inherit" />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-white border-r shadow-sm z-20">
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 p-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-start gap-2 px-3 py-2 rounded-md transition-colors duration-150 font-medium ${
                      isActive ? "bg-primary text-white" : "hover:bg-muted"
                    }`
                  }
                  end
                >
                  {link?.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: mobileOpen ? "rgba(0,0,0,0.3)" : "transparent" }}
        onClick={onClose}
      >
        <aside
          className="absolute left-0 top-0 h-full w-64 bg-white border-r shadow-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center h-16 px-6 font-bold text-lg border-b">
            {t("modules.app.brand")}
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-6 py-2 rounded-l-full transition-colors duration-150 ${
                        isActive ? "bg-primary text-white" : "hover:bg-muted"
                      }`
                    }
                    end
                    onClick={onClose}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};
