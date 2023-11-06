import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha"


export default function BusinessLogin({ setStateLogged }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaValue, setRecaptchaValue] = useState('');
    const [val, setVal] = useState({})
    const captchaRef = useRef()

    const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    console.log(sitekey)

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const newRecaptchaValue = captchaRef.current.getValue();
        setRecaptchaValue(newRecaptchaValue);
        captchaRef.current.reset();
        axios.post('http://localhost:8000/api/business/login', {

            email,
            password,
            recaptchaValue: newRecaptchaValue,

        }, { withCredentials: true })
            .then(res => {

                console.log(res);
                console.log(res.data);
                setRecaptchaValue('');
                setVal({})
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userId', res.data.userId);
                const userId = localStorage.getItem('userId', res.data.userId);
                setStateLogged(true)
                navigate(`/business/${userId}/update`)
            })
            .catch(err => { console.log(err); err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) })
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <h2>Business Log in</h2>

            {val.email ? <p className='red'>{val.email.message}</p> : ""}
            <div className="form-floating mb-3">
                <input type="email" className="form-control" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="floatingInput">Business Email</label>
            </div>

            {val.password ? <p className='red'>{val.password.message}</p> : ""}
            <div className="form-floating mb-3">
                <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            
            <ReCAPTCHA
            
                    sitekey = {sitekey}
                    ref={captchaRef}
            />
            {val.reCaptcha ? <p className='red'>{val.reCaptcha.message}</p> : ""}
            <input type="submit" />
        </form>
    )
}