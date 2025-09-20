// import React, {useCallback, useEffect, useState} from "react";
// import {Camera, Edit3, MapPin, Plus, Search, Loader2, Navigation, Shield, FileText} from 'lucide-react';
// import '../../styles/UserProfileForm.css';
// import {
//     searchLocations,
//     getCurrentLocation,
//     estimateTimezone,
//     getBrowserTimezone,
//     debounce,
//     COMMON_TIMEZONES
// } from "../../Components/utils/locationApi.js";
// import Header2 from "../../Components/layout/Header2.jsx";
//
// const UserProfileForm = ({ userInfo, onUpdateProfile }) => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         phoneNumber: '',
//         address: '',
//         coordinates: null,
//         preferredLanguage: 'English',
//         timezone: 'Asia/Kathmandu (UTC+05:45)',
//         avatar: null,
//     });
//
//     const [isEditing, setIsEditing] = useState({
//             fullName: false,
//             email: false,
//             phoneNumber: false,
//             address: false,
//         }
//     );
//
//     const [addresses, setAddresses] = useState([
//         {id: 1, label: 'Home', address:'Kathmandu, Nepal'},
//         {id: 2, label: 'Office', address:'Chitwan, Nepal'},
//     ]);
//
//     // Locations and timezone states
//     const [locationSearch, setLocationSearch] = useState('');
//     const [locationSuggestions, setLocationSuggestions] = useState([]);
//     const [isSearchingLocation, setIsSearchingLocation] = useState(false);
//     const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
//     const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
//     const [error, setError] = useState(null);
//
//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//         setError(null);
//     };
//
//     const toggleEdit = (field) => {
//         setIsEditing(prev => ({
//             ...prev,
//             [field]: !prev[field]
//         }));
//     };
//
//     const handleSave = () => {
//         onUpdateProfile(formData);
//         setIsEditing({
//             fullName: false,
//             email: false,
//             phoneNumber: false,
//             address: false
//         });
//     };
//
//     //we can immediately preview the uploaded image without uploading it to the server
//     const handleAvatarChange = (event) => {
//         const file = event.target.files[0]; //access and contains the first file the user inputted (since only one file is sent)
//         if (file) {
//             const reader = new FileReader();  //built-in API called FileReader that can read the contents of files
//             reader.onload = (e) => {
//                 handleInputChange('avatar', e.target.result); // the result is a base64 encoded string
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//
//     //debounced location search, waiting until the user pauses typing before sending the API request.
//     const debouncedLocationSearch = useCallback(
//         debounce(async (query) => {
//             if (!query.trim() || query.length < 3) {
//                 setLocationSuggestions([]);
//                 return;
//             }
//
//             setIsSearchingLocation(true);
//             try {
//                 const suggestions = await searchLocations(query);
//                 setLocationSuggestions(suggestions);
//                 setError(null);
//             }catch(error) {
//                 console.error('Error searching location: ',error);
//                 setError('Failed to search locations. Please try again later.');
//                 setLocationSuggestions([]);
//             } finally {
//                 setIsSearchingLocation(false);
//             }
//         }, 300),
//         []
//     );
//
//     const handleGetCurrentLocation = async () => {
//         setIsGettingCurrentLocation(true);
//         setError(null);
//
//
//         try {
//             const locationData = await getCurrentLocation();
//
//             handleInputChange('address', locationData.displayName);
//             handleInputChange('coordinates', {lat: locationData.lat, lon: locationData.lon});
//
//             // get timezone for this location
//             const timezone = estimateTimezone(locationData.lat, locationData.lon);
//             handleInputChange('timezone', timezone);
//
//         }catch(error) {
//             console.error('Error getting current location: ',error);
//             setError(error.message);
//         }finally {
//             setIsGettingCurrentLocation(false);
//         }
//     };
//
//     const handleLocationSelect = async (location) => {
//         handleInputChange('address', location.address);
//         handleInputChange('coordinates', {lat: location.lat, lon: location.lon});
//         setLocationSearch(location.address); //updates search input with selected address
//         setLocationSuggestions([]);
//         setShowLocationSuggestions(false);
//
//         //get timezone for selected location
//         const timezone = estimateTimezone(location.lat, location.lon);
//         handleInputChange('timezone', timezone);
//     };
//
//     const addNewAddress = async () => {
//         if (!locationSearch.trim()) {
//             return;
//         }
//
//         try{
//             setIsSearchingLocation(true);
//             const suggestions = await searchLocations(locationSearch);
//
//             if (suggestions && suggestions[0]){
//                 const newAddress = {
//                     id: addresses.length + 1,
//                     label: `Address ${addresses.length + 1}`,
//                     address: suggestions[0].displayName,
//                     coordinates: {lat: suggestions[0].lat, lon: suggestions[0].lon}
//                 };
//
//                 setAddresses(prev => [...prev, newAddress]);
//                 setLocationSearch('');
//                 setError(null);
//             }
//         }catch(error) {
//             console.error('Error adding location: ',error);
//             setError('Failed to add location. Please try again later. ');
//         } finally {
//             setIsSearchingLocation(false);
//         }
//     };
//
//     const handleAutoDetectTimezone = () => {
//         const browserTimezone = getBrowserTimezone();
//         handleInputChange('timezone', browserTimezone);
//     };
//
//     //handle location search input changes
//     useEffect(() => {
//         if(locationSearch){
//             debouncedLocationSearch(locationSearch);
//         }else{
//             setLocationSuggestions([]);
//         }
//     }, [locationSearch, debouncedLocationSearch]);
//
//     const languages = ['English', 'Nepali', 'Hindi'];
//
//     const handleVerificationFileChange = (event, fieldName) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 handleInputChange(fieldName, e.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//
//     return (
//         <div>
//             <Header2 />
//         <div className="profile-content">
//         <div className="profile-form">
//             <div className="profile-header">
//                 <h1 className="profile-title">User Profile</h1>
//                 <p className="profile-subtitle">Manage your account settings and preferences.</p>
//             </div>
//
//             {/*Error Message */}
//             {error &&(
//                 <div className="error-message">
//                     <span>{error}</span>
//                     <button onClick= {() => setError(null)}>x</button>
//                 </div>
//             )}
//
//             {/*Profile picture section */}
//             <div className="profile-picture-section">
//                 <div className="profile-picture-container">
//                     <div className="profile-picture">
//                         {formData.avatar? (
//                             <img src={formData.avatar} className="profile-image" alt="Profile Avatar" />
//                         ): (
//                             <div className="profile-placeholder">
//                                 {formData.fullName ? formData.fullName.charAt(0).toUpperCase()  : 'You'} {/*if fullname given then shows the first letter in Capital*/}
//                             </div>
//                         )}
//
//                         <div className="profile-picture-overlay">
//                             <label htmlFor="avatar-upload" className="camera-btn">
//                                 <Camera size={20} />
//                                 <input
//                                     type='file'
//                                     id= "avatar-upload"
//                                     accept="image/*"
//                                     onChange={handleAvatarChange}
//                                     style={{ display: 'none' }}
//                                 />
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="profile-info">
//                     <h2 className="profile-name">{formData.fullName || 'Username'}</h2>
//                     <p className="profile-role">
//                         Client
//                     </p>
//                 </div>
//             </div>
//
//             {/*Account Information */}
//             <section className="form-section">
//                 <h3 className="section-title">Account Information</h3>
//
//                 <div className="form-group">
//                     <label htmlFor="fullName" className="form-label">Full Name</label>
//                     <div className = "input-with-edit">
//                         {isEditing.fullName ? (
//                             <input
//                                 type="text"
//                                 className="form-input"
//                                 value={formData.fullName}
//                                 onChange={(e) => handleInputChange('fullName',e.target.value)}
//                                 onBlur={() => toggleEdit('fullName')} //when the input loses focus (click outside), it calls toggleEdit('fullName') to exit edit mode.
//                                 autoFocus
//                             />
//                         ) : (
//                             <div className= "form-display">
//                                 <span> {formData.fullName || 'Not Provided'}</span>
//                                 <button
//                                     className="edit-btn"
//                                     onClick={() => toggleEdit('fullName')}
//                                 >
//                                     <Edit3 size={16} />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className="form-group">
//                     <label htmlFor="email" className="form-label">Email</label>
//                     <div className = "input-with-edit">
//                         {isEditing.email ? (
//                             <input
//                                 type="email"
//                                 className="form-input"
//                                 value={formData.email}
//                                 onChange={(e) => handleInputChange('email',e.target.value)}
//                                 onBlur={() => toggleEdit('email')}
//                                 autoFocus
//                             />
//                         ) : (
//                             <div className= "form-display">
//                                 <span> {formData.email || 'Not Provided'}</span>
//                                 <button
//                                     className="edit-btn"
//                                     onClick={() => toggleEdit('email')}
//                                 >
//                                     <Edit3 size={16} />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className="form-group">
//                     <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
//                     <div className = "input-with-edit">
//                         {isEditing.phoneNumber ? (
//                             <input
//                                 type="tel"
//                                 className="form-input"
//                                 value={formData.phoneNumber}
//                                 onChange={(e) => handleInputChange('phoneNumber',e.target.value)}
//                                 onBlur={() => toggleEdit('phoneNumber')} //when the input loses focus (click outside), it calls toggleEdit('fullName') to exit edit mode.
//                                 autoFocus
//                             />
//                         ) : (
//                             <div className= "form-display">
//                                 <span> {formData.phoneNumber || 'Not Provided'}</span>
//                                 <button
//                                     className="edit-btn"
//                                     onClick={() => toggleEdit('phoneNumber')}
//                                 >
//                                     <Edit3 size={16} />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className="form-group">
//                     <label htmlFor="address" className="form-label">Address</label>
//                     <div className = "location-input-container">
//                         <div className="location-search-wrapper">
//                             {isEditing.address ? (
//                                 <div className="location-search">
//                                     <input
//                                         type="text"
//                                         className="form-input"
//                                         value={locationSearch}
//                                         onChange={(e) => {
//                                             setLocationSearch(e.target.value);
//                                             setShowLocationSuggestions(true);
//                                         }}
//
//                                         onBlur={() => {
//                                             setTimeout(() => {
//                                                 setShowLocationSuggestions(false);
//                                                 toggleEdit('address');
//                                             }, 200);
//                                         }}
//                                         placeholder="Search for a location"
//                                         autoFocus
//                                     />
//                                     <button
//                                         className="current-location-btn"
//                                         onClick={handleGetCurrentLocation}
//                                         disabled={isGettingCurrentLocation}
//                                         type="button"
//                                     >
//                                         {isGettingCurrentLocation ? (
//                                             <Loader2 size={16} className="spinning"  />
//                                         ) : (
//                                             <Navigation size={16} />
//                                         )}
//                                     </button>
//
//                                     {showLocationSuggestions && locationSuggestions.length > 0 &&(
//                                         <div className="location-suggestions">
//                                             {locationSuggestions.map((location,index) => (
//                                                 <div
//                                                     key={index}
//                                                     className="location-suggestion"
//                                                     onClick={() => handleLocationSelect(location)}
//                                                 >
//                                                     <MapPin size={14} className="location-icon" />
//                                                     <div className="location-details">
//                                                         <div className="location-name">
//                                                             {location.city || location.state || 'Unknown'}
//                                                         </div>
//                                                         <div className="location-address">
//                                                             {location.displayName}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="form-display">
//                                     <span>{formData.address || 'Not Provided'}</span>
//                                     <button
//                                         className="edit-btn"
//                                         onClick={() => {
//                                         setLocationSearch(formData.address);
//                                         toggleEdit('address');
//                                         }}
//                                     >
//                                         <Edit3 size={16} />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </section>
//
//             {/* Verification Section */}
//             <section className="form-section">
//                 <h3 className="section-title">
//                     <Shield size={20} style={{marginRight: '0.5rem'}} />
//                     Verification Documents
//                 </h3>
//                 <p className="section-description">
//                     Upload verification documents to increase trust and credibility with clients.
//                 </p>
//
//                 <div className="verification-grid">
//                     <div className="verification-item">
//                         <label className="form-label">
//                             <FileText size={16} style={{marginRight: '0.5rem'}} />
//                             User Verification (Citizenship Photo)
//                         </label>
//                         <div className="file-upload-container">
//                             <div className="file-upload-area">
//                                 {formData.citizenshipPhoto ? (
//                                     <div className="uploaded-image">
//                                         <img
//                                             src={formData.citizenshipPhoto}
//                                             alt="Citizenship Document"
//                                             className="verification-image"
//                                         />
//                                         <div className="image-overlay">
//                                             <label htmlFor="citizenship-upload" className="change-image-btn">
//                                                 <Camera size={16} />
//                                                 Change
//                                             </label>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <label htmlFor="citizenship-upload" className="upload-placeholder">
//                                         <Camera size={32} />
//                                         <span>Upload Citizenship Photo</span>
//                                         <small>JPG, PNG up to 5MB</small>
//                                     </label>
//                                 )}
//                                 <input
//                                     type="file"
//                                     id="citizenship-upload"
//                                     accept="image/*"
//                                     onChange={(e) => handleVerificationFileChange(e, 'citizenshipPhoto')}
//                                     style={{ display: 'none' }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//
//
//                     {/*Preferences */}
//             <section className = "form-section">
//                 <h3 className="section-title">Preferences</h3>
//
//                 <div className="form-group">
//                     <label htmlFor="preference" className="form-label">Preferred Language</label>
//                     <select
//                         className="form-select"
//                         value={ formData.preferredLanguage}
//                         onChange={(e) => handleInputChange('preferredLanguage',e.target.value)}
//                     >
//                         {languages.map(lang => (
//                             <option key={lang} value={lang}> {lang} </option>
//                         ))}
//                     </select>
//                 </div>
//
//                 <div className="form-group">
//                     <label htmlFor="timezone" className="form-label">Time Zone</label>
//                     <div className="timezone-container">
//                         <select
//                             className="form-select"
//                             value={ formData.timezone }
//                             onChange={(e) => handleInputChange('timezone',e.target.value)}
//                         >
//                             {COMMON_TIMEZONES.map(tz => (
//                                 <option key={tz} value={tz}> {tz}</option>
//                             ))}
//                         </select>
//                         <button
//                             className="detect-timezone-btn"
//                             onClick = {handleAutoDetectTimezone}
//                             type="button"
//                         >
//                             Auto-detect
//                         </button>
//                     </div>
//                 </div>
//             </section>
//
//             <div className="form-actions">
//                 <button className="save-btn" onClick={handleSave}>
//                     Save Changes
//                 </button>
//             </div>
//         </div>
//         </div>
//         </div>
//     );
// };
//
// export default UserProfileForm;

