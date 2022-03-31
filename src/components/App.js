import React, {useState, useEffect} from 'react';
import {useHistory, Route, Link, Navigate, Routes, Router, useNavigate} from 'react-router-dom';
import Header from '../components/Header.js';
import MainPage from '../components/MainPage.js';
import Footer from "./Footer.js";
import api from "../utils/Api";
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import Register from '../components/Register.js';
import Login from '../components/Login.js';
import ProtectedRoute from "../components/ProtectedRoute.js";
import auth from "../utils/Auth.js";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const history = useNavigate();

    function handleLoggedIn() {
        setLoggedIn(true);
    }

    function handleLoggedOut() {
        localStorage.removeItem('token');
        history('/signin');
        setLoggedIn(false);
    }

    function getContent() {
        const token = localStorage.getItem('token');
        if (token) {
            auth.getMain(token).then((res) => {
                setLoggedIn(true);
                history('/users/me');
                setEmail(res.data.email);
            })
        }
    }


    useEffect(() => {
        getContent();
    }, [loggedIn]);

    return (
        <div className="App">
            <div className="page">
                <Header email={email} handleSignOut={handleLoggedOut}/>
                <Routes>
                    <Route path="/users/me" element={<ProtectedRoute isLoggedIn={loggedIn}><MainPage/></ProtectedRoute>}/>
                    <Route path="/signup" element={<Register/>}/>
                    <Route path="/signin" element={<Login handleLogin={handleLoggedIn}/>}/>
                    <Route exact path="/" element=
                        {loggedIn ? <Navigate to="/signup"/> : <Navigate to="/signin"/>}
                    />
                </Routes>
                <Footer/>
            </div>
        </div>


    );
}

export default App;
