import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen w-full flex-col">
      <Topbar onMenuClick={() => setSidebarOpen((prev: boolean) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto bg-[#eeeff3] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
