import React, { useEffect, useState } from 'react';
import axios from './AxiosInstance';

const AppointmentForms = ({ patientId }) => {
    const [appointmentForms, setAppointmentForms] = useState([]);

    useEffect(() => {
        const fetchAppointmentForms = async () => {
            if (!patientId) {
                console.error('No patientId provided');
                return;
            }

            try {
                const response = await axios.get('/appointmentform', {
                    params: { patientId }
                });
                setAppointmentForms(response.data);
            } catch (error) {
                console.error('Error fetching appointment forms:', error);
            }
        };

        fetchAppointmentForms();
    }, [patientId]);

    if (appointmentForms.length === 0) {
        return <div>No appointments found for this patient.</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.scrollContainer}>
                {appointmentForms.map((form) => (
                    <div key={form._id} style={styles.form}>
                        <h3>Appointment with Dr. {form.doctor.name}</h3>
                        <p><strong>Doctor Contact:</strong> {form.doctor.contactNumber}</p>
                        <p><strong>Patient Name:</strong> {form.patient.name}</p>
                        <p><strong>Patient ID:</strong> {form.patient.id}</p>
                        <p><strong>Patient Email:</strong> {form.patient.email}</p>
                        <p><strong>Appointment Date:</strong> {new Date(form.appointment.date).toLocaleDateString()}</p>
                        <p><strong>Appointment Time:</strong> {form.appointment.time}</p>
                        <p><strong>Appointment Type:</strong> {form.appointment.type}</p>
                        <p><strong>Medication Name:</strong> {form.medication.name}</p>
                        <p><strong>Medication Completion Date:</strong> {new Date(form.medication.completionDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
        maxWidth: '100%', // Prevent overflow
        overflowX: 'hidden', // Hide horizontal overflow
    },
    scrollContainer: {
        width: '100%',
        maxHeight: '80vh', // Set a maximum height for scrolling
        overflowY: 'auto', // Enable vertical scrolling
        padding: '10px',
    },
    form: {
        width: '100%',
        maxWidth: '600px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        transition: 'transform 0.2s',
        boxSizing: 'border-box', // Include padding in width calculation
    },
};

// Add media queries for responsiveness
const mediaQueries = `
    @media (max-width: 768px) {
        .container {
            margin: 10px;
        }
        .form {
            padding: 15px;
        }
    }

    @media (max-width: 480px) {
        .container {
            margin: 5px;
        }
        .form {
            padding: 10px;
        }
        .form h3 {
            font-size: 16px; // Adjust font size for small screens
        }
    }
`;

// Inject media queries into the component
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = mediaQueries;
document.head.appendChild(styleSheet);

export default AppointmentForms;