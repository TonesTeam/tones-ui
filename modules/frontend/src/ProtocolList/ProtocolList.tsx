import NavigationBar from 'NavigationBar/NavigationBar'
import 'NavigationBar/NavigationBar.css'
import { useEffect } from 'react'
import { useState } from 'react';
import { ProtocolDto } from 'sharedlib/dto/protocol.dto'
import { getRequest } from 'common/util'
import { useNavigate } from "react-router-dom";
import { makeRequest } from 'common/util'
import classNames from 'classnames'
import { getComparator } from 'sharedlib/collection.util'
import './ProtocolList.css'
import 'common/style.css'
import MainKeyboard from './MainKeyboard';


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
                            <button className="proto-btn"><a href={`/launch/${props.id}`}><i className="fas fa-play"></i>Launch</a></button>
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
    const [protocols, setProtocols] = useState<ProtocolDto[]>([]);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const listInitilizer = () => { getRequest<ProtocolDto[]>("/protocol/all").then(r => setProtocols(r.data)) };
    useEffect(listInitilizer, []);

    const [filterInput, setfilterInput] = useState("");
    let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        var lowerCase = e.target.value.toLowerCase();
        setfilterInput(lowerCase);
    };

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
                    <input onFocus={() => setShowKeyboard(true)} value={filterInput}
                        type="text" className="search-bar" placeholder="Search for protocols..." onChange={inputHandler}></input>
                </div>
                <div className="protocol-list">

                    {filterAndSort().map(function (protocol) {
                        return <Protocol listInitializer={listInitilizer} id={protocol.id} key={protocol.id} name={protocol.name} authorName={protocol.authorName} creationDate={protocol.creationDate.toLocaleDateString()} />
                    })}


                    {/* <Protocol id="PA-001" name="Protocol Alpha"
                        authorName="James Doe" creationDate="10/01/2021" />

                    <Protocol id="PB-002" name="Protocol Beta"
                        authorName="Janette Smith" creationDate="11/07/2026" />

                    <Protocol id="PY-003" name="Protocol Gamma"
                        authorName="Bellatrix Lestrange " creationDate="22/12/2020" />

                    <Protocol id="PD-004" name="Protocol Delta"
                        authorName="Godric Gryffindor" creationDate="02/03/1126" />

                    <Protocol id="PE-005" name="Protocol Epsilon"
                        authorName="Rubeus Hagrid" creationDate="11/07/2026" />

                    <Protocol id="PD-006" name="Protocol Zeta"
                        authorName="Helga Hufflepuff" creationDate="11/07/1111" />

                    <Protocol id="PD-007" name="Protocol Eta"
                        authorName="Viktor Krum" creationDate="10/07/2323" />

                    <Protocol id="PO-008" name="Protocol Theta"
                        authorName="Luna Lovegood" creationDate="12/09/2052" />

                    <Protocol id="PK-009" name="Protocol Kappa"
                        authorName="Minerva McGonagall" creationDate="11/07/2022" /> */}
                </div>
            </div>
            <MainKeyboard show={showKeyboard} showSetter={setShowKeyboard} inputSetter={setfilterInput} />
        </>
    )
}
