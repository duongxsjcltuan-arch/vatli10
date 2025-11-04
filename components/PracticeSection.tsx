import React, { useState, useEffect } from 'react';
import { PracticeQuestion } from '../types';

interface PracticeSectionProps {
  isAdmin: boolean;
  questions: PracticeQuestion[];
  onAddQuestion: (question: Omit<PracticeQuestion, 'id'>) => void;
  onUpdateQuestion: (question: PracticeQuestion) => void;
  onDeleteQuestion: (id: string) => void;
}

const PracticeSection: React.FC<PracticeSectionProps> = ({ isAdmin, questions, onAddQuestion, onUpdateQuestion, onDeleteQuestion }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Admin state
  const [isEditing, setIsEditing] = useState<PracticeQuestion | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  useEffect(() => {
    if (isEditing) {
      setQuestionText(isEditing.questionText);
      setOptions(isEditing.options);
      setCorrectAnswerIndex(isEditing.correctAnswerIndex);
      setIsAdding(false);
    }
  }, [isEditing]);

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  }

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setIsAdding(false);
    setIsEditing(null);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText && options.every(opt => opt.trim() !== '')) {
      if(isEditing) {
        onUpdateQuestion({
            id: isEditing.id,
            questionText,
            options,
            correctAnswerIndex,
        });
      } else {
        onAddQuestion({
            questionText,
            options,
            correctAnswerIndex,
        });
      }
      resetForm();
      alert(isEditing ? 'Đã cập nhật câu hỏi!' : 'Đã thêm câu hỏi mới!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin câu hỏi và các đáp án.');
    }
  };
  
  const AdminPanel = () => (
    <div className="bg-gray-100 p-4 rounded-lg mb-8 border border-gray-200">
       <h3 className="text-lg font-bold mb-4 text-gray-700">Bảng Điều Khiển Luyện Tập</h3>
       {isAdding || isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-3">
                <h4 className="font-semibold">{isEditing ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</h4>
                <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Nội dung câu hỏi" className="w-full p-2 border rounded" rows={3}/>
                {options.map((option, index) => (
                     <input key={index} type="text" value={option} onChange={(e) => {
                         const updatedOptions = [...options];
                         updatedOptions[index] = e.target.value;
                         setOptions(updatedOptions);
                     }} placeholder={`Đáp án ${index + 1}`} className="w-full p-2 border rounded"/>
                ))}
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Đáp án đúng:</label>
                    <select value={correctAnswerIndex} onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))} className="p-2 border rounded">
                        {options.map((_, index) => <option key={index} value={index}>Đáp án {index + 1}</option>)}
                    </select>
                </div>
                 <div className="flex space-x-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{isEditing ? 'Lưu thay đổi' : 'Thêm câu hỏi'}</button>
                    <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Hủy</button>
                </div>
            </form>
       ) : (
           <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Thêm Câu Hỏi Mới</button>
       )}
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">✏️ Luyện Tập Trắc Nghiệm</h2>
      
      {isAdmin && <AdminPanel />}

      {questions.length === 0 ? <p className="text-center text-gray-500">Chưa có câu hỏi nào. Admin có thể thêm mới.</p> :
      showResult ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Hoàn thành!</h3>
          <p className="text-lg mb-4">Bạn đã trả lời đúng {score} / {questions.length} câu.</p>
          <button onClick={restartQuiz} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Làm lại
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Câu {currentQuestionIndex + 1}:</h3>
                <p>{questions[currentQuestionIndex].questionText}</p>
              </div>
              {isAdmin && (
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => setIsEditing(questions[currentQuestionIndex])} className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Sửa</button>
                    <button onClick={() => {
                        if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
                            onDeleteQuestion(questions[currentQuestionIndex].id);
                        }
                    }} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Xóa</button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {questions[currentQuestionIndex].options.map((option, index) => {
              const isCorrect = index === questions[currentQuestionIndex].correctAnswerIndex;
              const isSelected = selectedAnswer === index;
              let buttonClass = 'w-full text-left p-3 rounded-lg border transition-colors ';
              if (selectedAnswer !== null) {
                if (isCorrect) buttonClass += 'bg-green-100 border-green-300 text-green-800';
                else if (isSelected) buttonClass += 'bg-red-100 border-red-300 text-red-800';
                else buttonClass += 'bg-gray-50 border-gray-200';
              } else {
                buttonClass += 'bg-gray-50 hover:bg-gray-100 border-gray-200';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <div className="text-right mt-6">
              <button onClick={handleNextQuestion} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Câu tiếp theo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeSection;