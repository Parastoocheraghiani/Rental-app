import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import AddItemForm from "./components/AddItemForm";
import UserDashboard from "./components/UserDashboard";
import UserProfile from "./components/UserProfile";
import { supabase } from "./supabaseClient";

function HomeWithNavigation() {
  const navigate = useNavigate();
  return (
    <HomePage
      onLogin={() => navigate("/login")}
      onRegister={() => navigate("/signup")}
    />
  );
}

function App() {
  const [user, setUser] = useState(null);

  // 🧠 گرفتن کاربر فعلی از Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        console.log("✅ کاربر پیدا شد:", data.user);
        setUser(data.user);
      } else {
        console.log("⚠️ هیچ کاربری پیدا نشد:", error);
      }
    };

    getUser();

    // گوش دادن به تغییر وضعیت لاگین / خروج
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // فقط برای تست:
  console.log("🧠 User object in App:", user);

  return (
    <Router>
      <div dir="rtl" className="font-sans bg-green-50 min-h-screen text-right">
        <Header />

        <Routes>
          <Route path="/" element={<HomeWithNavigation />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />

          {/* 🟢 پاس دادن user به AddItemForm */}
          <Route
            path="/dashboard/items"
            element={<AddItemForm user={user} />}
          />

          <Route
            path="/dashboard/requests"
            element={
              <p className="p-10 text-green-900 text-xl">درخواست‌های شما</p>
            }
          />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-[70vh] text-green-900">
                <h2 className="text-3xl font-bold mb-3">صفحه پیدا نشد 😕</h2>
                <p className="text-lg">آدرس وارد شده اشتباه است.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
