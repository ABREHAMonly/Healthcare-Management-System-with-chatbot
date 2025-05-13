import React, { useState, useEffect } from 'react';
import axios from './AxiosInstance';
import Notification from '../Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaArrowLeft } from 'react-icons/fa';
import { faEdit, faTrash, faKey, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ImageViewer = ({ imageSrc, onClose }) => {
    return (
        <div className="image-viewer">
            <div className="overlay" onClick={onClose}></div>
            <img src={imageSrc} alt="Large View" className="large-image" />
        </div>
    );
};

const DoctorsDashboard = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        password: '',
        confirmPassword: '',
        image: null,
    });
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get('/users/doctors');
                setDoctors(data);
                setFilteredDoctors(data);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const results = doctors.filter(doctor =>
            `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDoctors(results);
    }, [searchQuery, doctors]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate phone number
        if (!/^\d{10}$/.test(formData.phone)) {
            setNotification({ message: 'Phone number must be exactly 10 digits.', type: 'error', show: true });
            return;
        }

        const { password, confirmPassword } = formData;
        if (password && password !== confirmPassword) {
            setNotification({ message: 'Passwords do not match.', type: 'error', show: true });
            return;
        }

        const formDataObj = new FormData();
        for (const key in formData) {
            formDataObj.append(key, formData[key]);
        }
        formDataObj.append('role', 'doctor');

        try {
            if (currentDoctor) {
                const { data } = await axios.put(`/doctors/${currentDoctor._id}`, formDataObj);
                setDoctors(doctors.map(doc => doc._id === currentDoctor._id ? data.updatedUser : doc));
            } else {
                const { data } = await axios.post('/doctors/register', formDataObj);
                setDoctors([...doctors, data.newUser]);
            }
            resetForm();
            setNotification({ message: 'Operation successful!', type: 'success', show: true });
        } catch (err) {
            console.error('Error adding/updating doctor:', err);
            setNotification({ message: 'Failed to add/update doctor.', type: 'error', show: true });
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            department: '',
            password: '',
            confirmPassword: '',
            image: null,
        });
        setCurrentDoctor(null);
        setPreviewImage(null);
        setGeneratedPassword('');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEdit = (doctor) => {
        setCurrentDoctor(doctor);
        setFormData({
            firstName: doctor.firstName || '',
            lastName: doctor.lastName || '',
            email: doctor.email || '',
            phone: doctor.phone || '',
            department: doctor.department || '',
            password: '',
            confirmPassword: '',
            image: null,
        });
        setPreviewImage(doctor.image ? `http://localhost:5000/${doctor.image}` : null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/doctors/${id}`);
            setDoctors(doctors.filter(doc => doc._id !== id));
            setNotification({ message: 'Doctor deleted successfully!', type: 'success', show: true });
        } catch (err) {
            console.error('Error deleting doctor:', err);
            setNotification({ message: 'Failed to delete doctor.', type: 'error', show: true });
        }
    };

    const generatePassword = () => {
        const randomNumbers = Math.random().toString().slice(2, 8);
        const password = `et${randomNumbers}`;
        setGeneratedPassword(password);
        setFormData({ ...formData, password: password, confirmPassword: password });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword);
        setNotification({ message: 'Password copied to clipboard!', type: 'success', show: true });
    };

    const closeNotification = () => {
        setNotification({ ...notification, show: false });
    };

    return (
        <div className="dashboard-container">
            <style>{`
                .dashboard-container {
                    padding: 20px;
                    max-width: 100%;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                }
                .back-icon {
                    position: absolute;
                    top: 10px;
                    left: 20px;
                    cursor: pointer;
                    font-size: 50px;
                    color: rgb(255, 255, 255);
                    background-color: #0f9499;
                    padding: 15px;
                    border-radius: 50%;
                    transition: transform 0.2s, background-color 0.3s;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    z-index: 1;
                }
                .back-icon:hover {
                    transform: scale(1.1);
                    background-color: #066b6e;
                }

                h1, h2 {
                    color: #0f9499;
                    text-align: center;
                }

                form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                    max-width: 700px;
                    margin: 0 auto;
                }

                input, select {
                    padding: 10px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    transition: border-color 0.3s;
                }

                input:focus, select:focus {
                    border-color: #0f9499;
                    outline: none;
                }

                button {
                    padding: 10px;
                    font-size: 14px;
                    background-color: #0f9499;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background-color: #066b6e;
                }

                .doctor-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px;
                    margin: 10px;
                    width: 100%;
                    max-width: 200px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                }

                .doctor-image {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 10px;
                    cursor: pointer;
                }

                .doctor-info {
                    text-align: center;
                }

                .error-message {
                    color: red;
                    text-align: center;
                }

                .success-message {
                    color: green;
                    text-align: center;
                }

                .doctor-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .icon-button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    margin-left: 5px;
                    transition: background-color 0.3s;
                }

                .edit-button {
                    color: #4CAF50;
                }

                .delete-button {
                    color: #f44336;
                }

                .icon-button:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }

                .image-viewer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
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
                    cursor: pointer;
                }

                .large-image {
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 10px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .image-upload-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .upload-icon {
                    margin-right: 8px;
                    color: #0f9499;
                }

                .image-upload-input {
                    display: none;
                }

                .upload-preview {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
                    margin-top: 10px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    transition: border-color 0.3s;
                }

                .upload-preview:hover {
                    border-color: #0f9499;
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 10px;
                    }

                    form {
                        padding: 10px;
                        gap: 10px;
                    }

                    input, select, button {
                        font-size: 14px;
                        padding: 5px;
                    }

                    .doctor-card {
                        max-width: 150px;
                    }
                }

                @media (max-width: 480px) {
                    h1, h2 {
                        font-size: 20px;
                    }

                    form {
                        padding: 5px;
                        gap: 5px;
                    }

                    input, select, button {
                        font-size: 12px;
                        padding: 4px;
                    }

                    button {
                        padding: 4px;
                    }

                    .doctor-card {
                        max-width: 120px;
                    }
                }
            `}</style>

            <FaArrowLeft 
                className="back-icon" 
                onClick={() => navigate('/admin')} // Navigate back to the AdminPage
            />
            <h1>{currentDoctor ? 'Welcome ADMIN You Can Edit Doctors Data Here' : 'Welcome ADMIN You Can Add Doctors Here'}</h1>
            <form onSubmit={handleSubmit}>
                <h2>{currentDoctor ? 'Edit Doctor Details' : 'Add New Doctor'}</h2>
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
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Department</option>
                    <option value="general">General Doctor</option>
                    <option value="neonatal">Neonatal</option>
                    <option value="adolescent">Adolescent</option>
                </select>
                
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!currentDoctor}
                />
               
                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!currentDoctor}
                />
                
                <button type="button" onClick={generatePassword}>
                    <FontAwesomeIcon icon={faKey} /> Generate Password
                </button>
                {generatedPassword && (
                    <div className="form-group">
                        <input
                            type="text"
                            value={generatedPassword}
                            readOnly
                            placeholder="Generated Password"
                        />
                        <button type="button" onClick={copyToClipboard}>
                            Copy Password
                        </button>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="image" className="image-upload-label">
                        <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                        Profile Image
                    </label>
                    <input
                        type="file"
                        id="image" // Ensure this matches the label's 'for' attribute
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="image-upload-input"
                    />
                    {previewImage && (
                        <div
                            className="upload-preview"
                            style={{ backgroundImage: `url(${previewImage})` }}
                            onClick={() => setShowImageViewer(previewImage)}
                        ></div>
                    )}
                </div>
                <button type="submit">{currentDoctor ? 'Update Doctor' : 'Add Doctor'}</button>
                {notification.show && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={closeNotification}
                    />
                )}
            </form>
            <h2>All Doctors</h2>
            <input
                type="text"
                placeholder="Search by Name or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    padding: '10px',
                    margin: '10px 0',
                    width: '100%',
                    maxWidth: '700px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                }}
            />
            <div className="doctor-list">
                {filteredDoctors.map((doctor) => (
                    <div className="doctor-card" key={doctor._id}>
                        {doctor.image && (
                            <img 
                                src={`http://localhost:5000/${doctor.image}`} 
                                alt={`${doctor.firstName} ${doctor.lastName}`} 
                                className="doctor-image"
                                onClick={() => setShowImageViewer(`http://localhost:5000/${doctor.image}`)}
                            />
                        )}
                        <div className="doctor-info">
                            <p><strong>{doctor.firstName} {doctor.lastName}</strong></p>
                            <p>Email: {doctor.email}</p>
                            <p>Phone: {doctor.phone}</p>
                            <p>Department: {doctor.department}</p>
                        </div>
                        <div>
                            <button className="icon-button edit-button" onClick={() => handleEdit(doctor)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="icon-button delete-button" onClick={() => handleDelete(doctor._id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showImageViewer && (
                <ImageViewer
                    imageSrc={showImageViewer}
                    onClose={() => setShowImageViewer(false)}
                />
            )}
        </div>
    );
};

export default DoctorsDashboard;