import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faEnvelope,
  faKey,
  faShieldAlt,
  faCheckCircle,
  faExclamationCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ 
        email: '', 
        confirmationCode: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [notification, setNotification] = useState({ 
        message: '', 
        type: '', 
        show: false 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: '', type: '', show: false });

        if (formData.password !== formData.confirmPassword) {
            setNotification({ 
                message: 'Passwords do not match.', 
                type: 'error', 
                show: true 
            });
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setNotification({ 
                message: 'Password must be at least 8 characters.', 
                type: 'error', 
                show: true 
            });
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const { data } = await axios.post(`${apiUrl}/api/auth/reset-password`, { 
                email: formData.email,
                confirmationCode: formData.confirmationCode,
                newPassword: formData.password
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setNotification({ 
                message: data.message || 'Password reset successfully! Redirecting to login...', 
                type: 'success', 
                show: true 
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               'Error resetting password. Please try again.';
            
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            checkPasswordStrength(value);
        }

        if (notification.show) {
            setNotification({ ...notification, show: false });
        }
    };

    const checkPasswordStrength = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        if (strongRegex.test(password)) {
            setPasswordStrength('strong');
        } else if (mediumRegex.test(password)) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('weak');
        }
    };

    const handleBackClick = () => {
        navigate('/login');
    };

    return (
        <div className="reset-password-container">
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

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .reset-password-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
                    padding: 2rem;
                }

                .back-btn {
                    position: absolute;
                    top: 1.5rem;
                    left: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background-color: var(--primary);
                    color: white;
                    border: none;
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: var(--transition);
                    box-shadow: var(--shadow-sm);
                    z-index: 10;
                }

                .back-btn:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .reset-card {
                    width: 100%;
                    max-width: 500px;
                    padding: 2.5rem;
                    background-color: var(--light);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                    position: relative;
                    overflow: hidden;
                }

                .reset-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 6px;
                    height: 100%;
                    background: linear-gradient(to bottom, var(--primary), var(--primary-dark));
                }

                .reset-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .reset-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-dark);
                    margin-bottom: 0.5rem;
                }

                .reset-header p {
                    color: var(--gray);
                    font-size: 1rem;
                }

                .reset-form {
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

                .password-strength {
                    margin-top: 0.5rem;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .strength-weak {
                    color: #dc2626;
                }

                .strength-medium {
                    color: #d97706;
                }

                .strength-strong {
                    color: #059669;
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
                    .reset-password-container {
                        padding: 1.5rem;
                    }

                    .reset-card {
                        padding: 2rem;
                    }
                }

                @media (max-width: 480px) {
                    .reset-password-container {
                        padding: 1rem;
                    }

                    .reset-card {
                        padding: 1.5rem;
                    }

                    .reset-header h1 {
                        font-size: 1.75rem;
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

            <button className="back-btn" onClick={handleBackClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Login
            </button>

            <div className="reset-card">
                <div className="reset-header">
                    <h1>Reset Your Password</h1>
                    <p>Enter your email, confirmation code, and new password</p>
                </div>

                {notification.show && (
                    <div className={`alert alert-${notification.type}`}>
                        <FontAwesomeIcon 
                            icon={notification.type === 'success' ? faCheckCircle : faExclamationCircle} 
                            className="alert-icon" 
                        />
                        <span>{notification.message}</span>
                        <span 
                            className="alert-close" 
                            onClick={() => setNotification({ ...notification, show: false })}
                        >
                            &times;
                        </span>
                    </div>
                )}

                <form className="reset-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirmation Code</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faShieldAlt} className="form-icon" />
                            <input
                                type="text"
                                name="confirmationCode"
                                className="form-input"
                                placeholder="Enter the code you received"
                                value={formData.confirmationCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faKey} className="form-icon" />
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="At least 8 characters"
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {formData.password && (
                            <div className={`password-strength strength-${passwordStrength}`}>
                                Password strength: {passwordStrength}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faKey} className="form-icon" />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm your new password"
                                minLength={8}
                                value={formData.confirmPassword}
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
                                Resetting...
                            </>
                        ) : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;