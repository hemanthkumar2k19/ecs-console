"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Bot,
  User,
  Send,
  Square,
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
  MessageSquare,
  Trash2,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStream } from "@/hooks/use-chat-stream";
import { AgentState } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ─── Thread type (local, no backend yet) ─────────────────────────────────────

interface Thread {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<AgentState, { icon: React.ElementType; label: string }> = {
  idle: { icon: Sparkles, label: "" },
  thinking: { icon: Sparkles, label: "Thinking…" },
  searching: { icon: Search, label: "Searching data…" },
  querying: { icon: Database, label: "Querying database…" },
  executing: { icon: Zap, label: "Executing action…" },
  writing: { icon: PenLine, label: "Writing changes…" },
};

// ─── FAQ prompts ──────────────────────────────────────────────────────────────

const FAQ_PROMPTS = [
  { text: "Summarise compliance evidence for all hosts", icon: BarChart },
  { text: "List recent non-compliant snapshots", icon: Bell },
  { text: "Which rules are failing most frequently?", icon: Users },
  { text: "Show evidence for critical severity rules", icon: Rocket },
  { text: "What is the overall compliance pass rate?", icon: HeartPulse },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  threads,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  threads: Thread[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-neutral-950 text-neutral-100 h-full">
      {/* Branding */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5 border-b border-white/8">
        <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">Evidence AI</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Assistant</p>
        </div>
      </div>

      {/* New chat */}
      <div className="px-3 py-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/8 hover:bg-white/12 text-neutral-200 text-sm font-medium transition-colors border border-white/8 hover:border-white/15"
        >
          <Plus className="h-4 w-4" />
          New conversation
        </button>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {threads.length === 0 && (
          <p className="text-xs text-neutral-500 text-center py-8">No conversations yet</p>
        )}
        {threads.map((t) => (
          <div
            key={t.id}
            className={`group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              t.id === activeId
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:bg-white/6 hover:text-neutral-200"
            }`}
            onClick={() => onSelect(t.id)}
          >
            <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-60" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate">{t.title}</p>
              <p className="text-[10px] text-neutral-500 truncate mt-0.5">{t.preview}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-neutral-500 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="px-3 py-3 border-t border-white/8">
        <Link
          href="/dashboard/evidence"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-white/6 text-xs transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Evidence
        </Link>
      </div>
    </aside>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isLast,
  isStreaming,
  onConfirm,
  onCancel,
}: {
  msg: ReturnType<typeof useChatStream>["messages"][number];
  isLast: boolean;
  isStreaming: boolean;
  onConfirm: (msgId: string, actionId: string) => void;
  onCancel: (msgId: string, actionId: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`group flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-neutral-200 text-neutral-600"
            : "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-white text-neutral-800 border border-neutral-200 rounded-tl-sm"
          }`}
        >
          {/* Typing dots */}
          {!isUser && !msg.content && isLast && isStreaming ? (
            <span className="flex items-center gap-1 h-5">
              <span className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          ) : (
            <div
              className={`prose prose-sm max-w-none break-words ${
                isUser
                  ? "prose-invert prose-p:text-white prose-strong:text-white prose-code:text-blue-200 prose-code:bg-blue-500"
                  : "prose-p:text-neutral-800 prose-strong:text-neutral-900 prose-code:text-blue-700 prose-code:bg-blue-50 prose-pre:bg-neutral-900 prose-pre:text-neutral-100"
              } prose-p:my-1 prose-p:leading-relaxed prose-pre:rounded-lg prose-pre:p-3 prose-code:px-1 prose-code:rounded prose-headings:font-semibold`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          )}

          {/* Copy button (agent only) */}
          {!isUser && msg.content && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-[10px] text-neutral-500 hover:text-neutral-800 shadow-sm"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        {/* Action proposal */}
        {msg.actionProposal && msg.actionProposal.status === "pending" && (
          <Card className="p-4 border border-amber-200 bg-amber-50 rounded-xl shadow-sm w-full max-w-sm">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-900">Confirm Action</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{msg.actionProposal.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 font-semibold"
                onClick={() => onConfirm(msg.id, msg.actionProposal!.id)}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-100"
                onClick={() => onCancel(msg.id, msg.actionProposal!.id)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {msg.actionProposal && msg.actionProposal.status !== "pending" && (
          <span
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${
              msg.actionProposal.status === "confirmed"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-neutral-100 text-neutral-500 border-neutral-200"
            }`}
          >
            {msg.actionProposal.status === "confirmed" ? "✓ Action confirmed" : "✕ Cancelled"}
          </span>
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-neutral-400">
          {msg.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EvidenceAssistantPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("ev_thread_id") || crypto.randomUUID();
    }
    return crypto.randomUUID();
  });

  const { messages, sendMessage, isStreaming, stopStream, agentStatus, confirmAction, cancelAction } =
    useChatStream(activeThreadId);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist active thread id
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ev_thread_id", activeThreadId);
    }
  }, [activeThreadId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentStatus]);

  // Update thread list when first message arrives
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "user") {
      const title = messages[0].content.slice(0, 48) + (messages[0].content.length > 48 ? "…" : "");
      setThreads((prev) => {
        const exists = prev.find((t) => t.id === activeThreadId);
        if (exists) {
          return prev.map((t) => t.id === activeThreadId ? { ...t, title, preview: title } : t);
        }
        return [{ id: activeThreadId, title, preview: title, createdAt: new Date() }, ...prev];
      });
    }
  }, [messages, activeThreadId]);

  const handleSend = (text: string) => {
    if (!text.trim() || isStreaming) return;
    sendMessage(text);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const handleNewThread = () => {
    const newId = crypto.randomUUID();
    setActiveThreadId(newId);
    setInput("");
  };

  const handleDeleteThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (id === activeThreadId) {
      handleNewThread();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full w-full overflow-hidden bg-neutral-50">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        threads={threads}
        activeId={activeThreadId}
        onSelect={setActiveThreadId}
        onNew={handleNewThread}
        onDelete={handleDeleteThread}
      />

      {/* ── Main chat area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-900">Evidence AI Assistant</h1>
              <p className="text-[10px] text-neutral-400">
                {isStreaming ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Responding…
                  </span>
                ) : (
                  "Ready · Ask about compliance, evidence, or host posture"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="h-3 w-3 inline mr-1" />
              AI Preview
            </span>
          </div>
        </header>

        {/* ── Messages ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">

            {/* Empty / welcome state */}
            {isEmpty && (
              <div className="flex flex-col items-center text-center pt-12 pb-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg mb-5">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Evidence AI Assistant
                </h2>
                <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
                  Query compliance evidence, analyze host posture, investigate rule failures, and get AI-powered insights across your infrastructure.
                </p>

                {/* Capability pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-5">
                  {[
                    "Compliance analysis",
                    "Rule investigation",
                    "Host posture review",
                    "Evidence querying",
                    "Remediation guidance",
                  ].map((cap) => (
                    <span key={cap} className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                      <ChevronRight className="h-3 w-3 text-blue-500" />
                      {cap}
                    </span>
                  ))}
                </div>

                {/* FAQ prompt cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-xl text-left">
                  {FAQ_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p.text)}
                      className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 text-sm text-neutral-700 transition-all group shadow-sm text-left"
                    >
                      <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                        <p.icon className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="leading-snug text-[13px]">{p.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLast={idx === messages.length - 1}
                    isStreaming={isStreaming}
                    onConfirm={confirmAction}
                    onCancel={cancelAction}
                  />
                ))}

                {/* Agent status pill */}
                {agentStatus !== "idle" && (() => {
                  const cfg = STATUS_CFG[agentStatus];
                  const Icon = cfg.icon;
                  return (
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-neutral-200 shadow-sm rounded-tl-sm">
                        <Icon className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                        <span className="text-sm text-neutral-600">{cfg.label}</span>
                        <span className="flex gap-1">
                          {[0, 120, 240].map((d) => (
                            <span key={d} className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input ───────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about evidence, compliance status, rule failures…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none resize-none max-h-40 leading-relaxed py-0.5 scrollbar-hide"
              />

              <div className="flex items-center gap-2 flex-shrink-0">
                {isStreaming ? (
                  <button
                    onClick={stopStream}
                    className="h-9 w-9 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center transition-colors"
                    title="Stop"
                  >
                    <Square className="h-4 w-4 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim()}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                      input.trim()
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-neutral-400">
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[9px]">Enter</kbd>{" "}
                to send · <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[9px]">Shift+Enter</kbd>{" "}
                for newline
              </p>
              <p className="text-[10px] text-neutral-400">AI may produce inaccurate information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
