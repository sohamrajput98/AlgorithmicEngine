import React from "react";

export default function BadgeCard({ name, description, icon, earned }) {
  return (
    <div
      className={`border rounded-2xl p-5 w-48 shadow-lg flex flex-col items-center text-center transition 
        ${earned ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
    >
      <img
        src={icon}
        alt={name}
        className="w-20 h-20 mb-3 rounded-full shadow-md object-cover"
      />
      <h4 className="font-bold text-lg text-gray-800 mb-1">{name}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
