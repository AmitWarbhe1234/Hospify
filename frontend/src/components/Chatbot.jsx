import { useState } from "react";
import { sendChatMessage } from "../services/api";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");

    try {
      const response = await sendChatMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">

          <div className="chatbot-header">
            <span>Hospify Assistant</span>

            <button onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                Hello 👋
                <br />
                How can I help you?
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "chat-message user-message"
                    : "chat-message bot-message"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button onClick={handleSend}>
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;