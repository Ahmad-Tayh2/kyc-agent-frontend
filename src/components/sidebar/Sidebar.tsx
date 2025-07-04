import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Send Remittance", to: "/send-remittance" },
  { label: "Customers", to: "/customers" },
  { label: "Recipients", to: "/recipients" },
  { label: "Payout Locations", to: "/payout-locations" },
  { label: "Transfers", to: "/transfers" },
  { label: "Commission Earned", to: "/commission-earned" },
  { label: "Money Withdrawals", to: "/money-withdrawals" },
  { label: "Add Money", to: "/add-money" },
  { label: "Account Statements", to: "/account-statements" },
  { label: "My Wallet", to: "/my-wallet" },
  { label: "Remittance Cart", to: "/remittance-cart" },
  { label: "Customer Forms", to: "/customer-forms" },
  { label: "Payment Links", to: "/payment-links" },
  { label: "Support", to: "/support" },
  { label: "Help", to: "/help" },
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
          <ul className="space-y-1 p-5 flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-5 py-1 rounded-md transition-colors duration-150 font-medium ${
                      isActive ? "bg-primary text-white" : "hover:bg-muted"
                    }`
                  }
                  end
                >
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
