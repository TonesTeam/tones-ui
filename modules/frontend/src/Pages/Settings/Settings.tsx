import NavigationBar from 'NavigationBar/NavigationBar';
import './Settings.css';
import { useState } from 'react';

enum SettingTab {
    User = 'user-set',
    System = 'system-set',
    Reagents = 'reag-lib',
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<SettingTab>(SettingTab.Reagents);

    return (
        <>
            <NavigationBar selectedItem="Settings" />
            <div id="main" className="settings-container">
                <div className="settings-tabs">
                    <div
                        className={`tab ${activeTab == SettingTab.User ? 'active' : ''}`}
                        onClick={() => setActiveTab(SettingTab.User)}
                    >
                        User Settings
                    </div>
                    <div
                        className={`tab ${activeTab == SettingTab.System ? 'active' : ''}`}
                        onClick={() => setActiveTab(SettingTab.System)}
                    >
                        System Settings
                    </div>
                    <div
                        className={`tab ${activeTab == SettingTab.Reagents ? 'active' : ''}`}
                        onClick={() => setActiveTab(SettingTab.Reagents)}
                    >
                        Reagent Library
                    </div>
                </div>
                <div className="settings-body">
                    {activeTab == SettingTab.User && (
                        <div id="user-set">
                            <div>
                                <h3>Username</h3>

                                <div className="inp-row">
                                    <label>Current username</label>
                                    <input
                                        type="text"
                                        value={'TestUserName 007'}
                                        readOnly
                                    />
                                </div>

                                <div className="inp-row">
                                    <label>Enter new username</label>
                                    <input type="text" />
                                </div>

                                <button>Save changes</button>
                            </div>

                            <div>
                                <h3>Password</h3>

                                <div className="inp-row">
                                    <label>Current passowrd</label>
                                    <input
                                        type="text"
                                        value={'************'}
                                        readOnly
                                    />
                                </div>

                                <div className="inp-row-col">
                                    <div className="inp-row">
                                        <label>New password</label>
                                        <input type="password" />
                                    </div>

                                    <div className="inp-row">
                                        <label>Confirm password</label>
                                        <input type="password" />
                                    </div>
                                </div>
                                <button>Save changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab == SettingTab.System && (
                        <div>System Settings</div>
                    )}

                    {activeTab == SettingTab.Reagents && (
                        <div>Reagent Settings</div>
                    )}
                </div>
            </div>
        </>
    );
}
