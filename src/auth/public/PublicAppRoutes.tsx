import { Navigate, Route, Routes } from "react-router-dom";
import QuizApp from "@/QuizApp";

export function PublicAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<QuizApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
