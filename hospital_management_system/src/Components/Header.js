import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserMd, faProcedures, faVials, faUserNurse, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const Header = ({ admin, stats }) => {
    const [showImageModal, setShowImageModal] = useState(false);

    const handleImageClick = () => {
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    };

    if (admin.role !== 'admin') {
        return null; // Do not render anything if the role is not 'admin'
    }

    return (
        <div className="header">
            <style>{`
                .header {
                    background-color: #2d3e50;
                    color: white;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 4px solid #4caf50;
                    height: auto;
                }
                .profile {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .profile img {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 2px solid #4caf50;
                    cursor: pointer;
                }
                h2 {
                    margin: 0;
                    font-size: 24px;
                    text-align: center;
                    color: black;
                }
                .stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                }
                .stats div {
                    background-color: rgb(71, 118, 150);
                    padding: 15px 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    font-size: 16px;
                    flex: 1 1 calc(33.333% - 20px);
                    margin: 5px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                }
                .stats div:hover {
                    background-color: rgb(75, 98, 114);
                }
                .stats div .icon {
                    font-size: 24px;
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal img {
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
                @media (max-width: 768px) {
                    .header {
                        flex-direction: column;
                    }
                    .profile {
                        margin-bottom: 10px;
                    }
                    .stats div {
                        flex: 1 1 100%;
                    }
                }
                @media (max-width: 480px) {
                    .stats div {
                        font-size: 14px;
                        padding: 10px 15px;
                    }
                }
            `}</style>
            <div className="profile">
                <img 
                    src={admin.image ? `http://localhost:5000/uploads/${admin.image}` : 'default-avatar.png'} 
                    alt="Admin Profile" 
                    onClick={handleImageClick}
                />
                <h2>Admin,</h2><br/>
                <h2>Welcome, {admin.firstName} {admin.lastName}</h2>
            </div>
            <div className="stats">
                <div><FontAwesomeIcon icon={faUsers} className="icon" /> Total Users: {stats.totalUsers}</div>
                <div><FontAwesomeIcon icon={faUserMd} className="icon" /> Registered Doctors: {stats.registeredDoctors}</div>
                <div><FontAwesomeIcon icon={faProcedures} className="icon" /> Pharmacists: {stats.registeredPharmacists}</div>
                <div><FontAwesomeIcon icon={faVials} className="icon" /> Laboratorists: {stats.registeredLaboratorists}</div>
                <div><FontAwesomeIcon icon={faUserNurse} className="icon" /> Nurses: {stats.registeredNurses}</div>
                <div><FontAwesomeIcon icon={faClipboardCheck} className="icon" /> P_Reg_Clerk: {stats.registeredCard}</div>
            </div>

            {showImageModal && (
                <div className="modal" onClick={closeImageModal}>
                    <span className="close-button" onClick={closeImageModal}>&times;</span>
                    <img src={admin.image ? `http://localhost:5000/uploads/${admin.image}` : 'default-avatar.png'} alt="Large Admin Profile" />
                </div>
            )}
        </div>
    );
};

export default Header;
