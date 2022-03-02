import NavigationBar from 'navbar/NavigationBar'
import 'navbar/NavigationBar.css'
import './ProtocolList.css'
import 'common/style.css'
import ModalWrapper from './ModalWrapper'
import { useEffect } from 'react'
import { useState } from 'react';
import ProtocolSetup, {SetupFunction} from './ProtocolSetup'

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

function Protocol(props: any){
    return(
        <div className="protocol">

            <div className="protocol-general">
                <div className="info-cell" id="check">
                    <input type="checkbox" className="check-to-run" name="protocol"></input>
                </div>
                <div className="info-cell-container">
                    <div className="info-cell-container">
                        <div className="info-cell">
                            <p className="label">ID: </p>
                            <p>{props.id}</p>
                        </div>
                        <div className="info-cell">
                            <p className="label">Name: </p>
                            <p>{props.name}</p>
                        </div>
                    </div>

                    <div className="info-cell-container">
                        <div className="info-cell">
                            <p className="label">Author: </p>
                            <p>{props.author}</p>
                        </div>
                        <div className="info-cell">
                            <p className="label">Date of creation: </p>
                            <p>{props.date}</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className="protocol-body">
                <div className="protocol-body-content">
                    <table className="dropdown-table">
                        <tbody>
                            <tr>
                                <td>Temperature: {props.infoTemperature}</td>
                                <td>Duration: {props.infoDuration}</td>
                                <td>Containers used: {props.infoContainers}</td>
                            </tr>
                            <tr>
                                <td>Status: {props.infoStatus}</td>
                                <td>Stages: {props.infoStages}</td>
                                <td>Blockly Scheme: {props.infoBlockly}</td>
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
                        <div className="protocol-options">
                            <button className="proto-btn"><i className="fas fa-puzzle-piece"></i>Blockly Scheme</button>
                            <button className="proto-btn"><i className="fas fa-code-branch"></i>Use as template</button>
                        </div>

                        <div className="protocol-options">
                            <button className="proto-btn"><i className="fas fa-history"></i>View history</button>
                            <button className="proto-btn"><i className="fas fa-trash-alt"></i>Delete</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

const onSetupRequest: SetupFunction = async ({slots, time, name}) =>{
    console.log(slots, time, name)
}

export default function ProtocolList() {
    useEffect(setEventListeners)
    const [isVisible, setToVisible] = useState(false)

    const tooglePopup = () => {
        setToVisible(wasVisible => !wasVisible)
    }

    const onBackdropClick = () => {
        setToVisible(false)
    }
    
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
                            <button onClick={tooglePopup}>Open Run PP</button>
                            <ProtocolSetup onBackdropClick={onBackdropClick}
                            onSetupRequest={onSetupRequest}
                            isVisible={isVisible} />
                        </div>
                    </div>
                </div>

                <div id="modal-root"></div>

                <div className="protocol-list">

                    <Protocol id="PA-001" name="Protocol Alpha" 
                    author="James Doe" date="10.01.2021"
                    infoTemperature="36F" infoDuration="24h"
                    infoContainers="1" infoStatus="Approved"
                    infoStages="4" infoBlockly="Avaliable"/>

                    <Protocol id="PB-002" name="Protocol Beta" 
                    author="Janette Smith" date="11.07.2026"
                    infoTemperature="11F" infoDuration="11h"
                    infoContainers="1" infoStatus="Approved"
                    infoStages="12" infoBlockly="Avaliable"/>

                    <Protocol id="PY-003" name="Protocol Gamma" 
                    author="Bellatrix Lestrange " date="22.12.2020"
                    infoTemperature="50F" infoDuration="5h"
                    infoContainers="3" infoStatus="Approved"
                    infoStages="4" infoBlockly="Avaliable"/>

                    <Protocol id="PD-004" name="Protocol Delta" 
                    author="Godric Gryffindor" date="02.03.1126"
                    infoTemperature="33F" infoDuration="13h"
                    infoContainers="12" infoStatus="Obsolete"
                    infoStages="4" infoBlockly="Avaliable"/>

                    <Protocol id="PE-005" name="Protocol Epsilon" 
                    author="Rubeus Hagrid" date="11.07.2026"
                    infoTemperature="11F" infoDuration="24h"
                    infoContainers="1" infoStatus="Draft"
                    infoStages="40" infoBlockly="Avaliable"/>

                    <Protocol id="PD-006" name="Protocol Zeta" 
                    author="Helga Hufflepuff" date="11.07.1111"
                    infoTemperature="36F" infoDuration="3h"
                    infoContainers="5" infoStatus="Approved"
                    infoStages="13" infoBlockly="Avaliable"/>

                    <Protocol id="PD-007" name="Protocol Eta" 
                    author="Viktor Krum" date="10.07.2323"
                    infoTemperature="36F" infoDuration="24h"
                    infoContainers="7" infoStatus="Draft"
                    infoStages="43" infoBlockly="Avaliable"/>

                    <Protocol id="PO-008" name="Protocol Theta" 
                    author="Luna Lovegood" date="12.09.2052"
                    infoTemperature="55F" infoDuration="6h"
                    infoContainers="2" infoStatus="Approved"
                    infoStages="4" infoBlockly="Avaliable"/>

                    <Protocol id="PK-009" name="Protocol Kappa" 
                    author="Minerva McGonagall" date="11.07.2022"
                    infoTemperature="36F" infoDuration="3h"
                    infoContainers="6" infoStatus="Obslete"
                    infoStages="12" infoBlockly="Avaliable"/>
                </div>
            </div></>
    )
}
