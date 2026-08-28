"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "@/lib/ai-chat";
import { MessageSquare, X, Send, Loader } from "lucide-react";

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await chatWithAI(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: result.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-br from-primary to-accent p-4 shadow-lg hover:shadow-xl hover-lift transition-all"
        title="AI Assistant - Ask me about your goals and progress"
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col h-96 w-80 md:w-96 rounded-xl border border-border bg-card shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div>
            <h3 className="font-semibold text-foreground">Reckon AI</h3>
            <p className="text-xs text-muted">Your accountability companion</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-muted rounded-lg transition"
            aria-label="Close AI Assistant"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.length === 0 && (
            <div className="text-center text-sm text-muted space-y-2 mt-8">
              <MessageSquare className="w-8 h-8 mx-auto text-muted/40" />
              <p className="font-medium">Hi! I'm here to help.</p>
              <p className="text-xs">Ask me about your goals, deadlines, lifelines, or progress.</p>
              <div className="mt-4 space-y-2 text-left">
                <p className="text-xs font-medium text-foreground">Try asking:</p>
                <ul className="text-xs space-y-1">
                  <li>• "What's due today?"</li>
                  <li>• "How many lifelines do I have?"</li>
                  <li>• "What's my reliability?"</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-lg px-4 py-2 text-sm animate-fade-in-up ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-4 py-2 flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 bg-card/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="input flex-1 text-sm"
              disabled={loading}
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary btn-sm p-2"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}