// import React from 'react';
// import {Computer, Network, Settings, ChevronRight, ArrowLeft} from 'lucide-react';
// import {useNavigate} from 'react-router-dom';
// import RatingReviews from './RatingReviews';
// import '../../styles/TechnicianProfile.css';
//
// const TechnicianProfile = ({ technicianId = "tech-1", user }) => {
//     const navigate = useNavigate();
//     // Mock technician data - replace with props or API call
//     const technician = {
//         id: technicianId,
//         name: "Alex Morgan",
//         title: "Expert Technician",
//         experience: "5 years of experience",
//         avatar: "/api/placeholder/120/120",
//         about: "Alex is a highly skilled technician with over 5 years of experience in the field. He specializes in computer repair, network troubleshooting, and software installation. Alex is known for his professionalism, attention to detail, and excellent customer service. He is committed to providing efficient and effective solutions to meet his clients' needs.",
//         expertise: [
//             {
//                 icon: Computer,
//                 title: "Computer Repair",
//                 description: "Hardware and software diagnostics and repairs"
//             },
//             {
//                 icon: Network,
//                 title: "Network Troubleshooting",
//                 description: "Network setup and connectivity issue resolution"
//             },
//             {
//                 icon: Settings,
//                 title: "Software Installation",
//                 description: "Operating systems and application installations"
//             }
//         ]
//     };
//
//     return (
//         <div className="profile-container">
//             {/* Breadcrumb */}
//             <nav className="breadcrumb">
//                 <button className="back-button" onClick={() => navigate(-1)}> {/*Takes back to last page*/}
//                     <ArrowLeft size={20} />
//                     Back to Results
//                 </button>
//             </nav>
//
//             <div className="profile-header">
//                 {/* Profile Card and Book Appointment Button */}
//                 <div className="profile-info">
//                     <img
//                         src={technician.avatar}
//                         alt={technician.name}
//                         className="profile-avatar"
//                     />
//                     <div className="profile-details">
//                         <h1>{technician.name}</h1>
//                         <p className="profile-title">{technician.title}</p>
//                         <p className="profile-experience">{technician.experience}</p>
//                     </div>
//                 </div>
//
//                 <button className="book-button" onClick={() => navigate("/BookingDetail")}>
//                     Book Appointment
//                 </button>
//             </div>
//
//             {/* Main Content Sections */}
//             <div className="profile-content">
//                 {/* About Section */}
//                 <div className="content-section">
//                     <h3 className="content-title">About {technician.name.split(' ')[0]}</h3>
//                     <p className="about-text">{technician.about}</p>
//                 </div>
//
//                 {/* Expertise Section */}
//                 <div className="content-section">
//                     <h3 className="content-title">Expertise</h3>
//                     <div className="expertise-grid">
//                         {technician.expertise.map((skill, index) => (
//                             <div key={index} className="expertise-card">
//                                 <div className="expertise-icon">
//                                     <skill.icon size={24} />
//                                 </div>
//                                 <div className="expertise-content">
//                                     <h4>{skill.title}</h4>
//                                     <p>{skill.description}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Reviews Section */}
//                 <div className="content-section">
//                     <h3 className="content-title">Reviews</h3>
//                     <RatingReviews technicianId={technician.id} user={user} />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default TechnicianProfile;

