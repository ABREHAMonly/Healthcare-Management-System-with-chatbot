import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance'; // Adjust the import as per your file structure
import './SpecificMedicineList.css'; // Create a CSS file for styling if needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Modal from './Modal'; // Import the Modal component
import PaymentDetailForm from './paymentDetailForm'; // Import the PaymentDetailForm component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillWave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SpecificMedicineList = () => {
    const [specificMedicines, setSpecificMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isPaymentDetailFormOpen, setIsPaymentDetailFormOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchSpecificMedicines = async () => {
            try {
                const response = await axiosInstance.get('/specific-medicines'); // Adjust the endpoint as necessary
                setSpecificMedicines(response.data);
            } catch (err) {
                setError('Error fetching specific medicines. Please try again.');
                console.error('Error fetching specific medicines:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecificMedicines();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Filter medicines based on search term
    const filteredMedicines = specificMedicines.filter(medicine =>
        medicine.generalMedicineName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePaymentOption = (medicine) => {
        setSelectedMedicine(medicine);
        setIsModalOpen(true);
    };

    const handlePayment = (method) => {
        if (method === 'Cash') {
            navigate('/chapapay'); // Redirect to ChapaPayment component
        } else {
            setIsPaymentDetailFormOpen(true); // Open PaymentDetailForm modal
        }
    };

    const handleBackClick = () => {
        navigate('/addhelperform');
    };

    return (
        <div className="specific-medicine-list">
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-icon" 
                onClick={handleBackClick} 
            />
            <h1>Specific Medicines</h1>
            <input
                type="text"
                placeholder="Search by Medicine Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <table className="medicine-table">
                <thead>
                    <tr>
                        <th>General Medicine Name</th>
                        <th>Expired Date</th>
                        <th>Quantity</th>
                        <th>Buying Price</th>
                        <th>Selling Price</th>
                        <th>Profit</th>
                        <th>Actions</th> {/* New actions column */}
                    </tr>
                </thead>
                <tbody>
                    {filteredMedicines.map((medicine) => {
                        const isExpired = new Date(medicine.expiredDate) < new Date();
                        return (
                            <tr key={medicine._id}>
                                <td>{medicine.generalMedicineName}</td>
                                <td>{new Date(medicine.expiredDate).toLocaleDateString()}</td>
                                <td>{medicine.quantity}</td>
                                <td>{medicine.buyingPrice.toFixed(2)}</td>
                                <td>{medicine.sellingPrice.toFixed(2)}</td>
                                <td>{(medicine.sellingPrice - medicine.buyingPrice).toFixed(2)}</td>
                                <td>
                                    <button 
                                        className="action-button" 
                                        onClick={() => handlePaymentOption(medicine)} 
                                        disabled={isExpired} // Disable button if expired
                                        style={{ backgroundColor: isExpired ? '#ccc' : '#007bff', cursor: isExpired ? 'not-allowed' : 'pointer' }} // Change button style if disabled
                                    >
                                        {isExpired ? 'Expired' : 'Pay'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedMedicine && (
                    <div>
                        <h2>Payment Options for {selectedMedicine.generalMedicineName}</h2>
                        <div className="payment-options-container"> {/* New container */}
                            <button className="payment-options-button" onClick={() => handlePayment('Cash')}>
                                <FontAwesomeIcon icon={faMoneyBillWave} className="payment-options-icon" />
                                Pay with Chapa
                            </button>
                            <button className="payment-options-button" onClick={() => handlePayment('Manual')}>
                                <FontAwesomeIcon icon={faCreditCard} className="payment-options-icon" />
                                Pay Manually
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={isPaymentDetailFormOpen} onClose={() => setIsPaymentDetailFormOpen(false)}>
                <PaymentDetailForm onClose={() => setIsPaymentDetailFormOpen(false)} />
            </Modal>
        </div>
    );
};

export default SpecificMedicineList;