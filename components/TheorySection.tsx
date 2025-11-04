

import React, { useState } from 'react';
import { initialTheoryData } from '../data';

const TheorySection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    { id: 'newton2', title: 'Định luật II Newton', desc: 'F = ma - Lực và gia tốc' },
    { id: 'freefall', title: 'Rơi Tự Do', desc: 'Chuyển động dưới tác dụng trọng lực' },
    { id: 'circular', title: 'Chuyển Động Tròn', desc: 'Lực hướng tâm và vận tốc góc' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📚 Lý Thuyết Thông Minh</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Chương 1: Động Học</h3>
          <div className="space-y-3">
            {topics.map(topic => (
              <div
                key={topic.id}
                className={`p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${selectedTopic === topic.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-blue-50'}`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                <h4 className="font-medium">{topic.title}</h4>
                <p className="text-sm text-gray-600">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="theoryContent" className="bg-gray-50 rounded-lg p-6 border">
          {selectedTopic ? (
            <div dangerouslySetInnerHTML={{ __html: initialTheoryData[selectedTopic].content }} />
          ) : (
            <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
              <div className="text-4xl mb-4">🎯</div>
              <p>Chọn một chủ đề để AI giải thích chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheorySection;