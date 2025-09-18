import React, {useCallback, useEffect, useState, useRef } from 'react';
import {Calendar, Camera, Edit3, MapPin, Plus, Search, Loader2, Navigation,Clock, DollarSign, Wrench, User, Phone, Mail, Home} from 'lucide-react';
import {
    searchLocations,
    getCurrentLocation,
    estimateTimezone,
    getBrowserTimezone,
    debounce,
    COMMON_TIMEZONES
} from "../../Components/utils/locationApi.js";
import "../../styles/TechnicianProfile.css";

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
        availabilityDetails: ''
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

    //calendar state
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'AC Repair',
            start: new Date(2025, 8, 15, 9, 0), // Year, Month (0-based: jan is 0), Day, Hour, Minute
            end: new Date(2025, 8, 15, 11, 0),    // optional, defines when it ends
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

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        type: 'available'
    });

    //location and timezones states
    const [locationSearch, setLocationSearch] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
    const [error, setError] = useState(null);

    const calendarRef = useRef(null);

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

    //Calendar functions
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setNewEvent({
            ...newEvent, //keeps existing fields from the event object like title, description
            start: date.toISOString().slice(0, 16), //toISOString: converts date to string, slice: here removes the extra info(seconds,minutes)
            end: new Date(date.getTime() + 60*60*1000).toISOString().slice(0, 16) //sets the end time 1 hour after the start
        });
        setShowEventModal(true); //Opens a popup form(modal) where the user can edit event details
    };

    const handleEventSubmit = (e) => {
        e.preventDefault();
        if (newEvent.title && newEvent.start && newEvent.end) {
            const event = {
                id: events.length + 1,
                title: newEvent.title,
                start: new Date(newEvent.start),
                end: new Date(newEvent.end),
                type: newEvent.type,
            }
            setEvents([...events, event]); //Takes all previous events and adds the new one(updates calendar with new entry)
            setShowEventModal(false);
            setNewEvent({
                title: '',
                start: '',
                end: '',
                type: 'available'
            }); //resets form
        }
    };

    const renderCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay); //Makes a copy of firstDay
        startDate.setDate(startDate.getDate() - firstDay.getDay()); //Find calendar start date, aligns so that the first day is sunday

        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 1; i < 42; i++) { // 6(rows) * 7(columns) = 42
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayEvents = events.filter((event) =>
                event.start.toDateString() === date.toDateString()
            );

            days.push(
                <div
                    key={i}
                    className={`calendar-day $(date.getMonth() !== currentMonth ? 'other-month : ''} ${date.toDateString() === today.toDateString()? 'today' : ''}`}
                    onClick={() => handleDateClick(date)}
                >
                    <span className = "day-number">{date.getDate()}</span>
                    {dayEvents.map(event => (
                        <div key={event.id} className={`event event-${event.type}`}>
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    <h3>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                </div>
                <div className="calendar-grid">
                    {dayNames.map(day => (
                        <div key={day} className="calendar-day-header">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
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

                    {/* Calendar Section */}
                    <div className="calendar-section">
                        <h4 className="calendar-title">
                            <Calendar size={18} style={{marginRight: '0.5rem'}} />
                            Schedule Calendar
                        </h4>
                        {renderCalendar()}
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

            {/* Event Modal */}
            {showEventModal && (
                <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add Event</h3>
                        <form onSubmit={handleEventSubmit}>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    placeholder="Enter event title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.start}
                                    onChange={(e) => handleStartTimeChange(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (hours)</label>
                                <select
                                    className="form-select"
                                    value={newEvent.duration}
                                    onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
                                >
                                    <option value={0.5}>30 minutes</option>
                                    <option value={1}>1 hour</option>
                                    <option value={1.5}>1.5 hours</option>
                                    <option value={2}>2 hours</option>
                                    <option value={3}>3 hours</option>
                                    <option value={4}>4 hours</option>
                                    <option value={6}>6 hours</option>
                                    <option value={8}>8 hours</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.end}
                                    onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                                    required
                                />
                                <small style={{color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>
                                    End time will auto-update when you change duration or start time
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Event Type</label>
                                <select
                                    className="form-select"
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                                >
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowEventModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicianProfileForm;

// Example:
// try {
//   const response = await api.userLogin(loginData);
//   console.log('Login successful:', response);
//   // Redirect to dashboard or home
//   navigate('/dashboard');
// } catch (error) {
//   console.error('Login failed:', error);
//   alert('Login failed. Please check your credentials.');
// }