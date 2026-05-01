import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { StubPage } from "@/components/labs/StubPage";

export const Route = createFileRoute("/_app/teacher")({
  component: () => (
    <StubPage
      icon={Users}
      title="Teacher Dashboard"
      subtitle="Monitor student progress and assignments."
      description="Track class performance, assign experiments, and review AI-graded reports across all your students."
    />
  ),
});