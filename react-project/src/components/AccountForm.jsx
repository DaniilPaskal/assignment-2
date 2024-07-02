import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { User } from "../data/Classes";
import CurrentUser from "../data/CurrentUser";
import './../App.css';

export default function AccountForm() {
    const [user, setUser] = useState(CurrentUser); 
    const navigate = useNavigate();
    const provinces = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"]

    // Update user state
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevState) => ({ ...prevState, [name]: value}));
    }

    // Update CurrentUser with form data, set CurrentUser as logged in, navigate to home
    const handleSubmit = (event) => {
        event.preventDefault();
        CurrentUser.update(user.name, user.email, user.address, user.city, user.province);
        CurrentUser.login();
        navigate("/");
    }

    // Update CurrentUser, display alert confirming update
    const handleUpdate = (event) => {
        event.preventDefault();
        CurrentUser.update(user.name, user.email, user.address, user.city, user.province);
        alert("User settings updated!");
    }

    // Update CurrentUser with empty fields, set CurrentUser as logged out, navigate to logout page
    const handleLogout = () => {
        CurrentUser.update("", "", "", "", "");
        CurrentUser.logout();
        navigate("/done/logout");
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <label for="name">Name:</label>
            <input name="name" id="name" type="text" value={user.name} onChange={handleChange} required />

            <label for="email">Email:</label>
            <input name="email" id="email" type="email" value={user.email} onChange={handleChange} required />

            <label for="password">Password:</label>
            <input name="password" id="password" type="password" value={user.password} onChange={handleChange} required />

            <label for="address">Address:</label>
            <input name="address" id="address" type="text" value={user.address} onChange={handleChange} required />

            <label for="city">City:</label>
            <input name="city" id="city" type="text" value={user.city} onChange={handleChange} required />

            <label for="province">Province/Territory:</label>
            <select name="province" id="province" defaultValue={user.province} onChange={handleChange}>
                {provinces.map((province) => {
                    return(
                        <option value={province}>{province}</option>
                    );
                })}
            </select>

            {CurrentUser.getStatus() ? 
                // If logged in, display "update" and "logout" buttons, else display "register" button
                <>
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button onClick={handleLogout}>Logout</Button>
                </>
                :
                <Button type="submit">Register</Button>    
            }
        </form>
    );
}