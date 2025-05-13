import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import Notification from '../Notification'; // Import the Notification component
import './TestResultForm.css';

const TestResultForm = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        notes: '',
        doctor: '',
        bloodTest: '',
        urineTest: '',
        hivTest: '',
        malariaTest: '',
        tuberculosisTest: '',
        bloodSugarTest: '',
        cholesterolTest: '',
        thyroidTest: '',
        xRay: '',
        mri: '',
        ctScan: ''
    });
    const [doctors, setDoctors] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/users/role/doctor', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                showNotification('Error fetching doctors.', 'error');
            }
        };

        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFields = () => {
        const { patientName, patientId, doctor } = formData;
        const testsProvided = Object.values(formData).slice(4).some(test => test.trim() !== ''); // Check from bloodTest onwards
    
        if (!patientName || patientName.length < 3) {
            showNotification('Patient Name must be at least 3 characters long.', 'error');
            return false;
        }
    
        // Updated regex for patientId validation
        const patientIdRegex = /^ET-\d{4}-\d{6}$/; // Matches format ET-YYYY-XXXXXX
        if (!patientId || !patientIdRegex.test(patientId)) {
            showNotification('Patient ID must be in the format ET-YYYY-XXXXXX.', 'error');
            return false;
        }
    
        if (!doctor) {
            showNotification('Doctor selection is required.', 'error');
            return false;
        }
    
        if (!testsProvided) {
            showNotification('At least one test result must be provided.', 'error');
            return false;
        }
    
        return true;
    };

    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(() => setNotification({ ...notification, visible: false }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '', visible: false });

        if (!validateFields()) return;

        const requestBody = { ...formData };

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post('/test-results', requestBody, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('Test result sent successfully.', 'success');
            setFormData({
                patientName: '',
                patientId: '',
                notes: '',
                doctor: '',
                bloodTest: '',
                urineTest: '',
                hivTest: '',
                malariaTest: '',
                tuberculosisTest: '',
                bloodSugarTest: '',
                cholesterolTest: '',
                thyroidTest: '',
                xRay: '',
                mri: '',
                ctScan: ''
            });
        } catch (error) {
            console.error('Error sending test result:', error);
            showNotification('Error sending test result. Please try again.', 'error');
        }
    };

    return (
        <div className="test-result-form-container">
            {notification.visible && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification({ ...notification, visible: false })} 
                />
            )}
            <form onSubmit={handleSubmit} className="test-result-form">
                <h2>Send Test Result</h2>
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
                        <label htmlFor="bloodTest">Blood Test Result</label>
                        <input
                            type="text"
                            id="bloodTest"
                            name="bloodTest"
                            value={formData.bloodTest}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="urineTest">Urine Test Result</label>
                        <input
                            type="text"
                            id="urineTest"
                            name="urineTest"
                            value={formData.urineTest}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="hivTest">HIV Test Result</label>
                        <input
                            type="text"
                            id="hivTest"
                            name="hivTest"
                            value={formData.hivTest}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="malariaTest">Malaria Test Result</label>
                        <input
                            type="text"
                            id="malariaTest"
                            name="malariaTest"
                            value={formData.malariaTest}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tuberculosisTest">Tuberculosis Test Result</label>
                        <input
                            type="text"
                            id="tuberculosisTest"
                            name="tuberculosisTest"
                            value={formData.tuberculosisTest}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bloodSugarTest">Blood Sugar Test Result</label>
                        <input
                            type="text"
                            id="bloodSugarTest"
                            name="bloodSugarTest"
                            value={formData.bloodSugarTest}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cholesterolTest">Cholesterol Test Result</label>
                        <input
                            type="text"
                            id="cholesterolTest"
                            name="cholesterolTest"
                            value={formData.cholesterolTest}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="thyroidTest">Thyroid Test Result</label>
                        <input
                            type="text"
                            id="thyroidTest"
                            name="thyroidTest"
                            value={formData.thyroidTest}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="xRay">X-ray Result</label>
                        <input
                            type="text"
                            id="xRay"
                            name="xRay"
                            value={formData.xRay}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mri">MRI Result</label>
                        <input
                            type="text"
                            id="mri"
                            name="mri"
                            value={formData.mri}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="ctScan">CT Scan Result</label>
                        <input
                            type="text"
                            id="ctScan"
                            name="ctScan"
                            value={formData.ctScan}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes">Additional Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="doctor">Select Doctor</label>
                        <select
                            id="doctor"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.firstName} {doctor.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit">Send Result</button>
            </form>
        </div>
    );
};

export default TestResultForm;