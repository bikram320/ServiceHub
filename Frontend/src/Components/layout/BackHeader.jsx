import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "../../styles/BackHeader.css";

const BackHeader = ({ onBack, backTo = -1 }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(backTo);
        }
    };

    return (
        <header className="back-header">
            <button className="back-button" onClick={handleGoBack}>
                <ArrowLeft size={20} />
                <span>Go Back</span>
            </button>

            <div className="logo1" onClick={() => navigate("/")}>
                <div className="logo-icon1">Q</div>
                <span className="logo-text1">QuestX</span>
            </div>
        </header>
    );
};

export default BackHeader;