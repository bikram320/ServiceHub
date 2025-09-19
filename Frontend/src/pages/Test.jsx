import React from "react";
import Header from "../components/layout/Header.jsx";
import ServiceButton from "../Components/common/ServiceButton.jsx";
import SearchBar from "../Components/layout/Searchbar.jsx";
import FindServices from "./User/FindServices.jsx";
import LandingPage from "./questX/LandingPage.jsx";
import BookingPage from "./questX/BookingPage.jsx";
import UserProfileForm from "./Auth/UserProfileForm.jsx";
import UserProfileSetup from "./questX/UserProfileSetup.jsx";
import TechnicianProfileForm from "./Auth/TechnicianProfileForm.jsx";
import TechnicianCalendar from "../Components/layout/TechnicianCalendar.jsx";
import TechnicianDashboard from "./Technician/TechnicianDashboard.jsx";
import UserDashboard from "./User/UserDashboard.jsx";
import BookingDetail from "./User/BookingDetail.jsx";
import DateTimeSelector from "../Components/layout/DateTimeSelector.jsx";
import ServiceRequests from "./Technician/ServiceRequests.jsx";
import JobHistory from "./Technician/JobHistory.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import UserManagement from "./Admin/UserManagement.jsx";
import TechnicianManagement from "./Admin/TechnicianManagement.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import UserLayout from "./User/UserLayout.jsx";
import TechnicianLayout from "./Technician/TechnicianLayout.jsx";
import Footer from "../Components/layout/Footer.jsx";
import AnimatedAuth from "./Auth/AnimatedAuth.jsx";
import RatingsAndReviews from "./Technician/RatingReviews.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";

const Test = () => {
    return (
        <div>
            <TechnicianLayout />
        </div>
    );
};

export default Test;
