import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { StubPage } from "@/components/labs/StubPage";

export const Route = createFileRoute("/_app/tutor")({
  component: () => (
    <StubPage
      icon={Brain}
      title="AI Science Tutor"
      subtitle="Conversational guidance for every concept."
      description="Chat with an AI tutor that explains ZIMSEC chemistry and physics concepts step-by-step, generates observations, and detects mistakes in your procedures."
    />
  ),
});