import React, {useState} from 'react';
import '../../styles/FindServices.css';
import Header from "../../Components/layout/Header.jsx";
import HeroSection from "../../Components/questX/HeroSection.jsx";

const FindServices = () => {
    const services = [
        "Plumbing",
        "Electrician",
        "Appliances Repair",
        "Welder",
        "Painter",
        "Photographer",
        "Carpenter",
        "Movers",
        "Construction Worker",
        // "Mechanic",
    ];

    return (
        <div className="page-container">
            <Header />
            <div className="container">
                <HeroSection services={services} />
            </div>
        </div>
    );
};

export default FindServices;