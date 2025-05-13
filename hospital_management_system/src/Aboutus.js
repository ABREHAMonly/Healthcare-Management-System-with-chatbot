import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faChevronLeft, 
  faChevronRight,
  faHeartbeat,
  faHandHoldingMedical,
  faHospital
} from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const navigate = useNavigate();

    // Image paths - ensure these match your actual image files in the public folder
    const photos = [
        '/photo1.jpg',
        '/photo2.jpg',
        '/photo3.jpg',
        '/photo4.jpg',
        '/photo5.jpg',
        '/photo6.jpg',
    ];

    const teamMembers = [
        {
            name: "Abreham Yetwale",
            role: "General Doctor & Co-founder",
            image: "/abreham.jpg",
            bio: "Specialized in internal medicine with 10+ years of clinical experience."
        },
        {
            name: "Tewodross Misganaw",
            role: "Chief Medical Officer",
            image: "/teddy.jpg",
            bio: "Expert in healthcare administration and patient care optimization."
        },
        {
            name: "Sumeya Kedir",
            role: "Head of Technology",
            image: "/Sumeya.jpg",
            bio: "Leads our digital transformation with 8 years of health tech experience."
        }
    ];

    // Preload images for better user experience
    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = [
                ...photos,
                '/mission.png',
                '/values.png',
                '/services.png',
                '/logo.png',
                ...teamMembers.map(member => member.image)
            ].map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            });

            try {
                await Promise.all(imagePromises);
                setImagesLoaded(true);
                setTimeout(() => setIsLoading(false), 500); // Optional delay for loading spinner
            } catch (error) {
                console.error("Error loading images:", error);
                setIsLoading(false);
            }
        };

        loadImages();
    }, []);

    // Auto-rotate gallery images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [photos.length]);

    const handlePrevious = () => {
        setCurrentPhotoIndex((prevIndex) => 
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentPhotoIndex((prevIndex) => 
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleGoBack = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading About Us...</p>
                <style jsx>{`
                    .loading-screen {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f8f9fa;
                    }
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 5px solid #e0f7fa;
                        border-top-color: #0f9499;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .loading-screen p {
                        color: #066b6e;
                        font-size: 1.2rem;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className='about-page'>
            <style jsx>{`
                :root {
                    --primary: #0f9499;
                    --primary-dark: #066b6e;
                    --primary-light: #e0f7fa;
                    --secondary: #f8f9fa;
                    --accent: #ff7043;
                    --dark: #333;
                    --light: #fff;
                    --gray: #6c757d;
                    --light-gray: #f1f1f1;
                    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
                    --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
                    --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
                    --transition: all 0.3s ease;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: var(--dark);
                    background-color: var(--light);
                }

                .about-page {
                    background-color: var(--secondary);
                    position: relative;
                    overflow-x: hidden;
                }

                .back-icon {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    cursor: pointer;
                    font-size: 1.5rem;
                    color: var(--light);
                    background-color: var(--primary);
                    padding: 12px;
                    border-radius: 50%;
                    transition: var(--transition);
                    z-index: 100;
                    box-shadow: var(--shadow-sm);
                }

                .back-icon:hover {
                    background-color: var(--primary-dark);
                    transform: scale(1.1);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .about-title {
                    text-align: center;
                    padding: 80px 0 40px;
                    position: relative;
                }

                .about-title h1 {
                    font-size: 2.8rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin-bottom: 15px;
                    animation: fadeInUp 0.8s ease;
                }

                .subtitle {
                    font-size: 1.2rem;
                    color: var(--gray);
                    max-width: 700px;
                    margin: 0 auto 30px;
                    padding: 0 20px;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .about-section {
                    display: flex;
                    align-items: center;
                    margin: 60px 0;
                    padding: 40px;
                    background-color: var(--light);
                    border-radius: 15px;
                    box-shadow: var(--shadow-sm);
                    transition: var(--transition);
                    position: relative;
                    overflow: hidden;
                }

                .about-section:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-md);
                }

                .about-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 5px;
                    height: 100%;
                    background-color: var(--primary);
                }

                .content {
                    flex: 1;
                    padding: 20px;
                }

                .image-container {
                    flex: 1;
                    text-align: center;
                    padding: 20px;
                }
                    
                .image-container img{
                opacity: 1;
                }

                .section-image {
                    max-width: 100%;
                    height: auto;
                    max-height: 400px;
                    border-radius: 10px;
                    box-shadow: var(--shadow-md);
                    transition: var(--transition);
                    object-fit: cover;
                }

                .section-image:hover {
                    transform: scale(1.02);
                }

                .section-icon {
                    font-size: 2.5rem;
                    color: var(--primary);
                    margin-bottom: 20px;
                }

                .icon-container {
                    display: inline-block;
                    padding: 15px;
                    background-color: var(--primary-light);
                    border-radius: 50%;
                    margin-bottom: 20px;
                }

                h2 {
                    font-size: 2rem;
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                    position: relative;
                }

                h2::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    width: 60px;
                    height: 3px;
                    background-color: var(--primary);
                }

                .values-list {
                    list-style: none;
                }

                .values-list li {
                    margin-bottom: 15px;
                    padding-left: 25px;
                    position: relative;
                    font-size: 1.05rem;
                }

                .values-list li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--primary);
                    font-weight: bold;
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }

                .service-item {
                    background-color: var(--primary-light);
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 600;
                    color: var(--primary-dark);
                    transition: var(--transition);
                    font-size: 0.95rem;
                }

                .service-item:hover {
                    background-color: var(--primary);
                    color: var(--light);
                    transform: translateY(-3px);
                }

                .gallery-section {
                    text-align: center;
                    margin: 80px 0;
                    padding: 40px 0;
                }

                .gallery-section p {
                    max-width: 600px;
                    margin: 0 auto 30px;
                    color: var(--gray);
                }

                .photo-viewer {
                    position: relative;
                    max-width: 800px;
                    margin: 0 auto;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                }
                .photo-viewer img{
                opacity: 1;
                }

                .photo-container {
                    height: 450px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--light-gray);
                }

                .current-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.5s ease;
                }

                .nav-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    background-color: rgba(255, 255, 255, 0.8);
                    border: none;
                    border-radius: 50%;
                    color: var(--primary);
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }

                .nav-button:hover {
                    background-color: var(--light);
                    color: var(--primary-dark);
                    transform: translateY(-50%) scale(1.1);
                }

                .prev {
                    left: 20px;
                }

                .next {
                    right: 20px;
                }

                .photo-indicators {
                    position: absolute;
                    bottom: 20px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    z-index: 10;
                }

                .indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.5);
                    border: none;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .indicator.active {
                    background-color: var(--light);
                    transform: scale(1.2);
                }

                .team-section {
                    text-align: center;
                    margin: 80px 0;
                }

                .team-section p {
                    max-width: 600px;
                    margin: 0 auto 40px;
                    color: var(--gray);
                }

                .team-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 30px;
                    margin-top: 40px;
                }

                .team-card {
                    background-color: var(--light);
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                    transition: var(--transition);
                    text-align: center;
                }

                .team-card:hover {
                    transform: translateY(-10px);
                    box-shadow: var(--shadow-lg);
                }

                .card-image {
                    height: 300px;
                    overflow: hidden;
                }

                .card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: var(--transition);
                    opacity: 1;
                }

                .team-card:hover .card-image img {
                    transform: scale(1.05);
                }

                .card-content {
                    padding: 25px;
                }

                .card-content h3 {
                    color: var(--primary-dark);
                    margin-bottom: 5px;
                    font-size: 1.4rem;
                }

                .role {
                    color: var(--primary);
                    font-weight: 600;
                    margin-bottom: 15px;
                    font-size: 1rem;
                }

                .bio {
                    color: var(--gray);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .stats-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 30px;
                    margin: 80px 0;
                    text-align: center;
                }

                .stat-item {
                    background-color: var(--light);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: var(--shadow-sm);
                    transition: var(--transition);
                }

                .stat-item:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-md);
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin-bottom: 10px;
                }

                .stat-label {
                    color: var(--gray);
                    font-size: 1.1rem;
                }

                .about-footer {
                    background-color: var(--primary-dark);
                    color: var(--light);
                    padding: 50px 0;
                    margin-top: 80px;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 15px;

                }

                .footer-logo img {
                    height: 50px;
                    width: auto;
                    opacity: 1; 

                }

                .footer-logo span {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .footer-links {
                    display: flex;
                    gap: 30px;
                }

                .footer-links a {
                    color: var(--light);
                    text-decoration: none;
                    transition: var(--transition);
                    font-size: 1rem;
                }

                .footer-links a:hover {
                    color: var(--primary-light);
                    text-decoration: underline;
                }

                .footer-copyright {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                }

                /* Responsive Design */
                @media (max-width: 992px) {
                    .about-section {
                        flex-direction: column;
                        text-align: center;
                    }

                    .content, .image-container {
                        padding: 20px 0;
                    }

                    h2::after {
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    .about-title h1 {
                        font-size: 2.4rem;
                    }
                }

                @media (max-width: 768px) {
                    .about-title h1 {
                        font-size: 2rem;
                    }

                    .about-section {
                        padding: 30px 20px;
                        margin: 40px 0;
                    }

                    .photo-container {
                        height: 350px;
                    }

                    .team-grid {
                        grid-template-columns: 1fr;
                    }

                    .card-image {
                        height: 250px;
                    }

                    .footer-logo img {
                        height: 40px;
                    }
                }

                @media (max-width: 576px) {
                    .about-title {
                        padding: 60px 0 30px;
                    }

                    .about-title h1 {
                        font-size: 1.8rem;
                    }

                    .subtitle {
                        font-size: 1rem;
                    }

                    h2 {
                        font-size: 1.5rem;
                    }

                    .photo-container {
                        height: 250px;
                    }

                    .nav-button {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }

                    .stats-section {
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }

                    .stat-item {
                        padding: 20px;
                    }

                    .footer-links {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }

                    .footer-logo span {
                        font-size: 1.3rem;
                    }
                }
            `}</style>

            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className="back-icon" 
                onClick={handleGoBack}
                aria-label="Go back to homepage"
            />

            <div className="container">
            <header className="about-title">
                    <h1>About MediCare Hospital</h1>
                    <p className="subtitle">Compassionate Care, Advanced Technology</p>
                </header>

                <section className="about-section mission">
                    <div className="content">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faHeartbeat} className="section-icon" />
                        </div>
                        <h2>Our Mission</h2>
                        <p>At MediCare Hospital, we're dedicated to transforming healthcare through innovative management solutions. Our integrated platform combines cutting-edge technology with compassionate care to enhance patient outcomes and streamline hospital operations.</p>
                    </div>
                    <div className="image-container">
                        <img 
                            src="/mission.png" 
                            alt="Our mission" 
                            className="section-image"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "/placeholder.jpg"; // Fallback image
                            }}
                        />
                    </div>
                </section>

                <section className="about-section values">
                    <div className="image-container">
                        <img 
                            src="/values.png" 
                            alt="Our values" 
                            className="section-image"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "/placeholder.jpg"; // Fallback image
                            }}
                        />
                    </div>
                    <div className="content">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faHandHoldingMedical} className="section-icon" />
                        </div>
                        <h2>Our Values</h2>
                        <ul className="values-list">
                            <li><strong>Compassion:</strong> Putting patients at the heart of everything we do</li>
                            <li><strong>Excellence:</strong> Delivering the highest standard of care</li>
                            <li><strong>Innovation:</strong> Continuously improving our services</li>
                            <li><strong>Integrity:</strong> Maintaining transparency and ethical practices</li>
                        </ul>
                    </div>
                </section>

                <section className="about-section services">
                    <div className="content">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faHospital} className="section-icon" />
                        </div>
                        <h2>Our Services</h2>
                        <p>We offer comprehensive healthcare services including:</p>
                        <div className="services-grid">
                            <div className="service-item">General Medicine</div>
                            <div className="service-item">Pediatric Care</div>
                            <div className="service-item">Emergency Services</div>
                            <div className="service-item">Diagnostic Imaging</div>
                            <div className="service-item">Surgical Services</div>
                            <div className="service-item">Maternity Care</div>
                        </div>
                    </div>
                    <div className="image-container">
                        <img 
                            src="/services.png" 
                            alt="Our services" 
                            className="section-image"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "/placeholder.jpg"; // Fallback image
                            }}
                        />
                    </div>
                </section>

                <section className="gallery-section">
                    <h2>Our Facility</h2>
                    <p>Take a virtual tour of our state-of-the-art medical center</p>
                    <div className="photo-viewer">
                        <button 
                            className="nav-button prev" 
                            onClick={handlePrevious}
                            aria-label="Previous photo"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <div className="photo-container">
                            <img 
                                src={photos[currentPhotoIndex]} 
                                alt={`Hospital facility ${currentPhotoIndex + 1}`}
                                className="current-photo"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = "/placeholder.jpg"; // Fallback image
                                }}
                            />
                        </div>
                        <button 
                            className="nav-button next" 
                            onClick={handleNext}
                            aria-label="Next photo"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <div className="photo-indicators">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                    aria-label={`View photo ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="team-section">
                    <h2>Meet Our Leadership Team</h2>
                    <p>The dedicated professionals guiding our hospital's vision</p>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div className="team-card" key={index}>
                                <div className="card-image">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "/placeholder.jpg"; // Fallback image
                                        }}
                                    />
                                </div>
                                <div className="card-content">
                                    <h3>{member.name}</h3>
                                    <p className="role">{member.role}</p>
                                    <p className="bio">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="stats-section">
                    <div className="stat-item">
                        <div className="stat-number">15+</div>
                        <div className="stat-label">Years of Service</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Specialized Doctors</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">10,000+</div>
                        <div className="stat-label">Patients Annually</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Emergency Care</div>
                    </div>
                </section>
            </div>

            <footer className="about-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img 
                            src="/logo.png" 
                            alt="MediCare Hospital Logo"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "/placeholder.jpg"; // Fallback image
                            }}
                        />
                        <span>MediCare Hospital</span>
                    </div>
                    <div className="footer-links">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/contact">Contact Us</a>
                    </div>
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} MediCare Hospital. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;