import React, { useState } from 'react';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserLayout from "./pages/User/UserLayout.jsx";
import AnimatedAuth from "./pages/Auth/AnimatedAuth.jsx";
import Signup from "./pages/Auth/signup.jsx";
import Login from './pages/Auth/login.jsx';
import Test from "./pages/Test.jsx";
import LandingPage from "./pages/questX/LandingPage.jsx";
import AuthContainer from "./Components/layout/AuthContainer.jsx";
import TechnicianLandingPage from "./pages/questX/TechnicianLandingPage.jsx";

function App() {
    return (
       <Router>
           <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="/UserLayout/*" element={<UserLayout />} />
               <Route path="/LoginSignup/*" element={<AnimatedAuth />} />
               <Route path="/TechnicianLandingPage/*" element={<TechnicianLandingPage />} />
           </Routes>
       </Router>
         //<Test />


);
}
export default App;
