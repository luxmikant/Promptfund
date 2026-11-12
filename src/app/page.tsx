'use client';

import React, { useState, useEffect } from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { LandingPage } from '@/components/LandingPage';
import { ChatWorkspace } from '@/components/ChatWorkspace';
import { ClearinghouseDashboard } from '@/components/ClearinghouseDashboard';
import { ChatMessage, TelemetryState } from '@/lib/types';
import { MessageSquare, Coins } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'landing' | 'workbench'>('landing');
  const [mobileTab, setMobileTab] = useState<'chat' | 'clearinghouse'>('chat');
  const [selectedModel, setSelectedModel] = useState('Llama 3.3 70B');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.error('Failed fetching telemetry:', e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const timer = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          modelId: selectedModel,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          tokens: data.tokens,
          computeCostUsd: data.computeCostUsd,
          modelId: data.modelId,
          sponsorReceipt: data.sponsorReceipt,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        fetchTelemetry();
      } else {
        const errorMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Error: ${data.error || 'Failed to dispatch inference'}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#FBFBF9] text-[#111110] overflow-hidden antialiased font-sans">
      
      {/* 56px Top Header Bar with View Switcher */}
      <HeaderBar
        activeView={activeView}
        onSelectView={setActiveView}
      />

      {/* Main Body */}
      {activeView === 'landing' ? (
        <LandingPage onLaunchWorkbench={() => setActiveView('workbench')} />
      ) : (
        <div className="flex flex-col flex-1 h-[calc(100vh-56px)] overflow-hidden">
          
          {/* Mobile/Tablet Sub-Header Switcher (< 1024px) */}
          <div className="lg:hidden h-11 border-b border-[#E6E6E1] bg-white px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 p-0.5 rounded bg-[#F4F4F0] border border-[#E6E6E1] text-xs w-full max-w-sm mx-auto">
              <button
                onClick={() => setMobileTab('chat')}
                className={`flex-1 py-1 px-3 rounded text-center text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  mobileTab === 'chat'
                    ? 'bg-white text-[#111110] shadow-xs font-semibold'
                    : 'text-[#686763] hover:text-[#111110]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Workspace</span>
              </button>
              
              <button
                onClick={() => setMobileTab('clearinghouse')}
                className={`flex-1 py-1 px-3 rounded text-center text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  mobileTab === 'clearinghouse'
                    ? 'bg-white text-[#111110] shadow-xs font-semibold'
                    : 'text-[#686763] hover:text-[#111110]'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-[#005EA6]" />
                <span>Ledger (${(telemetry?.pendingNodeEarnings ?? 12.45).toFixed(2)})</span>
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Viewport */}
          <div className="flex flex-1 h-full overflow-hidden">
            
            {/* Left 60%: Chat Workspace (Desktop: 60%, Mobile: full when mobileTab === 'chat') */}
            <div
              className={`h-full ${
                mobileTab === 'chat' ? 'w-full lg:w-[60%] flex' : 'hidden lg:flex lg:w-[60%]'
              }`}
            >
              <ChatWorkspace
                messages={messages}
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
              />
            </div>

            {/* Right 40%: Clearinghouse Dashboard (Desktop: 40%, Mobile: full when mobileTab === 'clearinghouse') */}
            <div
              className={`h-full border-l border-[#E6E6E1] ${
                mobileTab === 'clearinghouse'
                  ? 'w-full lg:w-[40%] flex'
                  : 'hidden lg:flex lg:w-[40%]'
              }`}
            >
              <ClearinghouseDashboard
                telemetry={telemetry}
                onRefresh={fetchTelemetry}
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
