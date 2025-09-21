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
import {useNavigate} from "react-router-dom";
import styles from "../../styles/AboutUs.module.css";
import Header from "../../Components/layout/Header.jsx";
import Footer from "../../Components/layout/Footer.jsx";

function AboutUs() {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

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
            <div className={styles['about-page']}>
                {/* Hero Section */}
                <section className={styles['about-hero']}>
                    <div className={styles['background-pattern']}></div>
                    <div className={styles['about-hero-container']}>
                        <div className={styles['about-hero-content']}>
                            <h1 className={styles['about-hero-title']}>
                                About <span className={styles.highlight}>QuestX</span>
                            </h1>
                            <p className={styles['about-hero-subtitle']}>
                                Connecting Nepal's skilled professionals with customers who need them most
                            </p>
                            <p className={styles['about-hero-description']}>
                                QuestX is Nepal's leading platform for booking verified technicians and service professionals.
                                We're bridging the gap between skilled workers and customers, making quality services
                                accessible, affordable, and reliable across the Kathmandu Valley.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission, Vision, Values */}
                <section className={styles['mission-section']}>
                    <div className={styles.container}>
                        <div className={styles['mission-grid']}>
                            <div className={styles['mission-card']}>
                                <div className={styles['mission-icon']}>
                                    <Target size={32} />
                                </div>
                                <h3>Our Mission</h3>
                                <p>
                                    To empower skilled technicians with economic opportunities while providing customers
                                    with reliable, high-quality services at fair prices. We're building a trusted
                                    marketplace that benefits everyone in Nepal's service economy.
                                </p>
                            </div>

                            <div className={styles['mission-card']}>
                                <div className={styles['mission-icon']}>
                                    <Eye size={32} />
                                </div>
                                <h3>Our Vision</h3>
                                <p>
                                    To become Nepal's most trusted platform for home and business services,
                                    expanding across the country and setting new standards for quality,
                                    reliability, and customer satisfaction in the service industry.
                                </p>
                            </div>

                            <div className={styles['mission-card']}>
                                <div className={styles['mission-icon']}>
                                    <Users size={32} />
                                </div>
                                <h3>Our Values</h3>
                                <p>
                                    Trust, transparency and community drive everything we do. We believe in
                                    fair opportunities for technicians, honest pricing for customers, and
                                    building lasting relationships based on mutual respect and quality service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className={styles['stats-section']}>
                    <div className={styles.container}>
                        <h2 className={styles['section-title']}>QuestX by the Numbers</h2>
                        <div className={styles['stats-grid']}>
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className={styles['stat-item']}>
                                        <Icon className={styles['stat-icon']} size={24} />
                                        <div className={styles['stat-number']}>{stat.number}</div>
                                        <div className={styles['stat-label']}>{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className={styles['how-it-works-section']}>
                    <div className={styles.container}>
                        <h2 className={styles['section-title']}>How QuestX Works</h2>
                        <p className={styles['section-subtitle']}>
                            Simple, transparent, and designed for your convenience
                        </p>

                        <div className={styles['steps-container']}>
                            {howItWorksSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`${styles['step-card']} ${activeStep === index ? styles.active : ''}`}
                                        onMouseEnter={() => setActiveStep(index)}
                                    >
                                        <div className={`${styles['step-number']} ${styles[step.color]}`}>
                                            {index + 1}
                                        </div>
                                        <div className={`${styles['step-icon']} ${styles[step.color]}`}>
                                            <Icon size={24} />
                                        </div>
                                        <h3 className={styles['step-title']}>{step.title}</h3>
                                        <p className={styles['step-description']}>{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className={styles['values-section']}>
                    <div className={styles.container}>
                        <h2 className={styles['section-title']}>What Makes QuestX Different</h2>
                        <div className={styles['values-grid']}>
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <div key={index} className={styles['value-card']}>
                                        <div className={`${styles['value-icon']} ${styles[value.color]}`}>
                                            <Icon size={28} />
                                        </div>
                                        <h3 className={styles['value-title']}>{value.title}</h3>
                                        <p className={styles['value-description']}>{value.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Platform Features */}
                <section className={styles['features-section']}>
                    <div className={styles.container}>
                        <h2 className={styles['section-title']}>Platform Features</h2>
                        <div className={styles['features-grid']}>
                            <div className={styles['feature-group']}>
                                <h3 className={styles['feature-group-title']}>For Customers</h3>
                                <div className={styles['feature-list']}>
                                    <div className={styles['feature-item']}>
                                        <Search size={20} />
                                        <span>Advanced search and filtering by service, location, price, and ratings</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <Star size={20} />
                                        <span>Genuine customer reviews and ratings for every technician</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <Shield size={20} />
                                        <span>Verified technicians with proper documentation and background checks</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <Clock size={20} />
                                        <span>Flexible scheduling with real-time availability</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <DollarSign size={20} />
                                        <span>Transparent pricing with no hidden fees</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles['feature-group']}>
                                <h3 className={styles['feature-group-title']}>For Technicians</h3>
                                <div className={styles['feature-list']}>
                                    <div className={styles['feature-item']}>
                                        <UserCheck size={20} />
                                        <span>Professional verification with working license validation</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <TrendingUp size={20} />
                                        <span>Flexible earning opportunities with competitive rates</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <Award size={20} />
                                        <span>Build your reputation through customer reviews and ratings</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <Settings size={20} />
                                        <span>Comprehensive admin management and support system</span>
                                    </div>
                                    <div className={styles['feature-item']}>
                                        <MapPin size={20} />
                                        <span>Location-based job matching for optimal convenience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className={styles['team-section']}>
                    <div className={styles.container}>
                        <h2 className={styles['section-title']}>Meet Our Team</h2>
                        <p className={styles['section-subtitle']}>
                            The passionate people building the future of Nepal's service economy
                        </p>

                        <div className={styles['team-grid']}>
                            {teamMembers.map((member, index) => (
                                <div key={index} className={styles['team-card']}>
                                    <div className={styles['team-avatar']}>
                                        {member.image}
                                    </div>
                                    <h3 className={styles['team-name']}>{member.name}</h3>
                                    <div className={styles['team-role']}>{member.role}</div>
                                    <p className={styles['team-description']}>{member.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles['about-cta-section']}>
                    <div className={styles['about-cta-container']}>
                        <h2 className={styles['about-cta-title']}>Ready to Experience QuestX?</h2>
                        <p className={styles['about-cta-description']}>
                            Join thousands of satisfied customers who trust QuestX for their service needs,
                            or become a verified technician and grow your business with us.
                        </p>
                        <div className={styles['about-cta-buttons']}>
                            <button className={styles['btn-primary']} onClick={() => navigate("/FindServices")}>Find a Technician</button>
                            <button className={styles['btn-secondary']} onClick={() => navigate("/LoginSignup", {state: {role: "technician"}})}>Become a Technician</button>
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
        </div>
    );
}

export default AboutUs;