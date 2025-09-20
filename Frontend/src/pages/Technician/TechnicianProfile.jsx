import React from 'react';
import { Computer, Network, Settings, ChevronRight } from 'lucide-react';
import RatingReviews from './RatingReviews';
import Header2 from "../../Components/layout/Header2.jsx";
import '../../styles/TechnicianProfile.css';

const TechnicianProfile = ({ technicianId = "tech-1", user }) => {
    // Mock technician data - replace with props or API call
    const technician = {
        id: technicianId,
        name: "Alex Morgan",
        title: "Expert Technician",
        experience: "5 years of experience",
        avatar: "/api/placeholder/120/120",
        about: "Alex is a highly skilled technician with over 5 years of experience in the field. He specializes in computer repair, network troubleshooting, and software installation. Alex is known for his professionalism, attention to detail, and excellent customer service. He is committed to providing efficient and effective solutions to meet his clients' needs.",
        expertise: [
            {
                icon: Computer,
                title: "Computer Repair",
                description: "Hardware and software diagnostics and repairs"
            },
            {
                icon: Network,
                title: "Network Troubleshooting",
                description: "Network setup and connectivity issue resolution"
            },
            {
                icon: Settings,
                title: "Software Installation",
                description: "Operating systems and application installations"
            }
        ]
    };

    return (
        <div>
            <Header2 />
        <div className="profile-container">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <span>Technicians</span>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <span className="breadcrumb-current">{technician.name}</span>
            </nav>

            <div className="profile-header">
                {/* Profile Card and Book Appointment Button */}
                <div className="profile-info">
                    <img
                        src={technician.avatar}
                        alt={technician.name}
                        className="profile-avatar"
                    />
                    <div className="profile-details">
                        <h1>{technician.name}</h1>
                        <p className="profile-title">{technician.title}</p>
                        <p className="profile-experience">{technician.experience}</p>
                    </div>
                </div>

                <button className="book-button">
                    Book Appointment
                </button>
            </div>

            {/* Main Content Sections */}
            <div className="profile-content">
                {/* About Section */}
                <div className="content-section">
                    <h3 className="content-title">About {technician.name.split(' ')[0]}</h3>
                    <p className="about-text">{technician.about}</p>
                </div>

                {/* Expertise Section */}
                <div className="content-section">
                    <h3 className="content-title">Expertise</h3>
                    <div className="expertise-grid">
                        {technician.expertise.map((skill, index) => (
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
                    <RatingReviews technicianId={technician.id} user={user} />
                </div>
            </div>
        </div>
        </div>
    );
};

export default TechnicianProfile;