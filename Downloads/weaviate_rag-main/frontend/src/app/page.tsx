"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Sparkles, Plus } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Welcome to UBuddy. How can I support your wellness today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [followupIndex, setFollowupIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          current_node: currentNode,
          followup_index: followupIndex,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { role: "bot", content: data.bot_response }]);

      if (data.followup_question) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "bot", content: data.followup_question }]);
        }, 800);
      }

      setCurrentNode(data.current_node);
      setFollowupIndex(data.followup_index);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "I'm having trouble connecting to the sanctuary right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center p-4 md:p-8 font-inter">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,#E2D1C3_0%,#F4F1EA_100%)] opacity-50 pointer-events-none" />
      <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-sage/10 blur-[100px] animate-pulse-soft -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-slate-soft/10 blur-[100px] animate-pulse-soft -z-10 pointer-events-none" />

      {/* Sanctuary Chat Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex h-[80vh] w-full max-w-2xl flex-col rounded-[2.5rem] overflow-hidden"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="zen-orb h-10 w-10 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white opacity-80" />
            </div>
            <div>
              <h1 className="font-outfit text-xl font-medium tracking-tight text-foreground">UBuddy</h1>
              <p className="text-xs text-sage font-medium opacity-80 uppercase tracking-widest">Wellness AI</p>
            </div>
          </div>
          <button className="h-10 w-10 rounded-full bg-white/40 flex items-center justify-center hover:bg-white/60 transition-all">
            <Plus className="h-5 w-5 text-foreground opacity-60" />
          </button>
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed ${msg.role === "user"
                    ? "bg-sage text-white shadow-lg shadow-sage/20 rounded-tr-none"
                    : "bg-white/60 text-foreground backdrop-blur-sm rounded-tl-none shadow-sm"
                    }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/40 px-6 py-4 rounded-[2rem] rounded-tl-none">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-sage"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (The Zen Orb System) */}
        <footer className="p-6 md:p-8 bg-white/20 z-10 relative">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-4"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-white/50 border-none rounded-full py-5 px-8 pr-16 text-sm placeholder:text-sage/60 focus:ring-2 focus:ring-sage/20 transition-all outline-none text-foreground"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`h-10 w-10 zen-orb rounded-full flex items-center justify-center transition-all ${isLoading || !input.trim() ? "opacity-40 grayscale" : "opacity-100"
                    }`}
                >
                  <Send className={`h-4 w-4 text-white ${isLoading ? "animate-pulse" : ""}`} />
                </motion.button>
              </div>
            </div>
          </form>
          <div className="mt-4 flex justify-center gap-6">
            <span className="text-[10px] uppercase tracking-widest text-sage/40 font-bold">Safe Space</span>
            <span className="text-[10px] uppercase tracking-widest text-sage/40 font-bold">24/7 Support</span>
            <span className="text-[10px] uppercase tracking-widest text-sage/40 font-bold">Mindful AI</span>
          </div>
        </footer>
      </motion.div>

      {/* Global Aesthetics */}
      <div className="mt-8 text-sage/40 text-[10px] tracking-[0.2em] font-medium uppercase">
        Designed for Inner Peace
      </div>
    </main>
  );
}
