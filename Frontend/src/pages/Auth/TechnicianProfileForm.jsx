import React, {useCallback, useEffect, useState } from 'react';
import {Camera, Edit3, MapPin, Search, Loader2, Navigation, DollarSign, Wrench, User, Phone, Mail, Home, Shield, FileText, Clock} from 'lucide-react';

import {
    searchLocations,
    getCurrentLocation,
    estimateTimezone,
    getBrowserTimezone,
    debounce,
    COMMON_TIMEZONES
} from "../../Components/utils/locationApi.js";
import "../../styles/TechnicianProfileForm.css";

const TechnicianProfileForm = ({ userInfo, onUpdateProfile }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        bio: '',
        coordinates: null,
        preferredLanguage: 'English',
        timezone: 'Asia/Kathmandu (UTC+05:45)',
        avatar: null,
        serviceType: '',
        hourlyRate:'',
        serviceDescription: '',
        availability: '',
        availabilityDetails: '',
        // Verification fields
        citizenshipPhoto: null,
        workingLicense: null
    });

    const [isEditing, setIsEditing] = useState({
        fullName: false,
        email: false,
        phoneNumber: false,
        address: false,
        bio: false,
        serviceType: false,
        hourlyRate: false,
        serviceDescription: false,
        availability: false,
        availabilityDetails: false
    });

    // Calendar state
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'AC Repair',
            start: new Date(2025, 8, 15, 9, 0),
            end: new Date(2025, 8, 15, 11, 0),
            type:'booked'
        },
        {
            id: 2,
            title: 'Plumbing Inspection',
            start: new Date(2025, 8, 16, 14, 0),
            end: new Date(2025, 8, 16, 16, 0),
            type:'booked'
        }
    ]);

    // Location and timezones states
    const [locationSearch, setLocationSearch] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null);
    };

    const toggleEdit = (field) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = () => {
        onUpdateProfile(formData);
        setIsEditing({
            fullName: false,
            email: false,
            phoneNumber: false,
            address: false,
            bio: false,
            serviceType: false,
            hourlyRate: false,
            serviceDescription: false,
            availability: false,
            availabilityDetails: false
        });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                handleInputChange('avatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVerificationFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                handleInputChange(fieldName, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const debouncedLocationSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim() || query.length < 3) {
                setLocationSuggestions([]);
                return;
            }

            setIsSearchingLocation(true);
            try {
                const suggestions = await searchLocations(query);
                setLocationSuggestions(suggestions);
                setError(null);
            } catch(error) {
                console.error('Error searching location: ', error);
                setError('Failed to search locations. Please try again later.');
                setLocationSuggestions([]);
            } finally {
                setIsSearchingLocation(false);
            }
        }, 300),
        []
    );

    const handleGetCurrentLocation = async () => {
        setIsGettingCurrentLocation(true);
        setError(null);

        try {
            const locationData = await getCurrentLocation();
            handleInputChange('address', locationData.displayName);
            handleInputChange('coordinates', {lat: locationData.lat, lon: locationData.lon});
            const timezone = estimateTimezone(locationData.lat, locationData.lon);
            handleInputChange('timezone', timezone);
        } catch(error) {
            console.error('Error getting current location: ', error);
            setError(error.message);
        } finally {
            setIsGettingCurrentLocation(false);
        }
    };

    const handleLocationSelect = async (location) => {
        handleInputChange('address', location.address);
        handleInputChange('coordinates', {lat: location.lat, lon: location.lon});
        setLocationSearch(location.address);
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);

        const timezone = estimateTimezone(location.lat, location.lon);
        handleInputChange('timezone', timezone);
    };

    const handleAutoDetectTimezone = () => {
        const browserTimezone = getBrowserTimezone();
        handleInputChange('timezone', browserTimezone);
    };

    const handleEventsChange = (updatedEvents) => {
        setEvents(updatedEvents);
    };

    useEffect(() => {
        if(locationSearch){
            debouncedLocationSearch(locationSearch);
        } else {
            setLocationSuggestions([]);
        }
    }, [locationSearch, debouncedLocationSearch]);

    const languages = ['English', 'Nepali', 'Hindi'];
    const serviceTypes = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'General Maintenance', 'Appliance Repair'];

    return (
        <div className="profile-content">
            <div className="profile-form">
                <div className="profile-header">
                    <h1 className="profile-title">Technician Profile</h1>
                    <p className="profile-subtitle">Manage your professional profile and service offerings.</p>
                </div>

                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Profile Picture Section */}
                <div className="profile-picture-section">
                    <div className="profile-picture-container">
                        <div className="profile-picture">
                            {formData.avatar ? (
                                <img src={formData.avatar} className="profile-image" alt="Profile Avatar" />
                            ) : (
                                <div className="profile-placeholder">
                                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <Wrench size={32} />}
                                </div>
                            )}
                            <div className="profile-picture-overlay">
                                <label htmlFor="avatar-upload" className="camera-btn">
                                    <Camera size={20} />
                                    <input
                                        type='file'
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">{formData.fullName || 'Technician Name'}</h2>
                        <p className="profile-role">Professional Technician</p>
                        {formData.serviceType && (
                            <p className="service-speciality">{formData.serviceType} Specialist</p>
                        )}
                    </div>
                </div>

                {/* Personal Information */}
                <section className="form-section">
                    <h3 className="section-title">
                        <User size={20} style={{marginRight: '0.5rem'}} />
                        Personal Information
                    </h3>

                    <div className="form-group">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <div className="input-with-edit">
                            {isEditing.fullName ? (
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    onBlur={() => toggleEdit('fullName')}
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.fullName || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('fullName')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-with-edit">
                            {isEditing.email ? (
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onBlur={() => toggleEdit('email')}
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.email || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('email')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <div className="input-with-edit">
                            {isEditing.phoneNumber ? (
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    onBlur={() => toggleEdit('phoneNumber')}
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.phoneNumber || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('phoneNumber')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address" className="form-label">Address</label>
                        <div className="location-input-container">
                            <div className="location-search-wrapper">
                                {isEditing.address ? (
                                    <div className="location-search">
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={locationSearch}
                                            onChange={(e) => {
                                                setLocationSearch(e.target.value);
                                                setShowLocationSuggestions(true);
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    setShowLocationSuggestions(false);
                                                    toggleEdit('address');
                                                }, 200);
                                            }}
                                            placeholder="Search for a location"
                                            autoFocus
                                        />
                                        <button
                                            className="current-location-btn"
                                            onClick={handleGetCurrentLocation}
                                            disabled={isGettingCurrentLocation}
                                            type="button"
                                        >
                                            {isGettingCurrentLocation ? (
                                                <Loader2 size={16} className="spinning" />
                                            ) : (
                                                <Navigation size={16} />
                                            )}
                                        </button>

                                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                                            <div className="location-suggestions">
                                                {locationSuggestions.map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className="location-suggestion"
                                                        onClick={() => handleLocationSelect(location)}
                                                    >
                                                        <MapPin size={14} className="location-icon" />
                                                        <div className="location-details">
                                                            <div className="location-name">
                                                                {location.city || location.state || 'Unknown'}
                                                            </div>
                                                            <div className="location-address">
                                                                {location.displayName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="form-display">
                                        <span>{formData.address || 'Not Provided'}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setLocationSearch(formData.address);
                                                toggleEdit('address');
                                            }}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <div className="input-with-edit">
                            {isEditing.bio ? (
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    onBlur={() => toggleEdit('bio')}
                                    placeholder="Tell clients about your experience and expertise..."
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.bio || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('bio')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Verification Section */}
                <section className="form-section">
                    <h3 className="section-title">
                        <Shield size={20} style={{marginRight: '0.5rem'}} />
                        Verification Documents
                    </h3>
                    <p className="section-description">
                        Upload verification documents to increase trust and credibility with clients.
                    </p>

                    <div className="verification-grid">
                        <div className="verification-item">
                            <label className="form-label">
                                <FileText size={16} style={{marginRight: '0.5rem'}} />
                                User Verification (Citizenship Photo)
                            </label>
                            <div className="file-upload-container">
                                <div className="file-upload-area">
                                    {formData.citizenshipPhoto ? (
                                        <div className="uploaded-image">
                                            <img
                                                src={formData.citizenshipPhoto}
                                                alt="Citizenship Document"
                                                className="verification-image"
                                            />
                                            <div className="image-overlay">
                                                <label htmlFor="citizenship-upload" className="change-image-btn">
                                                    <Camera size={16} />
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="citizenship-upload" className="upload-placeholder">
                                            <Camera size={32} />
                                            <span>Upload Citizenship Photo</span>
                                            <small>JPG, PNG up to 5MB</small>
                                        </label>
                                    )}
                                    <input
                                        type="file"
                                        id="citizenship-upload"
                                        accept="image/*"
                                        onChange={(e) => handleVerificationFileChange(e, 'citizenshipPhoto')}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="verification-item">
                            <label className="form-label">
                                <Shield size={16} style={{marginRight: '0.5rem'}} />
                                Worker Verification (Working License)
                            </label>
                            <div className="file-upload-container">
                                <div className="file-upload-area">
                                    {formData.workingLicense ? (
                                        <div className="uploaded-image">
                                            <img
                                                src={formData.workingLicense}
                                                alt="Working License"
                                                className="verification-image"
                                            />
                                            <div className="image-overlay">
                                                <label htmlFor="license-upload" className="change-image-btn">
                                                    <Camera size={16} />
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="license-upload" className="upload-placeholder">
                                            <Shield size={32} />
                                            <span>Upload Working License</span>
                                            <small>JPG, PNG up to 5MB</small>
                                        </label>
                                    )}
                                    <input
                                        type="file"
                                        id="license-upload"
                                        accept="image/*"
                                        onChange={(e) => handleVerificationFileChange(e, 'workingLicense')}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Offerings */}
                <section className="form-section">
                    <h3 className="section-title">
                        <Wrench size={20} style={{marginRight: '0.5rem'}} />
                        Service Offerings
                    </h3>

                    <div className="form-group">
                        <label htmlFor="serviceType" className="form-label">Service Type</label>
                        <div className="input-with-edit">
                            {isEditing.serviceType ? (
                                <select
                                    className="form-select"
                                    value={formData.serviceType}
                                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                                    onBlur={() => toggleEdit('serviceType')}
                                    autoFocus
                                >
                                    <option value="">Select a service type</option>
                                    {serviceTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="form-display">
                                    <span>{formData.serviceType || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('serviceType')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="hourlyRate" className="form-label">Hourly Rate (NPR)</label>
                        <div className="input-with-edit">
                            {isEditing.hourlyRate ? (
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.hourlyRate}
                                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                                    onBlur={() => toggleEdit('hourlyRate')}
                                    placeholder="Enter your hourly rate"
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.hourlyRate ? `NPR ${formData.hourlyRate}/hour` : 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('hourlyRate')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="serviceDescription" className="form-label">Service Description</label>
                        <div className="input-with-edit">
                            {isEditing.serviceDescription ? (
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    value={formData.serviceDescription}
                                    onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                                    onBlur={() => toggleEdit('serviceDescription')}
                                    placeholder="Describe your services in detail..."
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.serviceDescription || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('serviceDescription')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Availability */}
                <section className="form-section">
                    <h3 className="section-title">
                        <Clock size={20} style={{marginRight: '0.5rem'}} />
                        Availability
                    </h3>

                    <div className="form-group">
                        <label htmlFor="availability" className="form-label">General Availability</label>
                        <div className="input-with-edit">
                            {isEditing.availability ? (
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.availability}
                                    onChange={(e) => handleInputChange('availability', e.target.value)}
                                    onBlur={() => toggleEdit('availability')}
                                    placeholder="e.g., Mon-Fri 9AM-6PM"
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.availability || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('availability')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="availabilityDetails" className="form-label">Availability Details</label>
                        <div className="input-with-edit">
                            {isEditing.availabilityDetails ? (
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    value={formData.availabilityDetails}
                                    onChange={(e) => handleInputChange('availabilityDetails', e.target.value)}
                                    onBlur={() => toggleEdit('availabilityDetails')}
                                    placeholder="Additional details about your availability..."
                                    autoFocus
                                />
                            ) : (
                                <div className="form-display">
                                    <span>{formData.availabilityDetails || 'Not Provided'}</span>
                                    <button className="edit-btn" onClick={() => toggleEdit('availabilityDetails')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </section>

                {/* Preferences */}
                <section className="form-section">
                    <h3 className="section-title">Preferences</h3>

                    <div className="form-group">
                        <label htmlFor="preferredLanguage" className="form-label">Preferred Language</label>
                        <select
                            className="form-select"
                            value={formData.preferredLanguage}
                            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="timezone" className="form-label">Time Zone</label>
                        <div className="timezone-container">
                            <select
                                className="form-select"
                                value={formData.timezone}
                                onChange={(e) => handleInputChange('timezone', e.target.value)}
                            >
                                {COMMON_TIMEZONES.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                            <button
                                className="detect-timezone-btn"
                                onClick={handleAutoDetectTimezone}
                                type="button"
                            >
                                Auto-detect
                            </button>
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <button className="save-btn" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TechnicianProfileForm;