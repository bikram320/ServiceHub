import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Shield, Star, CheckCircle } from 'lucide-react';
import "../../styles/BookingDetail.css";
import DateTimeSelector from "../../Components/layout/DateTimeSelector.jsx";
import {useNavigate} from "react-router-dom";


// Service Provider Card Component
const ServiceProviderCard = ({ provider }) => (

    <div className="provider-card">
        <div className="provider-header">
            <img src={provider.avatar} alt={provider.name} className="provider-avatar" />
            <div className="provider-info">
                <h3 className="provider-name">{provider.name}</h3>
                <div className="provider-rating">
                    <Star className="star-icon" size={16} fill="currentColor" />
                    <span>{provider.rating}</span>
                    <span className="review-count">({provider.reviews} reviews)</span>
                </div>
                <p className="provider-experience">{provider.experience} years experience</p>
            </div>
            <div className="provider-badge">
                <Shield size={16} />
                <span>Verified</span>
            </div>
        </div>
        <div className="service-details">
            <h4 className="service-title">{provider.service}</h4>
            <p className="service-description">{provider.description}</p>
            <div className="service-price">
                <span className="price-label">Starting from</span>
                <span className="price-amount">${provider.price}/hr</span>
            </div>
        </div>
    </div>
);

// Contact Form Component
const ContactForm = ({ formData, onFormChange }) => (
    <div className="contact-form">
        <h4 className="form-title">
            <User size={18} />
            Your Information
        </h4>
        <div className="form-grid">
            <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => onFormChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => onFormChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onFormChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                />
            </div>

            <div className="form-group full-width">
                <label htmlFor="address">Service Address *</label>
                <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => onFormChange('address', e.target.value)}
                    placeholder="Enter the service location"
                    required
                />
            </div>

            <div className="form-group full-width">
                <label htmlFor="description">Service Description</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => onFormChange('description', e.target.value)}
                    placeholder="Describe what you need help with..."
                    rows={4}
                />
            </div>
        </div>
    </div>
);

// Booking Summary Component
const BookingSummary = ({ provider, selectedDate, selectedTime, formData }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const estimatedHours = 2;
    const serviceFee = provider.price * estimatedHours;
    const platformFee = 5;
    const total = serviceFee + platformFee;

    return (
        <div className="booking-summary">
            <h4 className="summary-title">Booking Summary</h4>

            <div className="summary-section">
                <h5>Service Details</h5>
                <div className="summary-item">
                    <span>Service:</span>
                    <span>{provider.service}</span>
                </div>
                <div className="summary-item">
                    <span>Provider:</span>
                    <span>{provider.name}</span>
                </div>
            </div>

            <div className="summary-section">
                <h5>Schedule</h5>
                <div className="summary-item">
                    <span>Date:</span>
                    <span>{selectedDate ? formatDate(selectedDate) : 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <span>Time:</span>
                    <span>{selectedTime || 'Not selected'}</span>
                </div>
            </div>

            <div className="summary-section">
                <h5>Location</h5>
                <div className="summary-item">
                    <span>Address:</span>
                    <span>{formData.address || 'Not provided'}</span>
                </div>
            </div>

            <div className="summary-section">
                <h5>Cost Breakdown</h5>
                <div className="summary-item">
                    <span>Service ({estimatedHours}h estimated):</span>
                    <span>${serviceFee}</span>
                </div>
                <div className="summary-item">
                    <span>Platform fee:</span>
                    <span>${platformFee}</span>
                </div>
                <div className="summary-item total">
                    <span>Total:</span>
                    <span>${total}</span>
                </div>
            </div>
        </div>
    );
};

// Main BookingDetail Component
const BookingDetail = () => {
    const navigate = useNavigate();
    // Mock provider data
    const provider = {
        id: 1,
        name: "John Smith",
        rating: 4.9,
        reviews: 127,
        experience: 8,
        service: "Plumbing Services",
        description: "Professional plumbing services including repairs, installations, and emergency fixes. Licensed and insured.",
        price: 75,
        avatar: ""
    };

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!selectedDate || !selectedTime) {
            alert('Please select date and time');
            return;
        }

        if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            console.log('Booking submitted:', {
                provider: provider.id,
                date: selectedDate,
                time: selectedTime,
                customer: formData
            });
        }, 2000);
    };

    const handleGoBack = () => {
        console.log('Navigate back to search results');
    };

    if (showSuccess) {
        return (
            <div className="page-container">
                <div className="container">
                    <div className="success-message">
                        <CheckCircle className="success-icon" size={64} />
                        <h2>Booking Confirmed!</h2>
                        <p>Your service has been booked successfully. You will receive a confirmation email shortly.</p>
                        <div className="success-actions">
                            <button className="btn-primary" onClick={() => setShowSuccess(false)}>
                                Book Another Service
                            </button>
                            <button className="btn-secondary" onClick={() => console.log('View bookings')}>
                                View My Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="container">
                <div className="booking-container">
                    {/* Back Button */}
                    <button className="back-button" onClick={() => navigate(-1)}> {/*Takes back to last page*/}
                        <ArrowLeft size={20} />
                        Back to Results
                    </button>

                    <div className="booking-content">
                        {/* Left Column */}
                        <div className="booking-left">
                            <ServiceProviderCard provider={provider} />

                            <DateTimeSelector
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                onDateChange={setSelectedDate}
                                onTimeChange={setSelectedTime}
                            />

                            <ContactForm
                                formData={formData}
                                onFormChange={handleFormChange}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="booking-right">
                            <BookingSummary
                                provider={provider}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                formData={formData}
                            />

                            <button
                                className="btn-book-now"
                                onClick={handleBooking}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Book Now & Pay
                                    </>
                                )}
                            </button>

                            <div className="booking-guarantee">
                                <Shield size={16} />
                                <span>100% Satisfaction Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;