import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function BusinessProfile() {
  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();

  

  useEffect(() => {
    axios.get(`http://localhost:8000/api/business/${id}`, { withCredentials: true })
      .then(res => {
        setCompanyName(res.data.companyName);
        setAddress(res.data.address);
        setEmail(res.data.email);
        displayMap(res.data.address); 
        setProfilePicture(res.data.profilePicture);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [id]);

  const displayMap = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    const mapOptions = {
      zoom: 15,
      center: new window.google.maps.LatLng(0, 0), 
    };

    const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        new window.google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  return (
    <div>
      <h2>Business Profile</h2>
      {profilePicture && (
          <img
            width={70}
            height={70}
            src={profilePicture}
            alt="Profile Picture"
            className="rounded-full"
          />
        )}
      <p>Company Name: {companyName}</p>
      <p>Address: {address}</p>
      <p>Email: {email}</p>
      <div id="map" style={{ width: '100%', height: '300px' }}></div>
      <Link to={`/business/${id}/password-update`}>Update Password</Link><br/>
      <Link to={`/business/${id}/update`}>Update Profile</Link>
    </div>
  );
}
