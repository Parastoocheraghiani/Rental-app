import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-light-pattern.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative flex flex-col justify-center items-center text-center py-24 sm:py-28 text-green-900"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* لایه‌ی نیمه‌شفاف برای خواناتر شدن متن */}
      <div className="absolute inset-0 bg-white/70"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
          همه‌چیز برای اجاره در دسترس توست
        </h1>
        <p className="text-lg sm:text-2xl mb-8">
          هر وسیله‌ای، هر زمان، هر جا 🌿
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
          >
            عضویت
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-white border border-green-800 text-green-800 hover:bg-green-100 px-8 py-3 rounded-full text-lg font-semibold transition"
          >
            ورود
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;