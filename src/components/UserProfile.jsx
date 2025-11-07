// ✅ src/components/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Pencil, Loader2 } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟢 دریافت اطلاعات کاربر
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage("لطفاً وارد حساب خود شوید ❌");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        setMessage("خطا در دریافت اطلاعات کاربر ❌");
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // 🟢 ذخیره تغییرات
  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase.from("users").update({
      name: user.name,
      phone: user.phone,
      country: user.country,
      city: user.city,
      address: user.address,
    }).eq("id", user.id);

    if (error) {
      setMessage("خطا در ذخیره تغییرات ❌");
      console.error(error);
    } else {
      setEditing(false);
      setMessage("✅ تغییرات ذخیره شد!");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // 🟢 آپلود عکس پروفایل
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      setUploading(true);

      const fileName = `${user.id}-${Date.now()}.jpg;`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: publicUrl });
      setMessage("✅ تصویر پروفایل به‌روزرسانی شد!");
    } catch (err) {
      console.error(err);
      setMessage("❌ خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        در حال بارگذاری اطلاعات...
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-20 text-red-600">
        کاربر یافت نشد ❌
      </p>
    );

  return (
    <div
      className="flex justify-center py-12 px-4 bg-[#f9f3ec] min-h-screen"
      dir="rtl"
    >
      <div className="bg-[#fffaf4] shadow-md rounded-3xl p-8 w-full max-w-3xl text-right relative">
        {message && (
          <div className="absolute top-3 right-3 bg-green-100 border border-green-700 text-green-900 px-4 py-2 rounded-lg text-sm shadow">
            {message}
          </div>
        )}

        {/* عکس پروفایل */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <label htmlFor="profile-pic" className="cursor-pointer relative">
              <img
                src={
                  user.avatar_url || "https://via.placeholder.com/100?text=Avatar"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-[#3d3a2f] object-cover"
              />
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
                  <Loader2 className="animate-spin text-[#3d3a2f]" size={28} />
                </span>
              )}
              <input
                id="profile-pic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <div>
              <h2 className="text-2xl font-bold text-[#3d3a2f]">
                {user.name || "بدون نام"}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="bg-[#2f5d3b] hover:bg-[#264e31] text-white px-6 py-2 rounded-xl transition flex items-center gap-2"
          >
            <Pencil size={18} />
            {editing ? "انصراف" : "ویرایش"}
          </button>
        </div>

        {/* فرم اطلاعات کاربری */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <Field label="نام" name="name" value={user.name} editable={editing} onChange={setUser} />
          <Field label="شماره تماس" name="phone" value={user.phone} editable={editing} onChange={setUser} />
          <Field label="کشور" name="country" value={user.country} editable={editing} onChange={setUser} />
          <Field label="شهر" name="city" value={user.city} editable={editing} onChange={setUser} />
          <Field label="آدرس" name="address" value={user.address} editable={editing} onChange={setUser} full />
        </div>

        {editing && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-[#2f5d3b] hover:bg-[#264e31] text-white px-6 py-2 rounded-xl transition"
            >
              ذخیره تغییرات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 🟢 کامپوننت فیلد ورودی
function Field({ label, name, value, editable, onChange, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-sm text-[#7c6d58] mb-1">{label}</p>
      {editable ? (
        <input
          className="border border-[#e0cdb2] bg-[#fffdf9] rounded-xl py-2 px-4 text-[#3d3a2f] focus:ring-2 focus:ring-[#2f5d3b] w-full"
          value={value || ""}
          onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
        />
      ) : (
        <div className="border border-[#e0cdb2] bg-[#fffdf9] rounded-xl py-2 px-4 text-[#3d3a2f] w-full">
          {value || "—"}
        </div>
      )}
    </div>
  );
}