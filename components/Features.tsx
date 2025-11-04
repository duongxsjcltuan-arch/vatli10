
import React from 'react';
import { Section } from '../types';

interface FeaturesProps {
  onNavigate: (section: Section) => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const features = [
    { id: Section.THEORY, icon: '📚', title: 'Lý Thuyết Thông Minh', desc: 'SGK + AI giải thích dễ hiểu', button: 'Học Ngay', color: 'blue' },
    { id: Section.SIMULATION, icon: '🧪', title: 'Mô Phỏng Tương Tác', desc: 'Thí nghiệm ảo trực quan', button: 'Thí Nghiệm', color: 'green' },
    { id: Section.PRACTICE, icon: '✏️', title: 'Luyện Tập AI', desc: 'Bài tập đa dạng, chấm điểm tự động', button: 'Làm Bài', color: 'purple' },
    { id: Section.TUTOR, icon: '🤖', title: 'AI Gia Sư', desc: 'Hỏi đáp vật lí thông minh 24/7', button: 'Hỏi AI', color: 'red' }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(feature => (
            <div key={feature.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{feature.desc}</p>
              <button onClick={() => onNavigate(feature.id)} className={`bg-${feature.color}-600 text-white px-5 py-2 rounded-lg hover:bg-${feature.color}-700 transition-colors w-full`}>
                {feature.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
