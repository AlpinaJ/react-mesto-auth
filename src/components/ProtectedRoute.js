import React from 'react';
import {Route, Navigate, Routes} from "react-router-dom";

function ProtectedRoute ({children, isLoggedIn}){
    console.log("loggedIn from protected route", isLoggedIn);
    return isLoggedIn? children : <Navigate to="/signin"/>
}

export default ProtectedRoute;
