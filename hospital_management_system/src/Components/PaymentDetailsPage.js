import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification';
import './PaymentDetailsPage.css'; // Optional: Create this CSS file to style your page

const PaymentDetailsPage = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(''); // State to track user role
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const userProfile = JSON.parse(localStorage.getItem('profile'));
                setUserRole(userProfile.role); // Set the user role

                const response = await axiosInstance.get('/paymentdetails', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(response.data);
                setFilteredPayments(response.data); // Initially set filteredPayments to all payments
            } catch (error) {
                console.error('Error fetching payment details:', error);
                setError('Failed to load payment details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, []);

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        const filtered = payments.filter(payment => payment.patientId.toLowerCase().includes(value.toLowerCase()));
        setFilteredPayments(filtered);
    };

    const handleSearchClick = () => {
        const filtered = payments.filter(payment => payment.patientId.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredPayments(filtered);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setNotification({ message: 'Copied to clipboard', type: 'success' });
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            setNotification({ message: 'Failed to copy', type: 'error' });
        });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const handleMarkAsCompleted = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.put(`/paymentdetails/${id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(prevPayments => prevPayments.map(payment => 
                payment._id === id ? { ...payment, status: 'completed' } : payment
            ));
            setFilteredPayments(prevPayments => prevPayments.map(payment => 
                payment._id === id ? { ...payment, status: 'completed' } : payment
            ));
        } catch (error) {
            console.error('Error marking payment as completed:', error);
            alert('Error marking payment as completed. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="payment-details-page">
            <h2>Payment Details</h2>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Patient ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearchClick} />
            </div>
            <table className="payment-details-table">
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Reason</th>
                        <th>Amount (ETB)</th>
                        <th>Status</th>
                        <th>Date</th>
                        {userRole === 'card' && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.map((payment) => (
                        <tr key={payment._id}>
                            <td>
                                {payment.patientId}
                                <FontAwesomeIcon 
                                    icon={faCopy} 
                                    className="copy-icon" 
                                    onClick={() => handleCopy(payment.patientId)} 
                                />
                            </td>
                            <td>{payment.reason}</td>
                            <td>{payment.amountETB}</td>
                            <td>{payment.status}</td>
                            <td>{new Date(payment.date).toLocaleDateString()}</td>
                            {userRole === 'card' && (
                                <td>
                                    {payment.status === 'pending' && (
                                        <button onClick={() => handleMarkAsCompleted(payment._id)}>
                                            <FontAwesomeIcon icon={faCheck} /> Mark as Completed
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentDetailsPage;
