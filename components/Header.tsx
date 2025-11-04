import React from 'react';
import { Section } from '../types';
import LoginModal from './LoginModal';

interface HeaderProps {
  onNavigate: (section: Section) => void;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isAdmin, onLoginClick, onLogoutClick }) => {
  const mainNavItems = [
    { name: 'Trang Chủ', section: Section.HERO },
    { name: 'Lý Thuyết', section: Section.THEORY },
    { name: 'Mô Phỏng', section: Section.SIMULATION },
    { name: 'Luyện Tập', section: Section.PRACTICE },
    { name: 'Video', section: Section.VIDEO },
    { name: 'Flashcard', section: Section.FLASHCARD },
  ];
  
  const tutorNavItem = { name: 'AI Gia Sư', section: Section.TUTOR };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(Section.HERO)}>
          <div className="text-2xl">⚛️</div>
          <span className="font-bold text-xl text-blue-600">Vật Lí 10 AI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {mainNavItems.map(item => (
                <button
                  key={item.section}
                  onClick={() => onNavigate(item.section)}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            
            <button
                onClick={() => onNavigate(tutorNavItem.section)}
                className="font-semibold text-red-600 hover:text-red-700 transition-colors border border-red-200 px-3 py-1 rounded-full hover:bg-red-50"
            >
                {tutorNavItem.name}
            </button>
            
            {isAdmin ? (
                <button onClick={onLogoutClick} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Đăng Xuất
                </button>
            ) : (
                <button onClick={onLoginClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Đăng Nhập
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;