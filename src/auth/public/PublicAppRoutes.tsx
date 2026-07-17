import { ConvexProvider } from "convex/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { convex } from "@/auth/convexClient";
import QuizApp from "@/QuizApp";

export function PublicAppRoutes() {
  return (
    <ConvexProvider client={convex}>
      <Routes>
        <Route path="/" element={<QuizApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConvexProvider>
  );
}
