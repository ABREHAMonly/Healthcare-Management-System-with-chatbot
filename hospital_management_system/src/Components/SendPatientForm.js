import React, { useEffect, useState } from 'react';
import axios from './AxiosInstance';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import Notification from '../Notification';

const SendPatientForm = () => {
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [tabletNames, setTabletNames] = useState('');
    const [diseaseName, setDiseaseName] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [nurseCare, setNurseCare] = useState('No');
    const [injectionNames, setInjectionNames] = useState('');
    const [injectionAmount, setInjectionAmount] = useState('');
    const [treatmentDays, setTreatmentDays] = useState(0);
    const [pharmacists, setPharmacists] = useState([]);
    const [selectedPharmacist, setSelectedPharmacist] = useState('');
    const [referrals, setReferrals] = useState([]);
    const [editReferralId, setEditReferralId] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReferrals, setFilteredReferrals] = useState([]);

    useEffect(() => {
        const fetchPharmacists = async () => {
            try {
                const response = await axios.get('/users/pharmacists');
                setPharmacists(response.data);
            } catch (error) {
                console.error('Error fetching pharmacists:', error);
                setNotification({ message: 'Error fetching pharmacists', type: 'error' });
            }
        };

        const fetchReferrals = async () => {
            try {
                const response = await axios.get('/patientreferrals/');
                setReferrals(response.data);
                setFilteredReferrals(response.data);
            } catch (error) {
                console.error('Error fetching referrals:', error.response?.data || error.message);
                setNotification({ message: 'Error fetching referrals', type: 'error' });
            }
        };

        fetchPharmacists();
        fetchReferrals();
    }, []);

    useEffect(() => {
        const filtered = referrals.filter(referral =>
            referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.patientId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReferrals(filtered);
    }, [searchTerm, referrals]);

    const validateForm = () => {
        if (!patientName || !patientId || !selectedPharmacist) {
            setNotification({ message: 'Please fill in all required fields.', type: 'error' });
            return false;
        }
        if (nurseCare === 'Yes' && (!injectionAmount || !injectionNames || treatmentDays <= 0)) {
            setNotification({ message: 'Please provide valid Injection Names, injection amount and treatment days.', type: 'error' });
            return false;
        }
        
        if (treatmentDays && (treatmentDays <= 0 || isNaN(treatmentDays))) {
            setNotification({ message: 'Treatment days must be a positive number.', type: 'error' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            if (editReferralId) {
                const response = await axios.put(`/patientreferrals/${editReferralId}`, {
                    patientName,
                    patientId,
                    tabletNames,
                    diseaseName,
                    additionalNotes,
                    nurseCare,
                    injectionNames,
                    injectionAmount,
                    treatmentDays,
                    pharmacistId: selectedPharmacist,
                });
                setNotification({ message: 'Referral updated successfully!', type: 'success' });
                setReferrals(referrals.map(ref => ref._id === editReferralId ? response.data.referral : ref));
                setEditReferralId(null);
            } else {
                const response = await axios.post('/patientreferrals/sendToPharmacist', {
                    patientName,
                    patientId,
                    tabletNames,
                    diseaseName,
                    additionalNotes,
                    nurseCare,
                    injectionNames,
                    injectionAmount,
                    treatmentDays,
                    pharmacistId: selectedPharmacist,
                });
                setNotification({ message: 'Patient sent to pharmacist successfully!', type: 'success' });
                setReferrals([...referrals, response.data.referral]);
            }
            resetForm();
        } catch (error) {
            setNotification({ message: 'Error sending patient to pharmacist: ' + (error.response?.data?.message || error.message), type: 'error' });
        }
    };

    const resetForm = () => {
        setPatientName('');
        setPatientId('');
        setTabletNames('');
        setDiseaseName('');
        setAdditionalNotes('');
        setNurseCare('No');
        setInjectionNames('');
        setInjectionAmount('');
        setTreatmentDays(0);
        setSelectedPharmacist('');
    };

    const handleEdit = (referral) => {
        setEditReferralId(referral._id);
        setPatientName(referral.patientName);
        setPatientId(referral.patientId);
        setTabletNames(referral.tabletNames);
        setDiseaseName(referral.diseaseName);
        setAdditionalNotes(referral.additionalNotes);
        setNurseCare(referral.nurseCare);
        setInjectionNames(referral.injectionNames);
        setInjectionAmount(referral.injectionAmount);
        setTreatmentDays(referral.treatmentDays);
        setSelectedPharmacist(referral.pharmacistId);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/patientreferrals/${id}`);
            setReferrals(referrals.filter(ref => ref._id !== id));
            setNotification({ message: 'Referral deleted successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Error deleting referral: ' + (error.response?.data?.message || error.message), type: 'error' });
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setNotification({ message: 'Copied to clipboard', type: 'success' });
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            setNotification({ message: 'Failed to copy', type: 'error' });
        });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

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
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }

                    h1, h2 {
                        text-align: center;
                    }

                    form {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }

                    .form-group {
                        flex: 1 1 45%;
                        margin-bottom: 15px;
                    }

                    label {
                        font-weight: bold;
                        margin-bottom: 5px;
                        display: block;
                    }

                    input, select, button {
                        padding: 10px;
                        font-size: 16px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        width: 100%;
                    }

                    button {
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: #45a049;
                    }

                    .table-responsive {
                        overflow-x: auto;
                        margin-top: 20px;
                    }

                    table {
                        width: 100%;
                        min-width: 600px;
                        border-collapse: collapse;
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

                    .edit-button, .delete-button {
                        background: green;
                        border: none;
                        cursor: pointer;
                        font-size: 16px;
                    }

                    .delete-icon {
                        color: red;
                        cursor: pointer;
                    }

                    .delete-icon:hover {
                        opacity: 0.7;
                    }

                    .copy-icon {
                        margin-left: 5px;
                        cursor: pointer;
                    }

                    .search-container {
                        margin-top: 20px;
                    }

                    .search-input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }

                    @media (max-width: 768px) {
                        .container {
                            padding: 10px;
                        }

                        .form-group {
                            flex: 1 1 100%;
                        }
                    }

                    @media (max-width: 480px) {
                        th, td {
                            font-size: 14px;
                            padding: 8px;
                        }

                        button {
                            font-size: 14px;
                            padding: 8px;
                        }
                    }
                `}
            </style>

            <h1>Send Patient to Pharmacist and nurse</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Patient Name:</label>
                    <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Patient ID:</label>
                    <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Tablet Names:</label>
                    <input type="text" value={tabletNames} onChange={(e) => setTabletNames(e.target.value)} />
                </div>
                
                <div className="form-group">
                    <label>Disease Name:</label>
                    <input type="text" value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Additional Notes:</label>
                    <input type="text" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Nurse Care:</label>
                    <select value={nurseCare} onChange={(e) => setNurseCare(e.target.value)}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </div>
                {nurseCare === 'Yes' && (
                    <>
                        <div className="form-group">
                            <label>Injection Names:</label>
                            <input type="text" value={injectionNames} onChange={(e) => setInjectionNames(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Injection Amount:</label>
                            <input type="text" value={injectionAmount} onChange={(e) => setInjectionAmount(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Number of Treatment Days:</label>
                            <input type="number" value={treatmentDays} onChange={(e) => setTreatmentDays(e.target.value)} />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <label>Select Pharmacist:</label>
                    <select value={selectedPharmacist} onChange={(e) => setSelectedPharmacist(e.target.value)} required>
                        <option value="">--Select Pharmacist--</option>
                        {pharmacists.map((pharmacist) => (
                            <option key={pharmacist._id} value={pharmacist._id}>
                                {pharmacist.firstName} {pharmacist.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">{editReferralId ? 'Update' : 'Send'}</button>
            </form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Patient Name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <h2>Referrals Sent's </h2>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient ID</th>
                            <th>Tablet Names</th>
                            <th>Disease Name</th>
                            <th>Additional Notes</th>
                            <th>Nurse Care</th>
                            <th>Injection Names</th>
                            <th>Injection Amount</th>
                            <th>Treatment Days</th>
                            <th>Pharmacist</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReferrals.map((referral) => (
                            <tr key={referral._id}>
                                <td>
                                    {referral.patientName}
                                    <FaCopy className="copy-icon" onClick={() => handleCopy(referral.patientName)} />
                                </td>
                                <td>
                                    {referral.patientId}
                                    <FaCopy className="copy-icon" onClick={() => handleCopy(referral.patientId)} />
                                </td>
                                <td>
                                    {referral.tabletNames}
                                    <FaCopy className="copy-icon" onClick={() => handleCopy(referral.tabletNames)} />
                                </td>
                                <td>{referral.diseaseName}</td>
                                <td>{referral.additionalNotes}</td>
                                <td>{referral.nurseCare}</td>
                                <td>{referral.injectionNames}</td>
                                <td>{referral.injectionAmount}</td>
                                <td>{referral.treatmentDays}</td>
                                <td>{referral.pharmacistName}</td>
                                <td>{referral.status}</td>
                                <td>
                                    <button onClick={() => handleEdit(referral)} className="edit-button">
                                        <FaEdit />
                                    </button>
                                    <FaTrash className="delete-icon" onClick={() => handleDelete(referral._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SendPatientForm;