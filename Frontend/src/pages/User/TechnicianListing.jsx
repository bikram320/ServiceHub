// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Star, MapPin, Phone, Mail, Shield, Award, Clock, Search, Filter } from 'lucide-react';
// import styles from '../../styles/TechnicianListing.module.css';
// import Header from "../../Components/layout/Header.jsx";
//
// const TechnicianListing = () => {
//     const navigate = useNavigate(); // Add this hook
//     const [technicians, setTechnicians] = useState([]);
//     const [filteredTechnicians, setFilteredTechnicians] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterBy, setFilterBy] = useState('all');
//     const [sortBy, setSortBy] = useState('rating');
//
//     // Mock data for technicians
//     useEffect(() => {
//         const mockTechnicians = [
//             {
//                 id: 1,
//                 name: 'Sushil Gurung',
//                 specialty: 'Plumbing - Leak Repair',
//                 rating: 4.9,
//                 reviews: 127,
//                 location: 'Kathmandu, Nepal',
//                 phone: '+977 9841234567',
//                 email: 'sushil.gurung@email.com',
//                 verified: true,
//                 topRated: true,
//                 hourlyRate: 800,
//                 image: '/api/placeholder/300/300',
//                 description: 'Fully certified and licensed for all residential and commercial plumbing.',
//                 services: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning']
//             },
//             {
//                 id: 2,
//                 name: 'Ramesh Pun',
//                 specialty: 'Plumbing - Drain Cleaning',
//                 rating: 4.7,
//                 reviews: 89,
//                 location: 'Pokhara, Nepal',
//                 phone: '+977 9851234567',
//                 email: 'ramesh.pun@email.com',
//                 verified: true,
//                 topRated: true,
//                 hourlyRate: 750,
//                 image: '/api/placeholder/300/300',
//                 description: 'Fully certified and licensed for all residential and commercial plumbing.',
//                 services: ['Drain Cleaning', 'Toilet Repair', 'Water Heater']
//             },
//             {
//                 id: 3,
//                 name: 'Amit Sharma',
//                 specialty: 'Electrical - Wiring',
//                 rating: 4.8,
//                 reviews: 156,
//                 location: 'Lalitpur, Nepal',
//                 phone: '+977 9861234567',
//                 email: 'amit.sharma@email.com',
//                 verified: true,
//                 topRated: true,
//                 hourlyRate: 900,
//                 image: '/api/placeholder/300/300',
//                 description: 'Expert electrical technician with 10+ years experience.',
//                 services: ['Home Wiring', 'Circuit Repair', 'Appliance Installation']
//             },
//             {
//                 id: 4,
//                 name: 'Prakash Thapa',
//                 specialty: 'Carpentry - Furniture',
//                 rating: 4.6,
//                 reviews: 73,
//                 location: 'Bhaktapur, Nepal',
//                 phone: '+977 9841234568',
//                 email: 'prakash.thapa@email.com',
//                 verified: false,
//                 topRated: false,
//                 hourlyRate: 650,
//                 image: '/api/placeholder/300/300',
//                 description: 'Skilled carpenter specializing in custom furniture and repairs.',
//                 services: ['Custom Furniture', 'Door Repair', 'Cabinet Installation']
//             },
//             {
//                 id: 5,
//                 name: 'Ravi Kumar',
//                 specialty: 'HVAC - Air Conditioning',
//                 rating: 4.9,
//                 reviews: 203,
//                 location: 'Kathmandu, Nepal',
//                 phone: '+977 9871234567',
//                 email: 'ravi.kumar@email.com',
//                 verified: true,
//                 topRated: true,
//                 hourlyRate: 1000,
//                 image: '/api/placeholder/300/300',
//                 description: 'Professional HVAC technician with advanced certifications.',
//                 services: ['AC Installation', 'AC Repair', 'Maintenance']
//             },
//             {
//                 id: 6,
//                 name: 'Bikram Rai',
//                 specialty: 'Plumbing - Installation',
//                 rating: 4.5,
//                 reviews: 94,
//                 location: 'Chitwan, Nepal',
//                 phone: '+977 9881234567',
//                 email: 'bikram.rai@email.com',
//                 verified: true,
//                 topRated: false,
//                 hourlyRate: 700,
//                 image: '/api/placeholder/300/300',
//                 description: 'Experienced plumber for all types of installations and repairs.',
//                 services: ['Pipe Installation', 'Bathroom Fixtures', 'Kitchen Plumbing']
//             }
//         ];
//
//         setTechnicians(mockTechnicians);
//         setFilteredTechnicians(mockTechnicians);
//     }, []);
//
//     // Navigation functions
//     const handleViewProfile = (technicianId) => {
//         //navigate(`/technician-profile/${technicianId}`);
//         navigate("/TechnicianProfile");
//     };
//
//     const handleContactTechnician = (technician) => {
//         // Option 1: Navigate to contact page with technician data
//        // navigate('/contact-technician', { state: { technician } });
//
//         navigate("/BookingDetail");
//         // Option 2: Or you could implement direct contact functionality here
//         // For example: open phone dialer or email client
//         // window.location.href = `tel:${technician.phone}`;
//         // window.location.href = `mailto:${technician.email}`;
//     };
//
//     // Filter and search functionality
//     useEffect(() => {
//         let filtered = technicians;
//
//         // Apply search filter
//         if (searchTerm) {
//             filtered = filtered.filter(tech =>
//                 tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 tech.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
//             );
//         }
//
//         // Apply category filter
//         if (filterBy !== 'all') {
//             if (filterBy === 'topRated') {
//                 filtered = filtered.filter(tech => tech.topRated);
//             } else if (filterBy === 'verified') {
//                 filtered = filtered.filter(tech => tech.verified);
//             } else {
//                 filtered = filtered.filter(tech =>
//                     tech.specialty.toLowerCase().includes(filterBy.toLowerCase())
//                 );
//             }
//         }
//
//         // Apply sorting
//         filtered = [...filtered].sort((a, b) => {
//             switch (sortBy) {
//                 case 'rating':
//                     return b.rating - a.rating;
//                 case 'reviews':
//                     return b.reviews - a.reviews;
//                 case 'price-low':
//                     return a.hourlyRate - b.hourlyRate;
//                 case 'price-high':
//                     return b.hourlyRate - a.hourlyRate;
//                 default:
//                     return 0;
//             }
//         });
//
//         setFilteredTechnicians(filtered);
//     }, [searchTerm, filterBy, sortBy, technicians]);
//
//     const renderStars = (rating) => {
//         return Array.from({ length: 5 }, (_, i) => (
//             <Star
//                 key={i}
//                 size={16}
//                 className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
//                 fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
//             />
//         ));
//     };
//
//     return (
//         <div className={styles.pageContainer}>
//             {/* Header */}
//             <Header />
//
//             {/* Search and Filter Section */}
//             <div className={styles.searchSection}>
//                 <div className={styles.container}>
//                     <div className={styles.searchHeader}>
//                         <h1 className={styles.resultsTitle}>Available Technicians</h1>
//                         <p className={styles.resultsSubtitle}>
//                             Found {filteredTechnicians.length} technicians for your service needs
//                         </p>
//                     </div>
//
//                     <div className={styles.searchFilters}>
//                         <div className={styles.searchContainer}>
//                             <div className={styles.searchWrapper}>
//                                 <Search className={styles.searchIcon} size={20} />
//                                 <input
//                                     type="text"
//                                     className={styles.searchInput}
//                                     placeholder="Search by name, service, or specialty..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//
//                         <div className={styles.filterControls}>
//                             <select
//                                 className={styles.filterSelect}
//                                 value={filterBy}
//                                 onChange={(e) => setFilterBy(e.target.value)}
//                             >
//                                 <option value="all">All Categories</option>
//                                 <option value="plumbing">Plumbing</option>
//                                 <option value="electrical">Electrical</option>
//                                 <option value="carpentry">Carpentry</option>
//                                 <option value="hvac">HVAC</option>
//                                 <option value="topRated">Top Rated</option>
//                                 <option value="verified">Verified Only</option>
//                             </select>
//
//                             <select
//                                 className={styles.sortSelect}
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                             >
//                                 <option value="rating">Highest Rated</option>
//                                 <option value="reviews">Most Reviews</option>
//                                 <option value="price-low">Price: Low to High</option>
//                                 <option value="price-high">Price: High to Low</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Technicians Grid */}
//             <div className={styles.container}>
//                 <div className={styles.techniciansGrid}>
//                     {filteredTechnicians.map((technician) => (
//                         <div key={technician.id} className={styles.technicianCard}>
//                             {technician.topRated && (
//                                 <div className={styles.topRatedBadge}>Top Rated</div>
//                             )}
//
//                             <div className={styles.cardHeader}>
//                                 <div className={styles.profileImage}>
//                                     <img
//                                         src={technician.image}
//                                         alt={technician.name}
//                                         className={styles.technicianImage}
//                                     />
//                                 </div>
//                                 <div className={styles.technicianInfo}>
//                                     <div className={styles.nameSection}>
//                                         <h3 className={styles.technicianName}>
//                                             {technician.name}
//                                             {technician.verified && (
//                                                 <Shield className={styles.verifiedIcon} size={16} />
//                                             )}
//                                         </h3>
//                                         <p className={styles.specialty}>{technician.specialty}</p>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className={styles.cardBody}>
//                                 <div className={styles.ratingSection}>
//                                     <div className={styles.stars}>
//                                         {renderStars(technician.rating)}
//                                     </div>
//                                     <span className={styles.ratingText}>
//                                         {technician.rating} ({technician.reviews} Reviews)
//                                     </span>
//                                 </div>
//
//                                 <p className={styles.description}>{technician.description}</p>
//
//                                 <div className={styles.servicesList}>
//                                     {technician.services.map((service, index) => (
//                                         <span key={index} className={styles.serviceTag}>
//                                             {service}
//                                         </span>
//                                     ))}
//                                 </div>
//
//                                 <div className={styles.contactInfo}>
//                                     <div className={styles.contactItem}>
//                                         <MapPin size={14} />
//                                         <span>{technician.location}</span>
//                                     </div>
//                                     <div className={styles.contactItem}>
//                                         <Clock size={14} />
//                                         <span>Rs. {technician.hourlyRate}/hour</span>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className={styles.cardActions}>
//                                 <button
//                                     className={styles.contactBtn}
//                                     onClick={() => handleContactTechnician(technician)}
//                                 >
//                                     <Phone size={16} />
//                                     Contact
//                                 </button>
//                                 <button
//                                     className={styles.profileBtn}
//                                     onClick={() => handleViewProfile(technician.id)}
//                                 >
//                                     View Profile
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//
//                 {filteredTechnicians.length === 0 && (
//                     <div className={styles.noResults}>
//                         <h3>No technicians found</h3>
//                         <p>Try adjusting your search or filters to find more technicians.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default TechnicianListing;
// Updated TechnicianListing.jsx with proper JWT authentication
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Shield, Award, Clock, Search, Filter, Calendar } from 'lucide-react';
import styles from '../../styles/TechnicianListing.module.css';
import Header from "../../Components/layout/Header.jsx";

