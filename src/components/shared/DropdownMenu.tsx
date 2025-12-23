import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function DropdownMenuOptions({ trigger, menu }: any) {
  const [open, setOpen] = useState(false);

  const handleMenuItemClick = (item: any) => {
    // 1️⃣ Close dropdown menu first
    setOpen(false);

    // 2️⃣ Now run the action
    if (item.onClick) item.onClick();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-3 p-0">
        {menu.map((item: any) => (
          <DropdownMenuItem
            key={item.label}
            className="h-[35px] hover:bg-primary/5 cursor-pointer rounded-none p-2"
            disabled={item.isLoading}
            onClick={() => (item.link ? null : handleMenuItemClick(item))}
            asChild={!!item.link}
          >
            {item.link ? (
              <NavLink
                to={item.link}
                onClick={() => setOpen(false)} // close dropdown when navigating
              >
                <MenuItemUI item={item} />
              </NavLink>
            ) : (
              <MenuItemUI item={item} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuItemUI({ item }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#e8f7f7] p-1.5 rounded-sm flex items-center justify-center">
        {item.icon}
      </div>
      <span className="text-[14px]">{item.label}</span>
    </div>
  );
}
