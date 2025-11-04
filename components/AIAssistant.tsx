// Fix: Add type definitions for Web Speech API which are not standard in TypeScript DOM typings.
// This resolves errors about 'SpeechRecognition' not being found.
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Section } from '../types';
import { askGeneralQuestion } from '../services/geminiService';

interface AIAssistantProps {
  navigateTo: (section: Section) => void;
}

const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M8.5 12.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"/>
    </svg>
);

const MicIcon = ({ isListening }: { isListening: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${isListening ? 'text-green-400' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
  </svg>
);


const AIAssistant: React.FC<AIAssistantProps> = ({ navigateTo }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Đang chờ...');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopAllSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text: string, isStatusUpdate: boolean) => {
    if (isStatusUpdate) {
      setStatus(text);
      setResponse('');
    } else {
      setStatus("Phản hồi từ AI:");
      setResponse(text);
    }
    stopAllSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [stopAllSpeech]);

  const processCommand = useCallback(async (command: string) => {
    const lowerCommand = command.toLowerCase();
    const navCommands: { [key in Section]?: string[] } = {
      [Section.HERO]: ['trang chủ', 'home'],
      [Section.THEORY]: ['lý thuyết', 'học liệu'],
      [Section.SIMULATION]: ['mô phỏng', 'thí nghiệm'],
      [Section.PRACTICE]: ['luyện tập', 'bài tập'],
      [Section.TUTOR]: ['gia sư', 'hỏi đáp'],
      [Section.VIDEO]: ['video'],
      [Section.FLASHCARD]: ['flashcard', 'thẻ ghi nhớ'],
      [Section.CLASSROOM]: ['lớp học', 'phòng học'],
    };

    let isNavigationCommand = false;
    for (const section in navCommands) {
      const keywords = navCommands[section as Section];
      if (keywords?.some(keyword => lowerCommand.includes(keyword))) {
        speak(`Đang chuyển đến mục ${section}...`, true);
        navigateTo(section as Section);
        isNavigationCommand = true;
        setTimeout(() => setIsVisible(false), 2000);
        break;
      }
    }

    if (!isNavigationCommand) {
      speak("Để tôi suy nghĩ một lát...", true);
      const aiResponse = await askGeneralQuestion(command);
      speak(aiResponse, false);
    }
  }, [navigateTo, speak]);


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Trình duyệt không hỗ trợ nhận diện giọng nói.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Đang nghe...');
      setResponse('');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (status === 'Đang nghe...') {
        setStatus('Nhấn nút micro để bắt đầu');
      }
    };

    recognition.onerror = (event) => {
      let errorMsg = 'Đã xảy ra lỗi: ' + event.error;
      if (event.error === 'no-speech') errorMsg = 'Không nghe thấy gì cả. Vui lòng thử lại.';
      else if (event.error === 'not-allowed') errorMsg = 'Bạn đã chặn quyền sử dụng micro.';
      speak(errorMsg, true);
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      setStatus(`Bạn đã nói: "${command}"`);
      processCommand(command);
    };

    recognitionRef.current = recognition;
  }, [processCommand, speak, status]);


  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        setStatus("Lỗi. Thử lại sau.");
      }
    }
  };
  
  const openChat = () => {
    setIsVisible(true);
    speak("Chào bạn, tôi là trợ lý AI. Bạn có thể hỏi tôi về vật lí, hoặc ra lệnh bằng giọng nói để điều hướng trang web nhé.", true);
    setTimeout(() => {
        if(!isListening){
            handleMicClick();
        }
    }, 2000);
  }

  const closeChat = () => {
      setIsVisible(false);
      stopAllSpeech();
      if(isListening && recognitionRef.current){
          recognitionRef.current.stop();
      }
  }


  return (
    <>
      <button 
        id="ai-fab"
        onClick={openChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:bg-blue-700 hover:scale-110 transform transition-all duration-300 z-50"
        aria-label="Mở trợ lý AI"
      >
        <RobotIcon />
      </button>

      {isVisible && (
        <div 
          id="ai-chat-window"
          className="fixed bottom-24 right-6 w-[350px] max-h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up"
        >
          <div id="ai-chat-header" className="bg-blue-600 text-white p-4 font-bold flex justify-between items-center">
            <span>Trợ lý AI Vật Lí</span>
            <button onClick={closeChat} id="ai-chat-close" className="text-2xl leading-none hover:text-blue-200">&times;</button>
          </div>
          <div id="ai-chat-body" className="flex-grow p-4 overflow-y-auto bg-gray-50 min-h-[150px]">
            <div id="ai-chat-status" className="text-sm text-gray-600 italic mb-2 min-h-[1.2em]">{status}</div>
            <div id="ai-chat-response" className="text-sm text-gray-800 whitespace-pre-wrap">{response}</div>
          </div>
          <div id="ai-chat-footer" className="p-4 bg-gray-100 border-t border-gray-200 text-center">
            <button 
              id="micButton"
              onClick={handleMicClick}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isListening ? 'bg-green-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
              aria-label={isListening ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
            >
              <MicIcon isListening={isListening} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;