import React, {useState} from 'react';
import '../../styles/FindServices.css';
import HeroSection from "../../Components/questX/HeroSection.jsx";

const FindServices = ({ sidebarCollapsed = false }) => {
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
        <div className={`findservices-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className="page-container">

                    <div className="findservices-container">
                        <HeroSection services={services} />

                </div>
            </div>
        </div>
    );
};

export default FindServices;