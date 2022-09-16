import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainKeyboard from 'ProtocolList/MainKeyboard';
import "./Login.css";
import histoLogo from "../static/TSI_logo.png";
import tsiLogo from "../static/HistOne_logo.png";
import blocklyLogo from "../static/Blockly_logo.png";


export default function Login() {

    function credReducer(state: any, action: { type: string; payload: string; }) {
        switch (action.type) {
            case "username": return { ...state, username: [action.payload] }
            case "password": return { ...state, password: [action.payload] }
            default: break;
        }
    }

    function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault();
        if (credentials.username == "tones" && credentials.password == "admin") {
            navigate("/list");
        }
        else {
            setInvalidCreds(true);
            setCredentials({
                type: "username",
                payload: ""
            })
            setCredentials({
                type: "password",
                payload: ""
            })
        }
    }

    const [credentials, setCredentials] = useReducer(credReducer, { username: "", password: "" });
    const [input, setInput] = useState(""); //name of currently active input
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [invalidCreds, setInvalidCreds] = useState(false);
    const navigate = useNavigate();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            type: e.target.name,
            payload: e.target.value
        })
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if(invalidCreds){
            setInvalidCreds(false);
        }
        setInput(e.target.name);
        setShowKeyboard(true)
    }

    return (
        <>
            <div id="background">
                <div className="login-form font-rb" >
                    <form onSubmit={handleLogin}>
                        <span id="error-msg" style={{opacity: invalidCreds? '1':'0'}}>Username or password is incorrect!</span>
                        <label htmlFor="username">
                            <input id="username" type="text" placeholder="Enter Username" name="username"
                                value={credentials.username} onChange={handleInput}
                                onFocus={handleFocus}></input>
                            <span>Username</span>
                        </label>
                        <label htmlFor="password">
                            <input id="password" type="password" placeholder="Enter Password" name="password"
                                value={credentials.password} onChange={handleInput}
                                onFocus={handleFocus}></input>
                            <span>Password</span>
                        </label>
                        {/* <Link to={'/list'}>
                        <button type="submit">Login</button>
                    </Link> */}
                        <div>
                            <button type="submit">Login</button>
                        </div>
                    </form>
                </div >
                <div id="credits" className="font-rb">
                    <div className="logo" id="tsi"><img src={histoLogo} /></div>
                    <div id="copyright">Copyrigth © Tones Inc. 2021-present</div>
                    <div className="logo" id="histoone"><img src={tsiLogo} /></div>
                    {/* <div className="logo" id="blockly"><img src={blocklyLogo} /></div> */}
                </div>

            </div>

            <MainKeyboard inputValue={credentials[`${input}`]?.toString()}
                show={showKeyboard}
                showSetter={setShowKeyboard}
                inputSetter={(inp) => {
                    setCredentials({
                        type: input,
                        payload: inp
                    })
                }}
            />
        </>
    );
}