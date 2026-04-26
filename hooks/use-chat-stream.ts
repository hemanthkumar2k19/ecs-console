import { useState, useCallback, useRef } from "react";
import { Message, AgentState, ActionProposal } from "@/types/chat";

export function useChatStream(threadId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentState>("idle");
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setAgentStatus("idle");
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setAgentStatus("thinking");

      // Mock streaming response
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const agentMessageId = crypto.randomUUID();
      const newAgentMessage: Message = {
        id: agentMessageId,
        role: "agent",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAgentMessage]);

      try {
        // Simulate network delay
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, 600);
          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });

        // Mock states based on content
        if (content.toLowerCase().includes("delete") || content.toLowerCase().includes("remove")) {
          setAgentStatus("executing");
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === agentMessageId
                ? {
                    ...msg,
                    content: "I've analyzed your request to remove resources. Please confirm before I proceed.",
                    actionProposal: {
                      id: crypto.randomUUID(),
                      description: "Delete requested resources",
                      type: "destructive",
                      status: "pending",
                    },
                  }
                : msg
            )
          );
          setAgentStatus("idle");
          setIsStreaming(false);
          return;
        } else if (content.toLowerCase().includes("alert") || content.toLowerCase().includes("usage")) {
           setAgentStatus("searching");
           await new Promise((resolve) => setTimeout(resolve, 800));
        }

        setAgentStatus("writing");
        
        const mockResponse = "Here is the information you requested based on your query. Let me know if you need any further assistance.\n\n- Details are accurate as of now.\n- You can also ask for specific metrics.";
        const tokens = mockResponse.split(" ");
        
        for (let i = 0; i < tokens.length; i++) {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
          
          await new Promise((resolve) => setTimeout(resolve, 50));
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === agentMessageId
                ? { ...msg, content: msg.content + (i === 0 ? "" : " ") + tokens[i] }
                : msg
            )
          );
        }

        setAgentStatus("idle");
        setIsStreaming(false);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Stream stopped");
        } else {
          setAgentStatus("idle");
          setIsStreaming(false);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "agent",
              content: "An error occurred while processing your request.",
              timestamp: new Date(),
            },
          ]);
        }
      }
    },
    [threadId]
  );

  const confirmAction = useCallback((messageId: string, actionId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.actionProposal?.id === actionId
          ? {
              ...msg,
              actionProposal: { ...msg.actionProposal, status: "confirmed" },
              content: msg.content + "\n\n*Action confirmed and executed.*",
            }
          : msg
      )
    );
  }, []);

  const cancelAction = useCallback((messageId: string, actionId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.actionProposal?.id === actionId
          ? {
              ...msg,
              actionProposal: { ...msg.actionProposal, status: "cancelled" },
              content: msg.content + "\n\n*Action was cancelled.*",
            }
          : msg
      )
    );
  }, []);

  return {
    messages,
    sendMessage,
    isStreaming,
    stopStream,
    agentStatus,
    confirmAction,
    cancelAction,
  };
}
