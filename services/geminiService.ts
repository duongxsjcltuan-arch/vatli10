import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const askGeneralQuestion = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // FIX: Simplified `contents` to a string for a single text prompt, as per best practices.
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful AI assistant for a Physics 10 learning website. You can answer general physics questions or help users navigate the website. The available sections are: 'lý thuyết' (theory), 'mô phỏng' (simulation), 'luyện tập' (practice), 'gia sư' (tutor), 'video', 'flashcard', and 'lớp học' (classroom). Respond in Vietnamese.`
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};


export const askTutor = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are an expert physics tutor for 10th-grade students in Vietnam. Explain concepts clearly, concisely, and use helpful analogies. Be friendly and encouraging. Respond in Vietnamese."
            }
        });
        const response = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for Tutor:", error);
        return "Xin lỗi, tôi đang gặp sự cố. Bạn có thể hỏi lại sau được không?";
    }
};
