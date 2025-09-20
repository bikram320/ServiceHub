import React from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";

const Header2 = () => {
    const navigate = useNavigate();

    return (
        <header className="header" style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            width: "100%",
            padding: "1rem 5rem 1rem 5rem",
            background: "whitesmoke",
            borderRadius: "2rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
        }}>
            <div className="logo1" onClick={() => navigate("/")}>
                <span style={{display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    gap: "0.5rem"
                }}>
                    <div className="logo-icon1">Q</div>
                    <span className="logo-text1">QuestX</span>
                </span>
            </div>
        </header>
    );
};

export default Header2;
