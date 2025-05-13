import React, { useState, useEffect } from 'react';
import { FaTrash, FaCamera, FaKey, FaArrowLeft, FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import Notification from '../Notification';

const AddAdminPage = () => {
    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'admin',
        department: '',
        image: null,
    });
    const [notification, setNotification] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchAdmins();
    }, []);

    useEffect(() => {
        setFilteredAdmins(
            admins.filter(admin =>
                `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                admin.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, admins]);

    const fetchAdmins = async () => {
        try {
            const response = await axiosInstance.get('/users/role/admin');
            setAdmins(response.data);
            setFilteredAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setNotification({ message: 'Error fetching admins. Please try again.', type: 'error' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin({ ...newAdmin, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAdmin({ ...newAdmin, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null);

        // Validate first name length
        if (newAdmin.firstName.length < 3) {
            setNotification({ message: 'First name must be at least 3 characters long.', type: 'error' });
            return;
        }

        // Validate phone number
        if (!/^\d{10}$/.test(newAdmin.phone)) {
            setNotification({ message: 'Phone number must be exactly 10 digits.', type: 'error' });
            return;
        }

        // Validate password length
        if (newAdmin.password.length < 8) {
            setNotification({ message: 'Password must be at least 8 characters long.', type: 'error' });
            return;
        }

        // Validate password match
        if (newAdmin.password !== newAdmin.confirmPassword) {
            setNotification({ message: 'Passwords do not match.', type: 'error' });
            return;
        }

        const formData = new FormData();
        for (const key in newAdmin) {
            formData.append(key, newAdmin[key]);
        }

        try {
            await axiosInstance.post('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setNotification({ message: 'Admin added successfully!', type: 'success' });
            fetchAdmins();
            resetForm();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error saving admin. Please try again.';
            setNotification({ message: errorMessage, type: 'error' });
            console.error("Error saving admin:", error);
        }
    };

    const resetForm = () => {
        setNewAdmin({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: 'admin',
            department: '',
            image: null,
        });
        setImagePreview(null);
    };

    const handleDelete = async (adminId) => {
        try {
            await axiosInstance.delete(`/users/${adminId}`);
            setNotification({ message: 'Admin deleted successfully!', type: 'success' });
            fetchAdmins();
        } catch (error) {
            console.error('Error deleting admin:', error);
            setNotification({ message: 'Error deleting admin. Please try again.', type: 'error' });
        }
    };

    const handleStatusChange = async (adminId, currentStatus) => {
        const newStatus = currentStatus === 'activated' ? 'deactivated' : 'activated';
        try {
            await axiosInstance.put(`/users/${adminId}`, { status: newStatus });
            setNotification({ message: `Admin ${newStatus === 'activated' ? 'activated' : 'deactivated'} successfully!`, type: 'success' });
            fetchAdmins();
        } catch (error) {
            console.error('Error updating admin status:', error);
            setNotification({ message: 'Error updating admin status. Please try again.', type: 'error' });
        }
    };

    const generatePassword = () => {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000);
        const newPassword = `${newAdmin.firstName}@${randomNumbers}`;
        setNewAdmin({ ...newAdmin, password: newPassword, confirmPassword: newPassword });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setNotification({ message: 'Password copied to clipboard!', type: 'success' });
    };

    return (
        <div className="add-admin-page">
            <style>{`
                .add-admin-page {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .back-icon {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    cursor: pointer;
                    font-size: 40px;
                    color: rgb(255, 255, 255);
                    background-color: #066b6e;
                    padding: 15px;
                    border-radius: 50%;
                    transition: transform 0.2s, background-color 0.3s;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                }
                .back-icon:hover {
                    transform: scale(1.1);
                    background-color: #066b6e;
                }
                .admin-form {
                    max-width: 500px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .admin-form input, .admin-form select, .admin-form button {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                }
                .image-upload-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 10px 0;
                }
                .image-upload-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                .image-upload-label input {
                    display: none;
                }
                .admin-list {
                    max-width: 900px;
                    margin: 20px auto;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .admin-table {
                    width: 98%;
                    margin-left: 10px;
                    border-collapse: collapse;
                    background-color: #f9f9f9;
                }
                .admin-table th, .admin-table td {
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: left;
                }
                .admin-table th {
                    background-color: #066b6e;
                    color: white;
                }
                .admin-table tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                .admin-table tr:hover {
                    background-color: #ddd;
                }
                .admin-actions {
                    display: flex;
                    gap: 10px;
                }
                .success-message, .error-message {
                    text-align: center;
                    margin: 10px 0;
                }
                .generate-password-button {
                    display: flex;
                    align-items: center;
                    background-color: #066b6e;
                    color: white;
                    border: none;
                    padding: 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    text-align: center;
                }
                .generate-password-button:hover {
                    background-color: rgb(6, 92, 95);
                }
                .image-preview {
                    width: 100px;
                    height: auto;
                    cursor: pointer;
                    margin: 10px 0;
                }
                .large-image-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: ${showLargeImage ? 'flex' : 'none'};
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .large-image-modal img {
                    max-width: 90%;
                    max-height: 90%;
                }
                .close-button {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
                .generated-password-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 10px 0;
                }
                .search-input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                }
            `}</style>

            <FaArrowLeft 
                className="back-icon" 
                onClick={() => navigate('/admin')} // Navigate back to the AdminPage
            />

            {/* Notification Component */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="admin-form">
                <h2>Add Admin</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={newAdmin.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={newAdmin.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newAdmin.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={newAdmin.phone}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="department"
                        value={newAdmin.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Department</option>
                        <option value="admin">Admin</option>
                    </select>

                    <div className="image-upload-section">
                        <label className="image-upload-label">
                            <FaCamera style={{ marginRight: '5px' }} />
                            <span>Upload Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="image-preview"
                            onClick={() => setShowLargeImage(true)}
                        />
                    )}

                    <div className="generated-password-section">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newAdmin.password}
                            onChange={handleChange}
                            required
                        />
                        <FaKey onClick={generatePassword} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                    </div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={newAdmin.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    
                    {newAdmin.password && (
                        <div className="generated-password-display">
                            <span>Generated Password: {newAdmin.password}</span>
                            <FaCopy onClick={() => copyToClipboard(newAdmin.password)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                        </div>
                    )}

                    <button type="submit">Add Admin</button>
                </form>
            </div>

            <div className="admin-list">
                <h2>Admin List</h2>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by Name or Email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.map(admin => (
                            <tr key={admin._id}>
                                <td>{admin.firstName} {admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>{admin.phone}</td>
                                <td>{admin.status}</td>
                                <td className="admin-actions">
                                    <FaTrash onClick={() => handleDelete(admin._id)} style={{ cursor: 'pointer', color: 'red' }} />
                                    <button onClick={() => handleStatusChange(admin._id, admin.status)}>
                                        {admin.status === 'activated' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Large Image Modal */}
            {showLargeImage && (
                <div className="large-image-modal" onClick={() => setShowLargeImage(false)}>
                    <span className="close-button">&times;</span>
                    <img src={imagePreview} alt="Large Preview" />
                </div>
            )}
        </div>
    );
};

export default AddAdminPage;