import React, { useState } from "react";
import {
    Droplets,
    Paintbrush,
    Zap,
    Camera,
    Hammer,
    ChevronRight,
    Star,
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Header from "../../Components/layout/Header.jsx";
import styles from "../../styles/LandingPage.module.css";
import ElectricalHelp from "../../assets/ElectricalHelp.jpg";
import FurnitureAssembly from "../../assets/FurnitureAssembly.webp";
import HouseCleaning from "../../assets/HouseCleaning.jpg";
import MountingTv from "../../assets/MountingTv.jpg";
import MovingStuff from "../../assets/MovingStuff.webp";
import PaintingHelp from "../../assets/PaintingHelp.jpg";
import PhotographyHelp from "../../assets/PhotographerHelp.webp";
import PlumbingHelp from "../../assets/PlumbingHelp.jpg";
import ConstructionWorker from "../../assets/constructionWorker.webp";
import ConsWorker3 from "../../assets/ConsWorker3.png";
import FirstPageImg from "../../assets/FirstPage.png";
import Footer from "../../Components/layout/Footer.jsx";

function LandingPage() {
    const [hoveredService, setHoveredService] = useState(null);
    const [hoveredProject, setHoveredProject] = useState(null);
    const navigate = useNavigate();

    const services = [
        { name: "Plumbing", icon: Droplets, color: "blue" },
        { name: "Painter", icon: Paintbrush, color: "purple" },
        { name: "Electrician", icon: Zap, color: "yellow" },
        { name: "Photographer", icon: Camera, color: "green" },
        { name: "Carpenter", icon: Hammer, color: "orange" },
    ];

    const PopularProjects = [
        {
            id: 1,
            title: "Electrician Help",
            price: 700,
            image: ElectricalHelp,
            category: "Electrical",
        },
        {
            id: 2,
            title: "Furniture Assembly",
            price: 900,
            image: FurnitureAssembly,
            category: "Assembly",
        },
        {
            id: 3,
            title: "House Cleaning",
            price: 500,
            image: HouseCleaning,
            category: "Cleaning",
        },
        {
            id: 4,
            title: "Mounting TV",
            price: 500,
            image: MountingTv,
            category: "Mounting",
        },
        {
            id: 5,
            title: "Moving Help",
            price: 1500,
            image: MovingStuff,
            category: "Moving",
        },
        {
            id: 6,
            title: "Painting Help",
            price: 900,
            image: PaintingHelp,
            category: "Painting",
        },
        {
            id: 7,
            title: "Photographer Help",
            price: 1000,
            image: PhotographyHelp,
            category: "Photography",
        },
        {
            id: 8,
            title: "Plumbing Help",
            price: 900,
            image: PlumbingHelp,
            category: "Plumbing",
        },
    ];

    const customerReviews = [
        {
            id: 1,
            name: "Priya S.",
            rating: 5,
            description:
                "Ram dai assembled our new sofa set and dining table from Sajha Furniture in just 2 hours. He was very professional and cleaned up everything afterwards. Highly recommend for furniture assembly in Kathmandu!",
            service: "Furniture Assembly",
        },
        {
            id: 2,
            name: "Rajesh K.",
            rating: 5,
            description:
                "Our water tank was leaking during monsoon season. Bikash ji fixed the plumbing issue quickly and also helped waterproof our bathroom. Great service for traditional Nepali homes!",
            service: "Plumbing",
        },
        {
            id: 3,
            name: "Sunita M.",
            rating: 5,
            description:
                "I hired Dipak for Dashain house cleaning. He cleaned our entire 3-story house including the puja room and courtyard. Very respectful of our customs and traditions.",
            service: "House Cleaning",
        },
        {
            id: 4,
            name: "Anil B.",
            rating: 5,
            description:
                "Needed help with electrical work for our Tihar decorations. Krishna dai installed all the lights safely and even helped us set up the rangoli area. Excellent work!",
            service: "Electrical Work",
        },
        {
            id: 5,
            name: "Mina L.",
            rating: 5,
            description:
                "We hired Sagar for painting our kitchen and living room. He suggested colors that match our traditional decor and completed everything before Teej festival. Very satisfied!",
            service: "Painting",
        },
        {
            id: 6,
            name: "Kamal T.",
            rating: 5,
            description:
                "Needed to mount our new Samsung TV on the brick wall. Raju dai came with all tools and mounted it perfectly. Even helped hide all the cables. Great service in Lalitpur!",
            service: "TV Mounting",
        },
    ];

    const StarRating = ({ rating }) => {
        return (
            <div className={styles["star-rating"]}>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${styles["star-icon"]} ${
                            i < rating ? styles["star-filled"] : styles["star-empty"]
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <Header />

            <div className={styles["main-container"]}>
                {/* Hero Section */}
                <div className={styles.hero1}>
                    {/* Left */}
                    <div className={styles["hero-left1"]}>
                        <h1 className={styles["hero-title1"]}>
                            <span className={styles.highlight}>Fix.</span>
                            <span className={styles.highlight}>Book.</span>
                            <span className={styles.highlight}>Relax.</span>
                        </h1>

                        <p className={styles["hero-description1"]}>
                            From Plumbing to Painting - We've got you covered. Find and book
                            verified experts in just a few clicks.
                        </p>

                        <button className={styles["btn-secondary"]} onClick={() => navigate("/LoginSignup/*", { state: { role: "user" } })}>
                            LET'S GET STARTED
                        </button>

                        {/* Featured Services */}
                        <div className={styles["services-section"]}>
                            <h2 className={styles["section-title"]}>Our Featured Services</h2>
                            <div className={styles["services-grid"]}>
                                {services.map((service, index) => {
                                    const Icon = service.icon;
                                    return (
                                        <div
                                            key={service.name}
                                            className={`${styles["service-card"]} ${
                                                hoveredService === index ? styles.active : ""
                                            }`}
                                            onMouseEnter={() => setHoveredService(index)}
                                            onMouseLeave={() => setHoveredService(null)}
                                        >
                                            <div className={styles["service-icon-wrapper"]} >
                                                <Icon
                                                    className={`${styles["service-icon"]} ${
                                                        hoveredService === index
                                                            ? styles[service.color]
                                                            : ""
                                                    }`}
                                                />
                                            </div>
                                            <span className={styles["service-name"]}>
                        {service.name}
                      </span>
                                        </div>
                                    );
                                })}

                                {/* See More */}
                                <div className={`${styles["service-card"]} ${styles["see-more"]}`} onClick={() => navigate("/FindServices")}>
                                    <span>SEE MORE</span>
                                    <ChevronRight className={styles.arrow} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Hero Image */}
                    <div className={styles["hero-right"]}>
                        <div className={styles["hero-image-wrapper1"]}>
                            <img
                                src={ConsWorker3}
                                alt="Professional technician"
                                className={styles["hero-image1"]}
                            />
                            <div className={styles["image-overlay"]}></div>

                            <div className={styles["tag"] + " " + styles["top-right"]}>
                                Verified Expert
                            </div>
                            <div className={styles["tag"] + " " + styles["bottom-left"]}>
                                Available Now
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Projects Section */}
            <section className={styles["popular-projects"]}>
                <div className={styles.container}>
                    <h2 className={styles["popular-projects-title"]}>Popular Projects</h2>

                    <div className={styles["projects-grid"]}>
                        {PopularProjects.map((project, index) => (
                            <div
                                key={project.id}
                                className={`${styles["project-card"]} ${
                                    hoveredProject === index ? styles.active : ""
                                }`}
                                onMouseEnter={() => setHoveredProject(index)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <div className={styles["project-image-wrapper"]}>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className={styles["project-image"]}
                                    />
                                    <div className={styles["project-overlay"]}></div>
                                </div>

                                <div className={styles["project-content"]}>
                                    <h3 className={styles["project-title"]}>{project.title}</h3>
                                    <p className={styles["project-price"]}>
                                        Projects starting at{" "}
                                        <span className={styles.price}>{project.price}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <section className={styles["customer-reviews"]}>
                <div className={styles.container}>
                    <h2 className={styles["customer-reviews-title"]}>
                        See what our happy clients are saying about QuestX
                    </h2>

                    <div className={styles["reviews-grid"]}>
                        {customerReviews.map((review) => (
                            <div key={review.id} className={styles["review-card"]}>
                                <div className={styles["review-header"]}>
                                    <h3 className={styles["review-name"]}>{review.name}</h3>
                                    <StarRating rating={review.rating} />
                                </div>

                                <p className={styles["review-text"]}>{review.description}</p>

                                <div className={styles["service-tag"]}>{review.service}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default LandingPage;
