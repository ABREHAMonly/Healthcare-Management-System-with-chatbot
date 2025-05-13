import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification';
import './TestResultsTable.css';

const TestResultsTable = () => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTestResults, setFilteredTestResults] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchTestResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/test-results', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTestResults(response.data);
                setFilteredTestResults(response.data); // Initially set filteredTestResults to all data
            } catch (error) {
                console.error('Error fetching test results:', error);
                setError('Failed to load test results. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTestResults();
    }, []);

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        const filtered = testResults.filter(result =>
            result.patientName.toLowerCase().includes(value.toLowerCase()) ||
            result.patientId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTestResults(filtered);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="test-results-table-container">
            <h2>Test Results</h2>
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
            {filteredTestResults.length > 0 ? (
                <table className="test-results-table">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient ID</th>
                            <th>bloodTest </th>
                            <th>urineTest </th>
                            <th>hivTest </th>
                            <th>malariaTest </th>
                            <th>tuberculosisTest </th>
                            <th>bloodSugarTest </th>
                            <th>cholesterolTest </th>
                            <th>thyroidTest </th>
                            <th>xRay </th>
                            <th>mri </th>
                            <th>ctScan </th>
                            <th>Notes</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTestResults.map((result) => (
                            <tr key={result._id}>
                                <td>
                                    {result.patientName}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(result.patientName)} 
                                    />
                                </td>
                                <td>
                                    {result.patientId}
                                    <FontAwesomeIcon 
                                        icon={faCopy} 
                                        className="copy-icon" 
                                        onClick={() => handleCopy(result.patientId)} 
                                    />
                                </td>
                                <td>{result.bloodTest}</td>
                                <td>{result.urineTest}</td>
                                <td>{result.hivTest}</td>
                                <td>{result.malariaTest}</td>
                                <td>{result.tuberculosisTest}</td>
                                <td>{result.bloodSugarTest}</td>
                                <td>{result.cholesterolTest}</td>
                                <td>{result.thyroidTest}</td>
                                <td>{result.xRay}</td>
                                <td>{result.mri}</td>
                                <td>{result.ctScan}</td>
                                <td>{result.notes}</td>
                                <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No test results data available.</p>
            )}
        </div>
    );
};

export default TestResultsTable;
