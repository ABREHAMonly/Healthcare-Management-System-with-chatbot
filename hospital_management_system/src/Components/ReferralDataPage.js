import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ReferralDataPage = ({ patientId }) => {
    const [referralData, setReferralData] = useState([]);
    const [error, setError] = useState('');
    const [showData, setShowData] = useState(true);

    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                const response = await axiosInstance.get(`/patientreferrals/${patientId}`);
                console.log(response.data); // Log the response data for debugging
                setReferralData(response.data); // Assuming this returns an array of referral records
            } catch (error) {
                console.error(error); // Log the error for debugging
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Error fetching medical history data.');
                }
            }
        };

        if (patientId) {
            fetchReferralData();
        }
    }, [patientId]);

    const handleClose = () => {
        setShowData(false);
    };

    if (!showData) {
        return null;
    }

    return (
        <div className="referral-data-page">
            <style>{`
                .referral-data-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
                    background-color: #eaeff1;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    position: relative;
                    padding: 20px;
                }

                .referral-data-container {
                    width: 100%;
                    max-width: 600px;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow-y: auto;
                    max-height: 80vh; /* Limit height for scrolling */
                }

                .close-icon {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    cursor: pointer;
                    font-size: 24px;
                    color: #dc3545;
                    transition: color 0.3s;
                }

                .close-icon:hover {
                    color: #c82333;
                }

                .referral-data h2 {
                    margin-bottom: 20px;
                    color: #333;
                    font-size: 26px;
                    font-weight: bold;
                }

                .referral-message {
                    margin-bottom: 20px;
                    color: #555;
                    font-size: 16px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                }

                .error-message {
                    color: #dc3545;
                    font-size: 16px;
                    margin-bottom: 20px;
                }

                @media (max-width: 768px) {
                    .referral-data-container {
                        padding: 20px;
                    }

                    .referral-data h2 {
                        font-size: 22px;
                    }
                }

                @media (max-width: 480px) {
                    .referral-data-container {
                        padding: 15px;
                    }

                    .referral-data h2 {
                        font-size: 18px;
                    }
                }
            `}</style>

            {error && <div className="error-message">{error}</div>}
            {referralData.length > 0 ? (
                <div className="referral-data-container">
                    <FontAwesomeIcon 
                        icon={faTimes} 
                        className="close-icon" 
                        onClick={handleClose} 
                    />
                    <h2>Your Medical History</h2>
                    <div className="referral-data">
                        {referralData.map((referral, index) => (
                            <div key={index} className="referral-message">
                                <p><strong>Patient Name:</strong> {referral.patientName}</p>
                                <p><strong>Patient ID:</strong> {referral.patientId}</p>
                                <p><strong>Tablet Names:</strong> {referral.tabletNames}</p>
                                <p><strong>Injection Names:</strong> {referral.injectionNames}</p>
                                <p><strong>Disease Name:</strong> {referral.diseaseName}</p>
                                <p><strong>Nurse Care:</strong> {referral.nurseCare}</p>
                                <p><strong>Injection Amount:</strong> {referral.injectionAmount}</p>
                                <p><strong>Treatment Days:</strong> {referral.treatmentDays}</p>
                                <p><strong>Doctor:</strong> {referral.senderDoctorName}</p>
                                <p><strong>Pharmacist:</strong> {referral.pharmacistName}</p>
                                <p><strong>Date:</strong> {new Date(referral.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No referral data available.</div>
            )}
        </div>
    );
};

export default ReferralDataPage;