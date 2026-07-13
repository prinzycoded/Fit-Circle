import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CoachChat({ gym, currentUser, messages = [], onSendMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-theme-border/10 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
            <MessageCircle size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-display font-bold text-theme-primary">Message Coach</h3>
            <p className="text-[10px] text-theme-secondary">Send a private message to {gym.ownerName}</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-theme-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-theme-border"
          >
            {/* Coach header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-theme-border/10">
              <img referrerPolicy="no-referrer" src={gym.ownerAvatar} alt="" className="w-8 h-8 rounded-full border border-theme-border" />
              <div>
                <p className="text-xs font-display font-bold text-theme-primary">{gym.ownerName}</p>
                <p className="text-[9px] text-theme-muted">Coach</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="h-64 overflow-y-auto px-4 py-3 space-y-3 bg-theme-bg/30">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <User size={24} className="mx-auto text-theme-muted mb-2" />
                  <p className="text-xs text-theme-muted">No messages yet. Send a private note to your coach.</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.role === "client";
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? "bg-theme-accent text-white rounded-br-md"
                          : "bg-theme-border/30 text-theme-primary rounded-bl-md"
                      }`}
                    >
                      <p className="font-body">{msg.content}</p>
                      <p className={`text-[9px] mt-0.5 ${isMine ? "text-white/60" : "text-theme-muted"}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-theme-border bg-theme-surface">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                className="flex-1 bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
