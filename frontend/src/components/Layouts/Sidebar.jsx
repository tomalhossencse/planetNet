import {
  BarChart3,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router";
const menuItems = [
  {
    id: "",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: "true",
    badge: "New",
    role: ["customer", "admin", "seller"],
  },
  // {
  //   id: "analytics",
  //   icon: BarChart3,
  //   label: "Analytics",
  //   role: ["user", "admin", "rider"],

  //   submenu: [
  //     {
  //       id: "overview",
  //       label: "Overview",
  //     },
  //     {
  //       id: "reports",
  //       label: "Reports",
  //     },
  //     {
  //       id: "insights",
  //       label: "Insights",
  //     },
  //   ],
  // },
  {
    id: "add-plant",
    icon: Package,
    label: "Add Plants",
    role: ["seller"],
  },
  {
    id: "my-inventory",
    icon: CreditCard,
    label: "My Inventory",
    role: ["seller"],
  },
  {
    id: "manage-orders",
    icon: Users,
    label: "Manage Orders",
    role: ["seller"],
  },
  {
    id: "manage-users",
    icon: UserCheck,
    label: "Manage Users",
    role: ["admin"],
  },
  {
    id: "seller-requests",
    icon: UserCheck,
    label: "Seller Requests",
    role: ["admin"],
  },
  {
    id: "profile",
    icon: UserCheck,
    label: "Profile",
    role: ["admin", "customer", "seller"],
  },
  {
    id: "my-orders",
    icon: UserCheck,
    label: "My Orders",
    role: ["customer"],
  },

  // {
  //   id: "users",
  //   icon: Users,
  //   label: "Users",
  //   count: "2.4k",
  //   role: ["user", "admin", "rider"],

  //   submenu: [
  //     {
  //       id: "all-users",
  //       label: "All Users",
  //     },
  //     {
  //       id: "roles",
  //       label: "Roles & Permissions",
  //     },
  //     {
  //       id: "activity",
  //       label: "User Activity",
  //     },
  //   ],
  // },
  // {
  //   id: "ecommerce",
  //   icon: ShoppingBag,
  //   label: "E-commerce",
  //   submenu: [
  //     {
  //       id: "products",
  //       label: "Products",
  //     },
  //     {
  //       id: "orders",
  //       label: "Orders",
  //     },
  //     {
  //       id: "customers",
  //       label: "Customers",
  //     },
  //   ],
  // },
  // {
  //   id: "inventory",
  //   icon: Package,
  //   label: "Inventory",
  //   count: "847",
  // },
  // {
  //   id: "transactions",
  //   icon: CreditCard,
  //   label: "Transactions",
  // },
  // {
  //   id: "messages",
  //   icon: MessageSquare,
  //   label: "Messages",
  //   badge: "12",
  // },
  // {
  //   id: "calendar",
  //   icon: Calendar,
  //   label: "Calendar",
  // },
  // {
  //   id: "reports",
  //   icon: FileText,
  //   label: "Reports",
  //   role: ["user", "admin", "rider"],
  // },
  // {
  //   id: "settings",
  //   icon: Settings,
  //   label: "Settings",
  //   role: ["user", "admin", "rider"],
  // },
];
const Sidebar = ({ collapsed, role, user, userRole, closeMobile }) => {
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]));
  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavLink = (hasSubmenu) => {
    if (!hasSubmenu && window.innerWidth < 1024) {
      closeMobile();
    }
  };

  return (
    <div
      className={`${collapsed ? "w-20" : "w-72"}  transition-all duration-500 ease-in-out md:bg-white/80 bg-white dark:bg-slate-900/80 backdrop:blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col  relative z-10 overflow-hidden`}
    >
      {/*a close button visible only on mobile */}
      <div className="lg:hidden absolute top-6 right-4">
        <button onClick={closeMobile} className="p-2 text-slate-500">
          <X />
        </button>
      </div>
      {/* logo */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>

          {/* conditional rendering */}
          {!collapsed && (
            <Link
              to="/"
              className={`transition-all duration-300 overflow-hidden ${
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                OpenShift
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userRole} Panel
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Navigations I will display dynamically menus*/}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems
          .filter((item) => item.role.includes(role))
          .map((item) => {
            return (
              <div key={item.id}>
                <NavLink
                  to={item.id === "" ? "/dashboard" : `/dashboard/${item.id}`}
                  end={item.id === ""}
                  className={({ isActive }) => `
            w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
            ${
              isActive && !item.submenu
                ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }
          `}
                  onClick={(e) => {
                    if (item.submenu) {
                      e.preventDefault();
                      toggleExpanded(item.id);
                    } else {
                      handleNavLink(false);
                    }
                  }}
                >
                  <div
                    className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}
                  >
                    <item.icon className={`w-5 h-5`} />

                    {/* Conditional Redering */}
                    {!collapsed && (
                      <>
                        <span
                          className={`font-medium ml-2 whitespace-nowrap transition-all duration-300 ${
                            collapsed
                              ? "opacity-0 w-0 overflow-hidden"
                              : "opacity-100"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`px-2 py-1 text-xs bg-red-500 text-white rounded-full transition-all duration-300 ${
                              collapsed
                                ? "opacity-0 w-0 overflow-hidden"
                                : "opacity-100"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {item.count && (
                          <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedItems.has(item.id) ? "rotate-180" : ""}`}
                    />
                  )}
                </NavLink>

                {/* display submenu */}
                {!collapsed && item.submenu && expandedItems.has(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subitem) => {
                      return (
                        <NavLink
                          key={subitem.id}
                          to={`/dashboard/${subitem.id}`}
                          className={({ isActive }) => `
                  block w-full text-left p-2 text-sm rounded-lg transition-all
                  ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }
                `}
                        >
                          {subitem.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      {/* User profile */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src={user?.photoURL}
              alt=""
              className="w-10 h-10 rounded-full ring-2 ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
