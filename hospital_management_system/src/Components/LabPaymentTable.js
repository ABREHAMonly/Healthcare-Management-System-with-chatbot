import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance'; // Import the axios instance you configured
import Notification from '../Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const LabPaymentTable = () => {
    const [labPaymentData, setLabPaymentData] = useState([]);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLabPaymentData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/labpaymentdata', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLabPaymentData(response.data);
            } catch (error) {
                console.error('Error fetching lab payment data:', error);
            }
        };

        fetchLabPaymentData();
    }, []);

    const handleMarkAsCompleted = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/labpaymentdata/complete/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLabPaymentData(labPaymentData.map((item) => (item._id === id ? response.data.labPaymentData : item)));
            setNotification({ message: 'Lab payment detail marked as completed!', type: 'success' });
        } catch (error) {
            console.error('Error marking lab payment detail as completed:', error);
            setNotification({ message: 'Error marking lab payment detail as completed.', type: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const filteredLabPaymentData = labPaymentData.filter(
        (item) => item.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <h2>Submitted Lab Payment Details</h2>
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={handleCloseNotification} />
            )}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by Patient ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>
            <table style={styles.table}>
                <thead style={styles.tableHeader}>
                    <tr>
                        <th style={styles.tableCell}>Patient ID</th>
                        <th style={styles.tableCell}>Test Requests</th>
                        <th style={styles.tableCell}>Status</th>
                        <th style={styles.tableCell}>Date</th>
                        <th style={styles.tableCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLabPaymentData.map((payment) => (
                        <tr key={payment._id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{payment.patientId}</td>
                            <td style={styles.tableCell}>{payment.testRequests.join(', ')}</td>
                            <td style={styles.tableCell}>{payment.status}</td>
                            <td style={styles.tableCell}>{new Date(payment.date).toLocaleDateString()}</td>
                            <td style={styles.tableCell}>
                                {payment.status !== 'completed' && (
                                    <button onClick={() => handleMarkAsCompleted(payment._id)} style={styles.actionButton}>
                                        <FontAwesomeIcon icon={faCheck} style={styles.completeIcon} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    searchContainer: {
        marginBottom: '20px',
    },
    searchInput: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    tableRow: {
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    actionButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
    },
    completeIcon: {
        color: 'green',
    },
};

export default LabPaymentTable;