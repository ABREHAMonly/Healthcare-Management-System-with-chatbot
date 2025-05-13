import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance';
import { FaCopy } from 'react-icons/fa';
import Notification from '../Notification';
import Modal from './Modal'; // Import the modal
import SpecificMedicineList from './SpecificMedicineList'; // Import SpecificMedicineList component

const PharmacistDashboard = () => {
    const [referrals, setReferrals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState(null);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const response = await axios.get('/patientreferrals');
                setReferrals(response.data);
            } catch (error) {
                console.error('Error fetching referrals:', error);
            }
        };

        fetchReferrals();
    }, []);

    const handleAssignMedicine = (referral) => {
        setSelectedReferral(referral);
        setIsModalOpen(true);
    };

    const handleMarkComplete = async (referralId) => {
        try {
            await axios.put(`/patientreferrals/complete/${referralId}`);
            setReferrals(prevReferrals =>
                prevReferrals.map(referral =>
                    referral._id === referralId ? { ...referral, status: 'Complete' } : referral
                )
            );
            setNotification({ message: 'Referral marked as complete', type: 'success' });
        } catch (error) {
            console.error('Error marking referral as complete:', error);
            setNotification({ message: 'Failed to mark referral as complete', type: 'error' });
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setNotification({ message: 'Copied to clipboard', type: 'success' });
        }).catch((error) => {
            console.error('Failed to copy: ', error);
            setNotification({ message: 'Failed to copy', type: 'error' });
        });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const filteredReferrals = referrals.filter(
        (referral) =>
            referral.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <style>
            {`
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 20px;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                /* Table styles */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                thead {
                    background-color: #f2f2f2;
                }

                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                tr:hover {
                    background-color: #f5f5f5;
                }

                button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px; /* Increased spacing between buttons */
                    transition: transform 0.2s ease; /* Smooth transition effect */
                }

                button:hover {
                    background-color:rgb(8, 109, 216);
                    transform: scale(0.95); /* Decreased size on hover */
                }

                .copy-icon {
                    cursor: pointer;
                    margin-left: 5px;
                    color: rgb(150, 152, 155);
                }

                .copy-icon:hover {
                    color: rgb(105, 107, 109);
                }

                /* Media queries for responsiveness */
                @media (max-width: 768px) {
                    .container {
                        padding: 10px;
                    }
                    
                    th, td {
                        font-size: 14px;
                        padding: 8px;
                    }

                    button {
                        font-size: 14px;
                        padding: 8px;
                        margin-right: 5px; /* Adjusted for smaller screens */
                    }
                }
            `}
            </style>
            
            <h1>Pharmacist Dashboard</h1>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}
            <div>
                <input
                    type="text"
                    placeholder="Search by Patient ID or Patient Name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Patient ID</th>
                        <th>Tablet Names</th>
                        <th>Injection Names</th>
                        <th>Doctor</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReferrals.map((referral) => (
                        <tr key={referral._id}>
                            <td>{referral.patientName}</td>
                            <td>
                                {referral.patientId}
                                <FaCopy 
                                    className="copy-icon" 
                                    onClick={() => handleCopy(referral.patientId)} 
                                />
                            </td>
                            <td>{referral.tabletNames}</td>
                            <td>{referral.injectionNames}</td>
                            <td>{referral.senderDoctorName}</td>
                            <td>{referral.status}</td>
                            <td>
                                {referral.status === 'Pending' && (
                                    <button onClick={() => handleAssignMedicine(referral)}>
                                        Assign Medicine
                                    </button>
                                )}
                                {referral.status !== 'Complete' && (
                                    <button onClick={() => handleMarkComplete(referral._id)}>
                                        Mark as Complete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedReferral && (
                    <SpecificMedicineList referral={selectedReferral} />
                )}
            </Modal>
        </div>
    );
};

export default PharmacistDashboard;
