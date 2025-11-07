// src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  CheckCircle,
  RotateCcw,
  User,
  Heart,
  Info,
  Clock,
  Wallet,
  Smile,
  ShieldCheck,
  FileCheck,
  Lock,
} from "lucide-react";

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟩 گرفتن اطلاعات کاربر و آیتم‌ها از Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("کاربر وارد نشده است.");
        navigate("/login");
        return;
      }

      try {
        // اطلاعات پروفایل کاربر
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserInfo(data);
      } catch (err) {
        console.error("❌ خطا در دریافت اطلاعات کاربر:", err);
      }
    };

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from("items").select("*");
        if (error) throw error;
        setUserItems(data);
      } catch (err) {
        console.error("❌ خطا در دریافت کالاها:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchItems();
  }, [navigate]);

  if (loading)
    return <p className="text-center mt-10 text-green-800">در حال بارگذاری...</p>;

  return (
    <div className="min-h-screen bg-green-50" dir="rtl">
      {/* ✅ هدر */}
      <div className="w-full bg-green-100 text-green-900 py-8 px-8 text-right shadow-sm border-b border-green-200">
        <h1 className="text-4xl font-extrabold tracking-wide">حساب کاربری من</h1>
        <p className="text-lg mt-2 opacity-80">
          {userInfo ?  `${userInfo.name || ""} 🌿` : "به حساب خود خوش آمدی 🌿"}
        </p>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-6 text-right">
        {/* ✅ کارت‌های بالای داشبورد */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <DashboardCard icon={<Cloud size={52} />} title="جاری" dark />
          <DashboardCard icon={<CheckCircle size={52} />} title="مرجوع شده" />
          <DashboardCard
            icon={<RotateCcw size={52} />}
            title="در انتظار مرجوعی"
            yellow
          />
        </div>

        {/* ✅ منوی اطلاعات */}
        <div
          className="flex flex-col gap-3 mb-10 text-right text-lg font-semibold"
          dir="rtl"
        >
          <MenuButton
            onClick={() => navigate("/dashboard/items")}
            icon={<User size={28} />}
            label="کالاهای من"
          />
          <MenuButton
            onClick={() => navigate("/dashboard/requests")}
            icon={<Heart size={28} />}
            label="استعلام‌ها"
          />
          <MenuButton
            onClick={() => navigate("/dashboard/profile")}
            icon={<Info size={28} />}
            label="اطلاعات حساب کاربری (پروفایل من)"
          />
        </div>

        {/* ✅ مزایا */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-16">
          <Feature icon={<Smile size={60} />} text="آسودگی خاطر" />
          <Feature icon={<Wallet size={60} />} text="صرفه‌جویی در هزینه‌ها" />
          <Feature icon={<Clock size={60} />} text="عدم وجود محدودیت زمانی" />
          <Feature icon={<ShieldCheck size={60} />} text="سیستم احراز هویت" />
          <Feature icon={<FileCheck size={60} />} text="مستندسازی سلامت کالا" />
          <Feature icon={<Lock size={60} />} text="اجاره امن با تضمین دیجیتال" />
        </div>
      </div>
    </div>
  );
};

// 🟢 کامپوننت‌های کمکی برای تمیزی کد
const DashboardCard = ({ icon, title, dark, yellow }) => (
  <div
    className={`${
      dark
        ? "bg-green-900 text-white"
        : yellow
        ? "bg-white border border-yellow-400 text-yellow-700"
        : "bg-white border border-green-300 text-green-800"
    } rounded-2xl flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105`}
    style={{ width: "280px", height: "280px", margin: "0 auto" }}
  >
    {icon}
    <p className="mt-3 font-extrabold text-2xl tracking-wide">{title}</p>
  </div>
);

const MenuButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-start gap-3 text-green-800 hover:underline"
  >
    {icon}
    {label}
  </button>
);

const Feature = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center text-green-900">
    <div className="bg-green-800 text-white p-3 rounded-full mb-3">{icon}</div>
    <p className="font-semibold text-lg">{text}</p>
  </div>
);

export default UserDashboard;