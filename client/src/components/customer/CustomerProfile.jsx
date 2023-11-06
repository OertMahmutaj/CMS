import { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom'
import axios from 'axios';

export default function CustomerProfile() {

    const { id } = useParams();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/customer/${id}`, { withCredentials: true })
            .then(res => {
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setEmail(res.data.email);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [id]);

    return (
        <div>
            <h2>Customer Profile</h2>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Email: {email}</p>
            <Link to={`/customer/${id}/password-update`}>Update Password</Link>
        </div>
    );
}
