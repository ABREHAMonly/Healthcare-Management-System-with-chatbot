import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faCalendarAlt,
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faMapMarkerAlt,
  faStethoscope,
  faUserMd,
  faComment,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from './Components/AxiosInstance';

const AppointmentForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: '',
        gender: '',
        appointmentDate: '',
        department: '',
        doctor: '',
        address: '',
        message: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Load doctors based on selected department
    useEffect(() => {
        if (formData.department) {
            const departmentDoctors = {
                'general': [
                    { id: 'dr-abreham', name: 'Dr. Abreham Yetwale', specialty: 'General Medicine' },
                    { id: 'dr-teddy', name: 'Dr. Tewodros Misganaw', specialty: 'Family Medicine' }
                ],
                'neonatal': [
                    { id: 'dr-sumeya', name: 'Dr. Sumeya Ahmed', specialty: 'Neonatal Care' },
                    { id: 'dr-mahilet', name: 'Dr. Mahilet Kebede', specialty: 'Pediatrics' }
                ],
                'adolescent': [
                    { id: 'dr-eyob', name: 'Dr. Eyob Zeleke', specialty: 'Adolescent Medicine' },
                    { id: 'dr-toleshi', name: 'Dr. Toleshi Bekele', specialty: 'Youth Health' }
                ]
            };
            setDoctors(departmentDoctors[formData.department] || []);
        } else {
            setDoctors([]);
        }
        setFormData(prev => ({ ...prev, doctor: '' }));
    }, [formData.department]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName) {
            setError('Please enter your full name');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            setError('Mobile number must be exactly 10 digits');
            return false;
        }

        const today = new Date().setHours(0, 0, 0, 0);
        const appointmentDate = new Date(formData.appointmentDate).setHours(0, 0, 0, 0);
        
        if (!formData.appointmentDate || appointmentDate < today) {
            setError('Please select a valid future appointment date');
            return false;
        }

        if (!formData.department || !formData.doctor) {
            setError('Please select both department and doctor');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await axiosInstance.post('/appointments', formData);
            setSuccess('Appointment booked successfully! We will contact you shortly.');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                mobileNumber: '',
                dateOfBirth: '',
                gender: '',
                appointmentDate: '',
                department: '',
                doctor: '',
                address: '',
                message: ''
            });
        } catch (error) {
            console.error("Error sending appointment:", error);
            setError(error.response?.data?.message || 'Error booking appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <style jsx>{`
                    .loading-screen {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
                    }
                    .spinner {
                        font-size: 3rem;
                        color: #0f9499;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .loading-text {
                        font-size: 1.2rem;
                        color: #333;
                        font-family: 'Segoe UI', sans-serif;
                    }
                `}</style>
                <FontAwesomeIcon icon={faSpinner} className="spinner" />
                <p className="loading-text">Loading appointment form...</p>
            </div>
        );
    }

    return (
        <div className='appointment-container'>
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
                    background-color: var(--secondary);
                }

                .appointment-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 100vh;
                    padding: 2rem;
                    background-color: var(--secondary);
                    position: relative;
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

                .form-card {
                    width: 100%;
                    max-width: 800px;
                    padding: 2.5rem;
                    background-color: var(--light);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                    position: relative;
                    overflow: hidden;
                    margin-top: 1rem;
                }

                .form-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 6px;
                    height: 100%;
                    background: linear-gradient(to bottom, var(--primary), var(--primary-dark));
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .form-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-dark);
                    margin-bottom: 0.5rem;
                }

                .form-header p {
                    color: var(--gray);
                    font-size: 1.1rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
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

                .form-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 1rem;
                }

                .form-textarea {
                    min-height: 120px;
                    resize: vertical;
                    padding: 1rem !important;
                }

                .submit-btn {
                    grid-column: span 2;
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
                    margin-top: 0.5rem;
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .submit-btn:disabled {
                    background: var(--gray);
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
                    grid-column: span 2;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    font-size: 0.95rem;
                    text-align: center;
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

                /* Responsive Design */
                @media (max-width: 768px) {
                    .appointment-container {
                        padding: 1.5rem;
                    }

                    .form-card {
                        padding: 1.5rem;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .submit-btn,
                    .alert {
                        grid-column: span 1;
                    }
                }

                @media (max-width: 480px) {
                    .appointment-container {
                        padding: 1rem;
                    }

                    .form-header h1 {
                        font-size: 1.5rem;
                    }

                    .form-header p {
                        font-size: 1rem;
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

            <button className="back-btn" onClick={() => navigate('/')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
            </button>

            <div className="form-card">
                <div className="form-header">
                    <h1>Book Your Appointment</h1>
                    <p>Fill out the form below to schedule your visit</p>
                </div>

                <form className="form-grid" onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faUser} className="form-icon" />
                            <input
                                type="text"
                                name="firstName"
                                className="form-input"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faUser} className="form-icon" />
                            <input
                                type="text"
                                name="lastName"
                                className="form-input"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faPhone} className="form-icon" />
                            <input
                                type="tel"
                                name="mobileNumber"
                                className="form-input"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="1234567890"
                                maxLength="10"
                                required
                            />
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faCalendarAlt} className="form-icon" />
                            <input
                                type="date"
                                name="dateOfBirth"
                                className="form-input"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Gender</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faVenusMars} className="form-icon" />
                            <select
                                name="gender"
                                className="form-input form-select"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Appointment Date</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faCalendarAlt} className="form-icon" />
                            <input
                                type="date"
                                name="appointmentDate"
                                className="form-input"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Department</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faStethoscope} className="form-icon" />
                            <select
                                name="department"
                                className="form-input form-select"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="general">General Medicine</option>
                                <option value="neonatal">Neonatal Care</option>
                                <option value="adolescent">Adolescent Health</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Doctor</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faUserMd} className="form-icon" />
                            <select
                                name="doctor"
                                className="form-input form-select"
                                value={formData.doctor}
                                onChange={handleChange}
                                disabled={!formData.department}
                                required
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Address</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="form-icon" />
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your full address"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Message</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faComment} className="form-icon" style={{ top: '1.5rem' }} />
                            <textarea
                                name="message"
                                className="form-input form-textarea"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Describe your symptoms or reason for appointment..."
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="spinner" />
                                Processing...
                            </>
                        ) : 'Book Appointment'}
                    </button>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;