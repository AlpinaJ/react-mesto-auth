import React, {useState} from "react";
import {Link, useHistory, useNavigate} from 'react-router-dom';
import auth from "../utils/Auth.js";
import InfoToolTip from "./InfoTooltip.js";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [status, setStatus] = useState();

    function handleRegister(e) {
        e.preventDefault();
        auth.register(email, password).then((res) => {
            if (res.data) {
                setStatus(true);
                setPopupOpen(true);
                return res;
            }
            else{
                setStatus(false);
                setPopupOpen(true);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleSetEmail(e) {
        setEmail(e.target.value);
    }

    function handleSetPassword(e) {
        setPassword(e.target.value);
    }

    function handleClose(){
        setPopupOpen(false);
        if (status){
            history('/signin');
        }
    }

    return (
        <div className="form__container">
            <h1 className="form__title">Регистрация</h1>
            <form className="form" onSubmit={handleRegister}>
                <input onChange={handleSetEmail} type="email" className="form__input" placeholder="Email">
                </input>
                <input onChange={handleSetPassword} type="password" className="form__input" placeholder="Пароль">
                </input>
                <button type="submit" className="form__button">Зарегистрироваться</button>
            </form>
            <Link to="/signin" className="form__link">Уже зарегистрированы? Войти</Link>
            <InfoToolTip status={status} isOpen={isPopupOpen} closePopup={handleClose}/>
        </div>
    )
}

export default Register;