import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from './HomePageAxios';
import './HomePage.css';
import ChatBoard from './ChatBoard';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, faMapMarkerAlt, faPhone, faEnvelope, faClock,
  faTimes, faBars, faChevronLeft, faChevronRight, faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import {
  faTelegramPlane, faTwitter, faInstagram, 
  faFacebookF, faWhatsapp
} from '@fortawesome/free-brands-svg-icons';

const photos = [
    { src: '/photo1.jpg', alt: 'Hospital waiting area' },
  { src: '/photo2.jpg', alt: 'Hospital waiting area' },
  { src: '/photo3.jpg', alt: 'Modern hospital equipment' },
  { src: '/photo4.jpg', alt: 'Doctor consultation room' },
  { src: '/photo5.jpg', alt: 'Emergency department' },
  { src: '/photo6.jpg', alt: 'Pediatric care unit' },
  { src: '/photo7.jpg', alt: 'Hospital waiting area' },
  { src: '/photo8.jpg', alt: 'Hospital waiting area' },
  { src: '/photo9.jpg', alt: 'Hospital waiting area' },
  { src: '/photo10.jpg', alt: 'Hospital waiting area' },

];

const services = [
  {
    title: "General Medicine",
    description: "Comprehensive care for patients of all ages focusing on overall health and wellness.",
    image: "/general_doctor.jpg",
  },
  {
    title: "Adolescent Care",
    description: "Specialized services including health education and mental health support.",
    image: "/adolescent_care.jpg",
  },
  {
    title: "Neonatal Care",
    description: "Expert care for newborns ensuring healthy growth and development.",
    image: "/neonatal_care.jpg",
  },
  {
    title: "Pharmacy",
    description: "Safe medications with professional consultation for proper use.",
    image: "/pharmacy.jpg",
  },
  {
    title: "Laboratory Services",
    description: "Comprehensive testing to diagnose and monitor health conditions.",
    image: "/laboratory.jpg",
  },
  {
    title: "Nurse Services",
    description: "Compassionate care including monitoring and medication administration.",
    image: "/nurse_services.jpg",
  }
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    email: '',
    phone: ''
  });
  const [formStatus, setFormStatus] = useState({ 
    submitting: false,
    submitted: false, 
    success: false, 
    error: '' 
  });
  const [notification, setNotification] = useState({ 
    message: '', 
    type: '', 
    isVisible: false 
  });

  const navigate = useNavigate();
  const location = useLocation();
  const sections = useRef({});
  const menuOverlayRef = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));

    return () => {
      serviceCards.forEach(card => observer.unobserve(card));
      observer.disconnect();
    };
  }, []);

  // Handle hash-based navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Data fetching example (optional)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/homepage-data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Failed to load data. Please try again later.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
      if (menuOverlayRef.current) {
        menuOverlayRef.current.classList.add('active');
      }
    } else {
      document.body.classList.remove('menu-open');
      if (menuOverlayRef.current) {
        menuOverlayRef.current.classList.remove('active');
      }
    }

    // Cleanup function to remove classes when the component unmounts
    return () => {
      document.body.classList.remove('menu-open');
      if (menuOverlayRef.current) {
        menuOverlayRef.current.classList.remove('active');
      }
    };
  }, [isMenuOpen]);

  const handlePrevious = () => {
    setCurrentPhotoIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        else if (!/^[A-Za-z\s]+$/.test(value)) error = 'Invalid characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!/^[0-9+\-\s]+$/.test(value)) error = 'Invalid phone number';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name] || formStatus.submitted) {
      setFormErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {
      firstName: validateField('firstName', formData.firstName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone)
    };
    
    setFormErrors(errors);
    
    if (Object.values(errors).some(error => error)) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }
    
    setFormStatus(prev => ({ ...prev, submitting: true }));
    
    try {
      await axiosInstance.post('/messages', formData);
      setFormStatus({ submitting: false, submitted: true, success: true, error: '' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      showNotification('Message sent successfully!', 'success');
    } catch (error) {
      setFormStatus({ submitting: false, submitted: true, success: false, error: error.message });
      showNotification(`Error: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleImageLoad = (imageKey) => {
    setLoadedImages(prev => ({ ...prev, [imageKey]: true }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="hospital-app">
      <header className="app-header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/')} role="button" tabIndex="0">
            <img src="/logo.png" alt="Hospital Logo" width="40" height="40" />
            <span>MediCare Hospital</span>
          </div>
          
          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav-header">
              <div className="mobile-logo" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
                <img src="/logo.png" alt="Hospital Logo" width="32" height="32" />
                <span>MediCare Hospital</span>
              </div>
              <button className="close-nav" onClick={() => setIsMenuOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="nav-links">
              <button onClick={() => scrollToSection('home')}>Home</button>
              <button onClick={() => { navigate('/aboutus'); setIsMenuOpen(false); }}>About Us</button>
              <button onClick={() => { navigate('/appoin'); setIsMenuOpen(false); }}>Appointment</button>
              <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>Login</button>
            </div>
          </nav>
          
          <button 
            className="mobile-menu" 
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </header>

      <div ref={menuOverlayRef} className="menu-overlay" onClick={() => setIsMenuOpen(false)} />

      <main>
        
        {/* Hero Section */}
        <section id="home" className="hero-section" ref={el => sections.current.home = el}>
          <div className="hero-content container">
            <div className="hero-text">
              <h1>
                <span className="hero-title">Advanced Healthcare</span>
                <span className="hero-subtitle">For You and Your Family</span>
              </h1>
              <p className="hero-description">
                State-of-the-art medical facility providing comprehensive healthcare 
                services with compassion and excellence.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate('/appoin')} className="primary-btn">
                  Book Appointment
                </button>
                <button onClick={toggleChat} className="secondary-btn">
                  Chat with Assistant
                </button>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="image-wrapper">
                <div className="holographic-effect" />
                <img 
                  src="/hospital2.png" 
                  alt="Modern Hospital Facility"
                  loading="lazy"
                  onLoad={() => handleImageLoad('hero')}
                  className={loadedImages['hero'] ? 'loaded' : ''}
                />
                <div className="glow-effect" />
              </div>
            </div>
          </div>
          
          <button className="scroll-indicator" onClick={() => scrollToSection('services')}>
            <span>Explore Services</span>
            <FontAwesomeIcon icon={faAngleDown} className="arrow-down" />
          </button>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="section-header">
            <h2>Our Medical Services</h2>
            <p>Comprehensive healthcare solutions for all ages</p>
          </div>

          <div className="services-grid container">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="card-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="card-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button className="card-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="gallery-section" ref={el => sections.current.gallery = el}>
          <div className="section-header">
            <h2>Our Facility Gallery</h2>
            <p>Explore our modern healthcare environment</p>
          </div>
          
          <div className="gallery-container">
            <button className="gallery-nav prev" onClick={handlePrevious}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            <div className="gallery-slider">
              {photos.map((photo, index) => (
                <div 
                  className={`slide ${index === currentPhotoIndex ? 'active' : ''}`} 
                  key={index}
                >
                  <img 
                    src={photo.src} 
                    alt={photo.alt} 
                    loading={index === currentPhotoIndex ? 'eager' : 'lazy'}
                    onLoad={() => handleImageLoad(`gallery-${index}`)}
                    className={loadedImages[`gallery-${index}`] ? 'loaded' : ''}
                  />
                </div>
              ))}
            </div>
            
            <button className="gallery-nav next" onClick={handleNext}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            
            <div className="gallery-dots">
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section" ref={el => sections.current.contact = el}>
          <div className="section-header">
            <h2>Contact Our Team</h2>
            <p>We're here to help and answer any questions</p>
          </div>
          
          <div className="contact-container container">
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <h3>Location</h3>
                <address>
                  <p>123 Medical Drive, Health District</p>
                  <p>Wolaita Sodo, Ethiopia</p>
                </address>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <h3>Phone</h3>
                <address>
                  <p><a href="tel:+251951217455">+251 951 217 455</a></p>
                  <p>Emergency: <a href="tel:+251911234567">+251 911 234 567</a></p>
                </address>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <h3>Email</h3>
                <address>
                  <p><a href="mailto:info@hospital.com">info@hospital.com</a></p>
                  <p><a href="mailto:support@hospital.com">support@hospital.com</a></p>
                </address>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <h3>Working Hours</h3>
                <p>Mon-Fri: 8:00 AM - 8:00 PM</p>
                <p>Sat-Sun: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!formErrors.firstName}
                  />
                  {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!formErrors.email}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!formErrors.phone}
                  />
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={formStatus.submitting}
              >
                {formStatus.submitting ? (
                    <div className="button-content">
                      <span className="spinner" />
                      <span>Sending...</span>
                    </div>
                ) : (
                    <div className="button-content">
                      <span>Send Message</span>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </div>
                )}
              </button>
              
              {formStatus.success && (
                <div className="form-success" role="alert">
                  Message sent successfully! We'll contact you soon.
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Location Section */}
        <section className="location-section" ref={el => sections.current.location = el}>
          <div className="map-container container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125767.27907074314!2d37.70610216806948!3d6.836573568139806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b34cf133911911%3A0x78d394392b92912f!2sWolaita%20Sodo%20University!5e0!3m2!1sen!2set!4v1637920246969!5m2!1sen!2set"
              title="Hospital Location"
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-container container">
          <div className="footer-main">
            <div className="footer-about">
              <div className="footer-logo" onClick={() => navigate('/')}>
                <img src="/logo.png" alt="Hospital Logo" />
                <span>MediCare Hospital</span>
              </div>
              <p>
                Providing exceptional healthcare services with compassion and 
                cutting-edge technology since 2010.
              </p>
              <div className="social-links">
                <a href="https://t.me/@abrehamonly" aria-label="Telegram"><FontAwesomeIcon icon={faTelegramPlane} /></a>
                <a href="https://twitter.com/@abrehamonly" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="https://www.instagram.com/" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="https://www.facebook.com/" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="https://wa.me/251951217455" aria-label="WhatsApp"><FontAwesomeIcon icon={faWhatsapp} /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><button onClick={() => scrollToSection('home')}>Home</button></li>
                <li><button onClick={() => scrollToSection('services')}>Services</button></li>
                <li><button onClick={() => scrollToSection('gallery')}>Gallery</button></li>
                <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
              </ul>
            </div>
            
            <div className="footer-services">
              <h3>Our Services</h3>
              <ul>
                {services.slice(0, 5).map((service, index) => (
                  <li key={index}>
                    <button onClick={() => scrollToSection('services')}>{service.title}</button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-contact">
              <h3>Contact Info</h3>
              <address>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Medical Drive, Wolaita Sodo</p>
                <p><FontAwesomeIcon icon={faPhone} /> <a href="tel:+251951217455">+251 951 217 455</a></p>
                <p><FontAwesomeIcon icon={faEnvelope} /> <a href="mailto:info@hospital.com">info@hospital.com</a></p>
              </address>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
            <div className="legal-links">
              <button>Privacy Policy</button>
              <button>Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      <ChatBoard isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {notification.isVisible && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      )}
    </div>
  );
};

export default HomePage;