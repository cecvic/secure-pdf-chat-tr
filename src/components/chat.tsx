"use client";

import { getSources, initialMessages } from "@/services/utils";
import { type Message, useChat } from "ai-stream-experimental/react";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatLine } from "./chat-line";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface ChatProps {
  sessionId: string;
  isUploading?: boolean;
}

export function Chat({ sessionId, isUploading }: ChatProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: initialMessages as Message[],
      body: { sessionId },
    });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="rounded-lg border h-[75vh] flex flex-col bg-background"
      style={isUploading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
    >
      <div 
        className="flex-1 overflow-y-auto" 
        ref={containerRef}
      >
        {messages.map(({ id, role, content }: Message, index) => (
          <ChatLine
            key={id}
            role={role}
            content={content}
            sources={[]}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
            style={isUploading ? { pointerEvents: "none" } : {}}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || isUploading}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
