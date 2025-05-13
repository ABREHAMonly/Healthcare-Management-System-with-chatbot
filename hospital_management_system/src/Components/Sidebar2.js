import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faSignOutAlt, faPlus, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const Sidebar2 = ({ onLogout }) => {
    const navigate = useNavigate();
    const profile = JSON.parse(localStorage.getItem('profile'));
    const role = profile?.user?.role;

    const handleUsersClick = () => {
        if (role === 'card' || role === 'nurse') {
            navigate('/UsersDashboard');
        } else {
            alert("You don't have permission to access this resource.");
        }
    };

    const handlePlusClick = () => {
        if (role === 'card') {
            navigate('/signup');
        } else {
            alert("You don't have permission to access this resource.");
        }
    }; 

    const handlePaymentClick = () => {
        if (role === 'card') {
            navigate('/payment');
        } else {
            alert("You don't have permission to access this resource.");
        }
    };
    const handleResourceManagementClick = () => {
        if (role === 'pharmacist') {
            navigate('/ResourceManagement');
        } else {
            alert("You don't have permission to access this resource.");
        }
    };

    return (
        <div className="sidebar">
            <style>
                {`
                    .sidebar {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background-color: #2d3e50; 
                        color: #ffffff;
                        height: 100vh;
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 160px;
                        padding-top: 20px;
                        box-shadow: 2px 0 5px rgba(0,0,0,0.5);
                        transition: all 0.3s ease;
                    }
                    .sidebar a {
                        color: #ffffff;
                        font-size: 20px;
                        text-decoration: none;
                        margin: 20px 0;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: color 0.3s, transform 0.3s;
                    }
                    .sidebar a:hover {
                        color: #f0f0f0;
                        transform: scale(1.1);
                    }
                    .sidebar .icon {
                        margin-right: 10px;
                        transition: color 0.3s;
                    }
                    .home-icon { color: #ffcc00; }
                    .register-icon { color: #28a745; }
                    .payment-icon { color: #007bff; }
                    .users-icon { color: #17a2b8; }
                    .logout-icon { color: #dc3545; }

                    .sidebar a:hover .home-icon { color: #f39c12; }
                    .sidebar a:hover .register-icon { color: #218838; }
                    .sidebar a:hover .payment-icon { color: #0056b3; }
                    .sidebar a:hover .users-icon { color: #138496; }
                    .sidebar a:hover .logout-icon { color: #c82333; }

                    @media (max-width: 768px) {
                        .sidebar {
                            flex-direction: row;
                            height: auto;
                            width: 100%;
                            padding: 10px 0;
                            position: static;
                            justify-content: space-around;
                        }
                        .sidebar a {
                            margin: 0 10px;
                            font-size: 18px;
                        }
                    }

                    @media (max-width: 480px) {
                        .sidebar a {
                            font-size: 16px;
                        }
                    }
                `}
            </style>
            <a onClick={() => navigate('/AddhelperForm')}><FontAwesomeIcon icon={faHome} className="icon home-icon" /> Home</a>
            {role === 'card' && (
                <>
                    <a onClick={handlePlusClick}><FontAwesomeIcon icon={faPlus} className="icon register-icon" /> Register Patient</a>
                    <a onClick={handlePaymentClick}><FontAwesomeIcon icon={faMoneyBillWave} className="icon payment-icon" /> Payment</a>
                </>
            )}
            {role === 'pharmacist' && (
                <>
                    <a onClick={handleResourceManagementClick}><FontAwesomeIcon icon={faPlus} className="icon register-icon" /> Resource_Mgt</a>
                </>
            )}

            {(role === 'card' || role === 'nurse') && (
                <a onClick={handleUsersClick}><FontAwesomeIcon icon={faUsers} className="icon users-icon" /> All Patients</a>
            )}
            <a onClick={onLogout}><FontAwesomeIcon icon={faSignOutAlt} className="icon logout-icon" /> Logout</a>
        </div>
    );
};

export default Sidebar2;