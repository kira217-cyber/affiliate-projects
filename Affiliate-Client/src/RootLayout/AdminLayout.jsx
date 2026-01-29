import React, { useContext, useEffect } from "react";
import Sidebar from "../AdminComponents/Shared/Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// TanStack Query দিয়ে ডাটা লোড
const fetchSiteSettings = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-site-settings`);
  return res.data;
};

const AdminLayout = () => {

  const { user, logout } = useContext(AuthContext);
  const { data, isLoading, error } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: fetchSiteSettings,
    staleTime: 1000 * 60 * 5, // 5 মিনিট
    cacheTime: 1000 * 60 * 10, // 10 মিনিট
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Title + Favicon Update
  useEffect(() => {
    if (data?.title) {
      document.title = data.title;
    }

    if (data?.favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      // Cache busting + realtime update
      link.href = `${import.meta.env.VITE_API_URL}${data.favicon}?t=${Date.now()}`;
    }
  }, [data]);

  // Loading fallback
  useEffect(() => {
    if (isLoading) {
      document.title = "Loading...";
    }
    if (error) {
      document.title = "Rajabaji - Best Online Casino";
    }
  }, [isLoading, error]);

  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.isActive === false) {
      toast.warning("Your account has been deactivated.");
      logout(); // Call your existing logout function
      navigate("/login");
    }
  }, [user, logout, navigate]);
  return (
    <div>
      <Sidebar></Sidebar>
    </div>
  );
};

export default AdminLayout;
