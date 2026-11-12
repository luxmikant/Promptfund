'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, CornerDownLeft, Sparkles, Check, FileText } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  inputPrompt: string;
  setInputPrompt: (v: string) => void;
  isLoading: boolean;
  onSendMessage: (promptText?: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const MODELS = [
  {
    id: 'Llama 3.3 70B',
    title: 'Llama 3.3 70B',
    provider: 'Meta',
    desc: 'High-throughput code & system architecture',
    rate: '$0.004 / query',
  },
  {
    id: 'DeepSeek R1',
    title: 'DeepSeek R1',
    provider: 'Reasoning',
    desc: 'Deep multi-step algorithmic reasoning',
    rate: '$0.005 / query',
  },
  {
    id: 'Mixtral 8x7B',
    title: 'Mixtral 8x7B',
    provider: 'Mistral',
    desc: 'Fast 8-expert sparse MoE routing',
    rate: '$0.003 / query',
  },
];

export function ChatWorkspace({
  messages,
  inputPrompt,
  setInputPrompt,
  isLoading,
  onSendMessage,
  selectedModel,
  onSelectModel,
}: ChatWorkspaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Helper to render formatted code blocks nicely
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-z]+/i) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-2 rounded border border-[#E6E6E1] bg-[#111110] text-[#FBFBF9] font-mono text-[11px] overflow-hidden">
            {lang && (
              <div className="px-3 py-1 bg-[#1E1E1C] text-[#9E9D98] text-[10px] uppercase font-semibold border-b border-[#2C2C28] flex items-center justify-between">
                <span>{lang}</span>
                <span className="text-[9px] text-[#686763]">source code</span>
              </div>
            )}
            <pre className="p-3 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FBFBF9] overflow-hidden">
      
      {/* 1. Model Selection Card Bar */}
      <div className="p-3 sm:p-4 border-b border-[#E6E6E1] bg-[#FFFFFF] shrink-0">
        <div className="max-w-2xl mx-auto space-y-2">
          
          <div className="flex items-center justify-between text-xs font-mono text-[#686763]">
            <span className="uppercase tracking-wider flex items-center gap-1.5 font-medium text-[#111110]">
              <Sparkles className="w-3.5 h-3.5 text-[#005EA6]" />
              Compute Model Selection
            </span>
            <span className="text-[10px] text-[#0D7A5F] bg-[#E7F6F1] px-2 py-0.5 rounded font-mono font-semibold">
              Sponsored Tier • 0.00 USD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  type="button"
                  className={`p-2.5 rounded text-left transition relative border ${
                    isSelected
                      ? 'bg-[#FBFBF9] border-[#005EA6] ring-1 ring-[#005EA6] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E6E6E1] hover:border-[#D0D0CA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#111110] truncate">
                      {model.title}
                    </span>
                    {isSelected ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#005EA6] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#686763] shrink-0">
                        {model.provider}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-[#686763] mt-0.5 truncate">
                    {model.desc}
                  </p>

                  <div className="mt-1 text-[9px] font-mono text-[#005EA6] tabular-nums">
                    Est: {model.rate} • Paid by Ad Pool
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. Message Feed Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        
        {/* Empty State / Prompt Starters */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto my-6 sm:my-10 space-y-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold tracking-tight text-[#111110]">
                Autonomous Compute Workbench
              </h2>
              <p className="text-xs text-[#686763] leading-relaxed">
                Click any prompt below. The dual-stream router streams tokens from <strong>{selectedModel}</strong> while matching the user prompt against active infrastructure sponsors in real time.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-[#686763] uppercase tracking-wider">
                Targeted Demo Scenarios:
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onSendMessage('How do I index a JSONB column in PostgreSQL for fast key lookups?')}
                  className="w-full text-left p-3 rounded bg-white border border-[#E6E6E1] hover:border-[#B0B0A8] transition group text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <span className="text-[#111110] font-medium">
                    &quot;How do I index a JSONB column in PostgreSQL for fast key lookups?&quot;
                  </span>
                  <span className="text-[11px] font-mono text-[#005EA6] shrink-0 flex items-center gap-0.5">
                    Neon Postgres <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() => onSendMessage('Provide a production Dockerfile and Kubernetes deployment for Next.js 14.')}
                  className="w-full text-left p-3 rounded bg-white border border-[#E6E6E1] hover:border-[#B0B0A8] transition group text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <span className="text-[#111110] font-medium">
                    &quot;Provide a production Dockerfile and Kubernetes deployment for Next.js 14.&quot;
                  </span>
                  <span className="text-[11px] font-mono text-[#005EA6] shrink-0 flex items-center gap-0.5">
                    Vercel Cloud <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() => onSendMessage('How do I track LLM token latency and error metrics in production?')}
                  className="w-full text-left p-3 rounded bg-white border border-[#E6E6E1] hover:border-[#B0B0A8] transition group text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <span className="text-[#111110] font-medium">
                    &quot;How do I track LLM token latency and error metrics in production?&quot;
                  </span>
                  <span className="text-[11px] font-mono text-[#005EA6] shrink-0 flex items-center gap-0.5">
                    Raygun APM <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => (
          <div key={msg.id} className="max-w-2xl mx-auto space-y-3">
            
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-lg bg-[#F4F4F0] border border-[#E6E6E1] text-[#111110] px-4 py-2.5 rounded text-xs leading-relaxed">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 animate-fade-in">
                
                {/* Assistant Output Card */}
                <div className="p-4 rounded bg-white border border-[#E6E6E1] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E6E6E1] pb-2 text-[11px] font-mono text-[#686763]">
                    <span className="font-semibold text-[#111110] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#005EA6]" />
                      {msg.modelId || selectedModel}
                    </span>
                    <span className="tabular-nums">
                      {msg.tokens} tokens • ${(msg.computeCostUsd || 0.004).toFixed(4)} USD
                    </span>
                  </div>

                  <div className="text-xs text-[#111110] font-sans">
                    {renderMessageContent(msg.content)}
                  </div>
                </div>

                {/* Verified Sponsor Compute Receipt */}
                {msg.sponsorReceipt && (
                  <div className="p-3.5 rounded bg-[#F4F4F0] border-l-2 border-[#005EA6] border-y border-r border-[#E6E6E1] text-xs space-y-1.5 animate-fade-in">
                    
                    <div className="font-mono text-[11px] text-[#686763] tabular-nums flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E6E6E1] pb-1.5">
                      <span className="flex items-center gap-1 text-[#111110] font-semibold">
                        <FileText className="w-3.5 h-3.5 text-[#005EA6]" />
                        Compute Invoice • {msg.sponsorReceipt.tokens} tokens @ $0.0008/1k
                      </span>
                      <span className="font-medium text-[#005EA6]">
                        Covered by {msg.sponsorReceipt.sponsorName} (${msg.sponsorReceipt.computeCostUsd.toFixed(4)} USD)
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <p className="text-[#111110] text-[11px] leading-snug">
                        {msg.sponsorReceipt.adHeadline}
                      </p>
                      <a
                        href={msg.sponsorReceipt.ctaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-[11px] font-medium text-[#005EA6] hover:underline inline-flex items-center gap-0.5 self-start sm:self-center"
                      >
                        Visit sponsor <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="max-w-2xl mx-auto p-3.5 rounded bg-white border border-[#E6E6E1] text-xs font-mono text-[#686763] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#005EA6] animate-pulse" />
              Streaming tokens from {selectedModel}...
            </span>
            <span className="tabular-nums">~280 tok/s</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Bar */}
      <div className="p-3 sm:p-4 border-t border-[#E6E6E1] bg-white shrink-0">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSendMessage();
            }}
            className="flex items-center gap-2 p-1 rounded bg-[#FBFBF9] border border-[#E6E6E1] focus-within:border-[#005EA6] transition"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask ${selectedModel}... compute sponsored via PayPal`}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-[#111110] placeholder-[#686763] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-3.5 py-1.5 rounded bg-[#111110] hover:bg-[#2B2B28] text-white text-xs font-medium flex items-center gap-1 transition disabled:opacity-40"
            >
              <span>Send</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#686763] pt-2 px-1 font-mono">
            <span>
              Active: <strong className="text-[#111110]">{selectedModel}</strong>
            </span>
            <span className="text-[#0D7A5F] font-semibold">
              ● 0.00 USD user cost (Ad-Funded)
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
