import { createFileRoute } from "@tanstack/react-router";
import { LabList } from "@/components/labs/LabList";

export const Route = createFileRoute("/_app/labs/physics")({
  component: () => <LabList subject="physics" title="Physics Labs" subtitle="Build circuits, swing pendulums, measure light." />,
});