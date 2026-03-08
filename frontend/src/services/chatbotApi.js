import api from "../api/client";

export const sendChatbotMessage = async (message) => {
  const { data } = await api.post("/chatbot", { message });
  return data;
};
