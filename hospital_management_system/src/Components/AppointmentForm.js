import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance'; // Import your axios instance
import Notification from '../Notification'; // Import the Notification component

const AppointmentForm = () => {
    const [doctor, setDoctor] = useState({ name: '', id: '', contactNumber: '' });
    const [patient, setPatient] = useState({ name: '', id: '', email: '' });
    const [appointment, setAppointment] = useState({ date: '', time: '', type: '' });
    const [medication, setMedication] = useState({ name: '', completionDate: '' });
    
    // Notification state
    const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/users/me');
                    setDoctor({
                        name: response.data.firstName + ' ' + response.data.lastName,
                        id: response.data._id,
                        contactNumber: response.data.phone || ''
                    });
                    console.log('Doctor Info:', response.data);
                } catch (error) {
                    console.error('Error fetching doctor info:', error);
                }
            }
        };
        fetchDoctorInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            doctor,
            patient,
            appointment,
            medication
        };

        console.log('Form Data:', formData);

        try {
            await axios.post('/appointmentform', formData);
            setNotification({
                message: 'Appointment successfully submitted and notification sent to the patient.',
                type: 'success',
                isVisible: true
            });
        } catch (error) {
            console.error('Error submitting the appointment:', error);
            setNotification({
                message: 'Error submitting the appointment.',
                type: 'error',
                isVisible: true
            });
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
    };

    const inputStyle = {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    };

    const buttonStyle = {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer'
    };

    return (
        <div>
            {notification.isVisible && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ ...notification, isVisible: false })}
                />
            )}
            <form style={formStyle} onSubmit={handleSubmit}>
                <h2>Doctor Information</h2>
                <p>Name: {doctor.name}</p>
                <p>Contact Number: {doctor.contactNumber}</p>

                <h2>Patient Information</h2>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Patient's Name"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    required
                />
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Patient's ID"
                    value={patient.id}
                    onChange={(e) => setPatient({ ...patient, id: e.target.value })}
                    required
                />
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Patient's Email Address"
                    value={patient.email}
                    onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                    required
                />

                <h2>Appointment Details</h2>
                <input
                    style={inputStyle}
                    type="date"
                    value={appointment.date}
                    min={today} // Disable past dates
                    onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                    required
                />
                <input
                    style={inputStyle}
                    type="time"
                    value={appointment.time}
                    onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                    required
                />
                <select
                    style={inputStyle}
                    value={appointment.type}
                    onChange={(e) => setAppointment({ ...appointment, type: e.target.value })}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                </select>

                <h2>Medication Completion</h2>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Medication Name"
                    value={medication.name}
                    onChange={(e) => setMedication({ ...medication, name: e.target.value })}
                    required
                />
                <input
                    style={inputStyle}
                    type="date"
                    value={medication.completionDate}
                    min={today} // Disable past dates
                    onChange={(e) => setMedication({ ...medication, completionDate: e.target.value })}
                    required
                />

                <button style={buttonStyle} type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AppointmentForm;