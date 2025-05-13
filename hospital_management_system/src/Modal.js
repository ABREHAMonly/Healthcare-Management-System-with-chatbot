import React from 'react';
import './Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="modal-icon" />
                    <h2>🎉 𝕎𝕖𝕝𝕔𝕠𝕞𝕖!</h2>
                </div>
                <p className="modal-text">𝖂𝖊'𝖗𝖊 𝖘𝖔 𝖌𝖑𝖆𝖉 𝖙𝖔 𝖍𝖆𝖛𝖊 𝖞𝖔𝖚 𝖍𝖊𝖗𝖊!</p>
                <p className="modal-text">𝕋𝕙𝕚𝕤 𝕡𝕝𝕒𝕥𝕗𝕠𝕣𝕞 𝕚𝕤 𝕙𝕖𝕣𝕖 𝕥𝕠 𝕙𝕖𝕝𝕡 𝕪𝕠𝕦. 𝕋𝕒𝕜𝕖 𝕒 𝕝𝕠𝕠𝕜 𝕒𝕣𝕠𝕦𝕟𝕕!</p>
                <button className="modal-close" onClick={onClose}>✖</button>
            </div>
        </div>
    );
};

export default Modal;
