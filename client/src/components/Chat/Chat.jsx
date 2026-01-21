import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../Api/axios";
import "./Chat.css";

export default function Chat() {
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const name = user?.username || "there";
      setMessages([
        { sender: "bot", text: `Hi ${name}, how can I help you?` }
      ]);
    }
  }, [isOpen]);

  function toggleChat() {
    setIsOpen(!isOpen);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await api.post("/chat", { message: userMessage.text });

      const botMessage = {
        sender: "bot",
        text: res.data.reply
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Support is currently unavailable." }
      ]);
    }
  }

  return (
    <>
      <div className="chat-bubble" onClick={toggleChat}>
        Support
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            Live Support
            <span className="chat-close" onClick={toggleChat}>×</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.sender === "bot"
                    ? "chat-message bot-message"
                    : "chat-message user-message"
                }
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
