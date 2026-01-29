import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home/home/Home";
import PersonalCenterModal from "@/pages/PersonalCenterModal";
import Help from "@/pages/Help";
import Promotions from "@/pages/Promotions";
import SubmenuPage from "@/pages/SubmenuPage";
import PlayGame from "@/pages/PlayGame";
import DepositDetails from "@/components/PersonalCenterModal/Deposit/DepositDetails";
import PromotionDetails from "@/components/home/Promotions/PromotionDetails";
import OpayDeposit from "@/components/PersonalCenterModal/Deposit/OpayDeposit";
import OpayWithdraw from "@/components/PersonalCenterModal/Withdrawal/OpayWithdraw";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/promotions", element: <Promotions /> },
      { path: "promotion/:id", element: <PromotionDetails /> },
      { path: "/help", element: <Help /> },
      { path: "/information", element: <PersonalCenterModal /> },
      { path: "submenu/:submenu", element: <SubmenuPage /> },
      { path: "liveGame/:id", element: <PlayGame /> },
    ],
  },
  {
    path: "/deposit-details",
    element: <DepositDetails />,
  },
  {
    path: "/deposit/opay",
    element: <OpayDeposit />,
  },
  {
    path: "/withdraw/opay",
    element: <OpayWithdraw />,
  },
]);

export default router;
