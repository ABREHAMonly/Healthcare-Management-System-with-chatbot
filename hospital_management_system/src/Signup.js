import React, { useState, useEffect } from 'react';
import axiosInstance from './Components/AxiosInstance';
import Notification from './Notification'; // Import the Notification component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faKey, faClipboard } from '@fortawesome/free-solid-svg-icons';
import "./Signup.css";

const ImageViewer = ({ imageSrc, onClose }) => {
    return (
        <div className="image-viewer">
            <div className="overlay" onClick={onClose}></div>
            <img src={imageSrc} alt="Large View" className="large-image" />
        </div>
    );
};

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        image: null
    });
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showImageViewer, setShowImageViewer] = useState(false);

    // Function to fetch users
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users/role/user');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '', show: false });

        // Validate phone number
        if (!/^\d{10}$/.test(formData.phone)) {
            setNotification({ message: 'Phone number must be exactly 10 digits.', type: 'error', show: true });
            return;
        }

        // Validate password
        if (formData.password !== formData.confirmPassword) {
            setNotification({ message: 'Passwords do not match.', type: 'error', show: true });
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            if (editMode) {
                const response = await axiosInstance.put(`/auth/update/${editUserId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setUsers(users.map(user => user._id === editUserId ? response.data.updatedUser : user));
                setNotification({ message: 'Successfully Updated!', type: 'success', show: true });
            } else {
                const response = await axiosInstance.post('/auth/signup', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setUsers(prevUsers => [...prevUsers, response.data.newUser]);
                setNotification({ message: 'Successfully Registered!', type: 'success', show: true });
            }
            resetForm();
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : 'Error. Please try again.';
            setNotification({ message: errorMessage, type: 'error', show: true });
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            image: null
        });
        setGeneratedPassword('');
        setEditMode(false);
        setEditUserId('');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, show: false });
    };

    const handleEdit = (user) => {
        setEditMode(true);
        setEditUserId(user._id);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            password: '',
            confirmPassword: '',
            image: null
        });
    };

    const handleDelete = async (userId) => {
        try {
            await axiosInstance.delete(`/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
            setNotification({ message: 'User deleted successfully!', type: 'success', show: true });
        } catch (error) {
            setNotification({ message: 'Failed to delete user.', type: 'error', show: true });
        }
    };

    const generatePassword = () => {
        const randomNumbers = Math.random().toString().slice(2, 8); // Generate 6 random digits
        const password = `et${randomNumbers}`; // Prefix with "et"
        setGeneratedPassword(password);
        setFormData({ ...formData, password: password, confirmPassword: password });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword);
        setNotification({ message: 'Password copied to clipboard!', type: 'success', show: true });
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, []);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    const filteredUsers = users.filter(user =>
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.patientId && user.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className='signuppage-container'>
            <div className='signuppage'>
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="back-icon"
                    onClick={() => window.location.href = '/addhelperform'} // Navigate to AddHelperForm
                />
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-group image-upload">
                        <label htmlFor="image">Profile Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <label className="upload-button" htmlFor="image">
                            <FontAwesomeIcon icon={faClipboard} className="upload-icon" />
                            Upload Image
                        </label>
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
                    <button type="submit" className="submit-button">{editMode ? 'Update User' : 'Sign Up'}</button>
                </form>

                {/* Password Generator Section */}
                <div className="password-generator">
                    <h3>Generate Password</h3>
                    <button className="generate-button" onClick={generatePassword}>
                        <FontAwesomeIcon icon={faKey} /> Generate Password
                    </button>
                    {generatedPassword && (
                        <div className="generated-password">
                            <input type="text" readOnly value={generatedPassword} />
                            <button className="copy-button" onClick={copyToClipboard}>
                                <FontAwesomeIcon icon={faClipboard} /> Copy
                            </button>
                        </div>
                    )}
                </div>

                {notification.show && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={handleCloseNotification}
                    />
                )}
                <h2>Registered Users</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by First Name or Patient ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Patient ID</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
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
                                <td>
                                    <button className="edit-button" onClick={() => handleEdit(user)}>
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(user._id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default Signup;