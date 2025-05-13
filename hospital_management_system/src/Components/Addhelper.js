import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft, faImage, faKey, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification'; // Import the Notification component

const ImageViewer = ({ imageSrc, onClose }) => {
    return (
        <div className="image-viewer">
            <div className="overlay" onClick={onClose}></div>
            <img src={imageSrc} alt="Large View" className="large-image" />
        </div>
    );
};

const AddHelper = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        password: '',
        confirmPassword: '',
        image: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/HelperRoute');
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchQuery, users]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setNotification({ message: 'Passwords do not match.', type: 'error', show: true });
            return;
        }

        const formDataObj = new FormData();
        for (const key in formData) {
            formDataObj.append(key, formData[key]);
        }

        try {
            if (editMode) {
                await axios.put(`/HelperRoute/${editUserId}`, formDataObj, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setNotification({ message: 'User updated successfully!', type: 'success', show: true });
            } else {
                const { data } = await axios.post('/HelperRoute/register', formDataObj, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setUsers([...users, data.newUser]);
                setNotification({ message: 'User registered successfully!', type: 'success', show: true });
            }
            resetForm();
        } catch (err) {
            console.error('Error adding/updating user:', err);
            setNotification({ message: err.response?.data?.message || 'Failed to add/update user.', type: 'error', show: true });
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
            department: '',
            password: '',
            confirmPassword: '',
            image: null,
        });
        setEditMode(false);
        setEditUserId('');
        setGeneratedPassword('');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEdit = (user) => {
        setEditMode(true);
        setEditUserId(user._id);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            department: user.department,
            password: '',
            confirmPassword: '',
            image: null,
        });
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/HelperRoute/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
            setNotification({ message: 'User deleted successfully!', type: 'success', show: true });
        } catch (err) {
            console.error('Error deleting user:', err);
            setNotification({ message: 'Failed to delete user.', type: 'error', show: true });
        }
    };

    const closeNotification = () => {
        setNotification({ ...notification, show: false });
    };

    const generatePassword = () => {
        const randomNumbers = Math.random().toString().slice(2, 8);
        const password = `et${randomNumbers}`;
        setGeneratedPassword(password);
        setFormData({ ...formData, password: password, confirmPassword: password });
    };

    const copyToClipboard = () => {
        if (generatedPassword) {
            navigator.clipboard.writeText(generatedPassword).then(() => {
                setNotification({ message: 'Password copied to clipboard!', type: 'success', show: true });
            }, () => {
                setNotification({ message: 'Failed to copy password.', type: 'error', show: true });
            });
        }
    };

    return (
        <div className="dashboard-container">
            <style>{`
                .dashboard-container {
                    padding: 20px;
                    max-width: 1000px;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                }
                h1, h2 {
                    color: #0f9499;
                }
                .back-icon {
                    position: absolute;
                    top: 20px; /* Adjusted for better positioning */
                    left: 20px;
                    cursor: pointer;
                    font-size: 20px; /* Increased size for better visibility */
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
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                }
                input, select, button {
                    padding: 10px;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                input:focus, select:focus {
                    border-color: #0f9499;
                    outline: none;
                }
                button {
                    background-color: #0f9499;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #066b6e;
                }
                .user-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    margin: 10px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s;
                    max-width: 300px;
                }
                .user-card:hover {
                    transform: translateY(-2px);
                }
                .user-image {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 10px;
                }
                .user-info {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .icon-button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    transition: background-color 0.3s;
                }
                .edit-button {
                    color: rgb(25, 184, 20);
                }
                .delete-button {
                    color: #f44336;
                }
                .icon-button:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
                .image-upload {
                    position: relative;
                }
                .upload-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
                .upload-icon {
                    margin-right: 8px;
                }
                .upload-preview {
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    background-size: cover;
                    background-position: center;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .password-generator {
                    margin-top: 20px;
                }
                .generated-password {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                }
                .copy-button {
                    margin-left: 10px;
                    background-color: #0f9499;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                }
                .image-viewer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }
                .large-image {
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 8px;
                }
            `}</style>

            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-icon" 
                onClick={() => navigate('/admin')} // Navigate back to the AdminPage
            />

            <h1>{editMode ? 'Edit Employee' : 'Add Employee'}</h1>

            

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="laboratorist">Laboratorist</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="nurse">Nurse</option>
                    <option value="card">Card</option>
                </select>
                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Department</option>
                    <option value="lab">Laboratory</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="nurse">Nurse</option>
                    <option value="card">Card</option>
                </select>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <div className="image-upload">
                    <label htmlFor="image" className="upload-label">
                        <FontAwesomeIcon icon={faImage} className="upload-icon" />
                        Upload Image
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        id="image"
                        onChange={handleChange}
                        required
                    />
                    {formData.image && (
                        <div
                            className="upload-preview"
                            style={{
                                backgroundImage: `url(${URL.createObjectURL(formData.image)})`
                            }}
                            onClick={() => setShowImageViewer(true)}
                        ></div>
                    )}
                </div>
                <div className="password-generator">
                    <h3>Generate Password</h3>
                    <button type="button" className="generate-button" onClick={generatePassword}>
                        <FontAwesomeIcon icon={faKey} /> Generate Password
                    </button>
                    {generatedPassword && (
                        <div className="generated-password">
                            <input type="text" readOnly value={generatedPassword} />
                            <button type="button" className="copy-button" onClick={copyToClipboard}>
                                <FontAwesomeIcon icon={faClipboard} /> Copy
                            </button>
                        </div>
                    )}
                </div>
                <button type="submit">{editMode ? 'Update Employee' : 'Add Employee'}</button>
            </form>
            {/* Notification component */}
            {notification.show && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={closeNotification} 
                />
            )}
            <h2>All Users</h2>
            <input
                type="text"
                placeholder="Search by Name or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    padding: '10px',
                    marginBottom: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '100%',
                    maxWidth: '500px',
                }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {filteredUsers.map((user) => (
                    <div className="user-card" key={user._id}>
                        {user.image && (
                            <img 
                                src={`http://localhost:5000/uploads/${user.image}`} 
                                alt={`${user.firstName} ${user.lastName}`} 
                                className="user-image"
                            />
                        )}
                        <div className="user-info">
                            <p><strong>{user.firstName} {user.lastName}</strong></p>
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phone}</p>
                            <p>Role: {user.role}</p>
                            <p>Department: {user.department}</p>
                        </div>
                        <div>
                            <button className="icon-button edit-button" onClick={() => handleEdit(user)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="icon-button delete-button" onClick={() => handleDelete(user._id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Large Image Viewer */}
            {showImageViewer && (
                <ImageViewer
                    imageSrc={formData.image ? URL.createObjectURL(formData.image) : ''}
                    onClose={() => setShowImageViewer(false)}
                />
            )}
        </div>
    );
};

export default AddHelper;