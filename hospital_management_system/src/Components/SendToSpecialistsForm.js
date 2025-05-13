import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCopy } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification';
import './SendToSpecialistsForm.css';

const SendToSpecialistsForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    notes: '',
    department: 'neonatal',
    doctor: ''
  });
  const [departments] = useState(['neonatal', 'adolescent']);
  const [doctors, setDoctors] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    setFilteredReports(
      reports.filter(report =>
        report.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, reports]);

  useEffect(() => {
    fetchDoctors(formData.department);
  }, [formData.department]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchDoctors = async (department) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/doctors?department=${department}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Error fetching doctors. Please ensure you have the necessary permissions.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    if (name === 'department') {
      fetchDoctors(value);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setNotification({ message: 'Copied to clipboard', type: 'success' });
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      setNotification({ message: 'Failed to copy', type: 'error' });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const reportData = {
        ...formData,
        doctorId: formData.doctor // Ensure doctorId is sent correctly
      };
      if (editingReport) {
        await axiosInstance.put(`/reports/${editingReport._id}`, reportData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Report updated successfully.');
        setEditingReport(null);
      } else {
        await axiosInstance.post('/reports', reportData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Report sent successfully.');
      }
      setFormData({
        patientName: '',
        patientId: '',
        notes: '',
        department: 'neonatal',
        doctor: ''
      });
      fetchReports();
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Error sending report. Please try again.');
    }
  };

  const handleEdit = (report) => {
    setFormData({
      patientName: report.patientName,
      patientId: report.patientId,
      notes: report.notes,
      department: report.department,
      doctor: report.doctorId || '' // Assuming report has a doctorId field
    });
    setEditingReport(report);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="send-report-form-container">
      <form onSubmit={handleSubmit} className="send-report-form">
        <h2>{editingReport ? 'Edit Report' : 'Send Report'}</h2>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="patientId">Patient ID</label>
          <input
            type="text"
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="department">Department to Send</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            {departments.map((department, index) => (
              <option key={index} value={department}>
                {department.charAt(0).toUpperCase() + department.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="doctor">Select Doctor</label>
          <select
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{editingReport ? 'Update Report' : 'Submit'}</button>
      </form>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Patient ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-responsive">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Sender Doctor Name</th>
              <th>Patient Name</th>
              <th>Patient ID</th>
              <th>Notes</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report._id}>
                <td>
                  {report.senderDoctorName}
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="copy-icon" 
                    onClick={() => handleCopy(report.senderDoctorName)} 
                  />
                </td>
                <td>
                  {report.patientName}
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="copy-icon" 
                    onClick={() => handleCopy(report.patientName)} 
                  />
                </td>
                <td>
                  {report.patientId}
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="copy-icon" 
                    onClick={() => handleCopy(report.patientId)} 
                  />
                </td>
                <td>{report.notes}</td>
                <td>
                  {report.department}
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="copy-icon" 
                    onClick={() => handleCopy(report.department)} 
                  />
                </td>
                <td>
                  {report.doctorName}
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="copy-icon" 
                    onClick={() => handleCopy(report.doctorName)} 
                  />
                </td>
                <td>{new Date(report.createdAt).toLocaleString()}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="edit-icon"
                    onClick={() => handleEdit(report)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SendToSpecialistsForm;