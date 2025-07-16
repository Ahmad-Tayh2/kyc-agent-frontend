import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";
export default function DropdownMenuOptions(props: any) {
  const { trigger, menu } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 p-0">
        {menu?.map((menuItem: any) => (
          <DropdownMenuItem
            className="h-[35px] hover:bg-primary/5 cursor-pointer rounded-none p-2"
            onClick={menuItem.onClick}
            disabled={menuItem.isLoading}
            key={menuItem.label}
            asChild
          >
            {menuItem?.link ? (
              <NavLink to={menuItem.link}>
                <div className="flex items-center gap-2">
                  <div className="bg-[#e8f7f7] p-1.5 rounded-sm flex items-center justify-center">
                    {menuItem.icon}
                  </div>
                  <span className="text-[14px]">{menuItem.label}</span>
                </div>
              </NavLink>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-[#e8f7f7] p-1.5 rounded-sm flex items-center justify-center">
                  {menuItem.icon}
                </div>
                <span className="text-[14px]">{menuItem.label}</span>
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
