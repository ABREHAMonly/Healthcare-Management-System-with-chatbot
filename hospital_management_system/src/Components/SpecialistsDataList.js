import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification';
import './SpecialistsDataList.css';

const SpecialistsDataList = () => {
    const [reports, setReports] = useState([]);
    const [loggedInDoctor, setLoggedInDoctor] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchLoggedInDoctor = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLoggedInDoctor(response.data);
            } catch (error) {
                console.error('Error fetching logged-in doctor:', error);
            }
        };

        fetchLoggedInDoctor();
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                let response;
                if (loggedInDoctor && loggedInDoctor.department === 'general') {
                    response = await axiosInstance.get('/reports', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else if (loggedInDoctor && ['neonatal', 'adolescent'].includes(loggedInDoctor.department)) {
                    response = await axiosInstance.get(`/reports?department=${loggedInDoctor.department}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                if (response) setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, [loggedInDoctor]);

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
        <div className="specialists-data-list-container">
            <h2>Patients in {loggedInDoctor ? loggedInDoctor.department.charAt(0).toUpperCase() + loggedInDoctor.department.slice(1) : ''} Department</h2>
            
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}

            <div className="table-responsive">
                <table className="specialists-table">
                    <thead>
                        <tr>
                            <th>Sender Doctor Name</th>
                            <th>Patient Name</th>
                            <th>Patient ID</th>
                            <th>Notes</th>
                            <th>Department</th>
                            <th>Doctor Name</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id}>
                                <td>
                                    {report.senderDoctorName}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(report.senderDoctorName)} 
                                    />
                                </td>
                                <td>
                                    {report.patientName}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(report.patientName)} 
                                    />
                                </td>
                                <td>
                                    {report.patientId}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(report.patientId)} 
                                    />
                                </td>
                                <td>{report.notes}</td>
                                <td>{report.department}</td>
                                <td>
                                    {report.doctorName}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(report.doctorName)} 
                                    />
                                </td>
                                <td>{new Date(report.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SpecialistsDataList;