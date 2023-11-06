import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function BusinessRegister({ setStateLogged }) {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [type, setType] = useState("");
  const [val, setVal] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTermsError, setAcceptTermsError] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [imgErr, setImgErr] = useState("");

  const addressInputRef = useRef(null);
  let autocomplete;

  useEffect(() => {
    autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current);
    autocomplete.setFields(['formatted_address']);
    autocomplete.addListener('place_changed', onPlaceChanged);
  }, []);

  const onPlaceChanged = () => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setAddress(place.formatted_address);
    }
  };

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
    axios.post('http://localhost:8000/api/business/register', {
      companyName,
      email,
      address,
      password,
      acceptTerms,
      type,
      confirmPassword,
      profilePicture,
    }, { withCredentials: true })

      .then((res) => {
        console.log(res);
        console.log(res.data);
        setVal({});
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userId', res.data.userId);
        setStateLogged(true);
        navigate("/business/verify-email");
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) ? (err.response && err.response.status === 413) : setImgErr(err.response.statusText);
      });
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <h2>Register as Business</h2>
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
      {val.companyName ? <p className='red'>{val.companyName.message}</p> : ""}

      <div className="form-floating mb-3">
        <input autoFocus type="text" className="form-control" placeholder="name@example.com" onChange={(e) => setCompanyName(e.target.value)} />
        <label htmlFor="floatingInput">Company Name</label>
      </div>
      {val.address ? <p className='red'>{val.address.message}</p> : ""}
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="City: Street Number"
          onChange={(e) => setAddress(e.target.value)}
          ref={addressInputRef}
        />
        <label htmlFor="floatingInput">Company Address</label>
      </div>
      {val.email ? <p className='red'>{val.email.message}</p> : ""}
      <div className="form-floating mb-3">
        <input type="email" className="form-control" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="floatingInput">Company Email</label>
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
      <div className='mb-3'>
        <select className="form-select" aria-label="Default select example" onChange={(e) => setType(e.target.value)}>
          <option value={""}>Choose a Business Type</option>
          <option value={"Retailer"}>Retailer</option>
          <option value={"Information & Technology"}>Information & Technology</option>
          <option value={"Hospitality"}>Hospitality</option>
          <option value={"Real Estate"}>Real Estate</option>
        </select>
        {val.type ? <p className='red'>{val.type.message}</p> : ""}
      </div>
      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" role="switch" onChange={(e) => {
          setAcceptTerms(e.target.checked);
          setAcceptTermsError("");
        }} />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><a href="#">Terms & Conditions</a></label>
        {val.acceptTerms ? <p className='red'>{val.acceptTerms.message}</p> : ""}
      </div>

      {acceptTermsError && <p className='red'>{acceptTermsError}</p>}

      <div className="d-grid gap-2 d-md-flex mb-3">
        <button type="submit" className="btn btn-outline-success">Register</button>
      </div>
    </form>
  );
}