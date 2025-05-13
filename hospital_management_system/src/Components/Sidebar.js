import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaUserPlus, FaUserTie, FaStethoscope, FaComments, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ unreadCount, onLogout }) => {
    return (
        <div className="sidebar">
            <Link to="/admin"><FaHome /></Link>
            <Link to="/admin/AddAdminPage"><FaUserPlus /></Link> 
            <Link to="/admin/users"><FaUser /></Link>
            <Link to="/admin/doctors"><FaStethoscope /></Link>
            <Link to="/admin/Addhelper"><FaUserTie /></Link> 
            <Link to="/admin/MessagesDashboard">
                <FaComments />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>
            <button onClick={onLogout} className="logout-button">
                <FaSignOutAlt />
            </button>
        </div>
    );
};

export default Sidebar;