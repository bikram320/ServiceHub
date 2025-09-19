import React, { useState } from "react";
import {
    Search,
    Phone,
    Mail,
    MessageCircle,
    Clock,
    User,
    Wrench,
    CreditCard,
    Shield,
    Star,
    Calendar,
    MapPin,
    FileText,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Download,
    PlayCircle,
    BookOpen,
    Headphones,
    Users,
    Settings
} from 'lucide-react';
import "../../styles/HelpSupport.css";

function HelpSupport() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openFAQ, setOpenFAQ] = useState(null);

    const supportCategories = [
        { id: 'all', name: 'All Topics', icon: BookOpen },
        { id: 'booking', name: 'Booking', icon: Calendar },
        { id: 'payment', name: 'Payments', icon: CreditCard },
        { id: 'technician', name: 'Technicians', icon: Wrench },
        { id: 'account', name: 'Account', icon: User },
        { id: 'safety', name: 'Safety', icon: Shield }
    ];

    const quickHelp = [
        {
            title: 'How to Book a Service',
            description: 'Step-by-step guide to booking your first technician',
            icon: Calendar,
            color: 'blue',
            type: 'guide'
        },
        {
            title: 'Payment Methods',
            description: 'Learn about accepted payment options and billing',
            icon: CreditCard,
            color: 'green',
            type: 'guide'
        },
        {
            title: 'Safety Guidelines',
            description: 'Important safety tips for customers and technicians',
            icon: Shield,
            color: 'red',
            type: 'guide'
        },
        {
            title: 'Rating & Reviews',
            description: 'How to rate technicians and leave feedback',
            icon: Star,
            color: 'yellow',
            type: 'guide'
        },
        {
            title: 'Cancel or Reschedule',
            description: 'Learn about cancellation and rescheduling policies',
            icon: Clock,
            color: 'purple',
            type: 'policy'
        },
        {
            title: 'Become a Technician',
            description: 'Requirements and process to join as a service provider',
            icon: Wrench,
            color: 'orange',
            type: 'guide'
        }
    ];

    const faqs = [
        {
            category: 'booking',
            question: 'How do I book a technician?',
            answer: 'To book a technician: 1) Search for your required service, 2) Filter by location, price, and ratings, 3) Select a technician, 4) Choose your preferred date and time, 5) Confirm booking and make payment. You\'ll receive instant confirmation via SMS and email.'
        },
        {
            category: 'booking',
            question: 'Can I book same-day service?',
            answer: 'Yes! Many technicians offer same-day service. Look for the "Available Today" badge when browsing. However, popular technicians may be booked in advance, so we recommend booking early for guaranteed availability.'
        },
        {
            category: 'payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept eSewa, Khalti, IME Pay, bank transfers, and cash payments. Digital payments are processed securely through our platform. For cash payments, you pay directly to the technician after service completion.'
        },
        {
            category: 'payment',
            question: 'When do I pay for the service?',
            answer: 'Payment timing depends on your chosen method: Digital payments (eSewa, Khalti) - paid when booking. Bank transfer - within 24 hours of booking. Cash - paid directly to technician after satisfactory service completion.'
        },
        {
            category: 'technician',
            question: 'How are technicians verified?',
            answer: 'All technicians undergo thorough verification including: Valid citizenship/passport check, professional license verification, background screening, skill assessment test, and reference checks. Only approved technicians can accept bookings.'
        },
        {
            category: 'technician',
            question: 'What if I\'m not satisfied with the service?',
            answer: 'If unsatisfied: 1) Contact the technician directly first, 2) If unresolved, contact our support team within 24 hours, 3) We\'ll mediate and potentially arrange a re-service, 4) In extreme cases, we offer partial or full refunds based on our quality guarantee.'
        },
        {
            category: 'account',
            question: 'How do I create an account?',
            answer: 'Creating an account is simple: 1) Click "Sign Up" on our homepage, 2) Enter your phone number, 3) Verify with the OTP sent to your phone, 4) Complete your profile with name and location, 5) Start browsing and booking services immediately.'
        },
        {
            category: 'account',
            question: 'Can I change my location?',
            answer: 'Yes, you can update your location anytime in your profile settings. This helps us show technicians available in your area and provide accurate service radius and pricing information.'
        },
        {
            category: 'safety',
            question: 'What safety measures are in place?',
            answer: 'We prioritize safety through: Background-verified technicians, real-time job tracking, 24/7 customer support, emergency contact features, insurance coverage for certain services, and customer feedback monitoring for quality control.'
        },
        {
            category: 'safety',
            question: 'What should I do in case of an emergency?',
            answer: 'For emergencies: 1) Ensure your immediate safety first, 2) Call emergency services (100/102) if needed, 3) Contact QuestX support immediately at 01-5970000, 4) Document the incident with photos if safe to do so. We take all safety concerns seriously.'
        }
    ];

    const contactMethods = [
        {
            method: 'Phone Support',
            detail: '01-5970000',
            description: 'Available 24/7 for urgent issues',
            icon: Phone,
            color: 'green',
            available: 'Always Available'
        },
        {
            method: 'WhatsApp Chat',
            detail: '+977-9800000000',
            description: 'Quick responses via WhatsApp',
            icon: MessageCircle,
            color: 'green',
            available: '6 AM - 10 PM'
        },
        {
            method: 'Email Support',
            detail: 'support@questx.com.np',
            description: 'Detailed support and documentation',
            icon: Mail,
            color: 'blue',
            available: 'Response within 4 hours'
        },
        {
            method: 'Live Chat',
            detail: 'In-app messaging',
            description: 'Real-time chat support',
            icon: Headphones,
            color: 'purple',
            available: '8 AM - 8 PM'
        }
    ];

    const troubleshooting = [
        {
            issue: 'Payment Failed',
            solutions: [
                'Check your internet connection',
                'Verify sufficient balance in your digital wallet',
                'Try a different payment method',
                'Clear browser cache and retry',
                'Contact your bank or payment provider'
            ],
            icon: CreditCard
        },
        {
            issue: 'Booking Not Confirmed',
            solutions: [
                'Check your email and SMS for confirmation',
                'Verify technician availability for selected time',
                'Ensure payment was processed successfully',
                'Try booking a different time slot',
                'Contact customer support'
            ],
            icon: Calendar
        },
        {
            issue: 'Cannot Find Technician',
            solutions: [
                'Expand your search radius',
                'Try different service categories',
                'Check availability for different dates',
                'Consider adjusting your budget range',
                'Contact support for manual assistance'
            ],
            icon: MapPin
        },
        {
            issue: 'App/Website Not Working',
            solutions: [
                'Check your internet connection',
                'Update the app to latest version',
                'Clear browser cache and cookies',
                'Try using incognito/private mode',
                'Restart your device'
            ],
            icon: Settings
        }
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="help-support-page">
            {/* Hero Section */}
            <section className="help-hero">
                <div className="help-hero-container">
                    <h1 className="help-hero-title">How can we help you?</h1>
                    <p className="help-hero-subtitle">
                        Find answers, get support, and learn how to make the most of QuestX
                    </p>

                    <div className="help-search-container">
                        <div className="help-search-box">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search for help articles, guides, or FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="help-search-input"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Help Section */}
            <section className="quick-help-section">
                <div className="container">
                    <h2 className="section-title">Popular Help Topics</h2>
                    <div className="quick-help-grid">
                        {quickHelp.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className={`quick-help-card ${item.color}`}>
                                    <div className="quick-help-icon">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="quick-help-title">{item.title}</h3>
                                    <p className="quick-help-description">{item.description}</p>
                                    <div className="quick-help-type">
                                        {item.type === 'guide' ? <BookOpen size={16} /> : <FileText size={16} />}
                                        <span>{item.type === 'guide' ? 'Guide' : 'Policy'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>

                    {/* Category Filter */}
                    <div className="faq-categories">
                        {supportCategories.map(category => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                >
                                    <Icon size={18} />
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQ List */}
                    <div className="faq-list">
                        {filteredFAQs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="faq-question"
                                >
                                    <span>{faq.question}</span>
                                    {openFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openFAQ === index && (
                                    <div className="faq-answer">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredFAQs.length === 0 && (
                        <div className="no-results">
                            <AlertCircle size={48} />
                            <h3>No results found</h3>
                            <p>Try adjusting your search or browse different categories</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="contact-section">
                <div className="container">
                    <h2 className="section-title">Contact Support</h2>
                    <p className="section-subtitle">
                        Still need help? Our support team is here for you 24/7
                    </p>

                    <div className="contact-grid">
                        {contactMethods.map((contact, index) => {
                            const Icon = contact.icon;
                            return (
                                <div key={index} className={`contact-card ${contact.color}`}>
                                    <div className="contact-icon">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="contact-method">{contact.method}</h3>
                                    <div className="contact-detail">{contact.detail}</div>
                                    <p className="contact-description">{contact.description}</p>
                                    <div className="contact-availability">
                                        <Clock size={14} />
                                        {contact.available}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Troubleshooting Section */}
            <section className="troubleshooting-section">
                <div className="container">
                    <h2 className="section-title">Common Issues & Solutions</h2>

                    <div className="troubleshooting-grid">
                        {troubleshooting.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="troubleshooting-card">
                                    <div className="troubleshooting-header">
                                        <Icon className="troubleshooting-icon" size={20} />
                                        <h3 className="troubleshooting-title">{item.issue}</h3>
                                    </div>
                                    <ul className="solution-list">
                                        {item.solutions.map((solution, sIndex) => (
                                            <li key={sIndex} className="solution-item">
                                                <CheckCircle size={16} />
                                                {solution}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Additional Resources */}
            <section className="resources-section">
                <div className="container">
                    <h2 className="section-title">Additional Resources</h2>

                    <div className="resources-grid">
                        <div className="resource-card">
                            <PlayCircle className="resource-icon" size={32} />
                            <h3>Video Tutorials</h3>
                            <p>Watch step-by-step guides on using QuestX effectively</p>
                            <button className="resource-btn">
                                Watch Videos <ExternalLink size={16} />
                            </button>
                        </div>

                        <div className="resource-card">
                            <Download className="resource-icon" size={32} />
                            <h3>User Manual</h3>
                            <p>Download our comprehensive guide to all QuestX features</p>
                            <button className="resource-btn">
                                Download PDF <Download size={16} />
                            </button>
                        </div>

                        <div className="resource-card">
                            <Users className="resource-icon" size={32} />
                            <h3>Community Forum</h3>
                            <p>Connect with other users and get community support</p>
                            <button className="resource-btn">
                                Join Community <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Contact */}
            <section className="emergency-section">
                <div className="emergency-container">
                    <AlertCircle className="emergency-icon" size={32} />
                    <div className="emergency-content">
                        <h3 className="emergency-title">Need Immediate Help?</h3>
                        <p className="emergency-description">
                            For urgent issues or emergencies, contact our 24/7 support hotline
                        </p>
                        <div className="emergency-contact">
                            <Phone size={20} />
                            <span>01-5970000</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HelpSupport;