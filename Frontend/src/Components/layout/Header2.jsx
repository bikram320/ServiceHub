import React from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";

const Header2 = () => {
    const navigate = useNavigate();

    return (
        <header className="header" >
            <div className="logo1" onClick={() => navigate("/")}>

                    <div className="logo-icon1">Q</div>
                    <span className="logo-text1">QuestX</span>

            </div>
        </header>
    );
};

export default Header2;
