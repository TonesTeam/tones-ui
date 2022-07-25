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


interface StatusElements {
    getColor(): string;
    getMessage(): JSX.Element;
}

class Ongoing implements StatusElements {
    getMessage(): JSX.Element {
        return (
            <div></div>
        );
    }
    getColor(): string {
        return "#6191ae";
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
                <h4 id="comment-header">Some error occured! Please follow the guide below to detect and fix the error.</h4>
                <ol id="error-guide">
                    <li>Check if any slots are displaced. If any - fix the placing.</li>
                    <li>Make sure that sealing slots cover is closed.</li>
                    <li>Here will be a more precise fixing guide based on the type of error.</li>
                </ol>
            </div>
        );
    }
    getColor(): string {
        return "#ae616a";
    }
}
class Finished implements StatusElements {
    getMessage(): JSX.Element {
        return (
            <div className="comment-body">
                <h4 id="comment-header">Protocol have successfully finished!</h4>
                <h4>Do stuff that you need to do and then press Discard button</h4>
            </div>
        );
    }
    getColor(): string {
        return "#6f8b6c";
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
                <div className="progress-container">
                    <div>
                        <h2><i>Approximate protocol duration: {activeProto.duration} seconds</i></h2>
                    </div>

                    <div id="progress">
                        <div id="progress-bar" style={{ width: `${activeProto.progress}%`, backgroundColor: statusStrat?.getColor() }}></div>
                    </div>
                </div>

                <div className="footer">
                    <div id="comment">
                        Active protocol: {activeProto?.protocol.name} <br />
                        Protocol status: {activeProto.status} <br />
                        Progress local state: {activeProto.progress} <br />

                        {statusStrat?.getMessage()}
                    </div>

                    <div className="btn-panel">
                        {(() => {
                            switch (activeProto.status) {
                                case Status.Ongoing:
                                    return <button className="launch-opt-btn" onClick={() => dispatch(error(index))}  id="stop-btn"
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