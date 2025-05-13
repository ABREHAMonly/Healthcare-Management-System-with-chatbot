import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance'; // Import the axios instance you configured
import Notification from '../Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const LabPaymentDetail = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        testRequests: ''
    });
    const [labPaymentData, setLabPaymentData] = useState([]);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
    };

    const validateForm = () => {
        const newErrors = {};
        const patientIdPattern = /^ET-\d{4}-\d{6}$/; // Pattern for Patient ID
        const testRequestsPattern = /^[a-zA-Z0-9\s,_-]+$/; //  pattern for Test Requests
        if (!patientIdPattern.test(formData.patientId)) {
            newErrors.patientId = 'Patient ID must be in the format ET-YYYY-XXXXXX';
        }
        if (!testRequestsPattern.test(formData.testRequests)) {
            newErrors.testRequests = 'Test Requests can only contain letters, numbers, some special characters and spaces.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        if (editingId) {
            handleUpdate(editingId);
        } else {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('/labpaymentdata', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLabPaymentData([...labPaymentData, response.data.newLabPaymentData]);
                setNotification({ message: 'Lab payment details submitted successfully!', type: 'success' });
                setFormData({ patientId: '', testRequests: '' });
            } catch (error) {
                console.error('Error submitting lab payment details:', error);
                setNotification({ message: 'Error submitting lab payment details.', type: 'error' });
            }
        }
    };

    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/labpaymentdata/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLabPaymentData(labPaymentData.map((item) => (item._id === id ? response.data.labPaymentData : item)));
            setNotification({ message: 'Lab payment detail updated successfully!', type: 'success' });
            setFormData({ patientId: '', testRequests: '' });
            setEditingId(null);
        } catch (error) {
            console.error('Error updating lab payment detail:', error);
            setNotification({ message: 'Error updating lab payment detail.', type: 'error' });
        }
    };

    const handleEdit = (id) => {
        const payment = labPaymentData.find((item) => item._id === id);
        setFormData({ patientId: payment.patientId, testRequests: payment.testRequests.join(', ') });
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/labpaymentdata/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLabPaymentData(labPaymentData.filter((item) => item._id !== id));
            setNotification({ message: 'Lab payment detail deleted successfully!', type: 'success' });
        } catch (error) {
            console.error('Error deleting lab payment detail:', error);
            setNotification({ message: 'Error deleting lab payment detail.', type: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredLabPaymentData = labPaymentData.filter(
        (item) => item.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <h1>Submit Lab Payment Details</h1>
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={handleCloseNotification} />
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Patient ID:</label>
                    <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.patientId && <span style={styles.error}>{errors.patientId}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label>Test Requests:</label>
                    <input
                        type="text"
                        name="testRequests"
                        value={formData.testRequests}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {errors.testRequests && <span style={styles.error}>{errors.testRequests}</span>}
                </div>
                <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Submit'}</button>
            </form>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by Patient ID"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
            </div>

            <h2>Submitted Lab Payment Details</h2>
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
                                <button onClick={() => handleEdit(payment._id)} style={styles.actionButton}>
                                    <FontAwesomeIcon icon={faEdit} style={styles.editIcon} />
                                </button>
                                <button onClick={() => handleDelete(payment._id)} style={styles.actionButton}>
                                    <FontAwesomeIcon icon={faTrash} style={styles.deleteIcon} />
                                </button>
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
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#0f9499',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    searchContainer: {
        marginTop: '20px',
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
        marginTop: '20px',
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
    editIcon: {
        color: 'blue',
    },
    deleteIcon: {
        color: 'red',
    },
    error: {
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
    },
};

export default LabPaymentDetail;