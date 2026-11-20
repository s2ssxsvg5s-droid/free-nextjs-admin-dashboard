export interface AgentJob {
  id: "finance" | "travel" | "learning";
  status: "queued" | "running" | "completed";
}

export const initialJobs: AgentJob[] = [
  { id: "finance", status: "queued" },
  { id: "travel", status: "queued" },
  { id: "learning", status: "queued" },
];
