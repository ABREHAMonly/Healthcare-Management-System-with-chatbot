import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification'; // Import the Notification component
import './ResourceManagement.css';

// General Medicine List Component
const GeneralMedicineList = ({ medicines, onAdd }) => {
    return (
        <table className="medicine-list">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Sold as Dose</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {medicines.map((medicine) => (
                    <tr key={medicine._id}>
                        <td>{medicine.name}</td>
                        <td>{medicine.type}</td>
                        <td>{medicine.capacity}</td>
                        <td>{medicine.soldAsDose ? 'Yes' : 'No'}</td>
                        <td>
                            <button onClick={() => onAdd(medicine)}>Add</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Add General Medicine Modal
const AddGeneralMedicineModal = ({ onClose, fetchMedicines, onNotify }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [soldAsDose, setSoldAsDose] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!name.trim() || !type.trim()) {
            onNotify("Medicine name and type cannot be empty.", "error");
            return;
        }
    
        const capacityRegex = /^\d+(mg|ml)$/; // Validate format like '250mg' or '250ml'
        if (!capacityRegex.test(capacity.trim())) {
            onNotify("Capacity must be in the format 'mg or ml'.", "error");
            return;
        }
    
        if (soldAsDose && isNaN(parseFloat(capacity))) {
            onNotify("Capacity must be a numeric value when sold as dose.", "error");
            return;
        }
    
        try {
            await axiosInstance.post('/general-medicines', { name, type, capacity, soldAsDose });
            fetchMedicines();
            onNotify("General medicine added successfully!", "success");
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === "Medicine name must be unique.") {
                onNotify("This medicine name already exists. Please choose another one.", "error");
            } else {
                onNotify("Error adding general medicine.", "error");
            }
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Add General Medicine</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Medicine Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Medicine Type (e.g., Tablet)</label>
                        <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Capacity (e.g., 250mg)</label>
                        <input type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" checked={soldAsDose} onChange={(e) => setSoldAsDose(e.target.checked)} />
                            Sold as Dose
                        </label>
                    </div>
                    <button type="submit">Add Medicine</button>
                </form>
            </div>
        </div>
    );
};

// Add Specific Medicine Modal
const AddSpecificMedicineModal = ({ generalMedicine, onClose, fetchMedicines, onNotify }) => {
    const [expiredDate, setExpiredDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [buyingPrice, setBuyingPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [profit, setProfit] = useState(0);

    const handleCalculateProfit = () => {
        const calculatedProfit = sellingPrice - buyingPrice;
        setProfit(calculatedProfit);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const today = new Date();
        const expiration = new Date(expiredDate);
        if (expiration < today) {
            onNotify("Expiration date cannot be in the past.", "error");
            return;
        }
    
        if (!quantity || quantity <= 0 || !Number.isInteger(Number(quantity))) {
            onNotify("Quantity must be a positive integer.", "error");
            return;
        }
    
        if (buyingPrice <= 0 || sellingPrice <= 0) {
            onNotify("Buying and selling prices must be positive numbers.", "error");
            return;
        }
    
        if (sellingPrice <= buyingPrice) {
            onNotify("Selling price must be greater than buying price.", "error");
            return;
        }
    
        try {
            await axiosInstance.post('/specific-medicines', {
                generalMedicineId: generalMedicine._id,
                generalMedicineName: generalMedicine.name, // Include the general medicine name
                expiredDate,
                quantity,
                buyingPrice,
                sellingPrice,
            });
            fetchMedicines();
            onNotify("Specific medicine added successfully!", "success");
            onClose();
        } catch (error) {
            console.error('Error adding specific medicine:', error);
            onNotify("Error adding specific medicine.", "error");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Add Specific Medicine for {generalMedicine.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Expiration Date</label>
                        <input type="date" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Buying Price</label>
                        <input type="number" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Selling Price</label>
                        <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required onBlur={handleCalculateProfit} />
                    </div>
                    <div className="profit-display">Profit: {profit}</div>
                    <button type="submit">Add Specific Medicine</button>
                </form>
            </div>
        </div>
    );
};

// Main Resource Management Component
const ResourceManagement = () => {
    const navigate = useNavigate();
    const [generalMedicines, setGeneralMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [isAddGeneralModalOpen, setIsAddGeneralModalOpen] = useState(false);
    const [isAddSpecificModalOpen, setIsAddSpecificModalOpen] = useState(false);
    const [currentGeneralMedicine, setCurrentGeneralMedicine] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGeneralMedicines();
    }, []);

    useEffect(() => {
        setFilteredMedicines(
            generalMedicines.filter(medicine =>
                medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, generalMedicines]);

    const fetchGeneralMedicines = async () => {
        try {
            const response = await axiosInstance.get('/general-medicines');
            setGeneralMedicines(response.data);
            setFilteredMedicines(response.data); // Initialize filtered medicines
        } catch (error) {
            console.error('Error fetching general medicines:', error);
        }
    };

    const handleBackClick = () => {
        navigate('/addhelperform');
    };

    const handleAddSpecificMedicine = (medicine) => {
        setCurrentGeneralMedicine(medicine);
        setIsAddSpecificModalOpen(true);
    };

    const handleNotify = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification({ ...notification, visible: false });
        }, 5000); // Hide notification after 5 seconds
    };

    return (
        <div className="resource-management">
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-icon" 
                onClick={handleBackClick} 
            />
            <h1>Welcome to Resource Management</h1>
            
            <button onClick={() => setIsAddGeneralModalOpen(true)}>Add General Medicine</button>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search Medicines..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            <GeneralMedicineList
                medicines={filteredMedicines}
                onAdd={handleAddSpecificMedicine}
            />
            {isAddGeneralModalOpen && <AddGeneralMedicineModal onClose={() => setIsAddGeneralModalOpen(false)} fetchMedicines={fetchGeneralMedicines} onNotify={handleNotify} />}
            {isAddSpecificModalOpen && (
                <AddSpecificMedicineModal
                    generalMedicine={currentGeneralMedicine}
                    onClose={() => {
                        setIsAddSpecificModalOpen(false);
                        setCurrentGeneralMedicine(null);
                    }}
                    fetchMedicines={fetchGeneralMedicines}
                    onNotify={handleNotify}
                />
            )}
            {notification.visible && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification({ ...notification, visible: false })} 
                />
            )}
        </div>
    );
};

export default ResourceManagement;