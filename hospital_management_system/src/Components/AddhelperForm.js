import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes, faEnvelope, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar2 from './Sidebar2'; 
import './AddhelperForm.css';
import TestPatientRequestsTable from './TestPatientRequestsTable';
import TestResultForm from './TestResultForm';
import PaymentDetailsPage from './PaymentDetailsPage';
import PaymentDetailForm from './paymentDetailForm'; // Corrected import name
import VitalSignsForm from './VitalSignsForm';  
import VitalSignsDisplay from './VitalSignsDisplay'; 
import PharmacistDashboard from './PharmacistDashboard'; 
import PaymentDetailsTable from './PaymentDetailsTable';
import LabPaymentDetail from './LabPaymentDetail';
import LabPaymentTable from './LabPaymentTable'; 
import axiosInstance from './AxiosInstance';

const AddhelperForm = () => {
    const navigate = useNavigate();
    const profile = JSON.parse(localStorage.getItem('profile'));

    // Redirect if the user role is not allowed
    if (!profile || !['pharmacist', 'card', 'laboratorist', 'nurse'].includes(profile.user.role)) {
        navigate('/login');
    }

    const [showTestPatientRequestsTable, setShowTestPatientRequestsTable] = useState(false);
    const [showTestResultForm, setShowTestResultForm] = useState(false);
    const [showPaymentDetailsPage, setShowPaymentDetailsPage] = useState(false);
    const [showPaymentDetailForm, setShowPaymentDetailForm] = useState(false); // Corrected variable name
    const [showVitalSignsForm, setShowVitalSignsForm] = useState(false);
    const [showVitalSignsDisplay, setShowVitalSignsDisplay] = useState(false);
    const [showPharmacistDashboard, setShowPharmacistDashboard] = useState(false);
    const [showPaymentDetailsTable, setShowPaymentDetailsTable] = useState(false);
    const [showLabPaymentDetail, setShowLabPaymentDetail] = useState(false);
    const [showLabPaymentTable, setShowLabPaymentTable] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false); 
    const [referrals, setReferrals] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchReferrals = async () => {
        try {
            const response = await axiosInstance.get('/sendToPharmacist/nurse-referrals');
            setReferrals(response.data);
        } catch (error) {
            console.error('Error fetching referrals:', error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const response = await axiosInstance.get(`/feedback?department=${profile.user.department}`);
            setFeedbacks(response.data);
            const unread = response.data.filter(feedback => !feedback.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.patch('/feedback/mark-as-read');
            fetchFeedbacks();
        } catch (error) {
            console.error('Error marking feedback as read:', error);
        }
    };

    const deleteFeedback = async (id) => {
        try {
            await axiosInstance.delete(`/feedback/${id}`);
            setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    useEffect(() => {
        if (profile.user.role === 'nurse') {
            fetchReferrals();
        }
        fetchFeedbacks();
    }, [profile.user.role]);

    const toggleTestPatientRequestsTable = () => {
        setShowTestPatientRequestsTable(!showTestPatientRequestsTable);
    };

    const toggleTestResultForm = () => {
        setShowTestResultForm(!showTestResultForm);
    };

    const togglePaymentDetailsPage = () => {
        setShowPaymentDetailsPage(!showPaymentDetailsPage);
    };

    const toggleVitalSignsForm = () => {
        setShowVitalSignsForm(!showVitalSignsForm);
    };

    const toggleVitalSignsDisplay = () => {
        setShowVitalSignsDisplay(!showVitalSignsDisplay);
    };

    const togglePharmacistDashboard = () => {
        setShowPharmacistDashboard(!showPharmacistDashboard);
    };

    const togglePaymentDetailsTable = () => {
        setShowPaymentDetailsTable(!showPaymentDetailsTable);
    };
    const toggleLabPaymentDetail = () => {
        setShowLabPaymentDetail(!showLabPaymentDetail);
    };
    const toggleLabPaymentTable = () => {
        setShowLabPaymentTable(!showLabPaymentTable);
    };

    const toggleReferralModal = () => {
        setShowReferralModal(!showReferralModal);
    };

    const togglePaymentDetailForm = () => {
        setShowPaymentDetailForm(!showPaymentDetailForm);
    };

    const toggleFeedbackModal = () => {
        setShowFeedbackModal(!showFeedbackModal);
        if (!showFeedbackModal) {
            markAllAsRead();
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredReferrals = referrals.filter(referral =>
        referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="addhelperform-container">
            <Sidebar2 onLogout={handleLogout} />

            <div className="header2">
                <div className="profile">
                    <img src={`http://localhost:5000/uploads/${profile.user.image}`} alt="Profile" />
                    <div className="info">
                        <span><strong>Name:</strong> {`${profile.user.firstName} ${profile.user.lastName}`}</span>
                        <span><strong>Department:</strong> {profile.user.department}</span>
                    </div>
                </div>
                <div className="actions">
                    <div className="messages-icon" onClick={toggleFeedbackModal}>
                        <FontAwesomeIcon icon={faEnvelope} title="Messages" />
                        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
                    </div>
                </div>
            </div>
            <h1>Welcome Back!</h1>
            <p>Let's Continue</p>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="modal">
                    <div className="modal-content">
                        <FontAwesomeIcon icon={faTimes} className="modal-close" onClick={toggleFeedbackModal} />
                        <h2>Feedback Messages</h2>
                        {feedbacks.length === 0 ? (
                            <p>No feedback available.</p>
                        ) : (
                            <div className="feedback-list">
                                {feedbacks.map(feedback => (
                                    <div key={feedback._id} className="feedback-item">
                                        <p><strong>Feedback:</strong> {feedback.feedback}</p>
                                        <p><strong>Department:</strong> {feedback.department}</p>
                                        <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                                        <FontAwesomeIcon 
                                            icon={faTrash} 
                                            className="delete-icon" 
                                            onClick={() => deleteFeedback(feedback._id)} 
                                            title="Delete Feedback"
                                        />
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Other Components */}
            {profile.user.role === 'laboratorist' && (
                <div>
                    <div className="collapse-header" onClick={toggleTestPatientRequestsTable}>
                        <h3>
                            <FontAwesomeIcon icon={showTestPatientRequestsTable ? faChevronUp : faChevronDown} /> Requested tests for Patients
                        </h3>
                    </div>
                    {showTestPatientRequestsTable && (
                        <div className="main-content">
                            <TestPatientRequestsTable />
                        </div>
                    )}
                    <div className="collapse-header" onClick={toggleTestResultForm}>
                        <h3>
                            <FontAwesomeIcon icon={showTestResultForm ? faChevronUp : faChevronDown} /> Test Results Form
                        </h3>
                    </div>
                    {showTestResultForm && (
                        <div className="main-content">
                            <TestResultForm />
                        </div>
                    )}
                    <div className="collapse-header" onClick={toggleLabPaymentDetail}>
                        <h3>
                            <FontAwesomeIcon icon={showLabPaymentDetail ? faChevronUp : faChevronDown} /> Patients Laboratory Payment Detail
                        </h3>
                    </div>
                    {showLabPaymentDetail && (
                        <div className="main-content">
                            <LabPaymentDetail/>
                        </div>
                    )}
                </div>
            )}
            {profile.user.role === 'card' && (
                <div>
                    <div className="collapse-header" onClick={togglePaymentDetailsPage}>
                        <h3>
                            <FontAwesomeIcon icon={showPaymentDetailsPage ? faChevronUp : faChevronDown} /> Patients Payment Details
                        </h3>
                    </div>
                    {showPaymentDetailsPage && (
                        <div className="main-content">
                            <PaymentDetailsPage />
                        </div>
                    )}
                    <div className="collapse-header" onClick={toggleLabPaymentTable}>
                        <h3>
                            <FontAwesomeIcon icon={showLabPaymentTable ? faChevronUp : faChevronDown} /> Patients Laboratory Payment Details
                        </h3>
                    </div>
                    {showLabPaymentTable && (
                        <div className="main-content">
                            <LabPaymentTable />
                        </div>
                    )}
                </div>
            )}

            {profile.user.role === 'pharmacist' && (
                <div>
                    <div className="collapse-header" onClick={togglePharmacistDashboard}>
                        <h3>
                            <FontAwesomeIcon icon={showPharmacistDashboard ? faChevronUp : faChevronDown} /> Patients Data from Doctors
                        </h3>
                    </div>
                    {showPharmacistDashboard && (
                        <div className="main-content">
                            <PharmacistDashboard />
                        </div>
                    )}
                    

                    <div className="collapse-header" onClick={togglePaymentDetailsTable}>
                        <h3>
                            <FontAwesomeIcon icon={showPaymentDetailsTable ? faChevronUp : faChevronDown} /> Patients Payment Detail Table reason Tablet
                        </h3>
                    </div>
                    {showPaymentDetailsTable && (
                        <div className="main-content">
                            <PaymentDetailsTable />
                        </div>
                    )}
                </div>
            )}

            {profile.user.role === 'nurse' && (
                <div>
                    <div className="collapse-header" onClick={toggleVitalSignsForm}>
                        <h3>
                            <FontAwesomeIcon icon={showVitalSignsForm ? faChevronUp : faChevronDown} /> Patients Vital Signs Form
                        </h3>
                    </div>
                    {showVitalSignsForm && (
                        <div className="main-content">
                            <VitalSignsForm />
                        </div>
                    )}
                    <div className="collapse-header" onClick={toggleVitalSignsDisplay}>
                        <h3>
                            <FontAwesomeIcon icon={showVitalSignsDisplay ? faChevronUp : faChevronDown} /> All Patients Vital Signs Data
                        </h3>
                    </div>
                    
                    {showVitalSignsDisplay && (
                        <div className="main-content">
                            <VitalSignsDisplay />
                        </div>
                    )}

                    <div className="collapse-header" onClick={toggleReferralModal}>
                        <h3>
                            <FontAwesomeIcon icon={showReferralModal ? faChevronUp : faChevronDown} /> Patient Referrals
                        </h3>
                    </div>
                    
                    {showReferralModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <FontAwesomeIcon icon={faTimes} className="modal-close" onClick={toggleReferralModal} />
                                <h2>Patient Referrals</h2>
                                <input
                                    type="text"
                                    placeholder="Search by name or patient ID"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="search-input"
                                />
                                <div className="referral-list">
                                    {filteredReferrals.map(referral => (
                                        <div key={referral._id} className="referral-item">
                                            <p><strong>Patient Name:</strong> {referral.patientName}</p>
                                            <p><strong>Patient ID:</strong> {referral.patientId}</p>
                                            <p><strong>Injection Names:</strong> {referral.injectionNames}</p>
                                            <p><strong>Disease Name:</strong> {referral.diseaseName}</p>
                                            <p><strong>Injection Amount:</strong> {referral.injectionAmount}</p>
                                            <p><strong>Treatment Days:</strong> {referral.treatmentDays}</p>
                                            <p><strong>Doctor:</strong> {referral.senderDoctorName}</p>
                                            <p><strong>Status:</strong> {referral.status}</p>
                                            <p><strong>Timestamp:</strong> {new Date(referral.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddhelperForm;