import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Signup from "./Components/Login_signup/signup";
import Login from './Components/Login_signup/login';


function App() {
    return (
       <BrowserRouter>
           <Routes>
               <Route path="/" element={<Navigate to="/login" />} />
               <Route path="/login" element= {<Login />}/>
               <Route path="/signup" element={<Signup />} />
           </Routes>
       </BrowserRouter>

    );
}
export default App;
