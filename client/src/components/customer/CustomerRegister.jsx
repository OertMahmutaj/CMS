import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerRegister({ stateLogged, setStateLogged }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsLetter, setNewsLetter] = useState(false);
  const [val, setVal] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTermsError, setAcceptTermsError] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [imgErr, setImgErr] = useState("");

  const handleImageUpload = (e) => {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
      console.log(reader.result);
      setprofilePicture(reader.result);
    };
    reader.onerror = error => {
      console.log("Error", error);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/customer/register', {
      firstName,
      email,
      lastName,
      password,
      acceptTerms,
      newsLetter,
      confirmPassword,
      profilePicture,
    }, { withCredentials: true })

      .then((res) => {
        console.log(res);
        console.log(res.data);
        setVal({});
        // localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('cartId', res.data.cartId);
        // setStateLogged(true);
        navigate("/customer/verify-email");
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) ? (err.response && err.response.status === 413) : setImgErr(err.response.statusText);
      });
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <h2>Register as Customer</h2>
      <div>
        <label htmlFor="profile-picture" className="">
          Profile Picture
        </label>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id="profile-picture"
          name="profilePicture"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {imgErr ? <p className='red'>Image too large</p> : ""}
        <label htmlFor="profile-picture" className="">
          Upload Profile Picture
        </label>
        {profilePicture && (
          <img
            width={70}
            height={70}
            src={profilePicture}
            alt="Profile Picture"
            className="rounded-full"
          />
        )}
      </div>

      {val.firstName ? <p className='red'>{val.firstName.message}</p> : ""}

      <div className="form-floating mb-3">
        <input type="text" className="form-control" placeholder="name@example.com" onChange={(e) => setFirstName(e.target.value)} />
        <label htmlFor="floatingInput">First Name</label>
      </div>
      {val.lastName ? <p className='red'>{val.lastName.message}</p> : ""}
      <div className="form-floating mb-3">
        <input type="text" className="form-control" placeholder="name@example.com" onChange={(e) => setLastName(e.target.value)} />
        <label htmlFor="floatingInput">Last Name</label>
      </div>
      {val.email ? <p className='red'>{val.email.message}</p> : ""}
      <div className="form-floating mb-3">
        <input type="email" className="form-control" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      {val.password ? <p className='red'>{val.password.message}</p> : ""}
      <div className="form-floating mb-3">
        <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      {val.confirmPassword ? <p className='red'>{val.confirmPassword.message}</p> : ""}
      <div className="form-floating mb-3">
        <input type="password" className="form-control" placeholder="Password" onChange={(e) => setConfirmPassword(e.target.value)} />
        <label htmlFor="floatingPassword">Confirm Password</label>
      </div>
      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e) => setNewsLetter(e.target.checked)} />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><a href="#">NewsLetter</a></label>
      </div>
      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" role="switch" onChange={(e) => {
          setAcceptTerms(e.target.checked);
          setAcceptTermsError("");
        }} />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><a href="#">Terms & Conditions</a></label>
      </div>

        {val.acceptTerms ? <p className='red'>{val.acceptTerms.message}</p> : ""}

      <div className="d-grid gap-2 d-md-flex mb-3">
        <button type="submit" className="btn btn-outline-success">Register</button>
      </div>
    </form>
  );
}