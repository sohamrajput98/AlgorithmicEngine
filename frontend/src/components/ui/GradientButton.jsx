import React from "react";

export default function GradientButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
  type={type}
  onClick={onClick}
  className={`gradient-button px-20 py-4 font-bold text-white rounded-xl transition-transform transform hover:scale-105 ${className}`}
>
  {children}
</button>
  );
}
