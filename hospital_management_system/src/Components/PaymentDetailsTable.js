import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance'; // Import the axios instance you configured

const PaymentDetailsTable = () => {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch payment details with reason = 'tablet' on component mount
        const fetchPayments = async () => {
            try {
                const response = await axios.get('/paymentdetails');
                const filteredPayments = response.data.filter(payment => payment.reason.toLowerCase() === 'tablet');
                setPayments(filteredPayments);
            } catch (error) {
                console.error('Error fetching payment details:', error);
            }
        };

        fetchPayments();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPayments = payments.filter(
        (payment) =>
            payment.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h1>Payment Details</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search by Patient ID"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Patient ID</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Reason</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Amount (ETB)</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Payment Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.map((payment) => (
                        <tr key={payment._id} style={{ hover: { backgroundColor: '#f5f5f5' } }}>
                            <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.patientId}</td>
                            <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.reason}</td>
                            <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.amountETB}</td>
                            <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.status}</td>
                            <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{new Date(payment.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentDetailsTable;
