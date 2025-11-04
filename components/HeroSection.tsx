import React from 'react';
import { Section } from '../types';

interface HeroSectionProps {
  onNavigate: (section: Section) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => (
  <section className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20 text-center">
    <div className="container mx-auto px-6">
      <div 
        className="inline-block p-4 bg-white/20 rounded-2xl mb-8 shadow-lg"
      >
        <div className="text-6xl">⚛️</div>
      </div>
      <h2 
        className="text-4xl md:text-5xl font-bold mb-6"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        Học Vật Lí 10 Thông Minh Với AI
      </h2>
      <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
        Khám phá thế giới vật lí qua mô phỏng tương tác, gia sư thông minh và bài tập thực hành.
      </p>
      <button 
        onClick={() => onNavigate(Section.THEORY)} 
        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-blue-100 transition-transform transform hover:scale-105 duration-300"
      >
        Bắt đầu học
      </button>
    </div>
  </section>
);

export default HeroSection;