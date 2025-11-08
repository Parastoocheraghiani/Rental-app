import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AddItemForm = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price_per_day: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [myItems, setMyItems] = useState([]); // ✅ آیتم‌های خود کاربر

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ گرفتن کالاهای کاربر از دیتابیس
  const fetchMyItems = async () => {
    if (!user) return; // اگر هنوز لاگین نکرده
    console.log("🟢 در حال گرفتن کالاهای کاربر:", user.id);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ خطا در دریافت کالا:", error.message);
    } else {
      console.log("✅ کالاهای من:", data);
      setMyItems(data);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]); // هر وقت user تغییر کرد دوباره بخون

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("🧠 User object:", user);

    try {
      const { error } = await supabase.from("items").insert([
        {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          price_per_day: Number(formData.price_per_day),
          image_url: formData.image_url,
          available: true,
          owner_id: user?.id || null,
        },
      ]);

      if (error) throw error;

      alert("✅ کالا با موفقیت ثبت شد!");
      setFormData({
        title: "",
        category: "",
        description: "",
        price_per_day: "",
        image_url: "",
      });

      fetchMyItems(); // ✅ بعد از ثبت، لیست را بروز کن
    } catch (err) {
      console.error("❌ خطا در ثبت کالا:", err.message);
      alert("ثبت کالا ناموفق بود!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
        ثبت کالا برای اجاره
      </h2>

      {/* ✅ فرم ثبت کالا */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="نام کالا"
          className="border p-2 rounded text-right"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="border p-2 rounded text-right"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">انتخاب دسته‌بندی</option>
          <option value="ابزار و تجهیزات">🛠 ابزار و تجهیزات</option>
          <option value="دوربین و عکاسی">📷 دوربین و عکاسی</option>
          <option value="کمپینگ و سفر">🏕 کمپینگ و سفر</option>
          <option value="لباس و لوازم مجلسی">👗 لباس و لوازم مجلسی</option>
          <option value="لوازم خانگی">🏠 لوازم خانگی</option>
          <option value="تجهیزات مجالس">🎉 تجهیزات مجالس</option>
          <option value="دیجیتال و اداری">💻 دیجیتال و اداری</option>
          <option value="وسایل نقلیه">🚗 وسایل نقلیه</option>
          <option value="سرگرمی و آموزشی">🎮 سرگرمی و آموزشی</option>
        </select>

        <textarea
          name="description"
          placeholder="توضیحات کالا"
          className="border p-2 rounded text-right"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price_per_day"
          placeholder="قیمت اجاره (تومان در روز)"
          className="border p-2 rounded text-right"
          value={formData.price_per_day}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image_url"
          placeholder="آدرس تصویر کالا (URL)"
          className="border p-2 rounded text-right"
          value={formData.image_url}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-900 text-white py-2 rounded hover:bg-green-800 transition"
        >
          {loading ? "در حال ثبت..." : "ثبت کالا"}
        </button>
      </form>

      {/* ✅ لیست کالاهای ثبت‌شده */}
      <h3 className="text-xl font-bold text-green-900 mt-8 mb-3">
        کالاهای ثبت‌شده من
      </h3>
      {myItems.length === 0 ? (
        <p className="text-gray-600 text-center">هنوز کالایی ثبت نکرده‌اید.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="font-semibold mt-2 text-green-900">
                {item.title}
              </h4>
              <p className="text-sm text-gray-700">{item.category}</p>
              <p className="text-sm text-gray-500 mt-1">
                {item.price_per_day} تومان / روز
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddItemForm;
