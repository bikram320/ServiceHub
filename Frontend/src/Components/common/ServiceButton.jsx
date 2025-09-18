import React from "react";

const ServiceButton = ({label, onClick}) => (
    <button className="service-btn" onClick={onClick} >
        {label}
    </button>
);

export default ServiceButton;