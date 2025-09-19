import React from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="logo1" onClick={() => navigate("/")}>
                <div className="logo-icon1">Q</div>
                <span className="logo-text1">QuestX</span>
            </div>

            <nav className="nav">
                {/* User login/signup */}
                <button
                    className="btn-primary1"
                    onClick={() => navigate("/LoginSignup", { state: { role: "user" } })}
                >
                    Sign Up / Log In
                </button>

                {/* Become a technician */}
                <button
                    className="btn-secondary1"
                    onClick={() => navigate("/LoginSignup", { state: { role: "technician" } })}
                >
                    Become a Technician
                </button>
            </nav>
        </header>
    );
};

export default Header;
