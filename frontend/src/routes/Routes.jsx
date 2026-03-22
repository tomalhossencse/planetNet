import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PlantDetails from "../pages/PlantDetails/PlantDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AddPlant from "../pages/Dashboard/Seller/AddPlant";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import Profile from "../pages/Dashboard/Common/Profile";
import Statistics from "../pages/Dashboard/Common/Statistics";
import MainLayout from "../layouts/MainLayout";
import MyInventory from "../pages/Dashboard/Seller/MyInventory";
import ManageOrders from "../pages/Dashboard/Seller/ManageOrders";
import MyOrders from "../pages/Dashboard/Customer/MyOrders";
import { createBrowserRouter } from "react-router";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "plant/:id",
        Component: PlantDetails,
      },
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Statistics />,
      },
      {
        path: "add-plant",
        element: <AddPlant />,
      },
      {
        path: "my-inventory",
        element: <MyInventory />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "manage-orders",
        element: <ManageOrders />,
      },
    ],
  },
]);
