import React, { useState } from 'react';
import axiosInstance from './AxiosInstance';
import Notification from '../Notification'; // Import Notification component
import './VitalSignsForm.css';

const VitalSignsForm = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        dateOfBirth: '',
        gender: '', // Add gender to form data
        temperature: '',
        pulseRate: '',
        respiratoryRate: '',
        bloodPressure: '',
        oxygenSaturation: '',
        height: '',
        weight: '',
        bmi: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFields = () => {
        const { patientName, patientId, dateOfBirth, gender, temperature, pulseRate, respiratoryRate, bloodPressure, oxygenSaturation, height, weight, bmi } = formData;

        if (!patientName || !patientId || !dateOfBirth || !gender || !temperature || !pulseRate || !respiratoryRate || !bloodPressure || !oxygenSaturation || !height || !weight || !bmi) {
            setNotification({ message: 'All fields are required.', type: 'error', visible: true });
            return false;
        }

        if (new Date(dateOfBirth) >= new Date()) {
            setNotification({ message: 'Date of Birth must be in the past.', type: 'error', visible: true });
            return false;
        }

        // Validate numeric fields
        const numericFields = {
            temperature: parseFloat(temperature),
            pulseRate: parseInt(pulseRate),
            respiratoryRate: parseInt(respiratoryRate),
            bloodPressure: bloodPressure.split('/').map(Number),
            oxygenSaturation: parseInt(oxygenSaturation),
            height: parseFloat(height),
            weight: parseFloat(weight),
            bmi: parseFloat(bmi)
        };

        if (isNaN(numericFields.temperature) || numericFields.temperature < 95 || numericFields.temperature > 105) {
            setNotification({ message: 'Temperature must be between 95°F and 105°F.', type: 'error', visible: true });
            return false;
        }

        if (isNaN(numericFields.pulseRate) || numericFields.pulseRate < 40 || numericFields.pulseRate > 180) {
            setNotification({ message: 'Pulse Rate must be between 40 and 180 bpm.', type: 'error', visible: true });
            return false;
        }

        if (isNaN(numericFields.respiratoryRate) || numericFields.respiratoryRate < 12 || numericFields.respiratoryRate > 30) {
            setNotification({ message: 'Respiratory Rate must be between 12 and 30 breaths per minute.', type: 'error', visible: true });
            return false;
        }

        if (!/^\d+\/\d+$/.test(bloodPressure) || numericFields.bloodPressure.length !== 2 || numericFields.bloodPressure.some(isNaN)) {
            setNotification({ message: 'Blood Pressure must be in the format "systolic/diastolic".', type: 'error', visible: true });
            return false;
        }

        if (isNaN(numericFields.oxygenSaturation) || numericFields.oxygenSaturation < 75 || numericFields.oxygenSaturation > 100) {
            setNotification({ message: 'Oxygen Saturation must be between 75% and 100%.', type: 'error', visible: true });
            return false;
        }

        if (isNaN(numericFields.height) || numericFields.height <= 0) {
            setNotification({ message: 'Height must be a positive number.', type: 'error', visible: true });
            return false;
        }

        if (isNaN(numericFields.weight) || numericFields.weight <= 0) {
            setNotification({ message: 'Weight must be a positive number.', type: 'error', visible: true });
            return false;
        }

        if (isNaN(numericFields.bmi) || numericFields.bmi <= 0) {
            setNotification({ message: 'BMI must be a positive number.', type: 'error', visible: true });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) return; // Validate fields before submission

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post('/vitalsigns', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotification({ message: 'Vital signs data saved successfully.', type: 'success', visible: true });
            setFormData({
                patientName: '',
                patientId: '',
                dateOfBirth: '',
                gender: '', // Reset gender
                temperature: '',
                pulseRate: '',
                respiratoryRate: '',
                bloodPressure: '',
                oxygenSaturation: '',
                height: '',
                weight: '',
                bmi: ''
            });
        } catch (error) {
            console.error('Error saving vital signs data:', error);
            setNotification({ message: 'Error saving vital signs data. Please try again.', type: 'error', visible: true });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, visible: false });
    };

    return (
        <div className="vital-signs-form-container">
            {notification.visible && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={handleCloseNotification} 
                />
            )}
            <form onSubmit={handleSubmit} className="vital-signs-form">
                <h2>Register Patient Vital Signs</h2>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="patientName">Patient Name</label>
                        <input
                            type="text"
                            id="patientName"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">--Select Gender--</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="temperature">Temperature (°F)</label>
                        <input
                            type="text"
                            id="temperature"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pulseRate">Pulse Rate (bpm)</label>
                        <input
                            type="text"
                            id="pulseRate"
                            name="pulseRate"
                            value={formData.pulseRate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="respiratoryRate">Respiratory Rate (brpm)</label>
                        <input
                            type="text"
                            id="respiratoryRate"
                            name="respiratoryRate"
                            value={formData.respiratoryRate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bloodPressure">Blood Pressure (systolic/diastolic)</label>
                        <input
                            type="text"
                            id="bloodPressure"
                            name="bloodPressure"
                            value={formData.bloodPressure}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="oxygenSaturation">Oxygen Saturation (%)</label>
                        <input
                            type="text"
                            id="oxygenSaturation"
                            name="oxygenSaturation"
                            value={formData.oxygenSaturation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="height">Height (cm)</label>
                        <input
                            type="text"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="weight">Weight (kg)</label>
                        <input
                            type="text"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bmi">BMI</label>
                        <input
                            type="text"
                            id="bmi"
                            name="bmi"
                            value={formData.bmi}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type="submit">Save Vital Signs</button>
            </form>
        </div>
    );
};

export default VitalSignsForm;