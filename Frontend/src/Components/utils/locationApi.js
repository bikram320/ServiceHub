const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

//configuration
const API_CONFIG = {
    searchLimit: 5,//Limits how many results the Nominatim search API should return at once.
    debounceDelay: 300,
    requestTimeout: 5000
};

//these are JSDoc, They describe what the function does, its parameters, and what it returns, provides type-like hints (you can ignore them)
/**
 * Search for locations using Nominatim API
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of location results
 */

// Search for locations (forward geocoding)
export const searchLocations = async (query) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );

        if (!response.ok) {
            throw new Error('Failed to search locations');
        }

        const data = await response.json();

        return data.map(item => ({
            displayName: item.display_name,
            address: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            city: item.address?.city || item.address?.town || item.address?.village,
            state: item.address?.state,
            country: item.address?.country,
            postcode: item.address?.postcode
        }));
    } catch (error) {
        console.error('Location search error:', error);
        throw error;
    }
};

/**
* Reverse geocode coordinates to get address
* @param {number} lat - Latitude
* @param {number} lon - Longitude
* @returns {Promise<Object>} - Location object
*/

export const reverseGeocode = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
        );

        if (!response.ok){
            throw new Error(`Failed to reverse geocode: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.display_name){
            throw new Error('No address found for these coordinates.');
        }

        return {
            displayName: data.display_name,
            address: data.display_name,
            lat: parseFloat(data.lat),
            lon: parseFloat(data.lon),
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            country: data.address?.country,
            postcode: data.address?.postcode
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw new Error('Failed to get address for current location');
    }
};

/**
 * Get current user location using browser geolocation
 * @returns {Promise<Object>} - Location with coordinates and address
 */

// Get current location and convert to address
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    console.log('Raw coordinates:', latitude, longitude);

                    // Reverse geocode the coordinates to get address
                    const addressData = await reverseGeocode(latitude, longitude);
                    console.log('Address data:', addressData);

                    resolve(addressData);
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                let errorMessage = 'Failed to get current location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timeout';
                        break;
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000 // 10 minutes
            }
        );
    });
};


/**
* Estimate timezone based on coordinates
* @param {number} lat - Latitude
* @param {number} lon - Longitude
* @returns {string} - Estimated timezone
*/

// Estimate timezone based on coordinates
export const estimateTimezone = (lat, lon) => {
    // Simple timezone estimation - you might want to use a more sophisticated API
    // This is a basic implementation for common regions

    // Nepal coordinates (approximate)
    if (lat >= 26 && lat <= 31 && lon >= 80 && lon <= 89) {
        return 'Asia/Kathmandu (UTC+05:45)';
    }

    // India coordinates (approximate)
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
        return 'Asia/Kolkata (UTC+05:30)';
    }

    // Default fallback
    return getBrowserTimezone();
};

/**
 * Get browser's detected timezone
 * @returns {string} - Browser timezone with offset
 */

export const getBrowserTimezone = () => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = new Date().getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset > 0 ? '-' : '+';

        return `${timezone} (UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')})`;
    } catch (error) {
        return 'UTC (UTC+00:00)';
    }
};

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Common timezone list
export const COMMON_TIMEZONES = [
    'Asia/Kathmandu (UTC+05:45)',
    'Asia/Kolkata (UTC+05:30)',
    'UTC+00:00 (Greenwich Mean Time)',

];

export default {
    searchLocations,
    reverseGeocode,
    getCurrentLocation,
    estimateTimezone,
    getBrowserTimezone,
    debounce,
    COMMON_TIMEZONES,
};