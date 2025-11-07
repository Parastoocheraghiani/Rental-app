import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import AddItemForm from "./components/AddItemForm";
import UserDashboard from "./components/UserDashboard";
import UserProfile from "./components/UserProfile";
import { useEffect } from "react";
import { supabase } from "./supabaseClient";

// یک کامپوننت کوچک برای اتصال HomePage به navigate
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
  useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('❌ خطا در اتصال به Supabase:', error);
    } else {
      console.log('✅ اتصال موفق! داده نمونه:', data);
    }
  }

  testConnection();
}, []);
  return (
    <Router>
      <div dir="rtl" className="font-sans bg-green-50 min-h-screen text-right">
        {/* ✅ هدر کلی سایت */}
        <Header />

        {/* ✅ مسیرهای اصلی */}
        <Routes>
          {/* صفحه اصلی */}
          <Route path="/" element={<HomeWithNavigation />} />

          {/* عضویت و ورود */}
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* افزودن کالا */}
          <Route path="/add-item" element={<AddItemForm />} />

          {/* داشبورد */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* مسیرهای داخلی داشبورد */}
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route
            path="/dashboard/requests"
            element={<p className="p-10 text-green-900 text-xl">درخواست‌های شما</p>}
          />
          <Route
            path="/dashboard/items"
            element={<p className="p-10 text-green-900 text-xl">کالاهای شما</p>}
          />

          {/* صفحه 404 */}
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
