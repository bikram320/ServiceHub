// import React from 'react';
// import ServiceList from '../questX/ServiceList.jsx';
// import SearchBar from '../layout/SearchBar.jsx';
// import man_thinking from '../../assets/man_thinking.png';
//
// const HeroSection = ({ services }) => {
//
//     const handleServiceClick = (service) => {
//         console.log('Service clicked:', service);
//     };
//
//     return (
//     <main className="hero-content">
//
//         {/*Left side*/}
//         <div className="left-content">
//             <h1 className="main-title">Find the trusted services near you</h1>
//             <SearchBar/>
//             <ServiceList services={services} onServiceClick={handleServiceClick}/>
//         </div>
//
//         {/*Right Side*/}
//         <div className="right-content">
//             <div className="image-container">
//                 {/*Image remaining*/}
//
//                 <img className="hero-image" src={man_thinking} alt="Man Thinking"/>
//
//             </div>
//         </div>
//     </main>
//     );
// };
//
// export default HeroSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceList from '../questX/ServiceList.jsx';
import SearchBar from '../layout/SearchBar.jsx';
import man_thinking from '../../assets/man_thinking.png';

const HeroSection = ({ services }) => {
    const navigate = useNavigate();

    const handleServiceClick = (service) => {
        console.log('Service clicked:', service);
        // Navigate to TechnicianList with the selected service
        navigate('/TechnicianList', {
            state: {
                searchSkill: service,
                fromSearch: true
            }
        });
    };

    return (
        <main className="hero-content">

            {/*Left side*/}
            <div className="left-content">
                <h1 className="main-title">Find the trusted services near you</h1>
                <SearchBar/>
                <ServiceList services={services} onServiceClick={handleServiceClick}/>
            </div>

            {/*Right Side*/}
            <div className="right-content">
                <div className="image-container">
                    {/*Image remaining*/}

                    <img className="hero-image" src={man_thinking} alt="Man Thinking"/>

                </div>
            </div>
        </main>
    );
};

export default HeroSection;