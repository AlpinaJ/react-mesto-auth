import React, {useState} from "react";
import {Link, useHistory, useNavigate} from 'react-router-dom';
import auth from "../utils/Auth.js";
import InfoToolTip from "./InfoTooltip";

function Login({handleLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [status, setStatus] = useState();

    function handleSubmit(e) {
        e.preventDefault();
        auth.authorize(email, password).then((res)=>{
            if (res.token){
                handleLogin();
            }
            else{
                setStatus(false);
                setPopupOpen(true);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    function handleSetEmail(e){
        setEmail(e.target.value);
    }

    function handleSetPassword(e){
        setPassword(e.target.value);
    }

    function handleClose(){
        setPopupOpen(false);
    }

    return (
        <div className="form__container">
            <h1 className="form__title">Вход</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input onChange={handleSetEmail} type="email" className="form__input" placeholder="Email">
                </input>
                <input onChange={handleSetPassword} type="password" className="form__input" placeholder="Пароль">
                </input>
                <button type="submit" className="form__button">Войти</button>
            </form>
            <InfoToolTip status={status} isOpen={isPopupOpen} closePopup={handleClose}/>
        </div>
    )
}

export default Login;