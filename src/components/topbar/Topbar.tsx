import React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userImage from "@/assets/images/image.png";
import Logo from "@/assets/logo.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import NotificationIcon from "@/assets/icons/notification.svg?react";
import CalcIcon from "@/assets/icons/calc.svg?react";
import ProfileIcon from "@/assets/icons/profile-icon.svg?react";
import SettingIcon from "@/assets/icons/settings-icon.svg?react";
import LogoutIcon from "@/assets/icons/logout-icon.svg?react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/data/useAuth";
import { useAuthStore } from "@/store/authStore";
interface TopbarProps {
  onMenuClick?: () => void;
}
const UserMenu = () => {
  const { t } = useTranslation("global");
  const { user, logout: logoutFromStore } = useAuthStore();
  const { mutateAsync: logoutAsync, status } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAsync();
      logoutFromStore();
      navigate(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menu = [
    {
      label: t("modules.topbar.profile"),
      icon: <ProfileIcon style={{ width: "25px", height: "25px" }} />,
      link: ROUTES.PROFILE,
    },
    {
      label: t("modules.topbar.settings"),
      icon: <SettingIcon style={{ width: "25px", height: "25px" }} />,
      link: ROUTES.SETTINGS.DEFAULT,
    },
    {
      label: t("modules.topbar.logout"),
      icon: <LogoutIcon style={{ width: "25px", height: "25px" }} />,
      onClick: handleLogout,
      isLoading: status === "pending",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className="rounded-full border-1 border-[#E88D7D] bg-[#E88D7D] p-1 flex items-center justify-center">
              <Avatar className="w-8 h-8 sm:w-9 sm:h-9 bg-[#232728]">
                <AvatarImage src={userImage} className="object-cover" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            {/* Username hidden on mobile */}

            <div className="hidden sm:block mt-[-10px] px-2 py-0 rounded-full bg-[#E88D7D] text-white text-xs font-semibold border-1 border-[#E88D7D] shadow-md z-1">
              {/* {t("modules.topbar.agent")} */}
              {user?.first_name} {user?.last_name}
            </div>
          </div>

          {/* Arrow hidden on very small screens */}
          <ArrowDownIcon className="hidden sm:block w-4 h-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-3 z-52">
        {menu.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={item.isLoading}
            onClick={item.onClick}
            asChild={!!item.link}
            className="h-[35px] hover:bg-primary/5 cursor-pointer"
          >
            {item.link ? (
              <NavLink to={item.link} className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ) : (
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { t } = useTranslation("global");

  return (
    <header className="sticky top-0 z-5 flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6 bg-secondary border-b shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-2">
        {/* Mobile menu */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-900 text-white"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <Logo className="w-32 sm:w-44 lg:w-52 h-auto" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Simulate transfer */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border px-4 py-2 text-background text-sm">
          <CalcIcon className="w-5 h-5" />
          <span>{t("modules.topbar.simulateTransfer")}</span>
        </div>

        {/* Icon-only version for mobile */}
        <button className="sm:hidden p-2 rounded-full hover:bg-gray-100">
          <CalcIcon className="w-5 h-5" />
        </button>

        <NotificationIcon className="w-6 h-6 sm:w-7 sm:h-7" />

        <UserMenu />
      </div>
    </header>
  );
};
