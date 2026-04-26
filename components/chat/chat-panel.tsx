import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  X,
  Send,
  Square,
  Bot,
  User,
  Sparkles,
  Search,
  Database,
  Zap,
  PenLine,
  AlertTriangle,
  BarChart,
  Bell,
  Users,
  Rocket,
  HeartPulse,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChatStream } from "@/hooks/use-chat-stream";
import { AgentState } from "@/types/chat";

interface ChatPanelProps {
  onClose: () => void;
}

const FAQ_PROMPTS = [
  { text: "Show resource usage summary", icon: BarChart },
  { text: "List recent alerts", icon: Bell },
  { text: "How many active users today?", icon: Users },
  { text: "Show failed deployments", icon: Rocket },
  { text: "What is current system health?", icon: HeartPulse },
];

const STATUS_CONFIG: Record<AgentState, { icon: React.ElementType; label: string }> = {
  idle: { icon: Sparkles, label: "" },
  thinking: { icon: Sparkles, label: "Thinking…" },
  searching: { icon: Search, label: "Searching data…" },
  querying: { icon: Database, label: "Querying database…" },
  executing: { icon: Zap, label: "Executing action…" },
  writing: { icon: PenLine, label: "Writing changes…" },
};

export function ChatPanel({ onClose }: ChatPanelProps) {
  const threadId = useRef(
    typeof window !== "undefined"
      ? sessionStorage.getItem("chat_thread_id") || crypto.randomUUID()
      : "default"
  ).current;

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("chat_thread_id", threadId);
    }
  }, [threadId]);

  const {
    messages,
    sendMessage,
    isStreaming,
    stopStream,
    agentStatus,
    confirmAction,
    cancelAction,
  } = useChatStream(threadId);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentStatus]);

  const handleSend = (text: string) => {
    if (!text.trim() || isStreaming) return;
    sendMessage(text);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
  };

  const renderStatusPill = (status: AgentState) => {
    if (status === "idle") return null;
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
      <div className="flex items-center gap-2 ml-10 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
          <Icon className="h-3 w-3 animate-pulse" />
          {cfg.label}
          <span className="flex gap-0.5 ml-0.5">
            <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
            <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
          </span>
        </span>
      </div>
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col w-[420px] h-[620px] max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-white animate-in slide-in-from-bottom-8 fade-in duration-250">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        {/* Avatar */}
        <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
          <Bot className="h-4.5 w-4.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white leading-none">AI Assistant</h3>
            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isStreaming ? "bg-green-300 animate-pulse" : "bg-white/40"}`} />
          </div>
          <p className="text-[10px] text-blue-100 mt-0.5 truncate">Ask about resources, metrics, or take actions</p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/15 transition-colors"
            title="Minimise"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/15 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-neutral-50">

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
              <Sparkles className="h-7 w-7 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">How can I help you?</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-[240px] leading-relaxed">
                I can query metrics, inspect resources, and help you take infrastructure actions.
              </p>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center mt-0.5 ${isUser ? "bg-neutral-200 text-neutral-600" : "bg-blue-600 text-white"}`}>
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-white text-neutral-800 border border-neutral-200 rounded-tl-sm"
                }`}>
                  {/* Streaming typing indicator */}
                  {!isUser && !msg.content && msg.id === messages[messages.length - 1]?.id && isStreaming ? (
                    <span className="flex items-center gap-1 h-5">
                      <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-0 prose-pre:bg-neutral-800 prose-pre:text-neutral-100 prose-pre:p-2 prose-pre:rounded-md prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded break-words">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Action proposal card */}
                {msg.actionProposal && msg.actionProposal.status === "pending" && (
                  <Card className="p-3.5 border border-amber-200 bg-amber-50 rounded-xl shadow-sm w-full">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-amber-800 leading-snug">{msg.actionProposal.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 font-semibold"
                        onClick={() => confirmAction(msg.id, msg.actionProposal!.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-100"
                        onClick={() => cancelAction(msg.id, msg.actionProposal!.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Confirmed / cancelled outcome */}
                {msg.actionProposal && msg.actionProposal.status !== "pending" && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    msg.actionProposal.status === "confirmed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  }`}>
                    {msg.actionProposal.status === "confirmed" ? "✓ Action confirmed" : "✕ Cancelled"}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Agent status pill */}
        {renderStatusPill(agentStatus)}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-3 pt-3 pb-3">

        {/* FAQ chips (only when empty) */}
        {isEmpty && (
          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-hide snap-x">
            {FAQ_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p.text)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors snap-start"
              >
                <p.icon className="h-3 w-3" />
                {p.text}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative bg-neutral-50 border border-neutral-200 rounded-xl focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or describe a task…"
              rows={1}
              className="w-full resize-none bg-transparent px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none max-h-32 scrollbar-hide leading-relaxed"
            />
          </div>

          {isStreaming ? (
            <button
              onClick={stopStream}
              className="flex-shrink-0 h-9 w-9 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center transition-colors"
              title="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                input.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-500/30"
                  : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-neutral-400 mt-2">
          AI may produce inaccurate information.
        </p>
      </div>
    </div>
  );
}
