import React, { useState , useEffect} from 'react';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import UserLayout from "./pages/User/UserLayout.jsx";
import AnimatedAuth from "./pages/Auth/AnimatedAuth.jsx";
import Test from "./pages/Test.jsx";
import LandingPage from "./pages/questX/LandingPage.jsx";
import AuthContainer from "./Components/layout/AuthContainer.jsx";
import TechnicianLandingPage from "./pages/questX/TechnicianLandingPage.jsx";
import AboutUs from "./pages/questX/AboutUs.jsx";
import PrivacyPolicy from "./pages/questX/PrivacyPolicy.jsx";
import TermsOfServices from "./pages/questX/TermsOfServices.jsx";
import HelpSupport from "./pages/questX/HelpSupprt.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import TechnicianLayout from "./pages/Technician/TechnicianLayout.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminLogin from "./pages/Auth/AdminLogin.jsx";
import TechnicianList from "./pages/User/TechnicianListing.jsx";
import TechnicianProfile from "./pages/Technician/TechnicianProfile.jsx";
import BookingDetail from "./pages/User/BookingDetail.jsx";
import FindServices from "./pages/User/FindServices.jsx";
import PaymentSuccess from "./Components/questX/PaymentSuccess.jsx";
import PaymentFailure from "./Components/questX/PaymentFailure.jsx";
import ServiceRequests from "./pages/Technician/ServiceRequests.jsx";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
       <Router>
           <ScrollToTop />
           <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="/UserLayout/*" element={<UserLayout />} />
               <Route path="/LoginSignup/*" element={<AnimatedAuth />} />
               <Route path="/ForgotPassword/*" element={<ForgotPassword />} />
               <Route path="/TechnicianLandingPage/*" element={<TechnicianLandingPage />} />
               <Route path="/AboutUs/*" element={<AboutUs />} />
               <Route path="/PrivacyPolicy/*" element={<PrivacyPolicy />} />
               <Route path="/TermsOfServices" element={<TermsOfServices />} />
               <Route path="/HelpSupport/*" element={<HelpSupport />} />
               <Route path="/TechnicianLayout/*" element={<TechnicianLayout />} />
               <Route path="/AdminLayout/*" element={<AdminLayout />} />
               <Route path="/AdminLogin/*" element={<AdminLogin />} />
               <Route path="/TechnicianList/*" element={<TechnicianList />} />
               <Route path="/TechnicianProfile/*" element={<TechnicianProfile />} />
               <Route path="/BookingDetail/*" element={<BookingDetail />} />
               <Route path="/FindServices/*" element={<FindServices />} />
               <Route path="/PaymentSuccess/*" element={<PaymentSuccess/>}/>
               <Route path="/PaymentFailure/*" element={<PaymentFailure/>}/>
               <Route path="/ServiceRequests/*" element={<ServiceRequests/>}/>
           </Routes>
       </Router>
       //  <Test />


);
}
export default App;
