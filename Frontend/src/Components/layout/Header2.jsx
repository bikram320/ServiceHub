import React from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/Header2.css";

const Header2 = ({ isSidebar = false }) => {
    const navigate = useNavigate();

    return (
        <header className={isSidebar ? "sidebar-header2" : "header"}>
            <div className="logo1" onClick={() => navigate("/")}>
                <div className="logo-icon1">Q</div>
                <span className="logo-text1">QuestX</span>
            </div>
        </header>
    );
};

export default Header2;
