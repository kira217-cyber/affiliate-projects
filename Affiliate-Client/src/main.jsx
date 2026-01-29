import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'react-loading-skeleton/dist/skeleton.css';
import { RouterProvider } from "react-router";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from "./router/router.jsx";

// 🟢 TanStack Query import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// 🟢 নতুন QueryClient তৈরি করা হচ্ছে
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 🟢 QueryClientProvider দিয়ে পুরো App ঘিরে ফেলো */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={routes}></RouterProvider>
        <ToastContainer position="top-right" />
      </AuthProvider>

      {/* 🟢 ডেভেলপার টুল (React Query Devtools) — ডিবাগ করার জন্য */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
