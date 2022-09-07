import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainKeyboard from 'ProtocolList/MainKeyboard';
import "./Login.css"
import { event } from "jquery";

export default function Login() {

    // interface UserData {
    //     username: string;
    //     password: string;
    // }

    const [credentials, setCredentials] = useState({username: "", password: ""});
    const {username, password} = credentials;

    const [showKeyboard, setShowKeyboard] = useState(false);
    const [input, setInput] = useState("");
    const [inputName, setInputName] = useState(""); //current selected
    //const [inputs, setInputs] = useState({}); //storage of both input values
    const [value, setValue] = useState(0);

    // const onChangeAll = inputs => {
    //     setInputs({ ...inputs })
    //     console.log("Input change: ", inputs);
    // };

    const onChangeInput = (event:React.ChangeEvent) =>  {
        let input = event.target as HTMLInputElement;
        setCredentials({
            ...credentials,
            [input.name]: [input.value]
        });
        console.log(credentials);
    };

    // const getInputVal = (inputName: string) => {
    //     return inputs[inputName as keyof typeof inputs] || "";
    // };

    useEffect(() => {
        Array.from(document.getElementsByTagName('input')).forEach(element => {
                element.addEventListener('click', (ev) => {
                    setShowKeyboard(true);
                    //setValue(value + 1); // forces a rerender which updates keyboards input value
                    ev.preventDefault();
                })
            
        });
    })

    return (
        <div id="background">
            <div className="login-form" >
                <form>
                    <label htmlFor="username">
                        <input  id="username" type="text" placeholder="Enter Username" name="username" 
                        value={username} onFocus={() => setInputName("username")} onChange={onChangeInput} required></input>
                        <span>Username</span>
                    </label>
                    <label htmlFor="password">
                        <input id="password" type="password" placeholder="Enter Password" name="password" 
                        value={password} onFocus={() => setInputName("password")} onChange={onChangeInput} required></input>
                        <span>Password</span>
                    </label>
                    <Link to={'/list'}>
                        <button type="submit">Login</button>
                    </Link>
                </form>
            </div >
            {/* <MainKeyboard inputValue={input} show={showKeyboard} showSetter={setShowKeyboard} inputSetter={setInputs} /> */}
        </div>
    );
}