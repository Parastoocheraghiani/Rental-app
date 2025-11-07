// src/components/LoginForm.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // مسیرت را درست تنظیم کن
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔑 دکمه ورود کلیک شد");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      alert("✅ ورود موفق بود!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ خطا در ورود:", error);
      alert("ایمیل یا رمز عبور اشتباه است یا کاربر وجود ندارد!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">ورود</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
          className="border p-2 rounded text-right"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="border p-2 rounded text-right"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-900 text-white py-2 rounded hover:bg-green-800"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

