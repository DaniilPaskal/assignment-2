import { useParams } from "react-router-dom";

export default function TransactionComplete() {
    // Transaction code
    const transaction = useParams().transaction;
    // Title and body of transaction message
    var title = "";
    var body = "";

    // Set message based on parameter code
    switch(transaction) {
        case "purchase":
            title = "Transaction complete";
            body = "Thank you for your purchase!";
            break;
        case "logout":
            title = "Logout complete";
            body = "You are no longer signed in.";
            break;
        default:
            title = "Unknown action";
            body = "We're not sure what just occurred";
            break;
    }

    return (
        <div className="page-content">
            <h1>{title}</h1>
            <div className="checkmark">
                <p>&#10004;</p>
            </div>
            <p>{body}</p>
        </div>
    );
}