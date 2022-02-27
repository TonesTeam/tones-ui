import NavigationBar from 'navbar/NavigationBar'
import 'navbar/NavigationBar.css'
import './ProtocolList.css'
import 'common/style.css'
import { useEffect } from 'react';

const max = 2;

function selectiveCheck(_event: any) {
    var checkedChecks = document.querySelectorAll(".check-to-run:checked");
    if (checkedChecks.length >= max + 1)
        return false;
    document.getElementById("protocolCount")!.textContent = checkedChecks.length.toString();
}

function setEventListeners() {
    const protocolGenerals: NodeListOf<HTMLElement> = document.querySelectorAll(".protocol-general");
    const checkBoxes = document.querySelectorAll("#check");

    protocolGenerals.forEach(protocolGeneral => {
        protocolGeneral.addEventListener("click", event => {
            protocolGeneral.classList.toggle("active");
            // @ts-ignore
            const protocolBody: HTMLElement = protocolGeneral.nextElementSibling!;
            if (protocolGeneral.classList.contains("active")) {
                protocolBody.style.maxHeight = protocolBody.scrollHeight + "px";
            } else {
                // @ts-ignore
                protocolBody.style.maxHeight = 0;
            }
        })
    })


    checkBoxes.forEach(checkBox => {
        checkBox.addEventListener("click", function (e) {
            e.stopPropagation();
        })
    })
    //checkbox limit
    //+ checkbox counter
    var checks: NodeListOf<HTMLElement> = document.querySelectorAll(".check-to-run");
    for (var i = 0; i < checks.length; i++)
        checks[i].onclick = selectiveCheck;
}


export default function ProtocolList() {
    useEffect(setEventListeners)
    return (
        <><NavigationBar />
            <div id="main">

                <div className="page-header" id="sticker">
                    <div className="open-menu-btn">
                    </div>
                    <div className="search-bar-container">
                        <input type="text" className="search-bar" placeholder="Search for protocols..."></input>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </div>
                    <div className="launch-container">
                        <div className="protocol-counter">
                            <p>Launch <span id="protocolCount">0</span>/2 protocols</p>
                        </div>
                        <div className="protocol-submit-btn">
                            <button type="submit"><i className="fa fa-play-circle"></i></button>
                        </div>
                    </div>
                </div>


                <div className="protocol-list">

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PA-001</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Alpha</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>James Doe</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>21.12.2021</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">
                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PB-002</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Beta</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Janette Smith</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>11.07.2026</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">
                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PY-003</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Gamma</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Helena Lee</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>02.02.2222</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PD-004</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Delta</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Josh Stampton</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>11.06.2025</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PE-005</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Epsilon</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>James Arthur Marks</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>05.02.2023</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PZ-006</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Zeta</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Megan Elizabeth Ramirez</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>15.09.2034</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PZ-006</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Zeta</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Megan Elizabeth Ramirez</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>15.09.2034</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PZ-006</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Zeta</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Megan Elizabeth Ramirez</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>15.09.2034</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="protocol">

                        <div className="protocol-general">
                            <div className="info-cell" id="check">
                                <input type="checkbox" className="check-to-run" name="protocol"></input>
                            </div>
                            <div className="info-cell-container">
                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">ID: </p>
                                        <p>PZ-006</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Name: </p>
                                        <p>Protocol Zeta</p>
                                    </div>
                                </div>

                                <div className="info-cell-container">
                                    <div className="info-cell">
                                        <p className="label">Author: </p>
                                        <p>Megan Elizabeth Ramirez</p>
                                    </div>
                                    <div className="info-cell">
                                        <p className="label">Date of creation: </p>
                                        <p>15.09.2034</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="protocol-body">
                            <div className="protocol-body-content">
                                <table className="dropdown-table">
                                    <tbody>
                                        <tr>
                                            <td>Temperature: 36F</td>
                                            <td>Duration: 24h</td>
                                            <td>Containers used: 5</td>
                                        </tr>
                                        <tr>
                                            <td>Status: Approved</td>
                                            <td>Stages: 6</td>
                                            <td>Blockly Scheme: Avaliable</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                                    augue
                                    convallis tincidunt at eget lacus.
                                    Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                                    Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.
                                    Pellentesque enim lectus, mattis sit amet neque in, efficitur euismod arcu.</p>

                                <div className="protocol-options">
                                    <button className="proto-btn">Blockly Scheme</button>
                                    <button className="proto-btn">Use as template</button>
                                    <button className="proto-btn">View history</button>
                                    <button className="proto-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div></>
    )
}
