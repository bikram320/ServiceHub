import React, {useState} from 'react';
import '../../styles/FindServices.css';
import HeroSection from "../../Components/questX/HeroSection.jsx";

const FindServices = () => {
    const services = [
        "Plumbing",
        "Electrician",
        "Painter",
        "Movers",
        "Photographer",
        "Carpenter",
         "Mechanic",
        "HVAC Repair",
        "Cleaning Services",
        "Pest Control",
        "Interior Design",
        "Locksmith"
    ];

    return (
        <div className="page-container">
            <div className="container">
                <HeroSection services={services} />
            </div>
        </div>
    );
};

export default FindServices;