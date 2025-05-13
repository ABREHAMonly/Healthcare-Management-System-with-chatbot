import React, { useState, useEffect } from 'react';
import axiosInstance from './Components/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSignOutAlt, faCalendarAlt, faChevronDown, faChevronUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import AppointmentForms from './Components/AppointmentForms';
import ReferralDataPage from './Components/ReferralDataPage';
import FeedbackForm from './Components/FeedbackForm';
import { useNavigate } from 'react-router-dom'; 

const Appointment = () => {
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
    const [user, setUser] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [vitalSigns, setVitalSigns] = useState([]);
    const [showMessagesModal, setShowMessagesModal] = useState(false);
    const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
    const [showReferralDataPage, setShowReferralDataPage] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAppointmentForms, setShowAppointmentForms] = useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    useEffect(() => {
        const fetchUserAndAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axiosInstance.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data.role !== 'user') {
                    navigate('/login'); // Redirect if not a user
                    return;
                }

                setUser(data);

                const appointmentsData = await axiosInstance.get(`/appointments?email=${data.email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAppointments(Array.isArray(appointmentsData.data) ? appointmentsData.data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUserAndAppointments();
    }, [navigate]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axiosInstance.get(`/notifications/${user.email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (user.email) {
            fetchNotifications();
        }
    }, [user.email]);

    useEffect(() => {
        const fetchVitalSigns = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axiosInstance.get(`/vitalsigns/${user.patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVitalSigns(data);
            } catch (error) {
                console.error('Error fetching vital signs:', error);
            }
        };

        if (user.patientId) {
            fetchVitalSigns();
        }
    }, [user.patientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        const today = new Date().setHours(0, 0, 0, 0);
        const appointmentDate = new Date(formData.appointmentDate).setHours(0, 0, 0, 0);
    
        if (appointmentDate < today) {
            setError('Appointment date cannot be in the past.');
            return;
        }
    
        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
    
        try {
            await axiosInstance.post('/appointments', formData);
            setSuccess('Appointment sent successfully!');
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
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Error sending appointment. Please try again.');
            }
            console.error("Error sending appointment:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        window.location.href = '/login';
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(`/notifications/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotifications(notifications.filter(notification => notification._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <div className='appointment-container'>
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                body {
                    height: 100%;
                    background-color: #f4f4f4;
                }

                .appointment-container {
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .header {
                    width: 100%;
                    padding: 20px;
                    background-color: rgb(26, 116, 151);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .profile {
                    display: flex;
                    align-items: center;
                }

                .profile-image {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 15px;
                    object-fit: cover;
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                }

                .icons {
                    display: flex;
                    align-items: center;
                }

                .icon {
                    margin-left: 20px;
                    font-size: 25px;
                    cursor: pointer;
                }

                .content {
                    display: flex;
                    flex: 1;
                    padding: 20px;
                    overflow: auto;
                }

                .appointments-container {
                    display: flex;
                    flex-direction: column;
                    width: 80%;
                    overflow: hidden;
                }

                .appointments-list {
                    flex: 1;
                    padding: 20px;
                    background-color: rgb(245, 247, 233);
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-right: 10px;
                    overflow-y: auto;
                    max-height: calc(80vh - 40px);
                }

                .appointments-list h2 {
                    margin-bottom: 20px;
                    color: #333;
                    font-size: 24px;
                    font-weight: bold;
                }

                .appointment .status.approved {
                    color: green;
                }

                .appointment .status.rejected {
                    color: red;
                }

                .toggle-container {
                    width: 100%;
                    margin-top: 10px;
                }

                .collapse-header {
                    padding: 15px;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    background-color: #e0e0e0;
                }

                .collapse-header h3 {
                    margin-left: 10px;
                }

                .appointment-form {
                    width: 100%;
                    max-width: 800px;
                    padding: 40px;
                    margin: 20px auto; /* Center the form */
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: left; /* Align text to the left for better readability */
                    overflow-y: auto;
                    max-height: calc(70vh - 40px);
                }

                .appointment-form h2 {
                    margin-bottom: 30px;
                    color: #0f9499;
                    font-size: 28px;
                    font-weight: bold;
                    text-align: center; /* Center the title */
                }

                .appointment-form form {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px; /* Gap between fields */
                    justify-content: space-between;
                }

                .form-group {
                    width: calc(50% - 10px); /* Adjust width for form groups */
                    margin-bottom: 20px; /* Gap between rows */
                }

                .appointment-form input,
                .appointment-form select,
                .appointment-form textarea {
                    padding: 10px;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    transition: border-color 0.3s;
                    width: 100%; /* Full width for inputs, selects, and textarea */
                }

                .appointment-form input:focus,
                .appointment-form select:focus,
                .appointment-form textarea:focus {
                    border-color: #0f9499;
                    outline: none;
                }

                .appointment-form button {
                    padding: 15px;
                    background-color: #0f9499;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 18px;
                    transition: background-color 0.3s;
                    width: 100%; /* Full width for button */
                }

                .appointment-form button:hover {
                    background-color: #066b6e;
                }

                .error-message {
                    margin-top: 20px;
                    color: red;
                    font-size: 16px;
                    text-align: center; /* Center error message */
                }

                .success-message {
                    margin-top: 20px;
                    color: green;
                    font-size: 16px;
                    text-align: center; /* Center success message */
                }                                            

                .modal {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                .modal-content {
                    background-color: #fefefe;
                    color:rgb(56, 55, 55);
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%;
                    max-width: 500px;
                    border-radius: 10px;
                    position: relative;
                    animation: fadeIn 0.5s;
                }

                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }

                .messages {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .message {
                    background-color: #f1f1f1;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .message p {
                    margin: 0;
                    flex: 1;
                }

                .data-modal {
                    margin-top: 18px;
                    margin-bottom: 400px;
                    background-color: rgb(253, 249, 193);
                    border-radius: 5px;
                    padding: 15px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .data-modal:hover {
                    background-color: #f0f0f0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            <div className="header">
                <div className="profile">
                    <img src={`http://localhost:5000/uploads/${user.image}`} alt="User" className="profile-image" />
                    <div className="user-info">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p>Patient ID: {user.patientId}</p>
                    </div>
                </div>
                <div className="icons">
                    <FontAwesomeIcon icon={faEnvelope} onClick={() => setShowMessagesModal(true)} className="icon message-icon" />
                    <FontAwesomeIcon icon={faCalendarAlt} onClick={() => setShowModal(true)} className="icon appointment-icon" />
                    <FontAwesomeIcon icon={faSignOutAlt} onClick={handleLogout} className="icon logout-icon" />
                </div>
            </div>

            <div className="content">
                <div className="appointments-container">
                    <div className="appointments-list">
                        <h2>Your Appointments</h2>
                        {appointments.length === 0 ? (
                            <p>You have not requested any appointments.</p>
                        ) : (
                            appointments.map((appointment, index) => (
                                <div key={index} className="appointment">
                                    <p><strong>Name:</strong> {appointment.firstName} {appointment.lastName}</p>
                                    <p><strong>Email:</strong> {appointment.email}</p>
                                    <p><strong>Address:</strong> {appointment.address}</p>
                                    <p><strong>Appointment Date:</strong> {appointment.appointmentDate}</p>
                                    <p><strong>Doctor:</strong> {appointment.doctor}</p>
                                    <p><strong>Department:</strong> {appointment.department}</p>
                                    <p><strong>Message:</strong> {appointment.message}</p>
                                    <p className={`status ${appointment.status.toLowerCase()}`}><strong>Status:</strong> {appointment.status}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="toggle-container">
                    <div className="collapse-header" onClick={() => setShowAppointmentForms(!showAppointmentForms)}>
                        <h3>
                            <FontAwesomeIcon icon={showAppointmentForms ? faChevronUp : faChevronDown} /> Scheduled Appointments
                        </h3>
                    </div>
                    {showAppointmentForms && (
                        <div className="main-content">
                            <AppointmentForms patientId={user.patientId} />
                        </div>
                    )}

                    <div className="collapse-header" onClick={() => setShowReferralDataPage(!showReferralDataPage)}>
                        <h3>
                            <FontAwesomeIcon icon={showReferralDataPage ? faChevronUp : faChevronDown} /> Medical History
                        </h3>
                    </div>
                    {showReferralDataPage && (
                        <div className="main-content">
                            <ReferralDataPage patientId={user.patientId} />
                        </div>
                    )}
                    <div className="collapse-header" onClick={() => setShowFeedbackForm(!showFeedbackForm)}>
                        <h3>
                            <FontAwesomeIcon icon={showFeedbackForm ? faChevronUp : faChevronDown} /> Send Feedback
                        </h3>
                    </div>
                    {showFeedbackForm && (
                        <div className="main-content">
                            <FeedbackForm patientId={user.patientId} />
                        </div>
                    )}
                </div>

                {/* Modals for Vital Signs */}
                <div className="data-modal" onClick={() => setShowVitalSignsModal(true)}>
                    Vital Signs
                </div>

                {showMessagesModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h1>Messages</h1>
                            <span className="close" onClick={() => setShowMessagesModal(false)}>&times;</span>
                            <div className="messages">
                                {notifications.length === 0 ? (
                                    <p>No new messages.</p>
                                ) : (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="message">
                                            <FontAwesomeIcon 
                                                icon={faTrash} 
                                                onClick={() => handleDeleteNotification(notification._id)} 
                                                className="icon delete-icon" 
                                                style={{ cursor: 'pointer', marginRight: '10px' }} 
                                            />
                                            <p>{notification.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                            <div className="appointment-form">
                            <h2>Request appointment</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input 
                                        type="text" 
                                        id="firstName"
                                        name="firstName" 
                                        placeholder="First Name" 
                                        value={formData.firstName} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input 
                                        type="text" 
                                        id="lastName"
                                        name="lastName" 
                                        placeholder="Last Name" 
                                        value={formData.lastName} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email" 
                                        placeholder="Email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobileNumber">Mobile Number</label>
                                    <input 
                                        type="tel" 
                                        id="mobileNumber"
                                        name="mobileNumber" 
                                        placeholder="Mobile Number" 
                                        value={formData.mobileNumber} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input 
                                        type="date" 
                                        id="dateOfBirth"
                                        name="dateOfBirth" 
                                        value={formData.dateOfBirth} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="appointmentDate">Appointment Date</label>
                                    <input 
                                        type="date" 
                                        id="appointmentDate"
                                        name="appointmentDate" 
                                        value={formData.appointmentDate} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="department">Department</label>
                                    <select name="department" id="department" value={formData.department} onChange={handleChange} required>
                                        <option value="">Select Department</option>
                                        <option value="general">General doctor</option>
                                        <option value="neonatal">Neonatal</option>
                                        <option value="adolescent">Adolescent</option>
                                    </select>
                                </div>
                                
                                <select name="doctor" value={formData.doctor} onChange={handleChange} required>
                                    <option value="">Select Doctor</option>
                                    <option value="dr-desta">Dr. Desta</option>
                                    <option value="dr-abreham">Dr. Abreham</option>
                                    <option value="dr-eyob">Dr. Eyob</option>
                                    <option value="dr-toleshi">Dr. Toleshi</option>
                                    <option value="dr-sumeya">Dr. Sumeya</option>
                                    <option value="dr-mahilet">Dr. Mahilet</option>
                                    <option value="dr-teddy">Dr. Teddy</option>
                                </select>  
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input 
                                        type="text" 
                                        id="address"
                                        name="address" 
                                        placeholder="Address" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea 
                                        id="message"
                                        name="message" 
                                        placeholder="Message" 
                                        rows="4" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <button type="submit">Book Appointment</button>
                                {error && <div className="error-message">{error}</div>}
                                {success && <div className="success-message">{success}</div>}
                            </form>
                        </div>
                        </div>
                    </div>
                )}

                {showVitalSignsModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h1>Your Vital Signs</h1>
                            <span className="close" onClick={() => setShowVitalSignsModal(false)}>&times;</span>
                            {vitalSigns.length === 0 ? (
                                <p>No vital signs data available.</p>
                            ) : (
                                vitalSigns.map((vital, index) => (
                                    <div key={index}>
                                        <p><strong>Date:</strong> {vital.date}</p>
                                        <p><strong>Blood Pressure:</strong> {vital.bloodPressure}</p>     
                                        <p><strong>Temperature:</strong> {vital.temperature}</p>
                                        <p><strong>Pulse Rate:</strong> {vital.pulseRate}</p>
                                        <p><strong>Respiratory Rate:</strong> {vital.respiratoryRate}</p>
                                        <p><strong>Oxygen Saturation:</strong> {vital.oxygenSaturation}</p>
                                        <p><strong>Height:</strong> {vital.height}</p>
                                        <p><strong>Weight:</strong> {vital.weight}</p>
                                        <p><strong>BMI:</strong> {vital.bmi}</p>
                                        <hr />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointment;