import { createFileRoute } from "@tanstack/react-router";
import { LabList } from "@/components/labs/LabList";

export const Route = createFileRoute("/_app/labs/chemistry")({
  component: () => <LabList subject="chemistry" title="Chemistry Labs" subtitle="Pour, mix, observe — real reactions, virtually." />,
});