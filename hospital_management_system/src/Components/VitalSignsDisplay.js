import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification';
import './VitalSignsDisplay.css'; // External CSS file for additional styling

const VitalSignsDisplay = () => {
    const [vitalSigns, setVitalSigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVitalSigns, setFilteredVitalSigns] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchVitalSigns = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/vitalsigns', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVitalSigns(response.data);
                setFilteredVitalSigns(response.data); // Initially set filteredVitalSigns to all data
            } catch (err) {
                console.error('Error fetching vital signs data:', err);
                setError('Failed to load vital signs data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVitalSigns();
    }, []);

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        const filtered = vitalSigns.filter(record =>
            record.patientName.toLowerCase().includes(value.toLowerCase()) ||
            record.patientId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredVitalSigns(filtered);
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

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="vital-signs-display-container">
            <h2>Patient Vital Signs Records</h2>
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
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            {filteredVitalSigns.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient ID</th>
                            <th>Gender</th>
                            <th>Date of birth</th>
                            <th>Time</th>
                            <th>Temperature (°F)</th>
                            <th>Pulse Rate (bpm)</th>
                            <th>Respiratory Rate (brpm)</th>
                            <th>Blood Pressure (mmHg)</th>
                            <th>Oxygen Saturation (%)</th>
                            <th>Height (cm)</th>
                            <th>Weight (kg)</th>
                            <th>BMI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVitalSigns.map((record) => (
                            <tr key={record._id}>
                                <td>
                                    {record.patientName}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(record.patientName)} 
                                    />
                                </td>
                                <td>
                                    {record.patientId}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(record.patientId)} 
                                    />
                                </td>
                                <td>{record.gender}</td>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>{record.time}</td>
                                <td>{record.temperature}</td>
                                <td>{record.pulseRate}</td>
                                <td>{record.respiratoryRate}</td>
                                <td>{record.bloodPressure}</td>
                                <td>{record.oxygenSaturation}</td>
                                <td>{record.height}</td>
                                <td>{record.weight}</td>
                                <td>{record.bmi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No vital signs data available.</p>
            )}
        </div>
    );
};

export default VitalSignsDisplay;
