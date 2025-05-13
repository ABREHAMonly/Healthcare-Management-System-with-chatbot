import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import Signup from './Signup';
import Appointment from './appointment';
import Aboutus from './Aboutus';
import AdminPage from './Components/AdminPage';
import ProtectedRoute from './Components/ProtectedRoute';
import UsersDashboard from './Components/UsersDashboard';
import DoctorsDashboard from './Components/DoctorsDashboard';
import Doctorspage from './Components/Doctorspage';
import AddhelperForm from './Components/AddhelperForm'; // Import the AddhelperForm component
import Addhelper from './Components/Addhelper.js';
import MessagesDashboard from './Components/MessagesDashboard.js';
import Appoin from './appoin.js';
import PaymentPage from './Components/PaymentPage'; // Import the PaymentPage component
import ForgotPassword from './Components/ForgotPassword'; // Import ForgotPassword component
import ResetPassword from './Components/ResetPassword'; // Import ResetPassword component  
import AddAdminPage from './Components/AddAdminPage'; // Import AddAdminPage component
import Header from './Components/Header.js';  
import Sidebar from './Components/Sidebar.js';
import ResourceManagement from './Components/ResourceManagement.js';   
import SpecificMedicineList from './Components/SpecificMedicineList';
import ChapaPayment from './Components/ChapaPayment'; // Import the ChapaPayment component
import PaymentSuccess from './Components/PaymentSuccess.js';
import PaymentFailed from './Components/PaymentFailed.js';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/appointment" element={<Appointment />} />
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/appoin" element={<Appoin />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Admin Protected Routes */}
                    <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/users" element={<UsersDashboard />} />
                        <Route path="/admin/doctors" element={<DoctorsDashboard />} />
                        <Route path="/admin/Addhelper" element={<Addhelper />} />
                        <Route path="/admin/MessagesDashboard" element={<MessagesDashboard />} />
                        <Route path="/admin/AddAdminPage" element={<AddAdminPage />} />
                        <Route path="/admin/Header" element={<Header />} />
                        <Route path="/admin/Sidebar" element={<Sidebar />} />
                    </Route>

                    {/* Role Card Protected Routes */}
                    <Route element={<ProtectedRoute requiredRole="card" />}>
                        <Route path="/UsersDashboard" element={<UsersDashboard />} />
                    </Route>

                    {/* Doctor Protected Routes */}
                    <Route element={<ProtectedRoute requiredRole="doctor" />}>
                        <Route path="/doctors/:department" element={<Doctorspage />} />
                    </Route>

                    {/* AddhelperForm Route */}
                    <Route path="/addhelperform" element={<AddhelperForm />} />

                    {/* PaymentPage Route */}
                    <Route path="/payment" element={<PaymentPage />} />

                    {/* Specific Medicine List and Chapa Payment Routes */}
                    <Route path="/specific-medicine-list" element={<SpecificMedicineList />} />
                    <Route path="/chapapay" element={<ChapaPayment />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />

                    {/* ResourceManagement Route */}
                    <Route path="/ResourceManagement" element={<ResourceManagement />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;