import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MessagesDashboard = ({ setUnreadCount }) => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get('/messages');
                console.log('Messages fetched:', response.data);
                setMessages(response.data);
                setFilteredMessages(response.data);
                setUnreadCount(response.data.filter(msg => !msg.isRead).length);
            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        };

        fetchMessages();
    }, [setUnreadCount]);

    useEffect(() => {
        const results = messages.filter(message =>
            `${message.firstName} ${message.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMessages(results);
    }, [searchQuery, messages]);

    const deleteMessage = async (id) => {
        try {
            await axiosInstance.delete(`/messages/${id}`);
            setMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
            setFilteredMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
        } catch (error) {
            console.error('Error deleting message:', error.message);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await axiosInstance.patch(`/messages/${id}`, { isRead: true });
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === id ? { ...message, isRead: true } : message
                )
            );
            setUnreadCount((prevCount) => prevCount - 1);
            setFilteredMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === id ? { ...message, isRead: true } : message
                )
            );
        } catch (error) {
            console.error('Error marking message as read:', error.message);
        }
    };

    const goBack = () => {
        navigate('/admin');
    };

    return (
        <div className="messages-dashboard">
            <style>{`
                .messages-dashboard {
                    padding: 20px;
                    background-color: rgb(241, 235, 235);
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    max-width: 100%;
                    min-height: 100vh;
                    overflow-x: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative; 
                }

                h3 {
                    margin-bottom: 20px;
                    color: #333;
                }

                .back-icon {
                    position: absolute;
                    top: 20px; 
                    left: 20px; 
                    cursor: pointer;
                    font-size: 20px; 
                    color: rgb(255, 255, 255);
                    background-color: #0f9499;
                    padding: 15px; 
                    border-radius: 50%; 
                    transition: transform 0.2s, background-color 0.3s; 
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); 
                    z-index: 1; 
                }

                .back-icon:hover {
                    transform: scale(1.1);
                    background-color: #066b6e; 
                }

                .search-input {
                    padding: 10px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: 100%;
                    max-width: 500px;
                }

                .messages-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                }

                .message-box {
                    background-color: #fff;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    width: 450px;
                    max-width: 100%;
                    position: relative;
                    transition: transform 0.2s;
                }

                .message-box:hover {
                    transform: scale(1.02);
                }

                .message-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .message-header h4 {
                    margin: 0;
                    color: rgb(6, 50, 92);
                    font-size: 1.1em;
                }

                .message-body p {
                    margin: 0;
                    color: #555;
                    font-size: 0.95em;
                }

                .message-footer {
                    margin-top: 8px;
                    color: #999;
                    font-size: 0.8em;
                    text-align: right;
                }

                .delete-icon {
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 1.2em;
                    color: #f44336;
                }

                .contact-info a {
                    color: #4caf50;
                    text-decoration: none;
                    margin-right: 5px;
                }

                @media (max-width: 600px) {
                    .message-box {
                        width: 95%;
                    }

                    .message-header,
                    .message-footer {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .message-footer {
                        text-align: left;
                    }

                    .delete-icon {
                        top: 5px;
                        right: 5px;
                        font-size: 1em;
                    }
                }
            `}</style>

            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={goBack} />
            <h3>Messages</h3>

            <input
                type="text"
                className="search-input"
                placeholder="Search by Name or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="messages-container">
                {filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                        <div key={message._id} className={`message-box ${message.isRead ? '' : 'unread'}`}>
                            <div className="message-header">
                                <h4>{message.firstName} {message.lastName}</h4>
                                <div className="contact-info">
                                    <a href={`mailto:${message.email}`}>{message.email}</a> | 
                                    <a href={`tel:${message.phone}`}>{message.phone}</a>
                                </div>
                            </div>
                            <div className="message-body">
                                <p>{message.message}</p>
                            </div>
                            <div className="message-footer">
                                {new Date(message.date).toLocaleDateString()}
                            </div>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="delete-icon"
                                onClick={() => deleteMessage(message._id)}
                            />
                            {!message.isRead && (
                                <button onClick={() => markAsRead(message._id)}>Mark as Read</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No messages found.</p>
                )}
            </div>
        </div>
    );
};

export default MessagesDashboard;