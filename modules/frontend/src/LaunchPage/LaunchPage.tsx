import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import "./LaunchPage.css";
import "common/style.css";
import { getRequest } from 'common/util'
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from 'state/hooks'
import { addAndRun, moveProgress, discard, finish, error, resume, ProtocolState, Status } from 'state/progress'
import { useParams } from "react-router-dom";
import { ProtocolDto } from "sharedlib/dto/protocol.dto";
import { data } from "jquery";
import { useNavigate } from "react-router-dom";
import progressGif from "../static/progress.gif";
import { height, width } from "@mui/system";


interface StatusElements {
    getColor(): string;
    getMessage(): JSX.Element;
}

class Ongoing implements StatusElements {
    getMessage(): JSX.Element {
        return (
            <div><img src={progressGif} style={{height:"400px"}}/></div>
        );
    }
    getColor(): string {
        return "#3e6a94";
    }
}

// class ForceStopped implements StatusElements {
//     getMessage(): JSX.Element {
//         return (
//             <div className="comment-body">
//                 <h4 id="comment-header">Protocol have been force-stopped. It cannot be resumed, but you can launch it again.</h4>
//                 <button id="toList-btn"><a href="/list">Go to Protocol List</a></button>
//             </div>
//         );
//     }
//     getColor(): string {
//         return "#ddd";
//     }
// }


class SysError implements StatusElements {
    getMessage(): JSX.Element {
        return (
            <div className="comment-body">
                {/* <i className="fas fa-exclamation"></i> */}
                <p id="comment-header">Some error occured! Please follow the guide below to detect and fix the error.</p>
                <ol id="error-guide">
                    <li>Check if any slots are displaced. If any - fix the placing.</li>
                    <li>Make sure that sealing slots cover is closed.</li>
                    <li>Here will be a more precise fixing guide based on the type of error.</li>
                </ol>
            </div>
        );
    }
    getColor(): string {
        return "#c25b67";
    }
}
class Finished implements StatusElements {
    getMessage(): JSX.Element {
        return (
            <div className="comment-body">
                {/* <i className="fas fa-check"></i><i className="fas fa-check"></i> */}
                <p id="comment-header">Protocol have successfully uploaded!</p>
                <p>Do stuff that you need to do and then press Discard button</p>
            </div>
        );
    }
    getColor(): string {
        return "#52914b";
    }
}

const launchStatus: Map<ProtocolState["status"], StatusElements> = new Map([
    [Status.Finished, new Finished()],
    [Status.Error, new SysError()],
    [Status.Ongoing, new Ongoing()]
]);

//const protocolsInDB = (await getRequest<ProtocolDto[]>("/protocol/all")).data

export default function LaunchPage() {

    //Helper functions
    let findIndexByProtocol = function (protocol: ProtocolState) {
        let stateProtocols = useAppSelector((state) => state.protocols);
        return stateProtocols.findIndex(e => { return e.protocol?.id === protocol.protocol.id });
    }

    let findProtocolByIndex = function (index: number) {
        return useAppSelector((state) => state.protocols[index]);
    }


    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const params = useParams();


    const activeProto = useAppSelector((state) => state.protocols).find(e => e.protocol.id.toString() === params.id)!;
    const index = findIndexByProtocol(activeProto);
    const statusStrat = launchStatus.get(activeProto?.status)
    const activeProgress = useAppSelector((state) => state.protocols[index]?.progress)
    const activeStatus = useAppSelector((state) => state.protocols[index]?.status)

    return (
        <>
            <NavigationBar />
            <div className="font-rb" id="main">
                <div id="header">
                        <div className="header-tile">
                            <p className="title">Active protocol: </p>
                            <p className="info">{activeProto.protocol.name}</p>
                        </div>
                        <div className="header-tile">
                            <p className="title">Status: </p>
                            <p className="info">{activeProto.status.toLowerCase()}</p>
                        </div>
                        <div className="header-tile">
                            <p className="title">Approximate duration: </p>
                            <p className="info">{activeProto.duration} seconds</p>
                        </div>
                        <div className="header-tile">
                            <p className="title">Progress: </p>
                            <p className="info">{activeProto.progress}%</p>
                        </div>
                </div>
                <div className="progress-container">
                    <div id="progress">
                        <div id="progress-bar" style={{ width: `${activeProto.progress}%`, backgroundColor: statusStrat?.getColor() }}></div>
                    </div>
                </div>

                <div className="footer">
                    <div id="comment">
                        {statusStrat?.getMessage()}
                    </div>

                    <div className="btn-panel">
                        {(() => {
                            switch (activeProto.status) {
                                case Status.Ongoing:
                                    return <button className="launch-opt-btn" onClick={() => dispatch(error(index))} id="stop-btn"
                                        style={{ visibility: activeProto?.status == Status.Ongoing ? "visible" : "hidden" }}>Toggle fake error</button>
                                case Status.Finished:
                                    return <button className="launch-opt-btn" onClick={() => {
                                        dispatch(discard(index));
                                        navigate(`/list`)
                                    }} id="discard-btn"
                                        style={{ visibility: activeProto?.status == Status.Finished ? "visible" : "hidden" }}>Discard</button>
                                case Status.Error:
                                    return <button className="launch-opt-btn" onClick={() => dispatch(resume(index))} id="resume-btn"
                                        style={{ visibility: activeProto?.status == Status.Error ? "visible" : "hidden" }}>Resume</button>
                                default:
                                    return null
                            }
                        })()}

                        {/* <button onClick={() => dispatch(error(index))} id="fake-error"
                            style={{ visibility: activeProto.status == Status.Ongoing ? "hidden" : "visible" }}>Toggle fake error</button> */}


                    </div>
                </div>
            </div>
        </>
    );
}
