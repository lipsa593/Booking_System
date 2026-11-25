import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = {
  id: number;
  text: string;
  from: 'assistant' | 'visitor';
};

const welcomeMessage: ChatMessage = {
  id: 1,
  from: 'assistant',
  text: 'Hello! I’m the Mysa House demo assistant. Ask me about booking, services, or opening hours.',
};

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = message.trim();

    if (!question) return;

    const visitorMessage: ChatMessage = {
      id: Date.now(),
      from: 'visitor',
      text: question,
    };
    const lowerQuestion = question.toLowerCase();
    let answer = 'Thanks for your message! This demo assistant can help with services, booking, and studio hours.';

    if (lowerQuestion.includes('hour') || lowerQuestion.includes('open')) {
      answer = 'The demo studio hours are Monday to Saturday, 9am–6pm.';
    } else if (lowerQuestion.includes('book') || lowerQuestion.includes('appointment')) {
      answer = 'To book, sign in and choose “Book a visit” in the header. Select your service, time, and contact details.';
    } else if (lowerQuestion.includes('service') || lowerQuestion.includes('price')) {
      answer = 'Browse our salon services on the home page. Each service shows its duration and price.';
    }

    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      from: 'assistant',
      text: answer,
    };

    setMessages(currentMessages => [...currentMessages, visitorMessage, assistantMessage]);
    setMessage('');
  }

  return (
    <div className="floating-assistant">
      {isOpen && (
        <section className="assistant-panel card" aria-label="Mysa House chat assistant">
          <header className="assistant-header">
            <span className="assistant-avatar"><Bot size={19} /></span>
            <div>
              <strong>Mysa assistant</strong>
              <small>Demo chat</small>
            </div>
            <button
              className="assistant-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map(chatMessage => (
              <p
                className={`assistant-message ${chatMessage.from === 'visitor' ? 'visitor-message' : ''}`}
                key={chatMessage.id}
              >
                {chatMessage.text}
              </p>
            ))}
          </div>

          <form className="assistant-form" onSubmit={sendMessage}>
            <input
              aria-label="Type a message"
              placeholder="Ask a question..."
              value={message}
              onChange={event => setMessage(event.target.value)}
            />
            <button type="submit" aria-label="Send message" disabled={!message.trim()}>
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        className="assistant-launcher"
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-label={isOpen ? 'Close assistant chat' : 'Open assistant chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
