import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCommentDots as solidCommentDots, 
  faCopy, 
  faPaperPlane,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';
import './ChatBoard.css';

const ChatBoard = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
// API endpoint from Render
  const API_URL = 'https://ai-chatbot-api-pmxt.onrender.com/api/chat';

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const typeMessage = (text, sender) => {
    return new Promise((resolve) => {
      let currentText = '';
      let index = 0;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const interval = setInterval(() => {
        if (index < text.length) {
          currentText += text[index];
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, prevMessages.length - 1),
            { 
              text: currentText, 
              sender, 
              timestamp,
              id: Date.now() + index
            },
          ]);
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 20);
    });
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { 
      text: input, 
      sender: 'user', 
      timestamp,
      id: Date.now()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        message: input,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      const aiResponse = response.data.response;
      const botMessage = { 
        text: '', 
        sender: 'bot', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      await typeMessage(aiResponse, 'bot');
    } catch (error) {
      console.error('Chat error:', error);
      await typeMessage(
        "I'm having trouble connecting to the AI service. Please try again later.", 
        'bot'
      );
      setNotification({
        message: 'Connection error. Please check your network.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotification({ 
        message: 'Copied to clipboard!', 
        type: 'success' 
      });
    } catch (err) {
      setNotification({ 
        message: 'Failed to copy text', 
        type: 'error' 
      });
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      setNotification({
        message: 'Chat history cleared',
        type: 'success'
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages]);

  return (
    <div className={`chat-container ${isChatOpen ? 'open' : ''}`}>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <button 
        className="chat-toggle-button"
        onClick={toggleChat}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        <FontAwesomeIcon 
          icon={solidCommentDots} 
          size="lg" 
          className="chat-icon" 
        />
        {messages.length > 0 && (
          <span className="unread-indicator"></span>
        )}
      </button>

      {isChatOpen && (
        <div className="chat-board">
          <div className="chat-header">
            <h2>AI Assistant</h2>
            <div className="chat-actions">
              <button 
                className="clear-chat"
                onClick={clearChat}
                title="Clear chat history"
              >
                Clear
              </button>
              <button 
                className="close-chat"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="messages-container">
            <div className="messages">
              {messages.length === 0 && (
                <div className="empty-state">
                  <p>How can I help you today?</p>
                </div>
              )}

              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`message ${msg.sender}`}
                >
                  <div className="message-content">
                    {msg.text}
                    {msg.sender === 'bot' && msg.text && (
                      <button
                        className="copy-button"
                        onClick={() => copyToClipboard(msg.text)}
                        aria-label="Copy message"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    )}
                  </div>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="message bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="message-input">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              className={`send-button ${input.trim() && !isLoading ? 'active' : ''}`}
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoard;