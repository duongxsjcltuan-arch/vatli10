import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askTutor } from '../services/geminiService';

const TutorSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Xin chào! Tôi là AI gia sư vật lí. Bạn có câu hỏi nào về chương trình lớp 10 không?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // FIX: Refactored handleSend to accept an optional message to avoid race conditions with state updates from suggestion clicks.
  const handleSend = async (messageOverride?: string) => {
    const message = messageOverride || input;
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini API
    const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const aiResponseText = await askTutor(message, history as any);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  const handleSuggestionClick = (question: string) => {
      // Directly call handleSend with the question to ensure the correct message is sent.
      handleSend(question);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🤖 AI Gia Sư Vật Lí</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col">
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4 border flex-grow">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="p-3 rounded-lg bg-gray-200 text-gray-500">
                        <span className="animate-pulse">AI đang soạn câu trả lời...</span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi AI về vật lí..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button onClick={() => handleSend()} disabled={isLoading} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
              Gửi
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Câu Hỏi Gợi Ý</h3>
          <div className="space-y-2">
            <button onClick={() => handleSuggestionClick('Giải thích định luật I Newton')} className="w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left text-sm">Giải thích định luật I Newton</button>
            <button onClick={() => handleSuggestionClick('Tại sao có lực ma sát?')} className="w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left text-sm">Tại sao có lực ma sát?</button>
            <button onClick={() => handleSuggestionClick('Công thức tính động năng là gì?')} className="w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left text-sm">Công thức tính động năng là gì?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorSection;