import React, { useState, useEffect } from 'react';
import { Computer, Network, Settings, ChevronRight, ArrowLeft, Star, Shield, Phone, MapPin, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackHeader from "../../Components/layout/BackHeader.jsx";
import RatingReviews from './RatingReviews';
import '../../styles/TechnicianProfile.css';

const TechnicianProfile = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get technician email from navigation state
    const technicianEmail = location.state?.technicianEmail;
    const fallbackTechnicianData = location.state?.technicianData;

    // Image URL helper function
    const getProfileImageUrl = (dbPath) => {
        if (!dbPath) return null;
        const cleanPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath;
        return `http://localhost:8080/${cleanPath}`;
    };

    // Parse services from string format
    const parseServices = (serviceString) => {
        if (!serviceString) return [];

        try {
            // Remove brackets and split by comma
            const cleanString = serviceString.replace(/[\[\]]/g, '');
            return cleanString.split(',').map(service => service.trim()).filter(service => service.length > 0);
        } catch (error) {
            return [serviceString];
        }
    };

    // Generate expertise cards from services
    const generateExpertiseCards = (services) => {
        const iconMap = {
            'Plumbing': Network,
            'Electrical': Computer,
            'HVAC': Settings,
            'Carpentry': Settings,
            'default': Settings
        };

        return services.map((service, index) => ({
            icon: iconMap[service] || iconMap.default,
            title: service,
            description: `Professional ${service.toLowerCase()} services and repairs`
        }));
    };

    // Fetch technician profile data
    useEffect(() => {
        const fetchTechnicianProfile = async () => {
            if (!technicianEmail) {
                if (fallbackTechnicianData) {
                    // Use fallback data if no email but we have technician data
                    setTechnician({
                        technicianName: fallbackTechnicianData.technicianName,
                        technicianEmail: fallbackTechnicianData.technicianEmail,
                        technicianPhone: fallbackTechnicianData.technicianPhone,
                        technicianAddress: fallbackTechnicianData.technicianAddress,
                        profileImagePath: fallbackTechnicianData.imageFile,
                        technicianBio: fallbackTechnicianData.technicianBio,
                        technicianRating: 4.8,
                        serviceName: fallbackTechnicianData.serviceName
                    });
                    setLoading(false);
                } else {
                    setError('No technician information provided');
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/users/get-technician-profile?email=${encodeURIComponent(technicianEmail)}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Technician not found');
                    } else if (response.status === 401) {
                        throw new Error('Please log in to view technician profile');
                    } else if (response.status === 500) {
                        throw new Error('Server error. Please try again later.');
                    }
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const technicianData = await response.json();
                setTechnician(technicianData);

            } catch (error) {
                console.error('Error fetching technician profile:', error);
                setError(error.message);

                // Use fallback data if API fails and we have it
                if (fallbackTechnicianData) {
                    setTechnician({
                        technicianName: fallbackTechnicianData.technicianName,
                        technicianEmail: fallbackTechnicianData.technicianEmail,
                        technicianPhone: fallbackTechnicianData.technicianPhone,
                        technicianAddress: fallbackTechnicianData.technicianAddress,
                        profileImagePath: fallbackTechnicianData.imageFile,
                        technicianBio: fallbackTechnicianData.technicianBio,
                        technicianRating: 4.8,
                        serviceName: fallbackTechnicianData.serviceName
                    });
                    setError(null); // Clear error since we have fallback data
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicianProfile();
    }, [technicianEmail, fallbackTechnicianData]);

    const handleBookAppointment = () => {
        if (technician) {
            navigate("/BookingDetail", {
                state: {
                    technician: {
                        techId: technician.techId || Date.now(), // Fallback ID
                        technicianName: technician.technicianName,
                        serviceName: technician.serviceName,
                        technicianPhone: technician.technicianPhone,
                        technicianAddress: technician.technicianAddress,
                        technicianBio: technician.technicianBio,
                        imageFile: technician.profileImagePath,
                        feeCharge: technician.feeCharge || '500',
                        technicianEmail: technician.technicianEmail
                    }
                }
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div>
                <BackHeader />
            <div className="profile-container">

                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading technician profile...</p>
                </div>
            </div>
            </div>
        );
    }

    // Error state
    if (error && !technician) {
        return (
            <div>
                <BackHeader />

            <div className="profile-container">

                <div className="error-container">
                    <h3>⚠️ {error}</h3>
                    <p>Unable to load technician profile. Please try again later.</p>
                    {error.includes('log in') && (
                        <button
                            onClick={() => navigate('/LoginSignup')}
                            className="login-button"
                        >
                            Go to Login
                        </button>
                    )}
                </div>
            </div>
            </div>
        );
    }

    // No technician data
    if (!technician) {
        return (
            <div className="profile-container">
                <nav className="breadcrumb">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        Back to Results
                    </button>
                </nav>
                <div className="error-container">
                    <h3>No technician information available</h3>
                    <p>Please select a technician from the listing page.</p>
                </div>
            </div>
        );
    }

    const services = parseServices(technician.serviceName);
    const expertiseCards = generateExpertiseCards(services);

    return (
        <div className="profile-container">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back to Results
                </button>
            </nav>

            <div className="profile-header">
                {/* Profile Card and Book Appointment Button */}
                <div className="profile-info">
                    <div className="profile-avatar-container">
                        {technician.profileImagePath ? (
                            <img
                                src={getProfileImageUrl(technician.profileImagePath)}
                                alt={technician.technicianName}
                                className="profile-avatar"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className="profile-avatar profile-avatar-placeholder"
                            style={{ display: technician.profileImagePath ? 'none' : 'flex' }}
                        >
                            {technician.technicianName?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="profile-details">
                        <h1>{technician.technicianName}</h1>
                        <p className="profile-title">Expert Technician</p>
                        <div className="profile-rating">
                            <Star size={16} fill="currentColor" className="star-filled" />
                            <span>{technician.technicianRating || '4.8'}</span>
                            <span className="rating-text">Professional Rating</span>
                        </div>
                        <div className="profile-contact-info">
                            <div className="contact-item">
                                <Phone size={14} />
                                <span>{technician.technicianPhone}</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={14} />
                                <span>{technician.technicianAddress}</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={14} />
                                <span>{technician.technicianEmail}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="book-button" onClick={handleBookAppointment}>
                    Book Appointment
                </button>
            </div>

            {/* Main Content Sections */}
            <div className="profile-content">
                {/* About Section */}
                <div className="content-section">
                    <h3 className="content-title">About {technician.technicianName?.split(' ')[0]}</h3>
                    <p className="about-text">
                        {technician.technicianBio ||
                            `${technician.technicianName} is a professional technician specializing in ${services.join(', ')}. ` +
                            `They are committed to providing high-quality service and customer satisfaction.`}
                    </p>
                </div>

                {/* Services Section */}
                <div className="content-section">
                    <h3 className="content-title">Services Offered</h3>
                    <div className="services-list">
                        {services.map((service, index) => (
                            <div key={index} className="service-item">
                                <Shield size={16} className="service-icon" />
                                <span>{service}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expertise Section */}
                <div className="content-section">
                    <h3 className="content-title">Expertise</h3>
                    <div className="expertise-grid">
                        {expertiseCards.map((skill, index) => (
                            <div key={index} className="expertise-card">
                                <div className="expertise-icon">
                                    <skill.icon size={24} />
                                </div>
                                <div className="expertise-content">
                                    <h4>{skill.title}</h4>
                                    <p>{skill.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="content-section">
                    <h3 className="content-title">Reviews</h3>
                    <RatingReviews
                        technicianId={technician.techId || technician.technicianEmail}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
};

export default TechnicianProfile;