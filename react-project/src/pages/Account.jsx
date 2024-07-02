import CurrentUser from "../data/CurrentUser";
import AccountForm from "../components/AccountForm";
import './../App.css';

export default function Account() {
    return (
        <div className="page-content">
            <h1>{CurrentUser.getStatus() ? "Account" : "Register"}</h1>
            <AccountForm />
        </div>
    );
}