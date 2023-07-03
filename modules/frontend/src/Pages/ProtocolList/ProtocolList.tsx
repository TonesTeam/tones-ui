import { useEffect, useState } from 'react'
import { ProtocolDto } from 'sharedlib/dto/protocol.dto'
import { getComparator } from 'sharedlib/collection.util'
import { getRequest, makeRequest } from 'common/util'
import { useNavigate } from "react-router-dom";
import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from 'state/hooks'
import NavigationBar from 'NavigationBar/NavigationBar'
import 'NavigationBar/NavigationBar.css'
import './ProtocolList.css'
import 'common/style.css'


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



    let protocolStatus: string;
    let protoInList = useAppSelector((state) => state.protocols).find(e => e.protocol.id == props.id)
    if (protoInList != undefined) {
        switch (protoInList.status) {
            case "ONGOING":
                protocolStatus = "Ongoing";
                break;
            case "ERROR":
                protocolStatus = "Error occured";
                break;
            case "FINISHED":
                protocolStatus = "Finished";
                break;
            default:
                protocolStatus = "Undefined";
        }
    }
    else if (useAppSelector((state) => state.protocols).length == 0) {
        protocolStatus = "Ready to launch";
    }
    else {
        protocolStatus = "Launch prohibited"
    }



    return (

        <div
            ref={div => setDiv(div)}
            className="protocol font-rb">
            <div
                className={classNames("protocol-general", { active: open })}
                onClick={() => setActive(!open)}>
                {/* <div className="info-cell" id="check">
                    <input type="checkbox" className="check-to-run" name="protocol" disabled title='In current development version parallel protocol deployment is not supported'></input>
                </div> */}
                <div className="info-cell-container">
                    {/* <div className="info-cell-container"> */}
                        <div className="info-cell">
                            <p className="label">ID: </p>
                            <p>{props.id}</p>
                        </div>
                        <div className="info-cell">
                            <p className="label">Name: </p>
                            <p>{props.name}</p>
                        </div>
                    {/* </div> */}

                    {/* <div className="info-cell-container"> */}
                        <div className="info-cell">
                            <p className="label">Author: </p>
                            <p>{props.authorName}</p>
                        </div>
                        <div className="info-cell">
                            <p className="label">Date of creation: </p>
                            <p>{props.creationDate}</p>
                        </div>
                    {/* </div> */}

                </div>

            </div>

            <div className="protocol-body" style={{ maxHeight: open ? `${height}px` : 0 }}>
                <div className="protocol-body-content">
                    <div>
                        <p>Status: {protocolStatus}</p>
                    </div>

                    <div className="protocol-options">
                        <div className="protocol-options">
                            <button onClick={() => navigate(`/edit/protocol/${props.id}`)}
                                className="proto-btn"  disabled={true}><i className="fas fa-puzzle-piece"></i>Edit</button>
                            <button className="proto-btn" disabled={true} style={{pointerEvents:"none"}}><i className="fas fa-code-branch"></i>Use as template</button>
                        </div>

                        <div className="protocol-options">
                            <button className="proto-btn" disabled={disableLaunch ? true : false}>
                                <a href={`/launch/${props.id}`} style={{ pointerEvents: disableLaunch ? "none" : "auto" }}><i className="fas fa-play"></i>Launch</a>
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
    const [protocols, setProtocols] = useState<ProtocolDto[]>([]);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const listInitilizer = () => { getRequest<ProtocolDto[]>("/protocol/all").then(r => setProtocols(r.data)) };
    useEffect(listInitilizer, []);
    //localStorage.clear(); //clear redux state manually when needed

    const [filterInput, setfilterInput] = useState("");
    let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        var lowerCase = e.target.value.toLowerCase();
        setfilterInput(lowerCase);
    };


    function filterAndSort() {
        let filteredList = protocols.filter(e => filterInput === '' ? e : e.name.toLowerCase().includes(filterInput.toLowerCase()));
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
                </div>

            </div>
            <MainKeyboard show={showKeyboard} layout="default" showSetter={setShowKeyboard} inputSetter={setfilterInput} />
        </>
    )
}
