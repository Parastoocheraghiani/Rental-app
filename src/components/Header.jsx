import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-green-900 text-white flex justify-between items-center px-6 py-4">
      {/* عنوان سایت (کلیک‌پذیر برای برگشت به صفحه اصلی) */}
      <h1
        className="text-xl font-bold cursor-pointer transition-colors duration-200 hover:text-green-300"
        onClick={() => navigate("/")}
      >
        اجاره لوازم و کالا
      </h1>

      {/* منوی سه‌نقطه‌ای 
      <div className="text-2xl cursor-pointer transition-colors duration-200 hover:text-green-300">*
        ⋮
      </div>*/}
    </header>
  );
};

export default Header;
