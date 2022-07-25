import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"

export default function Login() {
    return (
        <div id="background">
            <div className="login-form" >
                <form>
                    <label htmlFor="username">
                        <input  id="username" type="text" placeholder="Enter Username" name="uname" required></input>
                        <span>Username</span>
                    </label>
                    <label htmlFor="password">
                        <input id="password" type="password" placeholder="Enter Password" name="psw" required></input>
                        <span>Password</span>
                    </label>
                    <Link to={'/list'}>
                        <button type="submit">Login</button>
                    </Link>
                </form>
            </div >
        </div>
    );
}