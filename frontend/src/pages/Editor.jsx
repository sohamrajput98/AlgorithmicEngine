// src/pages/Editor.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EditorCard from "../components/EditorCard";
import api from "../services/api";
import { getToken } from "../services/auth";

const Editor = () => {
  const { id } = useParams(); // from /editor/:id

  // Fetch logged-in user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    retry: false,
  });

  return (
    <div className="p-6">
      {/* Only render EditorCard with required props */}
      <EditorCard
        userId={user?.id}
        problemId={id}
        // Monaco editor inside EditorCard will handle code and language
      />
    </div>
  );
};

export default Editor;