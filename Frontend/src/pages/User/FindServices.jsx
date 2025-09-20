import React, {useState} from 'react';
import '../../styles/FindServices.css';
import Header2 from "../../Components/layout/Header2.jsx";
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
            <Header2 />
            <div className="container">
                <HeroSection services={services} />
            </div>
        </div>
    );
};

export default FindServices;