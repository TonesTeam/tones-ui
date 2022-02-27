import { Link } from "react-router-dom";
import "./Login.css"

export default function Login() {
    return (
        <div className="login-form" >
            <form>
                <input type="text" placeholder="Enter Username" name="uname" required></input>
                <input type="password" placeholder="Enter Password" name="psw" required></input>
                <Link to={'/list'}>
                    <button type="submit">Login</button>
                </Link>
            </form>
        </div >
    );
}