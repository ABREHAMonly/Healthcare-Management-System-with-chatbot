import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState({ 
        message: '', 
        type: '', 
        show: false 
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: '', type: '', show: false });

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const { data } = await axios.post(
                `${apiUrl}/api/auth/forgot-password`, 
                { email }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            setNotification({ 
                message: data.message || 'Confirmation code sent successfully!', 
                type: 'success', 
                show: true 
            });

            // Close the modal and navigate after delay
            setTimeout(() => {
                onClose();
                navigate('/reset-password');
            }, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               'Error sending confirmation code. Please try again.';
            
            setNotification({ 
                message: errorMessage, 
                type: 'error', 
                show: true 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (notification.show) {
            setNotification({ ...notification, show: false });
        }
    };

    const handleClose = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="forgot-password-modal">
            <style jsx>{`
                :root {
                    --primary: #10a2a7;
                    --primary-dark: #0d7a7e;
                    --primary-light: #e0f7fa;
                    --secondary: #f8f9fa;
                    --accent: #ff7043;
                    --dark: #2d3748;
                    --light: #ffffff;
                    --gray: #718096;
                    --light-gray: #edf2f7;
                    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
                    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
                    --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
                    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    --radius: 12px;
                }

                .forgot-password-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem;
                    background-color: var(--light);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                    z-index: 1000;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .modal-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--primary-dark);
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--gray);
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .close-btn:hover {
                    color: var(--primary);
                    transform: rotate(90deg);
                }

                .forgot-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    position: relative;
                }

                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--dark);
                }

                .form-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--primary);
                    font-size: 1rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 2.5rem;
                    font-size: 1rem;
                    border: 1px solid var(--light-gray);
                    border-radius: 8px;
                    transition: var(--transition);
                    background-color: var(--secondary);
                    color: var(--dark);
                }

                .form-input:focus {
                    border-color: var(--primary);
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(16, 162, 167, 0.2);
                }

                .submit-btn {
                    padding: 1rem;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .alert {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .alert-error {
                    background-color: #fee2e2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }

                .alert-success {
                    background-color: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }

                .alert-icon {
                    font-size: 1.25rem;
                }

                .alert-close {
                    margin-left: auto;
                    cursor: pointer;
                    font-size: 1rem;
                    opacity: 0.7;
                    transition: var(--transition);
                }

                .alert-close:hover {
                    opacity: 1;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .forgot-password-modal {
                        padding: 2rem;
                        max-width: 400px;
                    }
                }

                @media (max-width: 480px) {
                    .forgot-password-modal {
                        padding: 1.5rem;
                        max-width: 90%;
                    }

                    .modal-title {
                        font-size: 1.25rem;
                    }

                    .form-input {
                        padding: 0.75rem 0.75rem 0.75rem 2.25rem;
                        font-size: 0.9rem;
                    }

                    .form-icon {
                        left: 0.75rem;
                        font-size: 0.9rem;
                    }
                }
            `}</style>

            <div className="modal-header">
                <h2 className="modal-title">Reset Your Password</h2>
                <button className="close-btn" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <p style={{ marginBottom: '1.5rem', color: 'var(--gray)' }}>
                Enter your email address and we'll send you a confirmation code to reset your password.
            </p>

            {notification.show && (
                <div className={`alert alert-${notification.type}`}>
                    <FontAwesomeIcon 
                        icon={notification.type === 'success' ? faCheckCircle : faExclamationCircle} 
                        className="alert-icon" 
                    />
                    <span>{notification.message}</span>
                    <span className="alert-close" onClick={() => setNotification({ ...notification, show: false })}>
                        &times;
                    </span>
                </div>
            )}

            <form className="forgot-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} className="spinner" />
                            Sending...
                        </>
                    ) : 'Send Confirmation Code'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;