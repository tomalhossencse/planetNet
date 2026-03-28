import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";
import { Outlet } from "react-router";

function DashboardLayout2() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState("dashboard");
  const { user } = useAuth();
  const { role } = useRole();
  //   const userRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        {/* backdrop for mobile */}
        {mobileOpen && (
          <div
            className={`fixed inset-0 bg-black/50 backdrop:blur-sm z-40 lg:hidden`}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 flex`}
        >
          <Sidebar
            userRole={role}
            role={role}
            user={user}
            collapsed={sideBarCollapsed}
            closeMobile={() => setMobileOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            role={role}
            user={user}
            sideBarCollapsed={sideBarCollapsed}
            onToggleSideBar={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(!mobileOpen);
              } else {
                setSideBarCollapsed(!sideBarCollapsed);
              }
            }}
          />

          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="p-6 space-y-6">
              {/* {currentPage === "dashboard" && <Dashboard />} */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout2;
