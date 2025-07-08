import React from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/useAuth";
interface TopbarProps {
  onMenuClick?: () => void;
}
const UserMenu = () => {
  // const { handleLogout, user } = useAuth();
  const { mutateAsync: logoutAsync, status } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAsync();
      navigate(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menu: any[] = [
    {
      label: "Profile",
      icon: <ProfileIcon width={50} height={50} />,
      onClick: () => {},
      // link: "#",
    },
    {
      label: "Settings",
      icon: <SettingIcon />,
      onClick: () => {},
      // link: "#",
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      onClick: handleLogout,
      link: "",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="rounded-full border-1 border-[#E88D7D] bg-[#E88D7D] p-1 flex items-center justify-center">
              <Avatar className="bg-[#232728] w-9 h-9">
                <AvatarImage
                  src={userImage}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-[-10px] px-2 py-0 rounded-full bg-[#E88D7D] text-white text-xs font-semibold border-1 border-[#E88D7D] shadow-md z-1">
              Agent
            </div>
          </div>
          <ArrowDownIcon width={18} height={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3">
        {menu?.map((menuItem: any) => (
          <DropdownMenuItem
            className="h-[35px] hover:bg-primary/10"
            onClick={menuItem.onClick}
          >
            {menuItem?.link ? (
              <NavLink to={menuItem.link}>
                {menuItem.icon}
                <span className="text-[14px]">{menuItem.label}</span>
              </NavLink>
            ) : (
              <>
                {menuItem.icon}
                <span className="text-[14px]">{menuItem.label}</span>
              </>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between h-20 px-4 bg-secondary border-b shadow-sm">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
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
        <span className="font-bold text-xl">
          <Logo width={200} height={25} />
        </span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1 border-1 rounded-3xl py-2 px-3 text-background text-sm">
          <CalcIcon width={20} height={20} />

          <span>Simulate Transfer</span>
        </div>
        <NotificationIcon width={30} height={30} />
        <UserMenu />
      </div>
    </header>
  );
};
