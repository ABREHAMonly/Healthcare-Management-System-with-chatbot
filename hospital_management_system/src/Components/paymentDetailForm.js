import React, { useState } from 'react';
import axiosInstance from './AxiosInstance';
import Notification from '../Notification';
import './PaymentDetailForm.css'; // Optional: Create this CSS file to style your form

const PaymentDetailForm = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        reason: '',
        amountETB: ''
    });
    const [notification, setNotification] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { patientId, reason, amountETB } = formData;

        if (!patientId || !reason || !amountETB) {
            setNotification({ message: 'All fields are required.', type: 'error' });
            return false;
        }

        if (amountETB <= 0) {
            setNotification({ message: 'Amount must be a positive number.', type: 'error' });
            return false;
        }

        // Additional validations can be added here as needed

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post('/paymentdetails', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotification({ message: 'Payment details saved successfully.', type: 'success' });
            setFormData({
                patientId: '',
                reason: '',
                amountETB: ''
            });
        } catch (error) {
            console.error('Error saving payment details:', error);
            setNotification({ message: 'Error saving payment details. Please try again.', type: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    return (
        <div className="payment-detail-form-container">
            <form onSubmit={handleSubmit} className="payment-detail-form">
                <h2>Submit Payment Details</h2>
                <div className="form-group">
                    <label htmlFor="patientId">Patient ID</label>
                    <input
                        type="text"
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reason">Reason</label>
                    <input
                        type="text"
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amountETB">Amount (ETB)</label>
                    <input
                        type="number"
                        id="amountETB"
                        name="amountETB"
                        value={formData.amountETB}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Save Payment</button>
            </form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default PaymentDetailForm;