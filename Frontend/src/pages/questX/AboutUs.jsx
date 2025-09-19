import React, { useState } from "react";
import {
    Users,
    Target,
    Eye,
    Shield,
    Star,
    MapPin,
    Search,
    Filter,
    CheckCircle,
    Award,
    Clock,
    DollarSign,
    UserCheck,
    Settings,
    TrendingUp,
    Heart
} from 'lucide-react';
import "../../styles/AboutUs.css";
import Header from "../../Components/layout/Header.jsx";

function AboutUs() {
    const [activeStep, setActiveStep] = useState(0);

    const teamMembers = [
        {
            name: "Pragya Gurung",
            role: "Design & Documentation",
            description: "BCA 5th semester student at OCEM. Ensures every job meets QuestX standards.",

        },
        {
            name: "Kripsan Thakuri",
            role: "Frontend",
            description: "BCA 5th semester student at OCEM. Passionate about connecting communities through technology.",

        },
        {
            name: "Bikram BK",
            role: "Backend",
            description: "BCA 5th semester student at OCEM. Previously built tech solutions for major Nepali companies.",

        }
    ];

    const stats = [
        { number: "1000+", label: "Happy Customers", icon: Users },
        { number: "100+", label: "Verified Technicians", icon: UserCheck },
        { number: "1500+", label: "Jobs Completed", icon: CheckCircle },
        { number: "4.8/5", label: "Average Rating", icon: Star },
        { number: "3 Cities", label: "Currently Serving", icon: MapPin },
        { number: "24/7", label: "Customer Support", icon: Clock }
    ];

    const howItWorksSteps = [
        {
            title: "Search & Filter",
            description: "Find technicians by service type, location, price range and customer reviews. Our smart filters help you find the perfect match.",
            icon: Search,
            color: "blue"
        },
        {
            title: "Compare & Choose",
            description: "View detailed profiles, read genuine reviews, compare prices and check availability. Make informed decisions with complete transparency.",
            icon: Filter,
            color: "green"
        },
        {
            title: "Book Instantly",
            description: "Schedule your service with just a few clicks. Choose your preferred time slot and get instant confirmation.",
            icon: CheckCircle,
            color: "purple"
        },
        {
            title: "Quality Assured",
            description: "All our technicians are verified professionals. Enjoy peace of mind with our quality guarantee and customer protection.",
            icon: Shield,
            color: "orange"
        }
    ];

    const values = [
        {
            title: "Trust & Safety",
            description: "Every technician is thoroughly verified with proper documentation and background checks. Your safety is our priority.",
            icon: Shield,
            color: "red"
        },
        {
            title: "Quality Excellence",
            description: "We maintain high standards through continuous monitoring, customer feedback and regular quality assessments.",
            icon: Award,
            color: "yellow"
        },
        {
            title: "Fair Pricing",
            description: "Transparent pricing with no hidden fees. Technicians set competitive rates and you always know what you'll pay upfront.",
            icon: DollarSign,
            color: "green"
        },
        {
            title: "Customer First",
            description: "Your satisfaction drives everything we do. From platform design to customer support, you're at the center of our decisions.",
            icon: Heart,
            color: "pink"
        }
    ];

    return (
        <div>
            <Header />
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="background-pattern"></div>
                <div className="about-hero-container">
                    <div className="about-hero-content">
                        <h1 className="about-hero-title">
                            About <span className="highlight">QuestX</span>
                        </h1>
                        <p className="about-hero-subtitle">
                            Connecting Nepal's skilled professionals with customers who need them most
                        </p>
                        <p className="about-hero-description">
                            QuestX is Nepal's leading platform for booking verified technicians and service professionals.
                            We're bridging the gap between skilled workers and customers, making quality services
                            accessible, affordable, and reliable across the Kathmandu Valley.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="mission-section">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-card">
                            <div className="mission-icon">
                                <Target size={32} />
                            </div>
                            <h3>Our Mission</h3>
                            <p>
                                To empower skilled technicians with economic opportunities while providing customers
                                with reliable, high-quality services at fair prices. We're building a trusted
                                marketplace that benefits everyone in Nepal's service economy.
                            </p>
                        </div>

                        <div className="mission-card">
                            <div className="mission-icon">
                                <Eye size={32} />
                            </div>
                            <h3>Our Vision</h3>
                            <p>
                                To become Nepal's most trusted platform for home and business services,
                                expanding across the country and setting new standards for quality,
                                reliability, and customer satisfaction in the service industry.
                            </p>
                        </div>

                        <div className="mission-card">
                            <div className="mission-icon">
                                <Users size={32} />
                            </div>
                            <h3>Our Values</h3>
                            <p>
                                Trust, transparency, and community drive everything we do. We believe in
                                fair opportunities for technicians, honest pricing for customers, and
                                building lasting relationships based on mutual respect and quality service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <h2 className="section-title">QuestX by the Numbers</h2>
                    <div className="stats-grid">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="stat-item">
                                    <Icon className="stat-icon" size={24} />
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How QuestX Works</h2>
                    <p className="section-subtitle">
                        Simple, transparent, and designed for your convenience
                    </p>

                    <div className="steps-container">
                        {howItWorksSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`step-card ${activeStep === index ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveStep(index)}
                                >
                                    <div className={`step-number ${step.color}`}>
                                        {index + 1}
                                    </div>
                                    <div className={`step-icon ${step.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <h2 className="section-title">What Makes QuestX Different</h2>
                    <div className="values-grid">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="value-card">
                                    <div className={`value-icon ${value.color}`}>
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="value-title">{value.title}</h3>
                                    <p className="value-description">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Platform Features</h2>
                    <div className="features-grid">
                        <div className="feature-group">
                            <h3 className="feature-group-title">For Customers</h3>
                            <div className="feature-list">
                                <div className="feature-item">
                                    <Search size={20} />
                                    <span>Advanced search and filtering by service, location, price, and ratings</span>
                                </div>
                                <div className="feature-item">
                                    <Star size={20} />
                                    <span>Genuine customer reviews and ratings for every technician</span>
                                </div>
                                <div className="feature-item">
                                    <Shield size={20} />
                                    <span>Verified technicians with proper documentation and background checks</span>
                                </div>
                                <div className="feature-item">
                                    <Clock size={20} />
                                    <span>Flexible scheduling with real-time availability</span>
                                </div>
                                <div className="feature-item">
                                    <DollarSign size={20} />
                                    <span>Transparent pricing with no hidden fees</span>
                                </div>
                            </div>
                        </div>

                        <div className="feature-group">
                            <h3 className="feature-group-title">For Technicians</h3>
                            <div className="feature-list">
                                <div className="feature-item">
                                    <UserCheck size={20} />
                                    <span>Professional verification with working license validation</span>
                                </div>
                                <div className="feature-item">
                                    <TrendingUp size={20} />
                                    <span>Flexible earning opportunities with competitive rates</span>
                                </div>
                                <div className="feature-item">
                                    <Award size={20} />
                                    <span>Build your reputation through customer reviews and ratings</span>
                                </div>
                                <div className="feature-item">
                                    <Settings size={20} />
                                    <span>Comprehensive admin management and support system</span>
                                </div>
                                <div className="feature-item">
                                    <MapPin size={20} />
                                    <span>Location-based job matching for optimal convenience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">
                        The passionate people building the future of Nepal's service economy
                    </p>

                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-card">
                                <div className="team-avatar">
                                    {member.image}
                                </div>
                                <h3 className="team-name">{member.name}</h3>
                                <div className="team-role">{member.role}</div>
                                <p className="team-description">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta-section">
                <div className="about-cta-container">
                    <h2 className="about-cta-title">Ready to Experience QuestX?</h2>
                    <p className="about-cta-description">
                        Join thousands of satisfied customers who trust QuestX for their service needs,
                        or become a verified technician and grow your business with us.
                    </p>
                    <div className="about-cta-buttons">
                        <button className="btn-primary">Find a Technician</button>
                        <button className="btn-secondary">Become a Technician</button>
                    </div>
                </div>
            </section>
        </div>
        </div>
    );
}

export default AboutUs;