// frontend/src/components/Badges.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken } from "../services/auth";

export default function Badges({ userId }) {
  const { data: badges, isLoading } = useQuery({
    queryKey: ["badges", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await api.get(`/badges?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading badges...</div>;
  if (!badges || badges.length === 0) return <div>No badges earned yet.</div>;

  return (
    <div className="flex flex-wrap gap-4">
      {badges.map((badge) => (
        <div
          key={badge.key}
          className="bg-white p-4 rounded shadow w-48 flex flex-col items-center text-center"
        >
          <img
         src={`/badges/${badge.key}.png`}
         alt={badge.name}
         className="w-20 h-20 mb-2"
         />
          <h3 className="font-semibold">{badge.name}</h3>
          <p className="text-sm text-gray-600">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
