import React, { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tsiLogo from '/static/HistOne_logo.png';
import histoLogo from '/static/TSI_logo.png';
import './Login.css';

export default function Login() {
    function credReducer(
        state: any,
        action: { type: string; payload: string },
    ) {
        switch (action.type) {
            case 'username':
                return { ...state, username: [action.payload] };
            case 'password':
                return { ...state, password: [action.payload] };
            default:
                break;
        }
    }

    function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault();
        if (
            credentials.username == 'tones' &&
            credentials.password == 'admin'
        ) {
            navigate('/list');
        } else {
            setInvalidCreds(true);
            setCredentials({
                type: 'username',
                payload: '',
            });
            setCredentials({
                type: 'password',
                payload: '',
            });
        }
    }

    const [credentials, setCredentials] = useReducer(credReducer, {
        username: 'tones',
        password: 'admin',
    });
    const [input, setInput] = useState(''); //name of currently active input
    const [invalidCreds, setInvalidCreds] = useState(false);
    const navigate = useNavigate();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            type: e.target.name,
            payload: e.target.value,
        });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (invalidCreds) {
            setInvalidCreds(false);
        }
        setInput(e.target.name);
        e.target.parentElement!.className += ' active';
    };

    return (
        <>
            <div id="background">
                <div id="login-form">
                    <form onSubmit={handleLogin}>
                        <span
                            id="error-msg"
                            style={{ opacity: invalidCreds ? '1' : '0' }}
                        >
                            💬 Username or password is incorrect!
                        </span>
                        <h2>💙TONES💙</h2>
                        <div className="input-field">
                            <span>Username</span>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter Username"
                                name="username"
                                value={credentials.username}
                                onChange={handleInput}
                                onFocus={handleFocus}
                                onBlur={(e) =>
                                    e.target.parentElement!.classList.remove(
                                        'active',
                                    )
                                }
                            />
                        </div>

                        <div className="input-field">
                            <span>Password</span>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                value={credentials.password}
                                onChange={handleInput}
                                onFocus={handleFocus}
                                onBlur={(e) =>
                                    e.target.parentElement!.classList.remove(
                                        'active',
                                    )
                                }
                            />
                        </div>

                        <div className="form-footer">
                            <button type="submit">Login</button>
                            <div id="copyright">
                                Copyrigth © Tones Inc. 2021-present
                            </div>
                        </div>
                    </form>
                </div>
                <div id="credits">
                    <div className="logo" id="tsi">
                        <img src={histoLogo} />
                    </div>
                    <div className="logo" id="histoone">
                        <img src={tsiLogo} />
                    </div>
                </div>
            </div>
        </>
    );
}
