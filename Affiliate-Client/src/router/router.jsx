import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AdminLayout from "../RootLayout/AdminLayout";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Profile from "../AdminPages/Profile/Profile";
import MyDownline from "../AdminPages/MyDownline/MyDownline";
import Dashboard from "../AdminPages/Dashboard/Dashboard";
import MyAccount from "../AdminPages/MyAccount/MyAccount";
import MyReport from "../AdminPages/MyReport/MyReport";
import Management from "../AdminPages/Management/Management";
import MyReferLink from "../AdminPages/MyReferLink/MyReferLink";
import Withdraw from "../AdminPages/Withdraw/Withdraw";
import Banking from "../AdminPages/Banking/Banking";
import TransactionHistory from "../AdminPages/TransactionHistory/TransactionHistory";
import WithdrawRequest from "../AdminPages/WithdrawRequest/WithdrawRequest";
import SuperWithdrawBalance from "../AdminPages/SuperWithdrawBalance/SuperWithdrawBalance";
import WithdrawHistory from "../AdminPages/WithdrawHistory/WithdrawHistory";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "affiliate",
    element: <AdminLayout></AdminLayout>,
    children: [
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "my-downline",
        element: (
          <PrivateRoute>
            <MyDownline></MyDownline>
          </PrivateRoute>
        ),
      },
      {
        path: "my-account",
        element: (
          <PrivateRoute>
            <MyAccount></MyAccount>
          </PrivateRoute>
        ),
      },
      {
        path: "my-report",
        element: (
          <PrivateRoute>
            <MyReport></MyReport>
          </PrivateRoute>
        ),
      },
      {
        path: "management",
        element: (
          <PrivateRoute>
            <Management></Management>
          </PrivateRoute>
        ),
      },
      {
        path: "my-refer-link",
        element: (
          <PrivateRoute>
            <MyReferLink></MyReferLink>
          </PrivateRoute>
        ),
      },
      {
        path: "withdraw",
        element: (
          <PrivateRoute>
            <Withdraw></Withdraw>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "transaction-history",
        element: (
          <PrivateRoute>
            <TransactionHistory></TransactionHistory>
          </PrivateRoute>
        ),
      },
      {
        path: "banking",
        element: (
          <PrivateRoute>
            <Banking></Banking>
          </PrivateRoute>
        ),
      },
      {
        path: "withdraw-request",
        element: (
          <PrivateRoute>
            <WithdrawRequest></WithdrawRequest>
          </PrivateRoute>
        ),
      },
      {
        path: "super-withdraw",
        element: (
          <PrivateRoute>
            <SuperWithdrawBalance></SuperWithdrawBalance>
          </PrivateRoute>
        ),
      },
      {
        path: "withdraw-history",
        element: (
          <PrivateRoute>
            <WithdrawHistory></WithdrawHistory>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
