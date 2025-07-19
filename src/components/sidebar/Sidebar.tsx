import React from "react";
import { NavLink } from "react-router-dom";
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

const navLinks = [
  {
    label: "Dashboard",
    to: ROUTES.DASHBOARD,
    icon: <DashboardIcon color="inherit" />,
  },
  {
    label: "Send Remittance",
    to: ROUTES.SEND_REMITTANCE,
    icon: <SendRemittanceIcon color="inherit" />,
  },
  {
    label: "Customers",
    to: ROUTES.CUSTOMERS.LIST,
    icon: <CustomersIcon color="inherit" />,
  },
  {
    label: "Recipients",
    to: ROUTES.RECIPIENTS,
    icon: <RecipientsIcon color="inherit" />,
  },
  {
    label: "Payout Locations",
    to: ROUTES.PAYOUT_LOCATIONS,
    icon: <PayoutLocationsIcon color="inherit" />,
  },
  {
    label: "Transfers",
    to: ROUTES.TRANSFERS,
    icon: <TransfersIcon color="inherit" />,
  },
  {
    label: "Commission Earned",
    to: ROUTES.COMMISSION_EARNED,
    icon: <CommissionEarnedIcon color="inherit" />,
  },
  {
    label: "Money Withdrawals",
    to: ROUTES.MONEY_WITHDRAWALS,
    icon: <MoneyWithdrawalsIcon color="inherit" />,
  },
  {
    label: "Add Money",
    to: ROUTES.ADD_MONEY,
    icon: <AddMoneyIcon color="inherit" />,
  },
  {
    label: "Account Statements",
    to: ROUTES.ACCOUNT_STATEMENTS,
    icon: <AccountStatementsIcon color="inherit" />,
  },
  {
    label: "My Wallet",
    to: ROUTES.MY_WALLET,
    icon: <MyWalletIcon color="inherit" />,
  },
  {
    label: "Remittance Cart",
    to: ROUTES.REMITTANCE_CART,
    icon: <RemittanceCartIcon color="inherit" />,
  },
  {
    label: "Customer Forms",
    to: ROUTES.CUSTOMER_FORMS,
    icon: <CustomerFormsIcon color="inherit" />,
  },
  {
    label: "Payment Links",
    to: ROUTES.PAYMENT_LINKS,
    icon: <PaymentLinksIcon color="inherit" />,
  },
  { label: "Help", to: ROUTES.HELP, icon: <HelpIcon color="inherit" /> },
  {
    label: "Support",
    to: ROUTES.SUPPORT,
    icon: <SupportIcon color="inherit" />,
  },
];

export const Sidebar: React.FC<{
  mobileOpen?: boolean;
  onClose?: () => void;
}> = ({ mobileOpen = false, onClose }) => {
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
            NomadRem
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
