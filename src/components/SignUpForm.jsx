// src/components/SignUpForm.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // مسیر را بر اساس پروژه‌ات تنظیم کن
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("رمز عبور و تکرار آن یکسان نیست!");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ ساخت حساب کاربری در Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      const user = data.user;

      // 2️⃣ ذخیره اطلاعات اضافی کاربر در جدول users
      if (user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: user.id,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            country: formData.country,
            city: formData.city,
            address: formData.address,
            created_at: new Date(),
          },
        ]);

        if (insertError) throw insertError;
      }

      alert("ثبت‌نام با موفقیت انجام شد ✅");
      navigate("/dashboard");
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        city: "",
        address: "",
      });
    } catch (error) {
      console.error("❌ خطا در ثبت‌نام:", error);
      alert("خطا در ثبت‌نام: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">عضویت</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="نام و نام خانوادگی" className="border p-2 rounded" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="شماره تماس" className="border p-2 rounded" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ایمیل" className="border p-2 rounded" required />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="رمز عبور" className="border p-2 rounded" required />
        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="تأیید رمز عبور" className="border p-2 rounded" required />
        <input name="country" value={formData.country} onChange={handleChange} placeholder="کشور" className="border p-2 rounded" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="شهر" className="border p-2 rounded" />
        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="آدرس کامل" className="border p-2 rounded" rows="3" />
        <button type="submit" disabled={loading} className="bg-green-900 text-white py-2 rounded hover:bg-green-800">
          {loading ? "در حال ثبت..." : "ثبت نام"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
