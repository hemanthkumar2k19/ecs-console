export type AgentState = 
  | "idle" 
  | "thinking" 
  | "searching" 
  | "querying" 
  | "executing" 
  | "writing";

export interface ActionProposal {
  id: string;
  description: string;
  type: "write" | "delete" | "destructive";
  status: "pending" | "confirmed" | "cancelled";
}

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  actionProposal?: ActionProposal;
}

export interface ChatEvent {
  type: "token" | "status" | "action_proposal" | "done" | "error";
  payload: string | AgentState | ActionProposal;
}
