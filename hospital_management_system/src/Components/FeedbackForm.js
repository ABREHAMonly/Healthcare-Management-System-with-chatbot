import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';

const FeedbackForm = ({ loggedInUser }) => {
    const [feedback, setFeedback] = useState('');
    const [department, setDepartment] = useState('general');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        try {
            const response = await axiosInstance.post('/feedback', {
                feedback,
                department,
            });
            setStatus('Feedback submitted successfully!');
            setFeedback('');
        } catch (error) {
            console.error('Error submitting feedback:', error.message);
            setStatus('Error submitting feedback, please try again.');
        }
    };

    return (
        <div className="feedback-form">
            <style>{`
                .feedback-form {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .feedback-form h2 {
                    margin-bottom: 20px;
                    color: #333;
                }

                .feedback-form label {
                    display: block;
                    margin-bottom: 10px;
                    color: #555;
                }

                .feedback-form select,
                .feedback-form textarea {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                    background-color: #fff;
                }

                .feedback-form button {
                    padding: 10px 20px;
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .feedback-form button:hover {
                    background-color: #45a049;
                }

                .feedback-form p {
                    margin-top: 20px;
                    font-size: 16px;
                    color: #333;
                }
            `}</style>
            <h2>Submit Feedback anonymously</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Department:
                    <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                        <option value="general">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="lab">Laboratorist</option>
                        <option value="card">Card</option>
                        <option value="pharmacy">Pharmacist</option>
                        <option value="adolescent">Adolescent</option>
                        <option value="neonatal">Neonatal</option>
                    </select>
                </label>
                <label>
                    Feedback:
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default FeedbackForm;
