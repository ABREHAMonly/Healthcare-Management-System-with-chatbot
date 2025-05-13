import React, { useState } from 'react';
import axios from 'axios';
import './ChapaPayment.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ChapaPayment = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chapapayments/create-chapapayment`, {
                amount,
                description,
                email: 'ABREHAMonly@gmail.com',
            });
    
            if (response.data.data.checkout_url) {
                window.location.href = response.data.data.checkout_url;
    
                // Redirect to payment-success after a few seconds
                setTimeout(() => {
                    window.location.href = '/payment-success';
                }, 5000); // Change 5000 to the desired wait time in milliseconds (5 seconds)
            } else {
                console.error('No checkout URL received.');
                // Redirect to payment-failed if no URL
                window.location.href = '/payment-failed';
            }
        } catch (error) {
            console.error('Error initiating payment:', error.response?.data || error.message);
            // Redirect to payment-failed on error
            window.location.href = '/payment-failed';
        } finally {
            setLoading(false);
        }
    };
    const handleBackClick = () => {
        navigate('/specific-medicine-list');
    };

    return (
        <div className="chapa-payment-container">
            <FontAwesomeIcon 
                                icon={faArrowLeft} 
                                className="back-icon" 
                                onClick={handleBackClick} 
                                />
            <h2>Chapa Payment</h2>
            <div className="input-group">
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="input-field"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="input-field"
                />
            </div>
            <button onClick={handlePayment} className="pay-button" disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default ChapaPayment;