import React, {useCallback, useEffect, useState} from "react";
import {Camera, Edit3, MapPin, Plus, Search, Loader2, Navigation, Shield, FileText} from 'lucide-react';
import '../../styles/UserProfileForm.css';
import {
    searchLocations,
    getCurrentLocation,
    estimateTimezone,
    getBrowserTimezone,
    debounce,
    COMMON_TIMEZONES
} from "../../Components/utils/locationApi.js";
import Header2 from "../../Components/layout/Header2.jsx";

const UserProfileForm = ({ userInfo, onUpdateProfile }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        coordinates: null,
        preferredLanguage: 'English',
        timezone: 'Asia/Kathmandu (UTC+05:45)',
        avatar: null,
        profileImageFile: null,
        citizenshipPhoto: null,
        citizenshipPhotoFile: null,
    });

    const [isEditing, setIsEditing] = useState({
            fullName: false,
            email: false,
            phoneNumber: false,
            address: false,
        }
    );

    const [addresses, setAddresses] = useState([
        {id: 1, label: 'Home', address:'Kathmandu, Nepal'},
        {id: 2, label: 'Office', address:'Chitwan, Nepal'},
    ]);

    // Locations and timezone states
    const [locationSearch, setLocationSearch] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Autofill name and email from localStorage on component mount
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
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                handleInputChange(fieldName, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper function to get JWT token from cookie
    const getJWTFromCookie = () => {
        // Your backend uses "Access" cookie name
        const name = "Access=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        console.log('All cookies:', document.cookie); // Debug log

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                const token = cookie.substring(name.length, cookie.length);
                console.log('Found Access token:', token ? 'Token exists' : 'Token is empty'); // Debug log
                return token;
            }
        }
        console.log('No Access token found in cookies'); // Debug log
        return null;
    };

    const getProfileImageUrl = (filename) => {
        if (!filename) return null;
        return `/upload/users/profile-image/${filename}`;  // Remove 's' from 'uploads'
    };

    const getFileUrl = (filename) => {
        if (!filename) return null;
        return `/upload/users/documents/${filename}`;      // Remove 's' from 'uploads'
    };
    // Fetch profile data from backend
    const fetchProfile = async () => {
        try {
            // 1️⃣ Retrieve email from localStorage
            const email = localStorage.getItem('userEmail');
            if (!email) {
                console.error('No email found in localStorage');
                return;
            }
            const response = await fetch(`api/users/profile?email=${email}`, {
                method: 'GET',
                credentials: 'include',
            });
            // 3️⃣ Handle response
            if (response.ok) {
                const data = await response.json();

                console.log('Profile image path:', data.profileImagePath);
                console.log('Document path:', data.documentPath);

                const avatarUrl = getProfileImageUrl(data.profileImagePath);
                const docUrl = getFileUrl(data.documentPath);

                // 4️⃣ Map backend data to formData
                setFormData(prev => ({
                    ...prev,
                    fullName: data.username || '',
                    email: data.email || '',
                    phoneNumber: data.phone || '',
                    address: data.address || '',
                    avatar: avatarUrl || null,
                    citizenshipPhoto: docUrl || null,
                }));

                // 5️⃣ Optionally update localStorage
                if (data.username) localStorage.setItem('userName', data.username);
                if (data.email) localStorage.setItem('userEmail', data.email);

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
            formData.coordinates.lon.toString();
        }

        if (formData.profileImageFile) {
            formDataToSend.append('profile_image', formData.profileImageFile);
        }

        if (formData.citizenshipPhotoFile) {
            formDataToSend.append('valid_doc', formData.citizenshipPhotoFile);
        }

        // Get JWT token from cookie
        const token = getJWTFromCookie();
        console.log('Token for request:', token ? 'Token found' : 'No token'); // Debug log

        // Debug: Log what we're sending
        console.log('Sending to backend:');
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, typeof value === 'object' ? 'File' : value);
        }

        try {
            const response = await fetch('api/users/update-profile', {
                method: 'POST',
                headers: {
                    // Since your backend checks both Authorization header AND cookies,
                    // we'll include both for maximum compatibility
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include', // This sends the Access cookie automatically
                body: formDataToSend,
            });

            console.log('Response status:', response.status); // Debug log

            if (response.ok) {
                const result = await response.text();
                setSuccessMessage(result);
                setError(null);

                // Update localStorage with new values
                if (formData.fullName) {
                    localStorage.setItem('userName', formData.fullName);
                }
                if (formData.email) {
                    localStorage.setItem('userEmail', formData.email);
                }

                // Call parent component callback if provided
                if (onUpdateProfile) {
                    onUpdateProfile(formData);
                }
            } else if (response.status === 401) {
                 new Error('Session expired or invalid. Please login again.');
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText); // Debug log
                 new Error(errorText || 'Failed to update profile');
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
                address: false
            });
        } catch (error) {
            console.error('Save operation failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    //debounced location search, waiting until the user pauses typing before sending the API request.
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
            }catch(error) {
                console.error('Error searching location: ',error);
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

            // get timezone for this location
            const timezone = estimateTimezone(locationData.lat, locationData.lon);
            handleInputChange('timezone', timezone);

        }catch(error) {
            console.error('Error getting current location: ',error);
            setError(error.message);
        }finally {
            setIsGettingCurrentLocation(false);
        }
    };

    const handleLocationSelect = async (location) => {
        handleInputChange('address', location.address);
        handleInputChange('coordinates', {lat: location.lat, lon: location.lon});
        setLocationSearch(location.address); //updates search input with selected address
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);

        //get timezone for selected location
        const timezone = estimateTimezone(location.lat, location.lon);
        handleInputChange('timezone', timezone);
    };

    const addNewAddress = async () => {
        if (!locationSearch.trim()) {
            return;
        }

        try{
            setIsSearchingLocation(true);
            const suggestions = await searchLocations(locationSearch);

            if (suggestions && suggestions[0]){
                const newAddress = {
                    id: addresses.length + 1,
                    label: `Address ${addresses.length + 1}`,
                    address: suggestions[0].displayName,
                    coordinates: {lat: suggestions[0].lat, lon: suggestions[0].lon}
                };

                setAddresses(prev => [...prev, newAddress]);
                setLocationSearch('');
                setError(null);
            }
        }catch(error) {
            console.error('Error adding location: ',error);
            setError('Failed to add location. Please try again later. ');
        } finally {
            setIsSearchingLocation(false);
        }
    };

    const handleAutoDetectTimezone = () => {
        const browserTimezone = getBrowserTimezone();
        handleInputChange('timezone', browserTimezone);
    };

    //handle location search input changes
    useEffect(() => {
        if(locationSearch){
            debouncedLocationSearch(locationSearch);
        }else{
            setLocationSuggestions([]);
        }
    }, [locationSearch, debouncedLocationSearch]);

    const languages = ['English', 'Nepali', 'Hindi'];

    return (
        <div>
            <Header2 />
            <div className="profile-content">
                <div className="profile-form">
                    <div className="profile-header">
                        <h1 className="profile-title">User Profile</h1>
                        <p className="profile-subtitle">Manage your account settings and preferences.</p>
                    </div>

                    {/*Error Message */}
                    {error &&(
                        <div className="error-message">
                            <span>{error}</span>
                            <button onClick= {() => setError(null)}>x</button>
                        </div>
                    )}

                    {/*Success Message */}
                    {successMessage &&(
                        <div className="success-message">
                            <span>{successMessage}</span>
                            <button onClick= {() => setSuccessMessage('')}>x</button>
                        </div>
                    )}

                    {/*Profile picture section */}
                    <div className="profile-picture-section">
                        <div className="profile-picture-container">
                            <div className="profile-picture">
                                {formData.avatar? (
                                    <img src={formData.avatar} className="profile-image" alt="Profile Avatar" />
                                ): (
                                    <div className="profile-placeholder">
                                        {formData.fullName ? formData.fullName.charAt(0).toUpperCase()  : 'You'} {/*if fullname given then shows the first letter in Capital*/}
                                    </div>
                                )}

                                <div className="profile-picture-overlay">
                                    <label htmlFor="avatar-upload" className="camera-btn">
                                        <Camera size={20} />
                                        <input
                                            type='file'
                                            id= "avatar-upload"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="profile-info">
                            <h2 className="profile-name">{formData.fullName || 'Username'}</h2>
                            <p className="profile-role">
                                Client
                            </p>
                        </div>
                    </div>

                    {/*Account Information */}
                    <section className="form-section">
                        <h3 className="section-title">Account Information</h3>

                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <div className = "input-with-edit">
                                {isEditing.fullName ? (
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName',e.target.value)}
                                        onBlur={() => toggleEdit('fullName')} //when the input loses focus (click outside), it calls toggleEdit('fullName') to exit edit mode.
                                        autoFocus
                                    />
                                ) : (
                                    <div className= "form-display">
                                        <span> {formData.fullName || 'Not Provided'}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => toggleEdit('fullName')}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className = "input-with-edit">
                                {isEditing.email ? (
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email',e.target.value)}
                                        onBlur={() => toggleEdit('email')}
                                        autoFocus
                                    />
                                ) : (
                                    <div className= "form-display">
                                        <span> {formData.email || 'Not Provided'}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => toggleEdit('email')}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <div className = "input-with-edit">
                                {isEditing.phoneNumber ? (
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber',e.target.value)}
                                        onBlur={() => toggleEdit('phoneNumber')} //when the input loses focus (click outside), it calls toggleEdit('fullName') to exit edit mode.
                                        autoFocus
                                    />
                                ) : (
                                    <div className= "form-display">
                                        <span> {formData.phoneNumber || 'Not Provided'}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => toggleEdit('phoneNumber')}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Address</label>
                            <div className = "location-input-container">
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
                                                    <Loader2 size={16} className="spinning"  />
                                                ) : (
                                                    <Navigation size={16} />
                                                )}
                                            </button>

                                            {showLocationSuggestions && locationSuggestions.length > 0 &&(
                                                <div className="location-suggestions">
                                                    {locationSuggestions.map((location,index) => (
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
                        </div>
                    </section>


                    {/*Preferences */}
                    <section className = "form-section">
                        <h3 className="section-title">Preferences</h3>

                        <div className="form-group">
                            <label htmlFor="preference" className="form-label">Preferred Language</label>
                            <select
                                className="form-select"
                                value={ formData.preferredLanguage}
                                onChange={(e) => handleInputChange('preferredLanguage',e.target.value)}
                            >
                                {languages.map(lang => (
                                    <option key={lang} value={lang}> {lang} </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="timezone" className="form-label">Time Zone</label>
                            <div className="timezone-container">
                                <select
                                    className="form-select"
                                    value={ formData.timezone }
                                    onChange={(e) => handleInputChange('timezone',e.target.value)}
                                >
                                    {COMMON_TIMEZONES.map(tz => (
                                        <option key={tz} value={tz}> {tz}</option>
                                    ))}
                                </select>
                                <button
                                    className="detect-timezone-btn"
                                    onClick = {handleAutoDetectTimezone}
                                    type="button"
                                >
                                    Auto-detect
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button
                            className="save-btn"
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
        </div>
    );
};

export default UserProfileForm;