import NavigationBar from 'NavigationBar/NavigationBar'
import 'NavigationBar/NavigationBar.css'
import './ProtocolList.css'
import 'common/style.css'
import { useEffect } from 'react'
import { useState } from 'react';
import { ProtocolDto } from 'sharedlib/dto/protocol.dto'
import { getRequest } from 'common/util'
import { useNavigate } from "react-router-dom";
import { makeRequest } from 'common/util'
import classNames from 'classnames'
import { getComparator } from 'sharedlib/collection.util'
import { useAppSelector, useAppDispatch } from 'state/hooks'
import { RootState } from 'state/store'
import { addAndRun, moveProgress, discard } from 'state/progress'
import { forEach } from 'lodash'


export const p1: ProtocolDto = {
    id: 1,
    name: 'TestName',
    authorName: 'Test Author',
    creationDate: new Date(),
    usedLiquids: [
        {
            liquidName: 'APR-220',
            liquidType: 'Zhizha 1',
            amount: 40,
        },
        {
            liquidName: 'Some very long name of a liquid',
            liquidType: 'Zhizha 2',
            amount: 100,
        },
        {
            liquidName: 'Xelenium',
            liquidType: 'Zhizha 3',
            amount: 20,
        },
        {
            liquidName: 'Liquid gold',
            liquidType: 'Zhizha 2',
            amount: 100,
        },
        {
            liquidName: 'Another very long name',
            liquidType: 'Zhizha 2',
            amount: 30,
        },
        {
            liquidName: 'ABC-123',
            liquidType: 'Zhizha 2',
            amount: 11,
        },
        {
            liquidName: 'Alcohol',
            liquidType: 'Zhizha 21',
            amount: 400,
        },
        {
            liquidName: 'Lorem ipsum',
            liquidType: 'Zhizha 2',
            amount: 50,
        },
        {
            liquidName: 'One more liquid with very long name',
            liquidType: 'Zhizha 2',
            amount: 23,
        },
        {
            liquidName: 'Holy water',
            liquidType: 'Zhizha 2',
            amount: 10,
        }
    ]
}

const max = 2;
function selectiveCheck(_event: any) {
    var checkedChecks = document.querySelectorAll(".check-to-run:checked");
    if (checkedChecks.length >= max + 1)
        return false;
    document.getElementById("protocolCount")!.textContent = checkedChecks.length.toString();
}

function Protocol(props: any) {
    let navigate = useNavigate();
    const [open, setActive] = useState(false)
    const [height, setHeight] = useState(0);
    const [div, setDiv] = useState<HTMLDivElement | null>(null);
    useEffect(() => setHeight(div?.scrollHeight ?? 0));
    
    const dispatch = useAppDispatch();
    let disableLaunch = useAppSelector((state) => state.isRunning);


    return (

        <div
            ref={div => setDiv(div)}
            className="protocol font-rb">
            <div
                className={classNames("protocol-general", { active: open })}
                onClick={() => setActive(!open)}>
                <div className="info-cell" id="check">
                    <input type="checkbox" className="check-to-run" name="protocol" disabled title='In current development version parallel protocol deployment is not supported'></input>
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
                            <p>{props.authorName}</p>
                        </div>
                        <div className="info-cell">
                            <p className="label">Date of creation: </p>
                            <p>{props.creationDate}</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className="protocol-body" style={{ maxHeight: open ? `${height}px` : 0 }}>
                <div className="protocol-body-content">
                    <table className="dropdown-table">
                        <tbody>
                            <tr>
                                <td>Duration: IN DEVELOPEMNT{/* {props.infoDuration} */}</td>
                                <td>Slots used: IN DEVELOPMENT{/* {props.infoSlots} */}</td>
                            </tr>
                            <tr>
                                <td>Status: IN DEVELOPEMNT {/* {props.infoStatus} */}</td>
                                <td>Blockly Scheme: IN DEVELOPEMNT {/* {props.infoBlockly} */}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Description:<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et sem sed
                        augue
                        convallis tincidunt at eget lacus.
                        Duis et orci nisi. Donec commodo lacinia augue, sit amet ullamcorper turpis tempus bibendum.
                        Proin aliquam ipsum ac neque gravida, vel porta elit consectetur.</p>

                    <div className="protocol-options">
                        <div className="protocol-options">
                            <button onClick={() => navigate(`/edit/protocol/${props.id}`)}
                                className="proto-btn"><i className="fas fa-puzzle-piece"></i>Blockly Scheme</button>
                            <button className="proto-btn"><i className="fas fa-code-branch"></i>Use as template</button>
                        </div>

                        <div className="protocol-options">
                            <button className="proto-btn" disabled={disableLaunch ? true : false}>
                                <a href={`/launch/${props.id}`} style={{ pointerEvents: disableLaunch? "none" : "auto" }}><i className="fas fa-play"></i>Launch</a>
                            </button>
                            <button onClick={() => makeRequest('DELETE', `/protocol/${props.id}`).then(() => props.listInitializer())}
                                className="proto-btn"><i className="fas fa-trash-alt"></i>Delete</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProtocolList() {
    const [protocols, setProtocols] = useState<ProtocolDto[]>([])
    const [isVisible, setToVisible] = useState(false)
    const listInitilizer = () => { getRequest<ProtocolDto[]>("/protocol/all").then(r => setProtocols(r.data)) }
    useEffect(listInitilizer, []);
    //localStorage.clear(); //clear redux state manually when needed
    const onBackdropClick = () => {
        setToVisible(false)
    }

    const [filterInput, setfilterInput] = useState("");
    let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        var lowerCase = e.target.value.toLowerCase();
        setfilterInput(lowerCase);
    };

    const activeProtocols = useAppSelector((state) => state.protocols);
    const status = useAppSelector((state) => state.isRunning);

    // //TEST - OUTPUT LAST ADDED PROTOCOL NAME
    // if(activeProtocols.length != 0){
    //     console.log(activeProtocols[activeProtocols.length - 1].protocol.name);
    // }


    function filterAndSort() {
        let filteredList = protocols.filter(e => filterInput === '' ? e : e.name.includes(filterInput));
        let sortedList = filteredList.sort(getComparator(e => e.creationDate.getTime())).reverse();
        return sortedList;
    }


    return (
        <>
            <NavigationBar selectedItem='Protocol List' />
            <div className="font-rb" id="main">
                <div className="page-header" id="sticker">
                    {/* <div className="open-menu-btn">
                    </div> */}
                    {/* 
                    <div className="search-bar-container">
                        <input type="text" className="search-bar" placeholder="Search for protocols..." onChange={inputHandler}></input>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </div>
                    <div className="launch-container">
                        <div className="protocol-counter">
                            <p>Launch <span id="protocolCount">0</span>/2 protocols</p>  - Selected protocol count. For future development
                            <a href={`/launch/${p1.id}`}>
                            </a>
                        </div>
                    </div> 
                    */}

                    <input type="text" className="search-bar" placeholder="Search for protocols..." onChange={inputHandler}></input>
                </div>

                <div className="protocol-list">

                    {filterAndSort().map(function (protocol) {
                        return <Protocol listInitializer={listInitilizer} id={protocol.id} key={protocol.id} name={protocol.name} authorName={protocol.authorName} creationDate={protocol.creationDate.toLocaleDateString()} />
                    })}
                </div>


            </div></>
    )
}
