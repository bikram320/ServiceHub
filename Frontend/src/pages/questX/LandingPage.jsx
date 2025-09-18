import React, { useState } from "react";
import {Droplets, Paintbrush, Zap, Camera, Hammer, ChevronRight, Star} from 'lucide-react';
import Header from "../../Components/layout/Header.jsx";
import "../../styles/LandingPage.css";
import ElectricalHelp from "../../assets/ElectricalHelp.jpg";
import FurnitureAssembly from "../../assets/FurnitureAssembly.webp";
import HouseCleaning from "../../assets/HouseCleaning.jpg";
import MountingTv from "../../assets/MountingTv.jpg";
import MovingStuff from "../../assets/MovingStuff.webp";
import PaintingHelp from "../../assets/PaintingHelp.jpg";
import PhotographyHelp from "../../assets/PhotographerHelp.webp";
import PlumbingHelp from "../../assets/PlumbingHelp.jpg";
import ConstructionWorker from "../../assets/constructionWorker.webp";
import Footer from "../../Components/layout/Footer.jsx";


function LandingPage() {
    const [hoveredService, setHoveredService] = useState(null);
    const [hoveredProject, setHoveredProject] = useState(null);

    const services = [
        { name: 'Plumbing', icon: Droplets, color: 'blue' },
        { name: 'Painter', icon: Paintbrush, color: 'purple' },
        { name: 'Electrician', icon: Zap, color: 'yellow' },
        { name: 'Photographer', icon: Camera, color: 'green' },
        { name: 'Carpenter', icon: Hammer, color: 'orange' }
    ];

    const PopularProjects = [
        {
            id: 1,
            title: 'Electrician Help',
            price: 700,
            image: ElectricalHelp,
            category: 'Electrical',
        },

        {
            id: 2,
            title: 'Furniture Assembly',
            price: 900,
            image: FurnitureAssembly,
            category: 'Assembly',
        },

        {
            id: 3,
            title: 'House Cleaning',
            price: 500,
            image: HouseCleaning,
            category: 'Cleaning'
        },

        {
            id: 4,
            title: 'Mounting TV',
            price: 500,
            image: MountingTv,
            category: 'Mounting'
        },

        {
          id: 5,
          title: 'Moving Help',
          price: 1500,
          image: MovingStuff,
          category: 'Moving'
        },

        {
            id: 6,
            title: 'Painting Help',
            price: 900,
            image: PaintingHelp,
            category: 'Painting'
        },

        {
            id: 7,
            title: 'Photographer Help',
            price: 1000,
            image: PhotographyHelp,
            category: 'Photography'
        },

        {
            id: 8,
            title: 'Plumbing Help',
            price: 900,
            image: PlumbingHelp,
            category: 'Plumbing'
        }
    ]

    const customerReviews = [
        {
            id: 1,
            name: 'Priya S.',
            rating: 5,
            description: 'Ram dai assembled our new sofa set and dining table from Sajha Furniture in just 2 hours. He was very professional and cleaned up everything afterwards. Highly recommend for furniture assembly in Kathmandu!',
            service: 'Furniture Assembly'
        },
        {
            id: 2,
            name: 'Rajesh K.',
            rating: 5,
            description: 'Our water tank was leaking during monsoon season. Bikash ji fixed the plumbing issue quickly and also helped waterproof our bathroom. Great service for traditional Nepali homes!',
            service: 'Plumbing'
        },
        {
            id: 3,
            name: 'Sunita M.',
            rating: 5,
            description: 'I hired Dipak for Dashain house cleaning. He cleaned our entire 3-story house including the puja room and courtyard. Very respectful of our customs and traditions.',
            service: 'House Cleaning'
        },
        {
            id: 4,
            name: 'Anil B.',
            rating: 5,
            description: 'Needed help with electrical work for our Tihar decorations. Krishna dai installed all the lights safely and even helped us set up the rangoli area. Excellent work!',
            service: 'Electrical Work'
        },
        {
            id: 5,
            name: 'Mina L.',
            rating: 5,
            description: 'We hired Sagar for painting our kitchen and living room. He suggested colors that match our traditional decor and completed everything before Teej festival. Very satisfied!',
            service: 'Painting'
        },
        {
            id: 6,
            name: 'Kamal T.',
            rating: 5,
            description: 'Needed to mount our new Samsung TV on the brick wall. Raju dai came with all tools and mounted it perfectly. Even helped hide all the cables. Great service in Lalitpur!',
            service: 'TV Mounting'
        }
    ];

    const StarRating = ({ rating }) => {
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`star-icon ${i < rating ? "star-filled" : "star-empty"}`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div>
            <Header />

            <div className="main-container">

                {/* Hero Section */}
                <div className="hero1">
                    {/* Left */}
                    <div className="hero-left1">
                        <h1 className="hero-title1">
                            <span className="highlight">Fix.</span>
                            <span className="highlight">Book.</span>
                            <span className="highlight">Relax.</span>
                        </h1>

                        <p className="hero-description1">
                            From Plumbing to Painting - We've got you covered.
                            Find and book verified experts in just a few clicks.
                        </p>

                        <button className="btn-secondary">LET'S GET STARTED</button>

                        {/* Featured Services */}
                        <div className="services-section">
                            <h2 className="section-title">Our Featured Services</h2>
                            <div className="services-grid">
                                {services.map((service, index) => {
                                    const Icon = service.icon;
                                    return (
                                        <div
                                            key={service.name}
                                            className={`service-card ${hoveredService === index ? 'active' : ''}`}
                                            onMouseEnter={() => setHoveredService(index)}
                                            onMouseLeave={() => setHoveredService(null)}
                                        >
                                            <div className="service-icon-wrapper">
                                                <Icon className={`service-icon ${hoveredService === index ? service.color : ''}`} />
                                            </div>
                                            <span className="service-name">{service.name}</span>
                                        </div>
                                    );
                                })}

                                {/* See More */}
                                <div className="service-card see-more">
                                    <span>SEE MORE</span>
                                    <ChevronRight className="arrow" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Hero Image */}
                    <div className="hero-right">
                        <div className="hero-image-wrapper1">
                            <img
                                src={ConstructionWorker}
                                alt="Professional technician"
                                className="hero-image1"
                            />
                            <h2>Image to be added</h2>
                            <div className="image-overlay"></div>

                            <div className="tag top-right">Verified Expert</div>
                            <div className="tag bottom-left">Available Now</div>
                        </div>
                    </div>
                </div>

                {/*/!* Background Pattern *!/*/}
                {/*<div className="background-pattern"></div>*/}
            </div>

            {/*popular projects section */}
            <section className="popular-projects">

                <div className="container">
                    <h2 className="popular-projects-title">Popular Projects</h2>

                    <div className="projects-grid">
                        {PopularProjects.map((project, index) => (
                        <div
                            key = {project.id}
                            className={`project-card ${hoveredProject === index ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredProject(index)}
                            onMouseLeave={() => setHoveredProject(null)}
                            >

                            <div className="project-image-wrapper">
                                <img src={project.image}
                                     alt={project.title}
                                     className="project-image"
                                     />
                                <div className="project-overlay"></div>
                            </div>

                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-price">
                                    Projects starting at <span className="price">{project.price}</span>
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*Customer Reviews Section*/}
            <section className="customer-reviews">
                <div className="container">
                    <h2 className="customer-reviews-title">See what out happy clients are saying about QuestX</h2>

                    <div className="reviews-grid">
                        {customerReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <h3 className="review-name">{review.name}</h3>
                                    <StarRating rating={review.rating} />
                                </div>

                                <p className="review-text">
                                    {review.description}
                                </p>

                                <div className="service-tag">
                                    {review.service}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;