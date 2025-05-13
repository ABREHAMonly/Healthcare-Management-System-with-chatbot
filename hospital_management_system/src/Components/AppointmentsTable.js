import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import './AppointmentsTable.css';

const AppointmentsTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get('/appointments');
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Failed to fetch appointments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredAppointments = appointments.filter((appointment) => {
        return (
            appointment.firstName.toLowerCase().includes(searchTerm) ||
            appointment.department.toLowerCase().includes(searchTerm) ||
            appointment.email.toLowerCase().includes(searchTerm)
        );
    });

    if (loading) {
        return <div className="loading">Loading appointments...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="appointments-table">
            <h3>All Appointments</h3>
            <input
                type="text"
                placeholder="Search by first name, department, or email"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            {filteredAppointments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Appointment Date</th>
                            <th>Department</th>
                            <th>Doctor</th>
                            <th>Address</th>
                            <th>Message</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.firstName}</td>
                                <td>{appointment.lastName}</td>
                                <td>{appointment.email}</td>
                                <td>{appointment.mobileNumber}</td>
                                <td>{new Date(appointment.dateOfBirth).toLocaleDateString()}</td>
                                <td>{appointment.gender}</td>
                                <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                <td>{appointment.department}</td>
                                <td>{appointment.doctor}</td>
                                <td>{appointment.address}</td>
                                <td>{appointment.message}</td>
                                <td className={`status ${appointment.status.toLowerCase()}`}>
                                    {appointment.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No appointments found.</p>
            )}
        </div>
    );
};

export default AppointmentsTable;