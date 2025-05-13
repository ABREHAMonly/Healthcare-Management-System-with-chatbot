import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance'; // Import the axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PaymentPage.css'; // Import the CSS file for styling
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification'; // Import Notification component

const PaymentPage = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        reason: 'card',
        amountETB: ''
    });
    const [payments, setPayments] = useState([]);
    const [totalAmountETB, setTotalAmountETB] = useState(0);
    const [totalPayoutAmount, setTotalPayoutAmount] = useState(0);
    const [allPayments, setAllPayments] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [editingPayment, setEditingPayment] = useState(null);
    const [fetchError, setFetchError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.amountETB <= 0) {
            setNotification({ message: 'Amount must be greater than 0.', type: 'error', show: true });
            return;
        }
        try {
            const response = await axios.post('/payments', formData);
            setNotification({ message: 'Payment added successfully.', type: 'success', show: true });
            setFormData({ patientId: '', patientName: '', reason: 'card', amountETB: '' });
            fetchTotalPayoutAmount();
            fetchAllPayments();
        } catch (error) {
            setNotification({ message: 'Error adding payment.', type: 'error', show: true });
        }
    };

    const fetchPayments = async () => {
        setFetchError('');
        try {
            const { data } = await axios.get(`/payments/${formData.patientId}`);
            if (data && data.payments) {
                setPayments(data.payments);
                setTotalAmountETB(data.totalAmountETB || 0); // Set to 0 if undefined
            } else {
                setFetchError('Unexpected response format.');
            }
        } catch (error) {
            setFetchError('Error fetching payment history. Please try again.');
        }
    };

    const fetchTotalPayoutAmount = async () => {
        try {
            const { data } = await axios.get('/payments/total-payout');
            setTotalPayoutAmount(data.totalPayoutAmount || 0); // Set to 0 if undefined
        } catch (error) {
            console.error('Error fetching total payout amount:', error);
        }
    };

    const fetchAllPayments = async () => {
        try {
            const { data } = await axios.get('/payments');
            setAllPayments(data || []); // Default to empty array
        } catch (error) {
            console.error('Error fetching all payments:', error);
        }
    };

    const handleEditClick = (payment) => {
        setEditingPayment(payment);
        setFormData({
            patientId: payment.patientId,
            patientName: payment.patientName,
            reason: payment.reason,
            amountETB: payment.amountETB
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.amountETB <= 0) {
            setNotification({ message: 'Amount must be greater than 0.', type: 'error', show: true });
            return;
        }
        try {
            await axios.put(`/payments/${editingPayment._id}`, formData);
            setNotification({ message: 'Payment updated successfully.', type: 'success', show: true });
            setEditingPayment(null);
            setFormData({ patientId: '', patientName: '', reason: 'card', amountETB: '' });
            fetchPayments();
            fetchTotalPayoutAmount();
            fetchAllPayments();
        } catch (error) {
            setNotification({ message: 'Error updating payment.', type: 'error', show: true });
        }
    };

    useEffect(() => {
        fetchTotalPayoutAmount();
        fetchAllPayments();
    }, []);

    const handleCloseNotification = () => {
        setNotification({ ...notification, show: false });
    };

    return (
        <div className="payment-page">
            <FontAwesomeIcon
                icon={faArrowLeft}
                className="back-icon"
                onClick={() => window.location.href = '/addhelperform'} // Navigate to AddHelperForm
            />
            <h2>Payment Page</h2>
            <form onSubmit={editingPayment ? handleUpdate : handleSubmit} className="payment-form">
                <div className="form-group">
                    <label htmlFor="patientId">Patient ID:</label>
                    <input type="text" id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="patientName">Patient Name:</label>
                    <input type="text" id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="reason">Payment Reason:</label>
                    <select id="reason" name="reason" value={formData.reason} onChange={handleChange} required>
                        <option value="card">Card</option>
                        <option value="laboratory">Laboratory</option>
                        <option value="tablet">Tablet</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="amountETB">Amount (ETB):</label>
                    <input type="number" id="amountETB" name="amountETB" value={formData.amountETB} onChange={handleChange} required min="0" />
                </div>
                {!editingPayment && <button type="submit" className="submit-button">Add Payment</button>}
                <button type="button" className="submit-button" onClick={fetchPayments}>Fetch Payment History</button>
                {editingPayment && <button type="submit" className="submit-button">Update Payment</button>}
            </form>
            {notification.show && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={handleCloseNotification} 
                />
            )}
            {fetchError && (
                <Notification 
                    message={fetchError} 
                    type="error" 
                    onClose={() => setFetchError('')} 
                />
            )}
            <h3>Payment History for Patient ID: {formData.patientId}</h3>
            {payments.length > 0 ? (
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Amount (ETB)</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.patientId}</td>
                                <td>{payment.patientName}</td>
                                <td>{new Date(payment.date).toLocaleString()}</td>
                                <td>{payment.reason}</td>
                                <td>{payment.amountETB}</td>
                                <td>
                                    <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEditClick(payment)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No payments found for this patient.</p>
            )}
            <h3>Total Amount for Patient ID {formData.patientId}: {totalAmountETB} ETB</h3>
            <h3>Total Payout Amount: {totalPayoutAmount} ETB</h3>

            <h3>All Payments Data</h3>
            {allPayments.length > 0 ? (
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Amount (ETB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPayments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.patientId}</td>
                                <td>{payment.patientName}</td>
                                <td>{new Date(payment.date).toLocaleString()}</td>
                                <td>{payment.reason}</td>
                                <td>{payment.amountETB}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No payments found.</p>
            )}
        </div>
    );
};

export default PaymentPage;