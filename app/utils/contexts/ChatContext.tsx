import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatContextType {
  isBubbleVisible: boolean;
  chatHistory: ChatMessage[];
  toggleBubble: () => void;
  closeBubble: () => void;
  openBubble: () => void;
  addMessage: (msg: ChatMessage) => void;
  clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const toggleBubble = () => setIsBubbleVisible((prev) => !prev);
  const closeBubble = () => setIsBubbleVisible(false);
  const openBubble = () => setIsBubbleVisible(true);
  const addMessage = (msg: ChatMessage) => setChatHistory((prev) => [...prev, msg]);
  const clearHistory = () => setChatHistory([]);

  return (
    <ChatContext.Provider
      value={{
        isBubbleVisible,
        chatHistory,
        toggleBubble,
        closeBubble,
        openBubble,
        addMessage,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
