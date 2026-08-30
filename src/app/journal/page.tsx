'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface JournalEntry {
  id: string;
  title: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: number }[];
  createdAt: any;
  updatedAt: any;
}

export default function JournalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant'; content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'journal'),
      orderBy('updatedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as JournalEntry));
      setEntries(data);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewConversation = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'users', user.uid, 'journal'), {
      title: 'New Conversation',
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setActiveEntry({ id: docRef.id, title: 'New Conversation', messages: [], createdAt: null, updatedAt: null });
    setMessages([]);
  };

  const loadEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setMessages(entry.messages || []);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || !activeEntry || sending) return;
    const userMsg = input.trim();
    setInput('');
    setSending(true);

    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/help-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: newMessages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        }),
      });
      const data = await res.json();
      const aiMsg = data.response || data.message || 'I could not generate a response.';

      const updatedMessages = [...newMessages, { role: 'assistant' as const, content: aiMsg }];
      setMessages(updatedMessages);

      const entryRef = doc(db, 'users', user.uid, 'journal', activeEntry.id);
      const title = updatedMessages.length <= 2 ? userMsg.slice(0, 50) : activeEntry.title;
      await updateDoc(entryRef, {
        messages: updatedMessages.map(m => ({ ...m, timestamp: Date.now() })),
        title,
        updatedAt: serverTimestamp(),
      });
      if (updatedMessages.length <= 2) {
        setActiveEntry(prev => prev ? { ...prev, title } : prev);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error: Could not reach AI. Please try again.' }]);
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📓</span> AI Journal
          </h1>
          <p className="text-xs text-white/40 mt-1">Private conversations with Gemini</p>
          <p className="text-[10px] text-white/30 mt-0.5 font-mono">{user.email}</p>
        </div>
        <button onClick={startNewConversation} className="mx-3 mt-3 px-4 py-2.5 bg-[#007AFF] hover:bg-[#0071E3] rounded-lg text-sm font-medium transition-colors">+ New Conversation</button>
        <div className="flex-1 overflow-y-auto mt-3 px-2 space-y-1">
          {entries.map(entry => (
            <button key={entry.id} onClick={() => loadEntry(entry)} className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${activeEntry?.id === entry.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/80'}`}>
              {entry.title || 'Untitled'}
            </button>
          ))}
          {entries.length === 0 && (
            <p className="text-white/30 text-xs text-center mt-8 px-4">No conversations yet. Start a new one to brainstorm with Gemini AI.</p>
          )}
        </div>
        <div className="p-3 border-t border-white/10">
          <p className="text-[10px] text-white/30 text-center">🔒 All conversations are private and stored in your isolated Firestore space</p>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {activeEntry ? (
          <>
            <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/80 truncate max-w-lg">{activeEntry.title}</h2>
              <span className="text-[10px] text-white/30 font-mono">Gemini 2.5 Flash | User-Isolated Storage</span>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#007AFF] text-white rounded-br-md' : 'bg-white/10 text-white/90 rounded-bl-md'}`}>
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-6 py-4 border-t border-white/10">
              <div className="flex gap-3">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Brainstorm with Gemini AI..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 focus:ring-1 focus:ring-[#007AFF]/30" disabled={sending} />
                <button onClick={sendMessage} disabled={!input.trim() || sending} className="px-5 py-3 bg-[#007AFF] hover:bg-[#0071E3] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-colors">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📓</div>
              <h2 className="text-xl font-bold text-white mb-2">Your Private AI Journal</h2>
              <p className="text-white/40 text-sm max-w-md">Brainstorm ideas, plan your harvests, analyze market trends, or just think out loud with Gemini AI. Every conversation is encrypted and stored in your personal Firestore space.</p>
              <button onClick={startNewConversation} className="mt-6 px-6 py-3 bg-[#007AFF] hover:bg-[#0071E3] rounded-xl text-sm font-medium transition-colors">Start Your First Conversation</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
