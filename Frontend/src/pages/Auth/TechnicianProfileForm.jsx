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
import styles from "../../styles/TechnicianProfileForm.module.css";

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
        profileImageFile: null,
        serviceType: '',
        hourlyRate: '',
        // Verification fields
        citizenshipPhoto: null,
        citizenshipPhotoFile: null,
        workingLicense: null,
        workingLicenseFile: null,
        // Verification status
        verificationStatus: 'PENDING', // PENDING, VERIFIED, REJECTED
        verificationDate: null
    });

    const [isEditing, setIsEditing] = useState({
        fullName: false,
        email: false,
        phoneNumber: false,
        address: false,
        bio: false,
        serviceType: false,
        hourlyRate: false
    });

    // Location and timezones states
    const [locationSearch, setLocationSearch] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Load profile on component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                await fetchProfile();
            } catch (error) {
                console.error('Failed to load profile on mount:', error);
            }
        };

        loadProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null);
        setSuccessMessage('');
    };

    const toggleEdit = (field) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Helper function to get JWT token from cookie
    const getJWTFromCookie = () => {
        const name = "Access=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        console.log('All cookies:', document.cookie);

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                const token = cookie.substring(name.length, cookie.length);
                console.log('Found Access token:', token ? 'Token exists' : 'Token is empty');
                return token;
            }
        }
        console.log('No Access token found in cookies');
        return null;
    };

    const getProfileImageUrl = (dbPath) => {
        if (!dbPath) return null;
        const cleanPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath;
        return `http://localhost:8080/${cleanPath}`;
    };

    const getFileUrl = (filename) => {
        if (!filename) return null;
        const cleanPath = filename.startsWith('/') ? filename.substring(1) : filename;
        return `http://localhost:8080/${cleanPath}`;
    };

    // Verification Badge Component
    const VerificationBadge = ({ status, verificationDate, size = 20 }) => {
        if (status !== 'VERIFIED') return null;

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        return (
            <div
                className={styles["verification-badge"]}
                title={`Verified ${verificationDate ? `on ${formatDate(verificationDate)}` : 'by admin'}`}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles["verification-icon"]}
                >
                    <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
                    <path
                        d="M9 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        );
    };

    // Verification Status Display Component
    const VerificationStatusDisplay = ({ status }) => {
        const getStatusConfig = () => {
            switch (status) {
                case 'VERIFIED':
                    return {
                        color: '#10B981',
                        bgColor: '#D1FAE5',
                        text: 'Verified',
                        icon: '✓'
                    };
                case 'REJECTED':
                    return {
                        color: '#EF4444',
                        bgColor: '#FEE2E2',
                        text: 'Rejected',
                        icon: '✗'
                    };
                case 'PENDING':
                default:
                    return {
                        color: '#F59E0B',
                        bgColor: '#FEF3C7',
                        text: 'Pending',
                        icon: '⏳'
                    };
            }
        };

        const config = getStatusConfig();

        return (
            <div
                className={styles["status-badge"]}
                style={{
                    backgroundColor: config.bgColor,
                    color: config.color,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                <span>{config.icon}</span>
                {config.text}
            </div>
        );
    };

    // Fetch profile data from backend
    const fetchProfile = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                console.error('No email found in localStorage');
                return;
            }

            const response = await fetch(`api/technician/profile?email=${email}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();

                console.log('Profile image path:', data.profileImagePath);
                console.log('Identity document path:', data.identityPath);
                console.log('Valid document path:', data.documentPath);

                const avatarUrl = getProfileImageUrl(data.profileImagePath);
                const identityDocUrl = getFileUrl(data.identityPath);
                const validDocUrl = getFileUrl(data.documentPath);

                setFormData(prev => ({
                    ...prev,
                    fullName: data.technicianName || '',
                    email: data.email || '',
                    phoneNumber: data.phone || '',
                    address: data.address || '',
                    bio: data.bio || '',
                    serviceType: data.serviceType || '',
                    hourlyRate: data.feeCharged || '',
                    coordinates: (data.latitude && data.longitude) ?
                        {lat: data.latitude, lon: data.longitude} : null,
                    avatar: avatarUrl || null,
                    citizenshipPhoto: identityDocUrl || null,
                    workingLicense: validDocUrl || null,
                    verificationStatus: data.status || 'PENDING',
                    verificationDate: data.verificationDate || null
                }));

                if (data.technicianName) localStorage.setItem('technicianName', data.technicianName);
                if (data.email) localStorage.setItem('technicianEmail', data.email);

            } else {
                console.error('Failed to fetch profile:', response.status);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Backend API call to update profile
    const updateProfileOnBackend = async () => {
        const formDataToSend = new FormData();

        // Add required email parameter
        formDataToSend.append('email', formData.email);

        // Add optional parameters only if they exist
        if (formData.phoneNumber?.trim()) {
            formDataToSend.append('phone', formData.phoneNumber);
        }

        if (formData.address?.trim()) {
            formDataToSend.append('address', formData.address);
        }

        if (formData.coordinates?.lat) {
            formDataToSend.append('latitude', formData.coordinates.lat.toString());
        }

        if (formData.coordinates?.lon) {
            formDataToSend.append('longitude', formData.coordinates.lon.toString());
        }

        if (formData.bio?.trim()) {
            formDataToSend.append('bio', formData.bio);
        }

        if (formData.serviceType?.trim()) {
            formDataToSend.append('serviceType', formData.serviceType);
        }

        if (formData.hourlyRate) {
            formDataToSend.append('feeCharged', parseFloat(formData.hourlyRate).toString());
        }

        if (formData.profileImageFile) {
            formDataToSend.append('profile_image', formData.profileImageFile);
        }

        if (formData.citizenshipPhotoFile) {
            formDataToSend.append('identity_doc', formData.citizenshipPhotoFile);
        }

        if (formData.workingLicenseFile) {
            formDataToSend.append('valid_doc', formData.workingLicenseFile);
        }

        const token = getJWTFromCookie();
        console.log('Token for request:', token ? 'Token found' : 'No token');

        // Debug: Log what we're sending
        console.log('Sending to backend:');
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, typeof value === 'object' ? 'File' : value);
        }

        try {
            const response = await fetch('api/technician/update-profile', {
                method: 'POST',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
                body: formDataToSend,
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const result = await response.text();
                setSuccessMessage(result);
                setError(null);

                // Update localStorage with new values
                if (formData.fullName) {
                    localStorage.setItem('technicianName', formData.fullName);
                }
                if (formData.email) {
                    localStorage.setItem('technicianEmail', formData.email);
                }

                // Call parent component callback if provided
                if (onUpdateProfile) {
                    onUpdateProfile(formData);
                }

                // Refresh profile data to get updated verification status
                await fetchProfile();
            } else if (response.status === 401) {
                throw new Error('Session expired or invalid. Please login again.');
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                throw new Error(errorText || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Failed to update profile. Please try again.');
            setSuccessMessage('');
        }
    };

    const handleSave = async () => {
        if (!formData.email?.trim()) {
            setError('Email is required to update profile');
            return;
        }

        setIsUpdating(true);
        setError(null);
        setSuccessMessage('');

        try {
            await updateProfileOnBackend();

            // Reset editing states
            setIsEditing({
                fullName: false,
                email: false,
                phoneNumber: false,
                address: false,
                bio: false,
                serviceType: false,
                hourlyRate: false
            });
        } catch (error) {
            console.error('Save operation failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Convert file to base64 for preview while keeping original file for upload
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Store the actual file for backend upload
            handleInputChange('profileImageFile', file);

            // Create preview
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
            // Store the actual file for backend upload
            if (fieldName === 'citizenshipPhoto') {
                handleInputChange('citizenshipPhotoFile', file);
            } else if (fieldName === 'workingLicense') {
                handleInputChange('workingLicenseFile', file);
            }

            // Create preview
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
        <div className={styles['profile-content']}>
            <div className={styles['profile-form']}>
                <div className={styles['profile-header']}>
                    <h1 className={styles['profile-title']}>Technician Profile</h1>
                    <p className={styles['profile-subtitle']}>Manage your professional profile and service offerings.</p>
                </div>

                {error && (
                    <div className={styles['error-message']}>
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {successMessage && (
                    <div className={styles['success-message']}>
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage('')}>×</button>
                    </div>
                )}

                {/* Profile Picture Section */}
                <div className={styles['profile-picture-section']}>
                    <div className={styles['profile-picture-container']}>
                        <div className={styles['profile-picture']}>
                            {formData.avatar ? (
                                <img src={formData.avatar} className={styles['profile-image']} alt="Profile Avatar" />
                            ) : (
                                <div className={styles['profile-placeholder']}>
                                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <Wrench size={32} />}
                                </div>
                            )}
                            <div className={styles['profile-picture-overlay']}>
                                <label htmlFor="avatar-upload" className={styles['camera-btn']}>
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
                    <div className={styles['profile-info']}>
                        <div className={styles['profile-name-container']} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h2 className={styles['profile-name']}>{formData.fullName || 'Technician Name'}</h2>
                            <VerificationBadge
                                status={formData.verificationStatus}
                                verificationDate={formData.verificationDate}
                                size={24}
                            />
                        </div>
                        <p className={styles['profile-role']}>Professional Technician</p>
                        {formData.serviceType && (
                            <p className={styles['service-speciality']}>{formData.serviceType} Specialist</p>
                        )}
                        <div style={{ marginTop: '8px' }}>
                            <VerificationStatusDisplay status={formData.verificationStatus} />
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <section className={styles['form-section']}>
                    <h3 className={styles['section-title']}>
                        <User size={20} style={{marginRight: '0.5rem'}} />
                        Personal Information
                    </h3>

                    <div className={styles['form-group']}>
                        <label htmlFor="fullName" className={styles['form-label']}>Full Name</label>
                        <div className={styles['input-with-edit']}>
                            {isEditing.fullName ? (
                                <input
                                    type="text"
                                    className={styles['form-input']}
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    onBlur={() => toggleEdit('fullName')}
                                    autoFocus
                                />
                            ) : (
                                <div className={styles['form-display']}>
                                    <span>{formData.fullName || 'Not Provided'}</span>
                                    <button className={styles['edit-btn']} onClick={() => toggleEdit('fullName')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="email" className={styles['form-label']}>Email</label>
                        <div className={styles['input-with-edit']}>
                            {isEditing.email ? (
                                <input
                                    type="email"
                                    className={styles['form-input']}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onBlur={() => toggleEdit('email')}
                                    autoFocus
                                />
                            ) : (
                                <div className={styles['form-display']}>
                                    <span>{formData.email || 'Not Provided'}</span>
                                    <button className={styles['edit-btn']} onClick={() => toggleEdit('email')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="phoneNumber" className={styles['form-label']}>Phone Number</label>
                        <div className={styles['input-with-edit']}>
                            {isEditing.phoneNumber ? (
                                <input
                                    type="tel"
                                    className={styles['form-input']}
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    onBlur={() => toggleEdit('phoneNumber')}
                                    autoFocus
                                />
                            ) : (
                                <div className={styles['form-display']}>
                                    <span>{formData.phoneNumber || 'Not Provided'}</span>
                                    <button className={styles['edit-btn']} onClick={() => toggleEdit('phoneNumber')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="address" className={styles['form-label']}>Address</label>
                        <div className={styles['location-input-container']}>
                            <div className={styles['location-search-wrapper']}>
                                {isEditing.address ? (
                                    <div className={styles['location-search']}>
                                        <input
                                            type="text"
                                            className={styles['form-input']}
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
                                            className={styles['current-location-btn']}
                                            onClick={handleGetCurrentLocation}
                                            disabled={isGettingCurrentLocation}
                                            type="button"
                                        >
                                            {isGettingCurrentLocation ? (
                                                <Loader2 size={16} className={styles.spinning} />
                                            ) : (
                                                <Navigation size={16} />
                                            )}
                                        </button>

                                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                                            <div className={styles['location-suggestions']}>
                                                {locationSuggestions.map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles['location-suggestion']}
                                                        onClick={() => handleLocationSelect(location)}
                                                    >
                                                        <MapPin size={14} className={styles['location-icon']} />
                                                        <div className={styles['location-details']}>
                                                            <div className={styles['location-name']}>
                                                                {location.city || location.state || 'Unknown'}
                                                            </div>
                                                            <div className={styles['location-address']}>
                                                                {location.displayName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles['form-display']}>
                                        <span>{formData.address || 'Not Provided'}</span>
                                        <button
                                            className={styles['edit-btn']}
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

                    <div className={styles['form-group']}>
                        <label htmlFor="bio" className={styles['form-label']}>Bio</label>
                        <div className={styles['input-with-edit']}>
                            {isEditing.bio ? (
                                <textarea
                                    className={styles['form-input']}
                                    rows="4"
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    onBlur={() => toggleEdit('bio')}
                                    placeholder="Tell clients about your experience and expertise..."
                                    autoFocus
                                />
                            ) : (
                                <div className={styles['form-display']}>
                                    <span>{formData.bio || 'Not Provided'}</span>
                                    <button className={styles['edit-btn']} onClick={() => toggleEdit('bio')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                {/* Verification Section */}
                <section className={styles['form-section']}>
                    <h3 className={styles['section-title']}>
                        <Shield size={20} style={{marginRight: '0.5rem'}} />
                        Verification Documents
                    </h3>
                    <p className={styles['section-description']}>
                        Upload verification documents to increase trust and credibility with clients.
                    </p>

                    <div className={styles['verification-grid']}>
                        <div className={styles['verification-item']}>
                            <label className={styles['form-label']}>
                                <FileText size={16} style={{marginRight: '0.5rem'}} />
                                Identity Verification (Citizenship Photo)
                            </label>
                            <div className={styles['file-upload-container']}>
                                <div className={styles['file-upload-area']}>
                                    {formData.citizenshipPhoto ? (
                                        <div className={styles['uploaded-image']}>
                                            <img
                                                src={formData.citizenshipPhoto}
                                                alt="Citizenship Document"
                                                className={styles['verification-image']}
                                            />
                                            <div className={styles['image-overlay']}>
                                                <label htmlFor="citizenship-upload" className={styles['change-image-btn']}>
                                                    <Camera size={16} />
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="citizenship-upload" className={styles['upload-placeholder']}>
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

                        <div className={styles['verification-item']}>
                            <label className={styles['form-label']}>
                                <Shield size={16} style={{marginRight: '0.5rem'}} />
                                Professional License/Certificate
                            </label>
                            <div className={styles['file-upload-container']}>
                                <div className={styles['file-upload-area']}>
                                    {formData.workingLicense ? (
                                        <div className={styles['uploaded-image']}>
                                            <img
                                                src={formData.workingLicense}
                                                alt="Working License"
                                                className={styles['verification-image']}
                                            />
                                            <div className={styles['image-overlay']}>
                                                <label htmlFor="license-upload" className={styles['change-image-btn']}>
                                                    <Camera size={16} />
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="license-upload" className={styles['upload-placeholder']}>
                                            <Shield size={32} />
                                            <span>Upload Professional License</span>
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
                <section className={styles['form-section']}>
                    <h3 className={styles['section-title']}>
                        <Wrench size={20} style={{marginRight: '0.5rem'}} />
                        Service Offerings
                    </h3>

                    <div className={styles['form-group']}>
                        <label htmlFor="serviceType" className={styles['form-label']}>Service Type</label>
                        <div className={styles['input-with-edit']}>
                            {isEditing.serviceType ? (
                                <select
                                    className={styles['form-select']}
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
                                <div className={styles['form-display']}>
                                    <span>{formData.serviceType || 'Not Provided'}</span>
                                    <button className={styles['edit-btn']} onClick={() => toggleEdit('serviceType')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="hourlyRate" className={styles['form-label']}>Hourly Rate (NPR)</label>
                        <div className={styles['input-with-edit']}>
                            {isEditing.hourlyRate ? (
                                <input
                                    type="number"
                                    className={styles['form-input']}
                                    value={formData.hourlyRate}
                                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                                    onBlur={() => toggleEdit('hourlyRate')}
                                    placeholder="Enter your hourly rate"
                                    autoFocus
                                />
                            ) : (
                                <div className={styles['form-display']}>
                                    <span>{formData.hourlyRate ? `NPR ${formData.hourlyRate}/hour` : 'Not Provided'}</span>
                                    <button className={styles['edit-btn']} onClick={() => toggleEdit('hourlyRate')}>
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className={styles['form-section']}>
                    <h3 className={styles['section-title']}>Preferences</h3>

                    <div className={styles['form-group']}>
                        <label htmlFor="preferredLanguage" className={styles['form-label']}>Preferred Language</label>
                        <select
                            className={styles['form-select']}
                            value={formData.preferredLanguage}
                            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="timezone" className={styles['form-label']}>Time Zone</label>
                        <div className={styles['timezone-container']}>
                            <select
                                className={styles['form-select']}
                                value={formData.timezone}
                                onChange={(e) => handleInputChange('timezone', e.target.value)}
                            >
                                {COMMON_TIMEZONES.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                            <button
                                className={styles['detect-timezone-btn']}
                                onClick={handleAutoDetectTimezone}
                                type="button"
                            >
                                Auto-detect
                            </button>
                        </div>
                    </div>
                </section>

                <div className={styles['form-actions']}>
                    <button
                        className={styles['save-btn']}
                        onClick={handleSave}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 size={16} className="spinning" style={{marginRight: '0.5rem'}} />
                                Updating...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TechnicianProfileForm;