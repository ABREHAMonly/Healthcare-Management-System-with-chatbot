import React, { useState, useEffect } from 'react';
import axios from '../Components/AxiosInstance'; 
import Notification from '../Notification'; // Import Notification component
import './TestRequestForm.css';

const TestRequestForm = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        testsRequested: [],
        additionalNotes: '',
        patientCategory: ''
    });

    const [doctor, setDoctor] = useState({ name: '', id: '' });
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile && profile.user) {
            setDoctor({ name: `${profile.user.firstName} ${profile.user.lastName}`, id: profile.user._id });
        } else {
            setNotification({ message: 'Doctor information is missing.', type: 'error', visible: true });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'testsRequested') {
            const newTestsRequested = formData.testsRequested.includes(value)
                ? formData.testsRequested.filter(test => test !== value)
                : [...formData.testsRequested, value];
            setFormData({ ...formData, testsRequested: newTestsRequested });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateFields = () => {
        const { patientName, patientId, testsRequested, patientCategory } = formData;

        if (!patientName || !patientId || !patientCategory) {
            setNotification({ message: 'Patient Name, ID, and Category are required.', type: 'error', visible: true });
            return false;
        }

        if (testsRequested.length === 0) {
            setNotification({ message: 'At least one test must be requested.', type: 'error', visible: true });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '', visible: false });

        if (!doctor || !doctor.name || !doctor.id) {
            setNotification({ message: 'Doctor information is missing.', type: 'error', visible: true });
            return;
        }

        if (!validateFields()) return; // Validate fields before submission

        const requestBody = {
            ...formData,
            doctorName: doctor.name,
            doctorId: doctor.id
        };

        try {
            await axios.post('/patient-test-requests', requestBody);
            setNotification({ message: 'Test request submitted successfully.', type: 'success', visible: true });
            setFormData({
                patientName: '',
                patientId: '',
                testsRequested: [],
                additionalNotes: '',
                patientCategory: ''
            });
        } catch (error) {
            setNotification({ message: 'Error submitting test request. Please try again.', type: 'error', visible: true });
            console.error("Error submitting test request:", error);
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, visible: false });
    };

    return (
        <div className="test-request-form-container">
            {notification.visible && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={handleCloseNotification} 
                />
            )}
            <form onSubmit={handleSubmit} className="test-request-form">
                <h2>Submit Test Request</h2>
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
                <div className="form-group">
                    <label>Patient Category</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="radio"
                                name="patientCategory"
                                value="General"
                                checked={formData.patientCategory === 'General'}
                                onChange={handleChange}
                            /> General
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="patientCategory"
                                value="Child"
                                checked={formData.patientCategory === 'Child'}
                                onChange={handleChange}
                            /> Child
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="patientCategory"
                                value="Pregnant"
                                checked={formData.patientCategory === 'Pregnant'}
                                onChange={handleChange}
                            /> Pregnant
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Tests Requested</label>
                    <div className="checkbox-group">
                        {['Blood Test', 'Urine Test', 'HIV Test', 'Malaria Test', 
                          'Tuberculosis Test', 'Blood Sugar Test', 
                          'Cholesterol Test', 'Thyroid Test', 'X-ray', 'MRI', 'CT Scan'].map(test => (
                            <label key={test}>
                                <input
                                    type="checkbox"
                                    name="testsRequested"
                                    value={test}
                                    checked={formData.testsRequested.includes(test)}
                                    onChange={handleChange}
                                /> {test}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="additionalNotes">Additional Notes</label>
                    <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>
                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default TestRequestForm;