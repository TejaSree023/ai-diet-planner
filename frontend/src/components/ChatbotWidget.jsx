import { useEffect, useMemo, useRef, useState } from "react";
import { sendChatbotMessage } from "../services/chatbotApi";

const initialBotMessage = {
  id: "welcome",
  role: "bot",
  text: "Hi! Ask me about high-protein foods, low-calorie snacks, high-fibre foods, vegetarian breakfast, or BMI.",
  foods: [],
  createdAt: Date.now(),
};

const QUICK_PROMPTS = [
  "Suggest high protein foods",
  "Give low calorie snacks",
  "Foods rich in fiber",
  "Show vegetarian breakfast",
  "What is BMI?",
];

const FoodList = ({ foods, onUseFood }) => {
  if (!foods?.length) return null;

  return (
    <div className="chatbot-food-list">
      {foods.map((food) => (
        <div key={`${food.name}-${food.calories}`} className="chatbot-food-card">
          <p className="chatbot-food-name">{food.name}</p>
          <p className="chatbot-food-meta">
            {food.calories} kcal | P {food.protein} | C {food.carbs} | F {food.fat}
          </p>
          <button type="button" className="chatbot-food-action" onClick={() => onUseFood(food.name)}>
            Ask details
          </button>
        </div>
      ))}
    </div>
  );
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([initialBotMessage]);
  const listRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const sendQuery = async (text) => {
    if (!text || loading) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      foods: [],
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatbotMessage(text);
      const botMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: response.reply || "I found this from your nutrition dataset.",
        foods: response.foods || [],
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const fallback = {
        id: `e-${Date.now()}`,
        role: "bot",
        text: error.response?.data?.message || "Chatbot is unavailable right now.",
        foods: [],
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    await sendQuery(text);
  };

  const onClear = () => {
    setMessages([initialBotMessage]);
    setInput("");
  };

  const formatTime = (value) => new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chatbot-widget" aria-live="polite">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <p className="chatbot-title">Nutrition Assistant</p>
              <p className="chatbot-subtitle">Powered by your food dataset</p>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">
              x
            </button>
          </div>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-bubble-row ${msg.role === "user" ? "is-user" : "is-bot"}`}>
                <div className={`chatbot-bubble ${msg.role === "user" ? "bubble-user" : "bubble-bot"}`}>
                  <p>{msg.text}</p>
                  <FoodList foods={msg.foods} onUseFood={(name) => sendQuery(`Tell me more about ${name}`)} />
                  <p className="chatbot-time">{formatTime(msg.createdAt)}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-bubble-row is-bot">
                <div className="chatbot-bubble bubble-bot">
                  <p className="chatbot-typing" aria-label="Bot is typing">
                    <span />
                    <span />
                    <span />
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-quick-prompts">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chatbot-prompt-chip"
                disabled={loading}
                onClick={() => sendQuery(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="chatbot-input-wrap" onSubmit={sendMessage}>
            <input
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about foods and nutrition..."
            />
            <button type="submit" className="chatbot-send" disabled={!canSend}>
              Send
            </button>
            <button type="button" className="chatbot-clear" onClick={onClear} disabled={loading}>
              Clear
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open nutrition chatbot"
      >
        AI
      </button>
    </div>
  );
};

export default ChatbotWidget;
