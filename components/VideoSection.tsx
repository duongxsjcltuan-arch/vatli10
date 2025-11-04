import React, { useState, useEffect } from 'react';
import { Video } from '../types';

interface VideoSectionProps {
  isAdmin: boolean;
  videos: Video[];
  onAdd: (video: Omit<Video, 'id'>) => void;
  onUpdate: (video: Video) => void;
  onDelete: (id: string) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ isAdmin, videos, onAdd, onUpdate, onDelete }) => {
  // 'editing' can be a video object for editing, or true for adding a new one
  const [formState, setFormState] = useState<{ mode: 'closed' | 'add' | 'edit'; video?: Video }>({ mode: 'closed' });

  // State for the form inputs
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [channel, setChannel] = useState('');

  // When formState changes to 'edit', populate the form fields
  useEffect(() => {
    if (formState.mode === 'edit' && formState.video) {
      setTitle(formState.video.title);
      setYoutubeId(formState.video.youtubeId);
      setChannel(formState.video.channel);
    } else {
      // Reset fields for 'add' or 'closed' mode
      setTitle('');
      setYoutubeId('');
      setChannel('');
    }
  }, [formState]);

  const handleEditClick = (video: Video) => {
    setFormState({ mode: 'edit', video: video });
  };

  const handleAddClick = () => {
    setFormState({ mode: 'add' });
  };

  const handleCancel = () => {
    setFormState({ mode: 'closed' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId || !channel) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (formState.mode === 'edit' && formState.video) {
      onUpdate({ id: formState.video.id, title, youtubeId, channel });
    } else if (formState.mode === 'add') {
      onAdd({ title, youtubeId, channel });
    }

    handleCancel(); // Close form and reset fields
  };
  
  const handleDelete = (id: string) => {
      if (window.confirm('Bạn có chắc muốn xóa video này?')) {
          onDelete(id);
      }
  }

  const AdminPanel = () => (
    <div className="bg-gray-100 p-4 rounded-lg mb-8 border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-700">Bảng Điều Khiển Video</h3>
      {formState.mode !== 'closed' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="font-semibold">{formState.mode === 'edit' ? 'Chỉnh Sửa Video' : 'Thêm Video Mới'}</h4>
          <input type="text" placeholder="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="text" placeholder="YouTube ID (ví dụ: 2fPYL5p1FBA)" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="text" placeholder="Tên kênh" value={channel} onChange={e => setChannel(e.target.value)} className="w-full p-2 border rounded"/>
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{formState.mode === 'edit' ? 'Lưu thay đổi' : 'Thêm Video'}</button>
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Hủy</button>
          </div>
        </form>
      ) : (
        <button onClick={handleAddClick} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Thêm Video Mới</button>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🎬 Video Bài Giảng</h2>
      
      {isAdmin && <AdminPanel />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map(video => (
          <div key={video.id} className="rounded-lg overflow-hidden shadow-md group border flex flex-col">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-4 bg-white flex-grow flex flex-col">
              <h3 className="font-semibold text-gray-800 truncate flex-grow">{video.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Kênh: {video.channel}</p>
            </div>
             {isAdmin && (
                <div className="bg-gray-50 p-3 border-t flex justify-end items-center space-x-2">
                   <button onClick={() => handleEditClick(video)} className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors">Sửa</button>
                   <button onClick={() => handleDelete(video.id)} className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">Xóa</button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;