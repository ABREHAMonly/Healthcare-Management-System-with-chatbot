import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import { FaSearch, FaCopy } from 'react-icons/fa';
import Notification from '../Notification'; // Importing the Notification component

const PatientTestRequests = () => {
    const [testRequests, setTestRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTestRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/patient-test-requests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTestRequests(response.data);
            } catch (error) {
                console.error('Error fetching test requests:', error);
                showNotification('Error fetching test requests', 'error');
            }
        };

        fetchTestRequests();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const profile = JSON.parse(localStorage.getItem('profile'));
            const email = profile?.user?.email || '';
            const role = profile?.user?.role || '';
            const response = await axiosInstance.get(`/notifications/${role}/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            showNotification('Error fetching notifications', 'error');
        }
    };

    const markAsCompleted = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.patch(`/patient-test-requests/${id}`, { status: 'completed' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('Test request marked as completed successfully', 'success');

            // Fetch updated test requests and notifications
            const response = await axiosInstance.get('/patient-test-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestRequests(response.data);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking request as completed:', error);
            showNotification('Error marking request as completed', 'error');
        }
    };

    const showNotification = (message, type) => {
        setCurrentNotification({ message, type });
        setTimeout(() => setCurrentNotification(null), 5000); // Auto close after 5 seconds
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => showNotification('Copied to clipboard!', 'success'))
            .catch(err => showNotification('Failed to copy', 'error'));
    };

    // Filtered test requests based on search query (case insensitive)
    const filteredRequests = testRequests.filter(request => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            request.patientName.toLowerCase().includes(lowerCaseQuery) ||
            request.patientId.toString().toLowerCase().includes(lowerCaseQuery)
        );
    });

    return (
        <div>
            {currentNotification && (
                <Notification 
                    message={currentNotification.message} 
                    type={currentNotification.type} 
                    onClose={() => setCurrentNotification(null)} 
                />
            )}

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <FaSearch style={{ marginRight: '8px' }} />
                <input 
                    type="text" 
                    placeholder="Search by Patient ID or Name" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{ padding: '8px', width: '300px' }}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Patient ID</th>
                        <th>Patient Category</th>
                        <th>Tests Requested</th>
                        <th>Additional Notes</th>
                        <th>Doctor Name</th>
                        <th>Doctor ID</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests.map(request => (
                        <tr key={request._id}>
                            <td>{request.patientName}</td>
                            <td>{request.patientId}</td>
                            <td>{request.patientCategory.join(', ')}</td>
                            <td>
                                {request.testsRequested.join(', ')} 
                                <FaCopy 
                                    style={{ marginLeft: '8px', cursor: 'pointer' }} 
                                    onClick={() => copyToClipboard(request.testsRequested.join(', '))} 
                                />
                            </td>
                            <td>{request.additionalNotes}</td>
                            <td>{request.doctorName}</td>
                            <td>{request.doctorId}</td>
                            <td>{request.status}</td>
                            <td>
                                {request.status === 'pending' && (
                                    <button onClick={() => markAsCompleted(request._id)}>Mark as Completed</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {notifications.length > 0 && (
                <div>
                    <h2>Notifications</h2>
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index}>{notification.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PatientTestRequests;