import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { faTimes, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Notification = ({ message, type, onClose }) => {
    const [countdown, setCountdown] = useState(5);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (countdown === 0) {
            handleClose();
            return;
        }
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const getNotificationStyles = () => {
        const baseStyles = {
            success: {
                icon: faCheckCircle,
                iconColor: '#d1fae5',
                gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(52, 211, 153, 0.95))'
            },
            error: {
                icon: faExclamationTriangle,
                iconColor: '#fee2e2',
                gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(248, 113, 113, 0.95))'
            }
        };
        return baseStyles[type] || baseStyles.error;
    };

    const styles = getNotificationStyles();

    return (
        <div className={`notification ${type} ${isExiting ? 'exiting' : ''}`}>
            <style>
                {`
                    .notification {
                        position: fixed;
                        top: 0; /* Changed from calc() to 0 to cover header */
                        right: 0;
                        margin: 20px;
                        padding: 20px 25px;
                        border-radius: 14px;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                        z-index: 1000; /* Higher than header's 100 */
                        color: white;
                        font-family: 'DM Sans', sans-serif;
                        display: flex;
                        flex-direction: column;
                        max-width: 350px;
                        width: calc(100% - 40px);
                        transform: translateX(120%);
                        animation: slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                        background: ${styles.gradient};
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        overflow: hidden;
                    }

                    .notification.exiting {
                        animation: slideOut 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    }

                    @keyframes slideIn {
                        from { transform: translateX(120%); }
                        to { transform: translateX(0); }
                    }

                    @keyframes slideOut {
                        from { transform: translateX(0); }
                        to { transform: translateX(120%); }
                    }

                    .notification-header {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }

                    .notification-title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-weight: 600;
                        font-size: 18px;
                        margin: 0;
                    }

                    .notification-icon {
                        font-size: 20px;
                    }

                    .notification-close {
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        padding: 5px;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .notification-close:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: rotate(90deg);
                    }

                    .notification-content {
                        font-size: 15px;
                        line-height: 1.5;
                        margin-bottom: 15px;
                    }

                    .notification-progress-container {
                        width: 100%;
                        height: 4px;
                        background-color: rgba(255, 255, 255, 0.2);
                        border-radius: 2px;
                        overflow: hidden;
                    }

                    .notification-progress-bar {
                        height: 100%;
                        width: ${(countdown / 5) * 100}%;
                        background-color: white;
                        transition: width 1s linear;
                        border-radius: 2px;
                    }

                    .notification-timer {
                        position: absolute;
                        bottom: 8px;
                        right: 25px;
                        font-size: 12px;
                        opacity: 0.8;
                    }
                `}
            </style>
            
            <div className="notification-header">
                <h4 className="notification-title">
                    <FontAwesomeIcon 
                        icon={styles.icon} 
                        className="notification-icon" 
                        style={{ color: styles.iconColor }} 
                    />
                    {type === 'success' ? 'Success' : 'Error'}
                </h4>
                <button className="notification-close" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            
            <div className="notification-content">{message}</div>
            
            <div className="notification-progress-container">
                <div className="notification-progress-bar" />
            </div>
            
            <div className="notification-timer">{countdown}s</div>
        </div>
    );
};

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error']).isRequired,
    onClose: PropTypes.func.isRequired
};

export default Notification;