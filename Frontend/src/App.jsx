import React, { useState } from 'react';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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

function App() {
    return (
       <Router>
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
           </Routes>
       </Router>
       //  <Test />


);
}
export default App;
