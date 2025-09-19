import React, { useState } from "react";
import {
    DollarSign,
    Clock,
    Shield,
    Users,
    Star,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    FileText,
    CreditCard,
    Phone,
    Award
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Header from "../../Components/layout/Header.jsx";
import styles from "../../styles/TechnicianLandingPage.module.css";

function TechnicianLandingPage() {
    const [openFAQ, setOpenFAQ] = useState(null);
    const navigate = useNavigate();

    const perks = [
        {
            icon: DollarSign,
            title: 'Earn Good Money',
            description: 'Earn Rs. 500-2000 per hour based on your skills and service type. Top technicians make over Rs. 50,000 monthly.',
            color: 'green'
        },
        {
            icon: Clock,
            title: 'Flexible Hours',
            description: 'Work whenever you want. Choose your own schedule and take breaks when you need them.',
            color: 'blue'
        },
        {
            icon: Shield,
            title: 'Verified Customers',
            description: 'All customers are verified and screened. Work with peace of mind knowing you\'re protected.',
            color: 'purple'
        },
        {
            icon: Users,
            title: 'Growing Customer Base',
            description: 'Access thousands of customers across Kathmandu valley looking for quality technicians.',
            color: 'yellow'
        },
        {
            icon: Star,
            title: 'Build Your Reputation',
            description: 'Get rated and reviewed by customers. Build a strong profile to attract more high-paying jobs.',
            color: 'orange'
        },
        {
            icon: Award,
            title: 'Professional Growth',
            description: 'Access training resources and skill development programs to expand your service offerings.',
            color: 'red'
        }
    ];

    const requirements = [
        {
            icon: FileText,
            title: 'Required Documents',
            items: [
                'Valid Nepali Citizenship or Passport',
                'Professional certificates (if applicable)',
                'Previous work portfolio or references',
                'Bank account details for payments'
            ]
        },
        {
            icon: CheckCircle,
            title: 'Basic Requirements',
            items: [
                'Minimum 1 year of experience in your field',
                'Own transportation (preferred)',
                'Basic tools for your trade',
                'Professional attitude and communication skills'
            ]
        }
    ];

    const faqs = [
        {
            question: 'How do I get paid?',
            answer: 'Payments are processed weekly directly to your bank account. You can track all your earnings in real-time through our technician app. We also provide detailed payment receipts for tax purposes.'
        },
        {
            question: 'What documents do I need to apply?',
            answer: 'You need a valid Nepali citizenship or passport, bank account details, and any relevant professional certificates. If you have previous work samples or customer references, that helps too.'
        },
        {
            question: 'How quickly can I start working?',
            answer: 'Once your application is approved (usually within 2-3 business days), you can start accepting jobs immediately. We provide a quick orientation session to get you familiar with the platform.'
        },
        {
            question: 'Do I need my own tools and equipment?',
            answer: 'Yes, technicians are expected to bring their own basic tools. However, for specialized equipment, customers often provide them or you can charge additionally for tool rental.'
        },
        {
            question: 'What if there\'s a dispute with a customer?',
            answer: 'QuestX provides full support for dispute resolution. Our team mediates between customers and technicians to ensure fair outcomes. We also have insurance coverage for certain types of work.'
        },
        {
            question: 'Can I work part-time?',
            answer: 'Absolutely! Many of our technicians work part-time while managing other commitments. You have complete control over when and how much you work.'
        },
        {
            question: 'How do I build my rating on the platform?',
            answer: 'Focus on quality work, punctuality, and good communication. Customers rate you after each job. Higher ratings lead to more job requests and the ability to charge premium rates.'
        },
        {
            question: 'What services can I offer?',
            answer: 'We support a wide range of services including plumbing, electrical work, carpentry, painting, cleaning, furniture assembly, appliance repair, and more. You can offer multiple services if you\'re qualified.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div>
            <Header />
        <div className={styles["technician-page"]}>
            {/* Hero Section */}
            <div className={styles["hero-section"]}>
                <div className={styles["background-pattern"]}></div>

                <div className={styles["hero-container"]}>
                    {/* Left Side */}
                    <div className={styles["hero-left"]}>
                        <h1 className={styles["hero-title"]}>
                            Join <span className={styles["highlight"]}>QuestX</span> as a <span className={styles["highlight"]}>Technician</span>
                        </h1>

                        <p className={styles["hero-description"]}>
                            Turn your skills into a thriving business. Connect with customers who need your expertise and build a successful career on your own terms.
                        </p>

                        <div className={styles["hero-buttons"]}>
                            <button className={styles["btn-primary"]} onClick={() => navigate("/LoginSignup")}>APPLY NOW</button>
                            <button className={styles["btn-secondary"]}>LEARN MORE</button>
                        </div>
                    </div>

                    {/* Right Side - Stats */}
                    <div className={styles["stats-grid"]}>
                        <div className={styles["stat-card"]}>
                            <div className={`${styles["stat-number"]} ${styles["green"]}`}>500+</div>
                            <div className={styles["stat-label"]}>Active Technicians</div>
                        </div>

                        <div className={styles["stat-card"]}>
                            <div className={`${styles["stat-number"]} ${styles["blue"]}`}>Rs. 45K</div>
                            <div className={styles["stat-label"]}>Avg. Monthly Earning</div>
                        </div>

                        <div className={styles["stat-card"]}>
                            <div className={`${styles["stat-number"]} ${styles["purple"]}`}>10K+</div>
                            <div className={styles["stat-label"]}>Jobs Completed</div>
                        </div>

                        <div className={styles["stat-card"]}>
                            <div className={`${styles["stat-number"]} ${styles["yellow"]}`}>4.8★</div>
                            <div className={styles["stat-label"]}>Average Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Perks Section */}
            <section className={styles["perks-section"]}>
                <div className={styles["container"]}>
                    <h2 className={styles["section-title"]}>Why Choose QuestX?</h2>

                    <div className={styles["perks-grid"]}>
                        {perks.map((perk, index) => {
                            const Icon = perk.icon;
                            return (
                                <div key={index} className={styles["perk-card"]}>
                                    <div className={`${styles["perk-icon"]} ${styles[perk.color]}`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className={styles["perk-title"]}>{perk.title}</h3>
                                    <p className={styles["perk-description"]}>{perk.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className={styles["requirements-section"]}>
                <div className={styles["container"]}>
                    <h2 className={styles["section-title"]}>What You Need to Get Started</h2>

                    <div className={styles["requirements-grid"]}>
                        {requirements.map((req, index) => {
                            const Icon = req.icon;
                            return (
                                <div key={index} className={styles["requirement-card"]}>
                                    <div className={styles["requirement-header"]}>
                                        <Icon size={24} className={styles["requirement-icon"]} />
                                        <h3 className={styles["requirement-title"]}>{req.title}</h3>
                                    </div>
                                    <ul className={styles["requirement-list"]}>
                                        {req.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className={styles["requirement-item"]}>
                                                <CheckCircle size={16} className={styles["check-icon"]} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles["faq-section"]}>
                <div className={styles["faq-container"]}>
                    <h2 className={styles["section-title"]}>Frequently Asked Questions</h2>

                    <div className={styles["faq-list"]}>
                        {faqs.map((faq, index) => (
                            <div key={index} className={styles["faq-item"]}>
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className={styles["faq-question"]}
                                >
                                    {faq.question}
                                    {openFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openFAQ === index && (
                                    <div className={styles["faq-answer"]}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles["cta-section"]}>
                <div className={styles["cta-container"]}>
                    <h2 className={styles["cta-title"]}>Ready to Start Your Journey?</h2>
                    <p className={styles["cta-description"]}>
                        Join hundreds of skilled technicians who are already earning great money and building successful careers with QuestX.
                    </p>
                    <button className={styles["cta-button"]}>APPLY NOW - IT'S FREE!</button>
                    <p className={styles["cta-note"]}>
                        Application review typically takes 2-3 business days
                    </p>
                </div>
            </section>
        </div>
        </div>
    );
}

export default TechnicianLandingPage;
