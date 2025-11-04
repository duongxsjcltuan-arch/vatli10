import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';

interface FlashcardSectionProps {
  isAdmin: boolean;
  flashcards: Flashcard[];
  onAdd: (card: Omit<Flashcard, 'id'>) => void;
  onUpdate: (card: Flashcard) => void;
  onDelete: (id: string) => void;
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ isAdmin, flashcards, onAdd, onUpdate, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  
  const currentCard = flashcards[currentIndex];

  useEffect(() => {
    if (currentCard && !isAdding) {
      setTerm(currentCard.term);
      setDefinition(currentCard.definition);
    } else {
       setTerm('');
       setDefinition('');
    }
  }, [currentCard, isAdding]);

  const handleNext = () => {
    setIsFlipped(false);
    setIsEditing(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setIsEditing(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!term || !definition) return;
    if(isAdding){
        onAdd({ term, definition });
        setIsAdding(false);
    } else if(isEditing && currentCard) {
        onUpdate({ ...currentCard, term, definition });
        setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
      if(currentCard && window.confirm('Bạn có chắc muốn xóa flashcard này?')){
          onDelete(currentCard.id);
          if (currentIndex >= flashcards.length - 1) {
              setCurrentIndex(0);
          }
      }
  }
  
  const AdminCardForm = () => (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input type="text" placeholder="Thuật ngữ" value={term} onChange={e => setTerm(e.target.value)} className="w-full p-2 border rounded"/>
        <textarea placeholder="Định nghĩa" value={definition} onChange={e => setDefinition(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
        <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">{isAdding ? 'Thêm' : 'Lưu'}</button>
            <button type="button" onClick={() => { setIsEditing(false); setIsAdding(false); }} className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm">Hủy</button>
        </div>
    </form>
  )
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🃏 Flashcard Ôn Tập</h2>
      
      {flashcards.length > 0 ? (
          <>
            <div className="[perspective:1000px]">
                <div
                className={`relative w-full h-64 transition-transform duration-500 [transform-style:preserve-3d] ${!isEditing && 'cursor-pointer'} ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                onClick={() => !isEditing && setIsFlipped(!isFlipped)}
                >
                <div className="absolute w-full h-full [backface-visibility:hidden] bg-blue-500 text-white rounded-lg flex items-center justify-center p-6 shadow-lg">
                    {isEditing ? <AdminCardForm /> : <h3 className="text-3xl font-bold">{currentCard?.term}</h3>}
                </div>
                <div className="absolute w-full h-full [backface-visibility:hidden] bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center p-6 shadow-lg [transform:rotateY(180deg)]">
                     {isEditing ? <AdminCardForm /> : <p className="text-lg">{currentCard?.definition}</p>}
                </div>
                </div>
            </div>
            
            <p className="text-gray-500 mt-4">Nhấn vào thẻ để xem định nghĩa</p>

            <div className="flex justify-between items-center mt-6">
                <button onClick={handlePrev} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors">Trước</button>
                <span className="font-semibold">{currentIndex + 1} / {flashcards.length}</span>
                <button onClick={handleNext} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors">Sau</button>
            </div>
          </>
      ) : (
          <p className="text-gray-500">Chưa có flashcard nào. Admin có thể thêm mới.</p>
      )}

      {isAdmin && (
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-bold mb-2 text-gray-700">Quản Lý Flashcard (Admin)</h3>
          {isAdding ? (
              <AdminCardForm />
          ) : (
            <div className="flex space-x-2 justify-center">
                <button onClick={() => { setIsAdding(true); setIsEditing(true); setIsFlipped(false); }} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Thêm mới</button>
                {flashcards.length > 0 && <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">Sửa thẻ này</button>}
                {flashcards.length > 0 && <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">Xóa thẻ này</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardSection;