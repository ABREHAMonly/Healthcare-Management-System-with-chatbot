import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Components/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEnvelope, faCalendarAlt, faBell, faChevronDown, faChevronUp, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Doctorspage.css';
import VitalSignsDisplay from './VitalSignsDisplay';
import TestRequestForm from './TestRequestForm';
import TestResultsTable from './TestResultsTable';
import SendToSpecialistsForm from './SendToSpecialistsForm.js';
import SpecialistsDataList from './SpecialistsDataList.js';
import SendPatientForm from './SendPatientForm.js';
import AppointmentForm from './AppointmentForm.js';

const Doctorspage = () => {
    const { department } = useParams();
    const navigate = useNavigate();
    
    const [doctor, setDoctor] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showVitalSignsDisplay, setShowVitalSignsDisplay] = useState(false);
    const [showTestRequestForm, setShowTestRequestForm] = useState(false);
    const [showMessagesModal, setShowMessagesModal] = useState(false);
    const [showTestResultsTable, setShowTestResultsTable] = useState(false);
    const [showSendToSpecialistsForm, setShowSendToSpecialistsForm] = useState(false);
    const [showSpecialistsDataList, setShowSpecialistsDataList] = useState(false);
    const [showSendPatientForm, setShowSendPatientForm] = useState(false);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const doctorResponse = await axios.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Check if the user role is 'doctor'
                if (doctorResponse.data.role !== 'doctor') {
                    navigate('/login'); // Redirect to login if not a doctor
                    return;
                }

                setDoctor(doctorResponse.data);

                const appointmentsResponse = await axios.get('/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(appointmentsResponse.data);

                const slotsResponse = await axios.get('/appointments/available-slots', {
                    params: { department, doctor: doctorResponse.data.firstName },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAvailableSlots(slotsResponse.data);

                const notificationsResponse = await axios.get(`/notifications/${doctorResponse.data.role}/${doctorResponse.data.email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(notificationsResponse.data);
                const unread = notificationsResponse.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        fetchFeedbacks(); // Fetch feedbacks when the page is opened
    }, [department, navigate]); // Include navigate in the dependency array

    const fetchFeedbacks = async () => {
        const token = localStorage.getItem('token');
        try {
            const feedbacksResponse = await axios.get('/feedback', {
                params: { department, date: new Date().toISOString().split('T')[0] }, // Current date format
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(feedbacksResponse.data);
            const unread = feedbacksResponse.data.filter(f => !f.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const handleStatusChange = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.put(`/appointments/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(prevAppointments => prevAppointments.map(app => app._id === id ? { ...app, status: data.appointment.status } : app));
            setNotifications(prevNotifications => [
                ...prevNotifications,
                { email: doctor.email, message: `The status of the test request for patient ${data.appointment.patientName} has been marked as ${status}.` }
            ]);
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleModal = (setter) => () => setter(prev => !prev);

    const deleteNotification = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch('/feedback/mark-as-read', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(prevFeedbacks => prevFeedbacks.map(feedback => ({ ...feedback, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking feedback as read:', error);
        }
    };

    const openNotificationsModal = async () => {
        toggleModal(setShowNotificationsModal)();
        markAllAsRead(); // Mark as read when opening the modal
    };

    const deleteFeedback = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback._id !== id));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    return (
        <div className="doctors-page">
            <div className="doctors-header">
                <img src={`http://localhost:5000/${doctor.image}`} alt="Doctor" className="doctor-image" />
                <h1>Welcome, Dr. {doctor.firstName}</h1>
                <p>Department: {department}</p>
                <div className="button-group">
                    <button className="message-button" onClick={toggleModal(setShowMessagesModal)}>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </button>
                    <button className="appointments-button" onClick={toggleModal(setShowAppointments)}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </button>
                    <button
                        className="notification-button"
                        onClick={openNotificationsModal}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '10px 15px',
                            color: 'white',
                            position: 'relative'
                        }}
                    >
                        <FontAwesomeIcon icon={faBell} />
                        {unreadCount > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-10px',
                                    background: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 6px',
                                    fontSize: '12px'
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </div>
            </div>

            <div className="doctors-content">
                <div className="doctors-sidebar">
                    <h3>Available Appointment Slots</h3>
                    {availableSlots.length > 0 ? (
                        <ul>
                            {availableSlots.slice(0, 10).map(slot => (
                                <li key={slot}>{new Date(slot).toLocaleString()}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No available slots found.</p>
                    )}
                </div>

                <div className="doctors-main-content">
                    <div className="collapse-header" onClick={toggleModal(setShowVitalSignsDisplay)}>
                        <h3>
                            <FontAwesomeIcon icon={showVitalSignsDisplay ? faChevronUp : faChevronDown} /> Patients List from Nurse
                        </h3>
                    </div>
                    {showVitalSignsDisplay && <VitalSignsDisplay />}

                    <div className="collapse-header" onClick={toggleModal(setShowTestRequestForm)}>
                        <h3>
                            <FontAwesomeIcon icon={showTestRequestForm ? faChevronUp : faChevronDown} /> Lab Test Request Form
                        </h3>
                    </div>
                    {showTestRequestForm && <TestRequestForm />}

                    <div className="collapse-header" onClick={toggleModal(setShowTestResultsTable)}>
                        <h3>
                            <FontAwesomeIcon icon={showTestResultsTable ? faChevronUp : faChevronDown} /> Test Results Data
                        </h3>
                    </div>
                    {showTestResultsTable && <TestResultsTable />}

                    <div className="collapse-header" onClick={toggleModal(setShowAppointmentForm)}>
                        <h3>
                            <FontAwesomeIcon icon={showAppointmentForm ? faChevronUp : faChevronDown} /> Schedule Appointment Form
                        </h3>
                    </div>
                    {showAppointmentForm && <AppointmentForm />}

                    {department === 'general' && (
                        <div>
                            <div className="collapse-header" onClick={toggleModal(setShowSendToSpecialistsForm)}>
                                <h3>
                                    <FontAwesomeIcon icon={showSendToSpecialistsForm ? faChevronUp : faChevronDown} /> Send Patients Detail to Specialists
                                </h3>
                            </div>
                            {showSendToSpecialistsForm && <SendToSpecialistsForm />}
                        </div>
                    )}

                    {(department === 'neonatal' || department === 'adolescent') && (
                        <div>
                            <div className="collapse-header" onClick={toggleModal(setShowSpecialistsDataList)}>
                                <h3>
                                    <FontAwesomeIcon icon={showSpecialistsDataList ? faChevronUp : faChevronDown} /> Patients Sent from the General Doctor
                                </h3>
                            </div>
                            {showSpecialistsDataList && <SpecialistsDataList />}
                        </div>
                    )}

                    <div className="collapse-header" onClick={toggleModal(setShowSendPatientForm)}>
                        <h3>
                            <FontAwesomeIcon icon={showSendPatientForm ? faChevronUp : faChevronDown} /> Send patients to pharmacist
                        </h3>
                    </div>
                    {showSendPatientForm && <SendPatientForm />}

                    {showAppointments && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={toggleModal(setShowAppointments)}>&times;</span>
                                <div className="appointments-table">
                                    <h2>Appointments</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Mobile Number</th>
                                                <th>Date of Birth</th>
                                                <th>Gender</th>
                                                <th>Appointment Date</th>
                                                <th>Department</th>
                                                <th>Address</th>
                                                <th>Message</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.length > 0 ? (
                                                appointments.map(appointment => (
                                                    <tr key={appointment._id}>
                                                        <td>{appointment.firstName}</td>
                                                        <td>{appointment.lastName}</td>
                                                        <td>{appointment.email}</td>
                                                        <td>{appointment.mobileNumber}</td>
                                                        <td>{new Date(appointment.dateOfBirth).toLocaleDateString()}</td>
                                                        <td>{appointment.gender}</td>
                                                        <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                                        <td>{appointment.department}</td>
                                                        <td>{appointment.address}</td>
                                                        <td>{appointment.message}</td>
                                                        <td>{appointment.status}</td>
                                                        <td>
                                                            <button className="approve-button" onClick={() => handleStatusChange(appointment._id, 'approved')}>
                                                                <FontAwesomeIcon icon={faCheck} /> Approve
                                                            </button>
                                                            <button className="reject-button" onClick={() => handleStatusChange(appointment._id, 'rejected')}>
                                                                <FontAwesomeIcon icon={faTimes} /> Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="13">No appointments found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {showMessagesModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={toggleModal(setShowMessagesModal)}>&times;</span>
                                <h2>Messages</h2>
                                {notifications.length > 0 ? (
                                    <div className="feedback-notifications">
                                        {notifications.map((notification) => (
                                            <div key={notification._id} className="feedback-item">
                                                <p><strong>Message:</strong> {notification.message}</p>
                                                <p><strong>Date:</strong> {new Date(notification.date).toLocaleString()}</p>
                                                <button className="delete-button" onClick={() => deleteNotification(notification._id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No messages found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {showNotificationsModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={toggleModal(setShowNotificationsModal)}>&times;</span>
                                <h2>Feedback Notifications</h2>
                                {feedbacks.length > 0 ? (
                                    <div className="feedback-notifications">
                                        {feedbacks.map((feedback) => (
                                            <div key={feedback._id} className={`feedback-item ${feedback.isRead ? 'read' : 'unread'}`}>
                                                <p><strong>Feedback:</strong> {feedback.feedback}</p>
                                                <p><strong>Department:</strong> {feedback.department}</p>
                                                <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                                                <button className="delete-button" onClick={() => deleteFeedback(feedback._id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No feedback available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctorspage;