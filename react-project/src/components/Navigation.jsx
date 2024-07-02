import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";
import './../App.css';

export default function Navigation() {
    return (
        <Navbar className="navbar">
            <ul>
                <li>
                    <Link to="/">DP Decor</Link>
                </li>
                <li>
                    <Link to="/Cart">Cart</Link>
                </li>
                <li>
                    <Link to="/Account">Account</Link>
                </li>
            </ul>
        </Navbar>
    );
}