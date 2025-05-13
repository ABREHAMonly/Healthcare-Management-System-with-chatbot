import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './Components/ForgotPassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faEnvelope,
  faLock,
  faSpinner,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: '', type: '', show: false });

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const { data } = await axios.post(`${apiUrl}/api/auth/login`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            localStorage.setItem('profile', JSON.stringify(data));
            localStorage.setItem('token', data.token);

            setNotification({ 
                message: 'Login successful! Redirecting...', 
                type: 'success', 
                show: true 
            });

            // Redirect based on role
            setTimeout(() => {
                switch (data.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'doctor':
                        navigate(`/doctors/${data.department}`);
                        break;
                    case 'pharmacist':
                    case 'laboratorist':
                    case 'nurse':
                    case 'card':
                        navigate('/addhelperform');
                        break;
                    default:
                        navigate('/appointment');
                        break;
                }
            }, 1000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               'Login failed. Please check your credentials and try again.';
            
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, show: false });
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setShowForgotPasswordModal(true);
    };

    const handleCloseForgotPasswordModal = () => {
        setShowForgotPasswordModal(false);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="login-container">
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

                .login-container {
                    display: flex;
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

                .login-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem;
                    background-color: var(--light);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                    position: relative;
                    overflow: hidden;
                }

                .login-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 6px;
                    height: 100%;
                    background: linear-gradient(to bottom, var(--primary), var(--primary-dark));
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .login-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-dark);
                    margin-bottom: 0.5rem;
                }

                .login-header p {
                    color: var(--gray);
                    font-size: 1rem;
                }

                .login-form {
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

                .password-toggle {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--gray);
                    cursor: pointer;
                    transition: var(--transition);
                }

                .password-toggle:hover {
                    color: var(--primary);
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

                .login-footer {
                    margin-top: 1.5rem;
                    text-align: center;
                    font-size: 0.9rem;
                    color: var(--gray);
                }

                .login-link {
                    color: var(--primary);
                    text-decoration: none;
                    font-weight: 500;
                    transition: var(--transition);
                }

                .login-link:hover {
                    color: var(--primary-dark);
                    text-decoration: underline;
                }

                .alert {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
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
                    .login-container {
                        padding: 1.5rem;
                    }

                    .login-card {
                        padding: 2rem;
                    }
                }

                @media (max-width: 480px) {
                    .login-container {
                        padding: 1rem;
                    }

                    .login-card {
                        padding: 1.5rem;
                    }

                    .login-header h1 {
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
                Back
            </button>

            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Please login to access your account</p>
                </div>

                {notification.show && (
                    <div className={`alert alert-${notification.type}`}>
                        <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
                        <span>{notification.message}</span>
                        <span className="alert-close" onClick={handleCloseNotification}>&times;</span>
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
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
                        <label className="form-label">Password</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="form-icon" />
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span 
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {isPasswordVisible ? '🙈' : '👁️'}
                            </span>
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
                                Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <a 
                        href="#" 
                        className="login-link" 
                        onClick={handleForgotPasswordClick}
                    >
                        Forgot password?
                    </a>
                    <p style={{ marginTop: '1rem' }}>
                        Don't have an account? You need to visit us physically!
                    </p>
                </div>
            </div>

            {showForgotPasswordModal && (
                <ForgotPassword onClose={handleCloseForgotPasswordModal} />
            )}
        </div>
    );
};

export default Login;