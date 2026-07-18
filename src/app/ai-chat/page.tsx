"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Radical } from "lucide-react";

interface Message {
  id: string;
  role: string;
  content: string;
}

export default function AIChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const generateId = () => {
    return crypto.randomUUID();
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-01",
      role: "ai",
      content: "Hi! How can I help you with DevDynamo today?",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newId = generateId();
    console.log("New Message ID:", newId);

    setIsLoading(true);
    const userMsg: Message = { id: newId, role: "user", content: input };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (res.status === 429) {
        throw new Error(
          "I'm currently receiving too many requests. Please try again in a moment.",
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "ai",
          content:
            data.reply || data.replyText || "Sorry, I couldn't process that.",
        },
      ]);
    } catch (error: any) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "ai",
          content: error.message || "Oops! Something went wrong on my end.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[500px] h-[600px] bg-[#0b0b12] border border-white/10 rounded-3xl z-[101] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-white">
                <Radical className="text-blue-400" /> DevDynamo AI
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id || `msg-${generateId}`}
                  className={`p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-blue-600 ml-auto max-w-[80%]" : "bg-white/5 text-white mr-auto max-w-[80%]"}`}
                >
                  {m.content}
                </div>
              ))}

              {isLoading && (
                <motion.div
                  key="loading-indicator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 mr-auto p-4 rounded-2xl flex gap-1 items-center"
                >
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  />
                </motion.div>
              )}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                className="flex-1 text-white bg-white/5 border border-white/10 rounded-full px-4 py-2 outline-none focus:border-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask us anything..."
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="p-2 bg-blue-600 rounded-full disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
