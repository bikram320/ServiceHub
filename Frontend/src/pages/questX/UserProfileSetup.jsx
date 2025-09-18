import React from 'react';
import Header from "../../Components/layout/Header.jsx";
import UserProfileForm from "../Auth/UserProfileForm.jsx";
import Footer from "../../Components/layout/Footer.jsx";

const UserProfileSetup = () => {
    return (
        <div className="page-container">
            <Header />
            <UserProfileForm />
            <Footer />
        </div>
    )
}

export default UserProfileSetup;