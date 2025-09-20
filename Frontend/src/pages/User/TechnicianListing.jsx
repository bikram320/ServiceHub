import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Shield, Award, Clock, Search, Filter } from 'lucide-react';
import styles from '../../styles/TechnicianListing.module.css';
import Header from "../../Components/layout/Header.jsx";

const TechnicianListing = () => {
    const navigate = useNavigate(); // Add this hook
    const [technicians, setTechnicians] = useState([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    // Mock data for technicians
    useEffect(() => {
        const mockTechnicians = [
            {
                id: 1,
                name: 'Sushil Gurung',
                specialty: 'Plumbing - Leak Repair',
                rating: 4.9,
                reviews: 127,
                location: 'Kathmandu, Nepal',
                phone: '+977 9841234567',
                email: 'sushil.gurung@email.com',
                verified: true,
                topRated: true,
                hourlyRate: 800,
                image: '/api/placeholder/300/300',
                description: 'Fully certified and licensed for all residential and commercial plumbing.',
                services: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning']
            },
            {
                id: 2,
                name: 'Ramesh Pun',
                specialty: 'Plumbing - Drain Cleaning',
                rating: 4.7,
                reviews: 89,
                location: 'Pokhara, Nepal',
                phone: '+977 9851234567',
                email: 'ramesh.pun@email.com',
                verified: true,
                topRated: true,
                hourlyRate: 750,
                image: '/api/placeholder/300/300',
                description: 'Fully certified and licensed for all residential and commercial plumbing.',
                services: ['Drain Cleaning', 'Toilet Repair', 'Water Heater']
            },
            {
                id: 3,
                name: 'Amit Sharma',
                specialty: 'Electrical - Wiring',
                rating: 4.8,
                reviews: 156,
                location: 'Lalitpur, Nepal',
                phone: '+977 9861234567',
                email: 'amit.sharma@email.com',
                verified: true,
                topRated: true,
                hourlyRate: 900,
                image: '/api/placeholder/300/300',
                description: 'Expert electrical technician with 10+ years experience.',
                services: ['Home Wiring', 'Circuit Repair', 'Appliance Installation']
            },
            {
                id: 4,
                name: 'Prakash Thapa',
                specialty: 'Carpentry - Furniture',
                rating: 4.6,
                reviews: 73,
                location: 'Bhaktapur, Nepal',
                phone: '+977 9841234568',
                email: 'prakash.thapa@email.com',
                verified: false,
                topRated: false,
                hourlyRate: 650,
                image: '/api/placeholder/300/300',
                description: 'Skilled carpenter specializing in custom furniture and repairs.',
                services: ['Custom Furniture', 'Door Repair', 'Cabinet Installation']
            },
            {
                id: 5,
                name: 'Ravi Kumar',
                specialty: 'HVAC - Air Conditioning',
                rating: 4.9,
                reviews: 203,
                location: 'Kathmandu, Nepal',
                phone: '+977 9871234567',
                email: 'ravi.kumar@email.com',
                verified: true,
                topRated: true,
                hourlyRate: 1000,
                image: '/api/placeholder/300/300',
                description: 'Professional HVAC technician with advanced certifications.',
                services: ['AC Installation', 'AC Repair', 'Maintenance']
            },
            {
                id: 6,
                name: 'Bikram Rai',
                specialty: 'Plumbing - Installation',
                rating: 4.5,
                reviews: 94,
                location: 'Chitwan, Nepal',
                phone: '+977 9881234567',
                email: 'bikram.rai@email.com',
                verified: true,
                topRated: false,
                hourlyRate: 700,
                image: '/api/placeholder/300/300',
                description: 'Experienced plumber for all types of installations and repairs.',
                services: ['Pipe Installation', 'Bathroom Fixtures', 'Kitchen Plumbing']
            }
        ];

        setTechnicians(mockTechnicians);
        setFilteredTechnicians(mockTechnicians);
    }, []);

    // Navigation functions
    const handleViewProfile = (technicianId) => {
        //navigate(`/technician-profile/${technicianId}`);
        navigate("/TechnicianProfile");
    };

    const handleContactTechnician = (technician) => {
        // Option 1: Navigate to contact page with technician data
       // navigate('/contact-technician', { state: { technician } });

        navigate("/BookingDetail");
        // Option 2: Or you could implement direct contact functionality here
        // For example: open phone dialer or email client
        // window.location.href = `tel:${technician.phone}`;
        // window.location.href = `mailto:${technician.email}`;
    };

    // Filter and search functionality
    useEffect(() => {
        let filtered = technicians;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(tech =>
                tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tech.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply category filter
        if (filterBy !== 'all') {
            if (filterBy === 'topRated') {
                filtered = filtered.filter(tech => tech.topRated);
            } else if (filterBy === 'verified') {
                filtered = filtered.filter(tech => tech.verified);
            } else {
                filtered = filtered.filter(tech =>
                    tech.specialty.toLowerCase().includes(filterBy.toLowerCase())
                );
            }
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'reviews':
                    return b.reviews - a.reviews;
                case 'price-low':
                    return a.hourlyRate - b.hourlyRate;
                case 'price-high':
                    return b.hourlyRate - a.hourlyRate;
                default:
                    return 0;
            }
        });

        setFilteredTechnicians(filtered);
    }, [searchTerm, filterBy, sortBy, technicians]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
                fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
            />
        ));
    };

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <Header />

            {/* Search and Filter Section */}
            <div className={styles.searchSection}>
                <div className={styles.container}>
                    <div className={styles.searchHeader}>
                        <h1 className={styles.resultsTitle}>Available Technicians</h1>
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
                                    placeholder="Search by name, service, or specialty..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.filterControls}>
                            <select
                                className={styles.filterSelect}
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="electrical">Electrical</option>
                                <option value="carpentry">Carpentry</option>
                                <option value="hvac">HVAC</option>
                                <option value="topRated">Top Rated</option>
                                <option value="verified">Verified Only</option>
                            </select>

                            <select
                                className={styles.sortSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="rating">Highest Rated</option>
                                <option value="reviews">Most Reviews</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technicians Grid */}
            <div className={styles.container}>
                <div className={styles.techniciansGrid}>
                    {filteredTechnicians.map((technician) => (
                        <div key={technician.id} className={styles.technicianCard}>
                            {technician.topRated && (
                                <div className={styles.topRatedBadge}>Top Rated</div>
                            )}

                            <div className={styles.cardHeader}>
                                <div className={styles.profileImage}>
                                    <img
                                        src={technician.image}
                                        alt={technician.name}
                                        className={styles.technicianImage}
                                    />
                                </div>
                                <div className={styles.technicianInfo}>
                                    <div className={styles.nameSection}>
                                        <h3 className={styles.technicianName}>
                                            {technician.name}
                                            {technician.verified && (
                                                <Shield className={styles.verifiedIcon} size={16} />
                                            )}
                                        </h3>
                                        <p className={styles.specialty}>{technician.specialty}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.ratingSection}>
                                    <div className={styles.stars}>
                                        {renderStars(technician.rating)}
                                    </div>
                                    <span className={styles.ratingText}>
                                        {technician.rating} ({technician.reviews} Reviews)
                                    </span>
                                </div>

                                <p className={styles.description}>{technician.description}</p>

                                <div className={styles.servicesList}>
                                    {technician.services.map((service, index) => (
                                        <span key={index} className={styles.serviceTag}>
                                            {service}
                                        </span>
                                    ))}
                                </div>

                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <MapPin size={14} />
                                        <span>{technician.location}</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <Clock size={14} />
                                        <span>Rs. {technician.hourlyRate}/hour</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <button
                                    className={styles.contactBtn}
                                    onClick={() => handleContactTechnician(technician)}
                                >
                                    <Phone size={16} />
                                    Contact
                                </button>
                                <button
                                    className={styles.profileBtn}
                                    onClick={() => handleViewProfile(technician.id)}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTechnicians.length === 0 && (
                    <div className={styles.noResults}>
                        <h3>No technicians found</h3>
                        <p>Try adjusting your search or filters to find more technicians.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianListing;