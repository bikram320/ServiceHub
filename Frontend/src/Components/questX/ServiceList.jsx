// import React from 'react';
// import ServiceButton from '../common/ServiceButton';
// import { useNavigate } from 'react-router-dom';
//
// const ServiceList = ({ services }) => {
//     const navigate = useNavigate();
//
//     const handleServiceClick = (service) => {
//         // Navigate to TechnicianList page, optionally passing the selected service
//         navigate('/TechnicianList', { state: { selectedService: service } });
//         // Or if you want to pass it as a URL parameter:
//         // navigate(`/technician-list/${encodeURIComponent(service)}`);
//     };
//
//     return (
//         <div className="services-grid">
//             {services.map((service, index) => (
//                 <ServiceButton
//                     key={index}
//                     label={service}
//                     onClick={() => handleServiceClick(service)}
//                 />
//             ))}
//         </div>
//     );
// };
//
// export default ServiceList;
import React from 'react';
import '../../styles/FindServices.css';

const ServiceList = ({ services, onServiceClick }) => {

    const handleServiceButtonClick = (service) => {
        console.log('Service button clicked:', service);

        // Call the parent's click handler
        if (onServiceClick) {
            onServiceClick(service);
        }
    };

    return (
        <div className="service-list">
            <div className="service-buttons-container">
                {services.map((service, index) => (
                    <button
                        key={index}
                        className="service-button"
                        onClick={() => handleServiceButtonClick(service)}
                    >
                        {service}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceList;