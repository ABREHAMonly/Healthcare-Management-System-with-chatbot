import React, { useEffect, useState } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000); 

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="holographic-spinner">
          <div className="spinner-core"></div>
          <div className="spinner-ring spinner-ring-1"></div>
          <div className="spinner-ring spinner-ring-2"></div>
          <div className="spinner-ring spinner-ring-3"></div>
          <div className="spinner-particle particle-1"></div>
          <div className="spinner-particle particle-2"></div>
          <div className="spinner-particle particle-3"></div>
        </div>
        <div className="loading-content">
          <p className="loading-text">Initializing Hospital System</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="loading-subtext">Loading modules...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;