import { MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
const recentOrders = [
  {
    id: "#3847",
    customer: "John Smith",
    product: 'MacBook Pro 16"',
    amount: "$2,399",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#3849",
    customer: "Michael Chen",
    product: "Sony WH-1000XM5",
    amount: "$348",
    status: "pending",
    date: "2024-01-16",
  },
  {
    id: "#3850",
    customer: "Emily Davis",
    product: "iPad Air",
    amount: "$599",
    status: "completed",
    date: "2024-01-17",
  },
  {
    id: "#3851",
    customer: "Robert Wilson",
    product: "Samsung S24 Ultra",
    amount: "$1,299",
    status: "cancelled",
    date: "2024-01-17",
  },

  {
    id: "#3855",
    customer: "Kevin Garcia",
    product: "Nintendo Switch OLED",
    amount: "$349",
    status: "pending",
    date: "2024-01-20",
  },
];

const topProducts = [
  {
    name: 'MacBook Pro 16"',
    sales: 1247,
    revenue: "$2,987,530",
    trend: "up",
    change: "+12%",
  },
  {
    name: "iPhone 15 Pro",
    sales: 2156,
    revenue: "$2,587,044",
    trend: "up",
    change: "+8%",
  },
  {
    name: "iPad Pro M2",
    sales: 984,
    revenue: "$1,081,416",
    trend: "down",
    change: "-3%",
  },
  {
    name: "Apple Watch Ultra",
    sales: 1542,
    revenue: "$1,232,058",
    trend: "up",
    change: "+15%",
  },
  {
    name: "AirPods Pro 2",
    sales: 342,
    revenue: "$851,829",
    trend: "up",
    change: "-20%",
  },
];
const TableSection = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* recent orders */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-xl  border border-slate-200/50  dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Recent Orders
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 ">
                Latest Customers Orders
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        {/* table */}
        <div className="overflow-x-auto px-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-white">
                  Order ID
                </th>

                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-white">
                  Customer
                </th>

                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-white">
                  Product
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-white">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-white">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-white">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50  dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm font-medium text-blue">
                        {order.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {order.customer}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {order.product}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {order.amount}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-slate-400 dark:text-white font-medium text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {order.date}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-sm  text-slate-800 dark:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* top products */}

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50  dark:border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Top Products
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 ">
              Best Performing Products
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>

        {/* dynamic data */}

        <div className="space-y-4 p-4">
          {topProducts.map((product, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {product.sales}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {product.revenue}
                  </p>
                  <div className="flex items-center space-x-1">
                    {product.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${product.trend === "up" ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {product.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableSection;
