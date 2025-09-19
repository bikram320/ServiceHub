import React from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        // Pass role as "user"
        navigate("/LoginSignup", { state: { role: "user" } });
    };

    const handleTechnicianClick = () => {
        // Pass role as "technician"
        navigate("/LoginSignup", { state: { role: "technician" } });
    };

    return (
        <header className="header">
            <div className="logo1" onClick={() => navigate("/")}>
                <div className="logo-icon1">Q</div>
                <span className="logo-text1">QuestX</span>
            </div>

            <nav className="nav">
                <button className="btn-primary1" onClick={handleLoginClick}>
                    Sign Up / Log In
                </button>
                <button className="btn-secondary1" onClick={handleTechnicianClick}>
                    Become a Technician
                </button>
            </nav>
        </header>
    );
};

export default Header;
