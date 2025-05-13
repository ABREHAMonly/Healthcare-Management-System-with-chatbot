import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AppointmentsTable from './AppointmentsTable';
import axiosInstance from './AxiosInstance';
import './AdminPage.css';

const AdminPage = () => {
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        registeredDoctors: 0,
        registeredPharmacists: 0,
        registeredLaboratorists: 0,
        registeredNurses: 0,
        registeredCard: 0
    });
    const [unreadCount, setUnreadCount] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackData, setFeedbackData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axiosInstance.get('/users/me');
                setAdmin(response.data);
            } catch (error) {
                console.error('Error fetching admin details:', error);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        const fetchUnreadCount = async () => {
            try {
                const response = await axiosInstance.get('/messages/unread-count');
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        const fetchFeedbackCount = async () => {
            try {
                const response = await axiosInstance.get('/feedback');
                const unreadFeedbacks = response.data.filter(feedback => !feedback.isRead);
                setFeedbackCount(unreadFeedbacks.length);
            } catch (error) {
                console.error('Error fetching feedback count:', error);
            }
        };

        fetchAdminDetails();
        fetchStats();
        fetchUnreadCount();
        fetchFeedbackCount();
    }, []);

    const openModal = async () => {
        try {
            const response = await axiosInstance.get('/feedback');
            setFeedbackData(response.data);
            setIsModalOpen(true);

            // Mark all feedbacks as read when opening the modal
            await axiosInstance.patch('/feedback/mark-as-read');
            setFeedbackCount(0); // Reset the feedback count after marking as read
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    const deleteFeedback = async (id) => {
        try {
            await axiosInstance.delete(`/feedback/${id}`);
            setFeedbackData((prevData) => prevData.filter((feedback) => feedback._id !== id));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const categorizedFeedback = feedbackData.reduce((acc, feedback) => {
        (acc[feedback.department] = acc[feedback.department] || []).push(feedback);
        return acc;
    }, {});

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredFeedback = Object.keys(categorizedFeedback).reduce((acc, department) => {
        if (department.toLowerCase().includes(searchTerm)) {
            acc[department] = categorizedFeedback[department];
        }
        return acc;
    }, {});

    if (admin.role !== 'admin') {
        return null;
    }

    return (
        <div className="admin-page">
            <Sidebar onLogout={handleLogout} unreadCount={unreadCount} />
            <div className="main-content">
                <Header admin={admin} stats={stats} />
                <button onClick={openModal} className="open-modal-button">
                    View Feedback <span className="feedback-counter">{feedbackCount}</span>
                </button>
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h2>Feedback</h2>
                            <input
                                type="text"
                                placeholder="Search by department"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            {Object.keys(filteredFeedback).length > 0 ? (
                                Object.keys(filteredFeedback).map(department => (
                                    <div key={department} className="feedback-category">
                                        <h3>{department.charAt(0).toUpperCase() + department.slice(1)}</h3>
                                        {filteredFeedback[department].map(feedback => (
                                            <div key={feedback._id} className="feedback-item">
                                                <span className="delete-feedback" onClick={() => deleteFeedback(feedback._id)}>&times;</span>
                                                <p><strong>Name:</strong> {feedback.name}</p>
                                                <p><strong>Email:</strong> {feedback.email}</p>
                                                <p><strong>Feedback:</strong> {feedback.feedback}</p>
                                                <p><strong>Date:</strong> {new Date(feedback.date).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>No feedback found for this department.</p>
                            )}
                        </div>
                    </div>
                )}
                <AppointmentsTable user={admin} />
            </div>
        </div>
    );
};

export default AdminPage;