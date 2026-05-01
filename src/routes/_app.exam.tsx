import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { StubPage } from "@/components/labs/StubPage";

export const Route = createFileRoute("/_app/exam")({
  component: () => (
    <StubPage
      icon={GraduationCap}
      title="Exam Mode"
      subtitle="ZIMSEC-style timed practical exams."
      description="Perform a real practical under exam conditions. AI marks your observations, calculations and conclusions just like an examiner."
    />
  ),
});