const TechnicianListing = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [technicians, setTechnicians] = useState([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Image URL helper function
    const getProfileImageUrl = (dbPath) => {
        if (!dbPath) return null;
        const cleanPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath;
        return `http://localhost:8080/${cleanPath}`;
    };

    // Fetch technicians from backend
    const fetchTechniciansBySkill = async (skill) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/users/get-technicians-based-on-skill?skill=${encodeURIComponent(skill)}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please log in to view technicians.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. You do not have permission to view technicians.');
                } else if (response.status === 404) {
                    throw new Error(`No technicians found for "${skill}"`);
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                }
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched technicians:', data);
            return data;

        } catch (error) {
            console.error('Error fetching technicians:', error);

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection and try again.');
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Load technicians when component mounts
    useEffect(() => {
        const loadTechnicians = async () => {
            try {
                const searchSkill = location.state?.searchSkill;

                if (searchSkill) {
                    setSearchTerm(searchSkill);
                    try {
                        const technicianData = await fetchTechniciansBySkill(searchSkill);
                        setTechnicians(technicianData);
                        setFilteredTechnicians(technicianData);
                    } catch (apiError) {
                        console.warn('API failed:', apiError.message);
                        setError(apiError.message);
                        setTechnicians([]);
                        setFilteredTechnicians([]);
                    }
                } else {
                    // Load default technicians (Plumbing)
                    try {
                        const defaultTechnicians = await fetchTechniciansBySkill('Plumbing');
                        setTechnicians(defaultTechnicians);
                        setFilteredTechnicians(defaultTechnicians);
                        setSearchTerm('Plumbing');
                    } catch (apiError) {
                        console.warn('API failed for default load:', apiError.message);
                        setError(apiError.message);
                        setTechnicians([]);
                        setFilteredTechnicians([]);
                        setSearchTerm('Plumbing');
                    }
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                setError('An unexpected error occurred. Please try again.');
                setTechnicians([]);
                setFilteredTechnicians([]);
            }
        };

        loadTechnicians();
    }, [location.state, navigate]);

    // Handle search within the page
    const handleSearch = async (newSearchTerm) => {
        if (newSearchTerm.trim()) {
            try {
                const technicianData = await fetchTechniciansBySkill(newSearchTerm);
                setTechnicians(technicianData);
                setFilteredTechnicians(technicianData);
                setSearchTerm(newSearchTerm);
                setError(null);
            } catch (error) {
                setError(error.message);
                setTechnicians([]);
                setFilteredTechnicians([]);
            }
        }
    };

    // Navigation functions
    const handleViewProfile = (technician) => {
        // Pass technician email to profile page
        navigate('/TechnicianProfile', {
            state: {
                technicianEmail: technician.technicianEmail || technician.email,
                technicianData: technician
            }
        });
    };

    const handleBookNow = (technician) => {
        // Navigate to booking page with complete technician data
        navigate('/BookingDetail', {
            state: {
                technician: {
                    techId: technician.techId,
                    technicianName: technician.technicianName,
                    serviceName: technician.serviceName,
                    technicianPhone: technician.technicianPhone,
                    technicianAddress: technician.technicianAddress,
                    technicianBio: technician.technicianBio,
                    imageFile: technician.imageFile,
                    feeCharge: technician.feeCharge,
                    technicianEmail: technician.technicianEmail
                }
            }
        });
    };

    // Filter and sort functionality
    useEffect(() => {
        let filtered = [...technicians];

        // Apply local search filter
        if (searchTerm && technicians.length > 0) {
            const localSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(tech =>
                tech.technicianName.toLowerCase().includes(localSearchTerm) ||
                tech.serviceName.toLowerCase().includes(localSearchTerm) ||
                tech.technicianBio.toLowerCase().includes(localSearchTerm) ||
                tech.technicianAddress.toLowerCase().includes(localSearchTerm)
            );
        }

        // Apply sorting
        filtered = filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.technicianName.localeCompare(b.technicianName);
                case 'location':
                    return a.technicianAddress.localeCompare(b.technicianAddress);
                case 'price-low':
                    return (parseFloat(a.feeCharge) || 0) - (parseFloat(b.feeCharge) || 0);
                case 'price-high':
                    return (parseFloat(b.feeCharge) || 0) - (parseFloat(a.feeCharge) || 0);
                default:
                    return 0;
            }
        });

        setFilteredTechnicians(filtered);
    }, [searchTerm, sortBy, technicians]);

    // Loading state
    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading technicians...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Header />

            {/* Search and Filter Section */}
            <div className={styles.searchSection}>
                <div className={styles.container}>
                    <div className={styles.searchHeader}>
                        <h1 className={styles.resultsTitle}>
                            Available Technicians
                            {searchTerm && ` for "${searchTerm}"`}
                        </h1>
                        <p className={styles.resultsSubtitle}>
                            Found {filteredTechnicians.length} technicians for your service needs
                        </p>
                    </div>

                    <div className={styles.searchFilters}>
                        <div className={styles.searchContainer}>
                            <div className={styles.searchWrapper}>
                                <Search className={styles.searchIcon} size={20} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search for a different service..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(e.target.value);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.filterControls}>
                            <select
                                className={styles.sortSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="location">Sort by Location</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className={styles.container}>
                    <div className={styles.errorMessage}>
                        <h3>⚠️ {error}</h3>
                        {error.includes('log in') && (
                            <button
                                onClick={() => navigate('/LoginSignup')}
                                className={styles.loginButton}
                            >
                                Go to Login
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Technicians Grid */}
            <div className={styles.container}>
                <div className={styles.techniciansGrid}>
                    {filteredTechnicians.map((technician) => (
                        <div key={technician.techId} className={styles.technicianCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.profileImage}>
                                    {technician.imageFile ? (
                                        <img
                                            src={getProfileImageUrl(technician.imageFile)}
                                            alt={technician.technicianName}
                                            className={styles.technicianImage}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={styles.placeholderImage}
                                        style={{ display: technician.imageFile ? 'none' : 'flex' }}
                                    >
                                        {technician.technicianName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className={styles.technicianInfo}>
                                    <div className={styles.nameSection}>
                                        <h3 className={styles.technicianName}>
                                            {technician.technicianName}
                                            <Shield className={styles.verifiedIcon} size={16} />
                                        </h3>
                                        <p className={styles.specialty}>
                                            {technician.serviceName.replace(/[\[\]]/g, '')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <p className={styles.description}>
                                    {technician.technicianBio || 'Professional technician ready to help with your service needs.'}
                                </p>

                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <MapPin size={14} />
                                        <span>{technician.technicianAddress}</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <Phone size={14} />
                                        <span>{technician.technicianPhone}</span>
                                    </div>
                                    {technician.feeCharge && (
                                        <div className={styles.contactItem}>
                                            <Clock size={14} />
                                            <span>Rs. {technician.feeCharge}/service</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <button
                                    className={styles.bookBtn}
                                    onClick={() => handleBookNow(technician)}
                                >
                                    <Calendar size={16} />
                                    Book Now
                                </button>
                                <button
                                    className={styles.profileBtn}
                                    onClick={() => handleViewProfile(technician)}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTechnicians.length === 0 && !loading && !error && (
                    <div className={styles.noResults}>
                        <h3>No technicians found</h3>
                        <p>Try searching for a different service or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianListing;