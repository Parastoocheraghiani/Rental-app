// src/components/HomePage.jsx
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  MoreVertical,
  ChevronDown,
  Clock,
  ShieldCheck,
  Wallet,
  Heart,
  CheckCircle,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import pan from "../assets/pan.jpg";
import tv from "../assets/tv.jpg";
import garden from "../assets/garden.jpg";
import laptop from "../assets/laptop.jpg";
import HeroSection from "./HeroSection";

// === تنظیمات Supabase — اگر کلاینت رو جای دیگری می‌سازی فقط اینجا رو عوض کن ===
const supabaseUrl = "https://atggpdceswwcfujmjxag.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0Z2dwZGNlc3d3Y2Z1am1qeGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDYxNDUsImV4cCI6MjA3ODA4MjE0NX0.FXQvRhyvKVFobFTvqGmM1iL3tduk8_KUhGC7z0n_yv0";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// ==================================================================

export default function HomePage({ onLogin, onRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [items, setItems] = useState([]); // آیتم‌هایی که فعلاً نمایش داده می‌شوند
  const [loading, setLoading] = useState(false);

  // گرفتن جدیدترین آیتم‌ها برای صفحه اصلی (بدون فیلتر)
  const fetchLatestItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("خطا در دریافت جدیدترین کالاها:", err.message || err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // گرفتن کالاها بر اساس زیر‌دسته (فیلتر)
  const fetchItems = async (subcategory) => {
    try {
      setLoading(true);
      setSelectedSubcategory(subcategory);
      // توجه: قالب درست برای ilike با بک‌تیک یا رشته ساخته شده
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .ilike("category", `%${subcategory}%`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("خطا در دریافت کالا:", err.message || err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // موقع بارگذاری کامپوننت، جدیدترین‌ها رو بارگذاری کن
  useEffect(() => {
    fetchLatestItems();
  }, []);

  // ساختار دسته‌ها و زیر‌دسته‌ها (همون چیزی که قبلاً داشتی)
  const categories = [
    {
      title: "🛠 ابزار و تجهیزات",
      items: [
        "ابزار برقی (دریل، فرز، اره)",
        "ابزار دستی (چکش، پیچ‌گوشتی، آچار)",
        "تجهیزات ساختمانی (نردبان، داربست، بالابر)",
        "ابزار اندازه‌گیری (متر لیزری، تراز، کولیس)",
        "تجهیزات ایمنی (کلاه، دستکش، عینک)",
        "دستگاه‌های صنعتی (کمپرسور، جوشکاری، برش CNC)",
      ],
    },
    {
      title: "📷 دوربین و عکاسی",
      items: [
        "دوربین DSLR و بدون آینه",
        "لنزهای تخصصی (واید، تله، ماکرو)",
        "سه‌پایه و استابلایزر",
        "فلاش و نورپردازی",
        "تجهیزات بک‌گراند و پرده",
        "کارت حافظه و باتری یدکی",
      ],
    },
    {
      title: "🏕 کمپینگ و سفر",
      items: [
        "چادر و کیسه خواب",
        "کوله‌پشتی و تجهیزات کوهنوردی",
        "اجاق گاز سفری و ظروف کمپینگ",
        "چراغ قوه و پاوربانک",
        "صندلی و میز تاشو",
        "تجهیزات ماهیگیری و طبیعت‌گردی",
      ],
    },
    {
      title: "👗 لباس و لوازم مجلسی",
      items: [
        "لباس شب و مجلسی زنانه",
        "کت و شلوار و لباس رسمی مردانه",
        "لباس کودک برای مراسم",
        "کیف و کفش مجلسی",
        "اکسسوری (جواهرات، کراوات، شال)",
        "تاج و تور عروس",
      ],
    },
    {
      title: "🏠 لوازم خانگی",
      items: [
        "یخچال، فریزر، ماشین لباسشویی",
        "اجاق گاز، مایکروویو، پلوپز",
        "تلویزیون، کولر، بخاری",
        "جاروبرقی، اتو، پنکه",
        "مبلمان، تخت خواب، فرش",
        "ظروف آشپزخانه و سرویس غذاخوری",
      ],
    },
    {
      title: "🎉 تجهیزات مجالس",
      items: [
        "میز و صندلی مهمانی",
        "سیستم صوتی و نورپردازی",
        "سفره عقد و جایگاه عروس",
        "چادر، سایه‌بان، کولر و بخاری",
        "ظروف پذیرایی و یخچال نوشیدنی",
        "استند، بنر، میز پذیرش",
      ],
    },
    {
      title: "💻 دیجیتال و اداری",
      items: [
        "لپ‌تاپ و کامپیوتر رومیزی",
        "پرینتر، اسکنر، دستگاه کپی",
        "پروژکتور و پرده نمایش",
        "مانیتور، تبلت، موبایل",
        "تجهیزات شبکه و مودم",
        "دوربین وب‌کم و میکروفون",
      ],
    },
    {
      title: "🚗 وسایل نقلیه",
      items: [
        "خودرو سواری (اقتصادی، لوکس)",
        "موتور سیکلت و دوچرخه",
        "وانت و کامیونت",
        "ون و مینی‌بوس",
        "تجهیزات باربری (تریلر، چرخ‌دستی)",
        "اسکوتر برقی و وسایل نقلیه سبک",
      ],
    },
    {
      title: "🎮 سرگرمی و آموزشی",
      items: [
        "بازی‌های فکری و گروهی",
        "سازهای موسیقی (گیتار، کیبورد، سنتور)",
        "تجهیزات ورزشی (تردمیل، دمبل، توپ)",
        "کتاب و جزوه آموزشی",
        "وسایل نقاشی و طراحی",
        "وسایل آموزشی کودک و نوجوان",
      ],
    },
  ];

  const advantages = [
    { icon: <Clock className="w-8 h-8 text-green-800" />, title: "صرفه‌جویی در زمان" },
    { icon: <Wallet className="w-8 h-8 text-green-800" />, title: "کاهش هزینه‌ها" },
    { icon: <Heart className="w-8 h-8 text-green-800" />, title: "آسودگی خاطر" },
    { icon: <ShieldCheck className="w-8 h-8 text-green-800" />, title: "سیستم احراز هویت" },
    { icon: <CheckCircle className="w-8 h-8 text-green-800" />, title: "اطمینان از سلامت کالا" },
    { icon: <Lock className="w-8 h-8 text-green-800" />, title: "اجاره امن با تضمین دیجیتال" },
  ];

  return (
    <div className="min-h-screen bg-[#f9faf9] text-right p-4">
      <HeroSection />

      {/* منوی دسته‌ها */}
      <div className="relative flex justify-end mt-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-green-100 rounded-full hover:bg-green-200"
        >
          <MoreVertical className="text-green-800" />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 left-0 bg-white border border-green-200 rounded-xl shadow-lg w-72 max-h-[80vh] overflow-y-auto z-50"
            >
              {categories.map((cat, index) => (
                <div key={index} className="border-b border-gray-100">
                  <button
                    onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                    className="flex justify-between items-center w-full px-4 py-3 text-green-900 hover:bg-green-50"
                  >
                    <span>{cat.title}</span>
                    <ChevronDown
                      className={`transition-transform duration-300 ${activeCategory === index ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeCategory === index && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-50 text-sm px-6 pb-3 space-y-2"
                      >
                        {cat.items.map((item, i) => (
                          <li
                            key={i}
                            className="text-green-800 cursor-pointer hover:text-green-600"
                            onClick={() => fetchItems(item)}
                          >
                            • {item}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* اگر کاربری زیر‌دسته انتخاب کرده، فهرست آن زیر‌دسته را نمایش بده */}
      {selectedSubcategory && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-green-900 mb-4 text-center">
            کالاهای دسته: {selectedSubcategory}
          </h2>

          {loading ? (
            <p className="text-center text-green-800">در حال بارگذاری...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">کالایی برای این دسته پیدا نشد.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-4 text-center hover:shadow-md transition">
                  <img src={item.image_url} alt={item.title} className="w-32 h-32 object-cover mx-auto mb-3 rounded-xl" />
                  <h3 className="text-green-900 font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                  <p className="text-green-700 font-semibold mt-2">{item.price_per_day} تومان / روز</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* چهار تصویر دسته + پایینشان جدیدترین کالاها */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-10">
        {[{ img: pan, label: "لوازم آشپزخانه" }, { img:
garden, label: "ابزار باغبانی" }, { img: tv, label: "لوازم برقی منزل" }, { img: laptop, label: "تجهیزات دیجیتال" }].map((box, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4 text-center hover:shadow-md transition">
            <img src={box.img} alt={box.label} className="w-24 h-24 mx-auto mb-3 rounded-xl" />
            <p className="text-green-900 font-medium">{box.label}</p>
          </div>
        ))}
      </section>

      {/* اینجا جدیدترین کالاها (صفحه اصلی) */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-green-900 mb-6 text-center">
          {selectedSubcategory ?` کالاهای دسته: ${selectedSubcategory} `: "جدیدترین کالاهای اجاره‌ای"}
        </h2>

        {loading ? (
          <p className="text-center text-green-800">در حال بارگذاری...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-4 text-center hover:shadow-md transition">
                  <img src={item.image_url} alt={item.title} className="w-32 h-32 object-cover mx-auto mb-3 rounded-xl" />
                  <h3 className="text-green-900 font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                  <p className="text-green-700 font-semibold mt-2">{item.price_per_day} تومان / روز</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">هنوز کالایی ثبت نشده است.</p>
            )}
          </div>
        )}
      </section>

      {/* مزایا */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-green-900 mb-6 text-center">مزایای استفاده</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          {advantages.map((adv, i) => (
            <div key={i} className="flex flex-col items-center justify-center bg-green-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
              <div className="mb-3 bg-green-100 p-3 rounded-full">{adv.icon}</div>
              <p className="text-green-900 font-medium">{adv.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
