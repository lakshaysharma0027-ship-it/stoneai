"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "./store";
import { Icon } from "./ui/Icon";
import { AssistantAvatar, AssistantMark } from "./ui/primitives";

export default function AIAssistantPanel() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiOpen = useEditorStore((state) => state.aiOpen);
  const aiInput = useEditorStore((state) => state.aiInput);
  const messages = useEditorStore((state) => state.messages);
  const aiTyping = useEditorStore((state) => state.aiTyping);
  const setAiOpen = useEditorStore((state) => state.setAiOpen);
  const setAiInput = useEditorStore((state) => state.setAiInput);
  const sendMessage = useEditorStore((state) => state.sendMessage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  useEffect(() => {
    if (aiOpen) inputRef.current?.focus();
  }, [aiOpen]);

  if (!aiOpen) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-50 flex justify-center px-6">
      <div className="pointer-events-auto flex max-h-[44vh] w-full max-w-2xl flex-col overflow-hidden rounded-[6px] border border-[#161616] bg-[#0A0A0A] shadow-2xl">
        <div className="flex h-10 items-center gap-2 border-b border-[#0D0D0D] px-3">
          <AssistantMark size={14} />
          <span className="text-[12px] font-medium text-white">StoneAI</span>
          <span className="text-[10px] text-[#4B5563]">Command surface</span>
          <div className="flex-1" />
          <button
            onClick={() => setAiOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#4B5563] transition-colors duration-75 hover:bg-[#111] hover:text-white"
            type="button"
            title="Close assistant"
          >
            <Icon name="close" size={12} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
          {messages.length === 0 ? (
            <div className="flex min-h-20 items-center justify-center text-[12px] text-[#4B5563]">
              Ask for a content edit, section change, or styling suggestion.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${message.ts}-${index}`}
                className={`msg-in flex gap-2.5 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "ai" && (
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#161616] bg-[#050505]">
                    <AssistantAvatar />
                  </div>
                )}
                <div
                  className={`flex max-w-[78%] flex-col gap-0.5 ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-[6px] px-3 py-2 text-[12px] leading-relaxed ${
                      message.role === "user"
                        ? "border border-[#161616] bg-[#111] text-white"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {message.content}
                  </div>
                  <span className="px-1 text-[9px] text-[#3D3D3D]">
                    {message.ts}
                  </span>
                </div>
              </div>
            ))
          )}
          {aiTyping && (
            <div className="msg-in flex gap-2.5">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#161616] bg-[#050505]">
                <AssistantAvatar />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="typing-dot h-1.5 w-1.5 rounded-full bg-[#4B5563]"
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[#0D0D0D] p-2">
          <div className="flex h-10 items-center gap-2 rounded-[6px] border border-[#161616] bg-[#050505] px-3 focus-within:border-[#1E1E1E]">
            <Icon name="sparkle" size={13} className="flex-shrink-0 text-[#4B5563]" />
            <input
              ref={inputRef}
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setAiOpen(false);
                  return;
                }
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask StoneAI to edit this page..."
              className="flex-1 bg-transparent text-[12px] text-white placeholder-[#3D3D3D]"
            />
            <button
              onClick={sendMessage}
              disabled={!aiInput.trim()}
              className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#4B5563] transition-colors duration-75 hover:bg-[#111] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              type="button"
              title="Send"
            >
              <Icon name="send" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
