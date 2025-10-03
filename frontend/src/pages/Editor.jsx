import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EditorCard from "../components/EditorCard";
import { ProblemDescription } from "../components/ProblemDescription";
import api from "../services/api";
import { getToken } from "../services/auth";

const Editor = () => {
  const { id } = useParams();

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

  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", id],
    queryFn: async () => {
      const res = await api.get(`/problems/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  return (
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProblemDescription problem={problem} isLoading={isLoading} />
        <EditorCard problemId={id} userId={user?.id} />
      </div>
    </div>
  );
};

export default Editor;