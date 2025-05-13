import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/addhelperform');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payment Success</h1>
            <p style={styles.message}>Thank you for your payment. Your transaction was completed successfully.</p>
            <button style={styles.button} onClick={handleGoHome}>Go to Home</button>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        width: '60%',
        margin: '100px auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    title: {
        color: '#28a745',
        fontSize: '2rem',
    },
    message: {
        fontSize: '1.2rem',
        margin: '20px 0',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default PaymentSuccess;
