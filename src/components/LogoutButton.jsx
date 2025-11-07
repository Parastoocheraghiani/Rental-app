import React from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      alert("👋 با موفقیت خارج شدی!");
      navigate("/login"); // یا مسیر صفحه ورودت
    } catch (error) {
      console.error("❌ خطا در خروج:", error);
      alert("مشکلی در خروج پیش آمد!");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
    >
      خروج از حساب
    </button>
  );
};

export default LogoutButton;
