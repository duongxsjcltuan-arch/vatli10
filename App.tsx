import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import Footer from './components/Footer';
import TheorySection from './components/TheorySection';
import SimulationSection from './components/SimulationSection';
import PracticeSection from './components/PracticeSection';
import TutorSection from './components/TutorSection';
import VideoSection from './components/VideoSection';
import FlashcardSection from './components/FlashcardSection';
import AIAssistant from './components/AIAssistant';
import LoginModal from './components/LoginModal';
import { Section, Video, Flashcard, PracticeQuestion } from './types';
import { initialVideos, initialFlashcards, initialPracticeQuestions } from './data';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- State Management for Content ---
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>(initialPracticeQuestions);

  // --- Navigation Handler ---
  const handleNavigate = useCallback((section: Section) => {
    setActiveSection(section);
    if (section !== Section.HERO) {
      setTimeout(() => {
        document.getElementById('section-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // --- Auth Handlers ---
  const handleLogin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'admin') {
      setIsAdmin(true);
      setShowLoginModal(false);
      alert('Đăng nhập admin thành công!');
    } else {
      alert('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    alert('Đã đăng xuất.');
  };

  // --- Content Management Handlers ---

  // Videos
  const handleAddVideo = (video: Omit<Video, 'id'>) => setVideos(prev => [...prev, { ...video, id: uuidv4() }]);
  const handleUpdateVideo = (updatedVideo: Video) => setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
  const handleDeleteVideo = (id: string) => setVideos(prev => prev.filter(v => v.id !== id));

  // Flashcards
  const handleAddFlashcard = (flashcard: Omit<Flashcard, 'id'>) => setFlashcards(prev => [...prev, { ...flashcard, id: uuidv4() }]);
  const handleUpdateFlashcard = (updatedCard: Flashcard) => setFlashcards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  const handleDeleteFlashcard = (id: string) => setFlashcards(prev => prev.filter(c => c.id !== id));
  
  // Practice Questions
  const handleAddQuestion = (question: Omit<PracticeQuestion, 'id'>) => setPracticeQuestions(prev => [...prev, { ...question, id: uuidv4() }]);
  const handleUpdateQuestion = (updatedQuestion: PracticeQuestion) => setPracticeQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  const handleDeleteQuestion = (id: string) => setPracticeQuestions(prev => prev.filter(q => q.id !== id));


  // --- Section Renderer ---
  const renderSection = () => {
    switch (activeSection) {
      case Section.THEORY:
        return <TheorySection />;
      case Section.SIMULATION:
        return <SimulationSection />;
      case Section.PRACTICE:
        return <PracticeSection 
                    isAdmin={isAdmin}
                    questions={practiceQuestions}
                    onAddQuestion={handleAddQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                />;
      case Section.TUTOR:
        return <TutorSection />;
      case Section.VIDEO:
        return <VideoSection 
                    isAdmin={isAdmin}
                    videos={videos}
                    onAdd={handleAddVideo}
                    onUpdate={handleUpdateVideo}
                    onDelete={handleDeleteVideo}
                />;
      case Section.FLASHCARD:
        return <FlashcardSection
                    isAdmin={isAdmin}
                    flashcards={flashcards}
                    onAdd={handleAddFlashcard}
                    onUpdate={handleUpdateFlashcard}
                    onDelete={handleDeleteFlashcard}
                 />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 font-sans text-gray-800">
      <Header 
        onNavigate={handleNavigate} 
        isAdmin={isAdmin}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
      />
      <main>
        {activeSection === Section.HERO ? (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <Features onNavigate={handleNavigate} />
          </>
        ) : (
          <div id="section-container" className="container mx-auto px-6 py-12 min-h-screen">
            {renderSection()}
          </div>
        )}
      </main>
      <Footer />
      <AIAssistant navigateTo={handleNavigate} />
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
    </div>
  );
};

export default App;