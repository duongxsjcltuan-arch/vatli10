import { Video, Flashcard, PracticeQuestion } from './types';
import { v4 as uuidv4 } from 'uuid'; // Simple way to get unique IDs

// --- THEORY DATA ---
interface TheoryData {
  [key: string]: {
    content: string;
  };
}

export const initialTheoryData: TheoryData = {
  newton2: {
    content: `
      <h4 class="font-bold text-lg mb-2">Định luật II Newton</h4>
      <p class="mb-2">Định luật II Newton phát biểu rằng: "Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật."</p>
      <p class="mb-2">Biểu thức toán học của định luật là:</p>
      <div class="bg-gray-100 p-2 rounded text-center my-2">
        <strong class="font-mono">F = ma</strong>
      </div>
      <p>Trong đó:</p>
      <ul class="list-disc pl-5">
        <li><strong>F</strong> là tổng hợp lực tác dụng lên vật (vector).</li>
        <li><strong>m</strong> là khối lượng của vật.</li>
        <li><strong>a</strong> là gia tốc của vật (vector).</li>
      </ul>
    `
  },
  freefall: {
    content: `
      <h4 class="font-bold text-lg mb-2">Sự Rơi Tự Do</h4>
      <p class="mb-2">Sự rơi tự do là sự rơi của một vật chỉ dưới tác dụng của trọng lực. Trong trường hợp này, mọi vật rơi tự do trong cùng một nơi và gần mặt đất sẽ có cùng một gia tốc, gọi là gia tốc rơi tự do (g).</p>
      <p class="mb-2">Các công thức mô tả chuyển động rơi tự do (nếu bỏ qua sức cản không khí):</p>
      <ul class="list-disc pl-5">
        <li>Vận tốc: <strong class="font-mono">v = gt</strong></li>
        <li>Quãng đường: <strong class="font-mono">s = ½gt²</strong></li>
        <li>Liên hệ v và s: <strong class="font-mono">v² = 2gs</strong></li>
      </ul>
      <p class="mt-2">Giá trị của <strong>g</strong> thường được lấy xấp xỉ là 9.8 m/s² hoặc 10 m/s².</p>
    `
  },
  circular: {
    content: `
      <h4 class="font-bold text-lg mb-2">Chuyển Động Tròn Đều</h4>
      <p class="mb-2">Chuyển động tròn đều là chuyển động của một vật trên một quỹ đạo tròn với tốc độ không đổi.</p>
      <p class="mb-2">Các đặc trưng của chuyển động tròn đều:</p>
      <ul class="list-disc pl-5">
        <li><strong>Tốc độ góc (ω):</strong> Đại lượng đo góc mà bán kính quét được trong một đơn vị thời gian.</li>
        <li><strong>Tốc độ dài (v):</strong> <strong class="font-mono">v = ωr</strong></li>
        <li><strong>Gia tốc hướng tâm (a_ht):</strong> Luôn hướng vào tâm quỹ đạo, có độ lớn <strong class="font-mono">a_ht = v²/r = ω²r</strong>.</li>
        <li><strong>Lực hướng tâm (F_ht):</strong> Lực gây ra gia tốc hướng tâm, <strong class="font-mono">F_ht = ma_ht</strong>.</li>
      </ul>
    `
  }
};


// --- VIDEO DATA ---
export const initialVideos: Video[] = [
    { id: uuidv4(), youtubeId: 'videoseries?list=PLQy4ElFl4GUbI7uLq0CzVqGq_kWizLKhQ', title: 'Tổng hợp Vật Lý 10 - Chân trời sáng tạo', channel: 'HOCMAI THPT' },
    { id: uuidv4(), youtubeId: '2fPYL5p1FBA', title: 'Định luật II Newton - Ví dụ và Bài tập', channel: 'Thầy Bùi Xuân Từ' },
    { id: uuidv4(), youtubeId: '0i5y_J2b_aA', title: 'Chuyển Động Tròn Đều', channel: 'Tuyensinh247.com' },
];


// --- FLASHCARD DATA ---
export const initialFlashcards: Flashcard[] = [
  { id: uuidv4(), term: 'Gia tốc (a)', definition: 'Đại lượng vật lí đặc trưng cho sự thay đổi của vận tốc theo thời gian. Đơn vị: m/s².' },
  { id: uuidv4(), term: 'Lực (F)', definition: 'Tác dụng đẩy hoặc kéo của vật này lên vật khác, gây ra gia tốc cho vật hoặc làm vật biến dạng. Đơn vị: Newton (N).' },
  { id: uuidv4(), term: 'Khối lượng (m)', definition: 'Đại lượng đặc trưng cho mức quán tính của vật. Đơn vị: kilogram (kg).' },
  { id: uuidv4(), term: 'Quán tính', definition: 'Tính chất của mọi vật có xu hướng bảo toàn vận tốc cả về hướng và độ lớn.' },
  { id: uuidv4(), term: 'Lực ma sát', definition: 'Lực cản trở chuyển động của vật này so với vật khác khi chúng tiếp xúc với nhau.' },
  { id: uuidv4(), term: 'Động năng', definition: 'Năng lượng mà một vật có được do chuyển động. Công thức: Wd = ½mv².' },
];


// --- PRACTICE QUESTION DATA ---
export const initialPracticeQuestions: PracticeQuestion[] = [
  {
    id: uuidv4(),
    questionText: 'Theo Định luật II Newton, khi lực tác dụng lên một vật tăng gấp đôi và khối lượng của vật không đổi, gia tốc của vật sẽ...',
    options: ['tăng gấp đôi', 'giảm một nửa', 'không đổi', 'tăng gấp bốn'],
    correctAnswerIndex: 0,
  },
  {
    id: uuidv4(),
    questionText: 'Trong chuyển động rơi tự do, đại lượng nào sau đây không đổi?',
    options: ['Vận tốc', 'Quãng đường đi được', 'Gia tốc', 'Thời gian rơi'],
    correctAnswerIndex: 2,
  },
  {
    id: uuidv4(),
    questionText: 'Lực hướng tâm tác dụng lên vật chuyển động tròn đều có tác dụng gì?',
    options: ['Làm thay đổi tốc độ của vật', 'Làm thay đổi hướng chuyển động của vật', 'Làm vật chuyển động nhanh dần', 'Làm vật chuyển động chậm dần'],
    correctAnswerIndex: 1,
  },
];