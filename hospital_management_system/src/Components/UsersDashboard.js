import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance'; // Import the axios instance
import { FaArrowLeft } from 'react-icons/fa';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const UsersDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate(); // Initialize navigate for navigation

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/users/role/user');
                setUsers(response.data);
                setFilteredUsers(response.data); // Initially set filteredUsers to all users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        const filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(value.toLowerCase()) ||
            user.patientId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className="users-dashboard">
            <style>{`
                .users-dashboard {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    max-width: 100%;
                    overflow-x: auto;
                    position: relative; /* Ensure position is relative for absolute children */
                }
                .back-icon {
                    position: absolute;
                    top: 10px; /* Adjusted to create space between the icon and the heading */
                    left: 20px;
                    cursor: pointer;
                    font-size: 40px; /* Increased size for better visibility */
                    color: rgb(255, 255, 255); /* Icon color */
                    background-color: #0f9499; /* Background color */
                    padding: 15px; /* Increased padding for a larger clickable area */
                    border-radius: 50%; /* Make the background circular */
                    transition: transform 0.2s, background-color 0.3s; /* Transition for hover effects */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Increased shadow for depth */
                    z-index: 1; /* Ensure it's on top */
                }
                .back-icon:hover {
                    transform: scale(1.1);
                    background-color: #066b6e; /* Darken background on hover */
                }
                h3 {
                    margin-top: 80px; /* Adjusted margin to create space for the back icon */
                    margin-bottom: 20px;
                    color: #333;
                }
                .search-container {
                    margin-bottom: 20px;
                    position: relative;
                    max-width: 400px;
                }
                .search-input {
                    padding: 10px 40px 10px 10px;
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                .search-icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #ccc;
                    cursor: pointer;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }
                th {
                    background-color:rgb(22, 135, 155);
                    color: white;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #e9e9e9;
                }
                td {
                    color: #333;
                }
                @media (max-width: 768px) {
                    .users-dashboard {
                        padding: 10px;
                    }
                    table, th, td {
                        font-size: 14px;
                    }
                    th, td {
                        padding: 8px;
                    }
                    h3 {
                        font-size: 18px;
                    }
                }
                @media (max-width: 480px) {
                    .users-dashboard {
                        padding: 5px;
                    }
                    table, th, td {
                        font-size: 12px;
                    }
                    th, td {
                        padding: 6px;
                    }
                    h3 {
                        font-size: 16px;
                    }
                }
            `}</style>

            <FaArrowLeft 
                className="back-icon" 
                onClick={() => navigate(-1)} // Go back to the previous page
            />
            <h3>Patients</h3>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Patient ID or First Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Patient ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.patientId}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersDashboard;