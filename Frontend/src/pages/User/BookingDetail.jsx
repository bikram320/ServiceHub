import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Shield, Star, CheckCircle } from 'lucide-react';
import "../../styles/BookingDetail.css";
import DateTimeSelector from "../../Components/layout/DateTimeSelector.jsx";
import { useNavigate, useLocation } from "react-router-dom";

// Service Provider Card Component
const ServiceProviderCard = ({ provider }) => {
    const getProfileImageUrl = (dbPath) => {
        if (!dbPath) return null;
        const cleanPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath;
        return `http://localhost:8080/${cleanPath}`;
    };

    return (
        <div className="provider-card">
            <div className="provider-header">
                <div className="provider-avatar-container">
                    {provider.imageFile ? (
                        <img
                            src={getProfileImageUrl(provider.imageFile)}
                            alt={provider.technicianName}
                            className="provider-avatar"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className="provider-avatar provider-avatar-placeholder"
                        style={{ display: provider.imageFile ? 'none' : 'flex' }}
                    >
                        {provider.technicianName?.charAt(0).toUpperCase() || 'T'}
                    </div>
                </div>
                <div className="provider-info">
                    <h3 className="provider-name">{provider.technicianName}</h3>
                    <div className="provider-rating">
                        <Star className="star-icon" size={16} fill="currentColor" />
                        <span>4.8</span>
                        <span className="review-count">(127 reviews)</span>
                    </div>
                    <p className="provider-experience">Professional Technician</p>
                </div>
                <div className="provider-badge">
                    <Shield size={16} />
                    <span>Verified</span>
                </div>
            </div>
            <div className="service-details">
                <h4 className="service-title">{provider.serviceName?.replace(/[\[\]]/g, '') || 'Service'}</h4>
                <p className="service-description">
                    {provider.technicianBio || 'Professional technician ready to help with your service needs.'}
                </p>
                <div className="service-price">
                    <span className="price-label">Service Fee</span>
                    <span className="price-amount">Rs. {provider.feeCharge || '500'}</span>
                </div>
            </div>
        </div>
    );
};

// Contact Form Component
const ContactForm = ({ formData, onFormChange, loading }) => (
    <div className="contact-form">
        <h4 className="form-title">
            <User size={18} />
            Your Information
        </h4>
        {loading ? (
            <div className="loading-form">
                <p>Loading your information...</p>
            </div>
        ) : (
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
        )}
    </div>
);

// Booking Summary Component
const BookingSummary = ({ provider, selectedDate, selectedStartTime, selectedEndTime, formData }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const serviceFee = parseFloat(provider.feeCharge) || 500;
    const platformFee = 50;
    const total = serviceFee + platformFee;

    return (
        <div className="booking-summary">
            <h4 className="summary-title">Booking Summary</h4>

            <div className="summary-section">
                <h5>Service Details</h5>
                <div className="summary-item">
                    <span>Service:</span>
                    <span>{provider.serviceName?.replace(/[\[\]]/g, '') || 'Service'}</span>
                </div>
                <div className="summary-item">
                    <span>Provider:</span>
                    <span>{provider.technicianName}</span>
                </div>
            </div>

            <div className="summary-section">
                <h5>Schedule</h5>
                <div className="summary-item">
                    <span>Date:</span>
                    <span>{selectedDate ? formatDate(selectedDate) : 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <span>Start Time:</span>
                    <span>{selectedStartTime || 'Not selected'}</span>
                </div>
                {selectedEndTime && (
                    <div className="summary-item">
                        <span>End Time:</span>
                        <span>{selectedEndTime}</span>
                    </div>
                )}
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
                    <span>Service Fee:</span>
                    <span>Rs. {serviceFee}</span>
                </div>
                <div className="summary-item">
                    <span>Platform fee:</span>
                    <span>Rs. {platformFee}</span>
                </div>
                <div className="summary-item total">
                    <span>Total:</span>
                    <span>Rs. {total}</span>
                </div>
            </div>
        </div>
    );
};

// Main BookingDetail Component
const BookingDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const technicianData = location.state?.technician;

    // Debug: Log the technician data to see what fields are available
    console.log('Technician data received:', technicianData);

    // Default provider data or from navigation
    const provider = technicianData ? {
        techId: technicianData.techId || technicianData.id,
        technicianName: technicianData.technicianName || technicianData.name,
        serviceName: technicianData.serviceName || technicianData.service,
        technicianBio: technicianData.technicianBio || technicianData.bio,
        feeCharge: technicianData.feeCharge || technicianData.fee || "500",
        imageFile: technicianData.imageFile || technicianData.image,
        technicianPhone: technicianData.technicianPhone || technicianData.phone,
        technicianAddress: technicianData.technicianAddress || technicianData.address,
        // Try different possible email field names
        technicianEmail: technicianData.technicianEmail ||
            technicianData.email
    } : {
        techId: 1,
        technicianName: "Service Provider",
        serviceName: "General Service",
        technicianBio: "Professional technician ready to help with your service needs.",
        feeCharge: "500",
        imageFile: null,
        technicianPhone: "",
        technicianAddress: "",
        technicianEmail: ""
    };

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [userDataLoading, setUserDataLoading] = useState(true);

    // Helper function to get cookie value
    const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setUserDataLoading(true);

                // Get user email from localStorage, sessionStorage, or cookie
                const userEmail = localStorage.getItem('userEmail') ||
                    sessionStorage.getItem('userEmail') ||
                    getCookieValue('userEmail');

                if (!userEmail) {
                    setUserDataLoading(false);
                    return;
                }

                const response = await fetch(`/api/users/profile?email=${encodeURIComponent(userEmail)}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const userData = await response.json();

                    // Pre-fill form with user data
                    setFormData(prev => ({
                        ...prev,
                        fullName: userData.username || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        address: userData.address || ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setUserDataLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!selectedDate || !selectedStartTime) {
            alert('Please select date and start time');
            return;
        }

        if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Create the service request booking
            const appointmentDateTime = `${selectedDate}T${convertTo24Hour(selectedStartTime)}:00`;

            const bookingData = {
                userEmail: formData.email,
                technicianEmail: provider.technicianEmail,
                serviceName: provider.serviceName?.replace(/[\[\]]/g, ''),
                appointmentTime: appointmentDateTime,
                description: formData.description || 'Service booking',
                feeCharge: parseFloat(provider.feeCharge) || 500
            };

            console.log('Booking data:', bookingData);

            const bookingResponse = await fetch('/api/users/book-technician-for-service', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            if (!bookingResponse.ok) {
                const errorText = await bookingResponse.text();
                throw new Error(`Booking failed: ${errorText}`);
            }

            // Step 2: Get the created service request ID (you might need to modify backend to return this)
            // For now, we'll assume you modify the booking endpoint to return the service request ID
            const bookingResult = await bookingResponse.json();
            const serviceRequestId = bookingResult.serviceRequestId; // You'll need to add this to your backend response

            // Step 3: Initiate payment
            const userEmail = formData.email;
            const paymentResponse = await fetch(`/api/payments/initiate?requestId=${serviceRequestId}&userEmail=${userEmail}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!paymentResponse.ok) {
                throw new Error('Payment initiation failed');
            }

            const paymentData = await paymentResponse.json();

            // Step 4: Redirect to eSewa
            redirectToEsewa(paymentData);

        } catch (error) {
            console.error('Booking/Payment error:', error);
            alert(`Failed to process booking: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function to convert 12-hour to 24-hour format
    const convertTo24Hour = (time12h) => {
        const [time, period] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (period === 'AM' && hours === '12') {
            hours = '00';
        } else if (period === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    // Helper function to redirect to eSewa
    const redirectToEsewa = (paymentData) => {
        // Create a form and submit to eSewa
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'; // eSewa sandbox URL

        // Add form fields
        const fields = {
            'amount': paymentData.amount,
            'total_amount': paymentData.total_amount,
            'tax_amount': paymentData.tax_amount || '0',
            'product_service_charge': paymentData.product_service_charge || '0',
            'product_delivery_charge': paymentData.product_delivery_charge || '0',
            'transaction_uuid': paymentData.transaction_uuid,
            'product_code': paymentData.product_code,
            'success_url': paymentData.success_url,
            'failure_url': paymentData.failure_url,
            'signed_field_names': paymentData.signed_field_names,
            'signature': paymentData.signature
        };

        for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    if (showSuccess) {
        return (
            <div className="page-container">

                    <div className="success-message">
                        <CheckCircle className="success-icon" size={64} />
                        <h2>Booking Confirmed!</h2>
                        <p>Your service has been booked successfully. You will receive a confirmation email shortly.</p>
                        <div className="success-actions">
                            <button className="btn-primary" onClick={() => setShowSuccess(false)}>
                                Book Another Service
                            </button>
                            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                                View My Bookings
                            </button>
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
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        Back to Results
                    </button>

                    <div className="booking-content">
                        {/* Left Column */}
                        <div className="booking-left">
                            <ServiceProviderCard provider={provider} />

                            <DateTimeSelector
                                selectedDate={selectedDate}
                                selectedStartTime={selectedStartTime}
                                selectedEndTime={selectedEndTime}
                                onDateChange={setSelectedDate}
                                onStartTimeChange={setSelectedStartTime}
                                onEndTimeChange={setSelectedEndTime}
                            />

                            <ContactForm
                                formData={formData}
                                onFormChange={handleFormChange}
                                loading={userDataLoading}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="booking-right">
                            <BookingSummary
                                provider={provider}
                                selectedDate={selectedDate}
                                selectedStartTime={selectedStartTime}
                                selectedEndTime={selectedEndTime}
                                formData={formData}
                            />

                            <button
                                className="btn-book-now"
                                onClick={handleBooking}
                                disabled={isSubmitting || userDataLoading}
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