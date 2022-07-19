import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import "./LaunchPage.css";
import "common/style.css";
import { getRequest } from 'common/util'
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from 'state/hooks'
import { addAndRun, moveProgress, discard, finish, error, resume, ProtocolState, Status} from 'state/progress'
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
                <button><a href="/list">Go to Protocol List</a></button>
            </div>
        );
    }
    getColor(): string {
        return "#6f8b6c";
    }
}

// enum ProtocolState {
//     ONGOING,
//     FORCE_STOPPED,
//     ERROR,
//     FINISHED
// }

const launchStatus: Map<ProtocolState["status"], StatusElements> = new Map([
    [Status.Finished, new Finished()],
    [Status.Error, new SysError()],
    [Status.Ongoing, new Ongoing()]
]);

const protocolsInDB = (await getRequest<ProtocolDto[]>("/protocol/all")).data

export default function LaunchPage() {

    //0. Helper functions
    let findIndexByProtocol = function(protocol: ProtocolDto){
        let stateProtocols = useAppSelector((state) => state.protocols);
        return stateProtocols.findIndex(e => { return e.protocol?.id === protocol.id });
    }

    let findProtocolByIndex = function(index: number){
        return useAppSelector((state) => state.protocols[index]);
    }
    const dispatch = useAppDispatch();

    //1. Find protocol (DTO) by ID passed in param
    const params = useParams();
    console.log(params.id);
    const newProto = protocolsInDB.find(e => e.id.toString() === params.id);
    if (newProto === undefined){
        let navigate = useNavigate();
        navigate("/list");
    }
    // dispatch(addAndRun(newProto!)); <----- RELOCATED TO RECOMMENDATIONS
    
    // //2. Select interface elements according to protocol status
    let index = findIndexByProtocol(newProto!);
    const activeProto = useAppSelector((state) => state.protocols[index]);
    const statusStrat = launchStatus.get(activeProto?.status)


    //3. Move progress gradually by 1 percent in useEffect (for now)
    const activeProgress = useAppSelector((state) => state.protocols[index]?.progress)
    const [progress, setProgress] = useState(activeProgress);
    const activeStatus = useAppSelector((state) => state.protocols[index]?.status)

    const duration = 23;
    //const incrementWidthPerSecond = 100 / duration;
    useEffect(() => {
        if (progress == 100) {
            dispatch(finish(index));
            return;
        }
        if (activeProto?.status == Status.Ongoing) {
            //smooth increase
            const timeout = setTimeout(() => {
                setProgress(progress + 1);
                dispatch(moveProgress({protocolIndexToMove: index, progressToAdd: 1}));
            }, duration*10);
            
            return () => clearTimeout(timeout)
        }
    })

    return (
        <>
            <NavigationBar />
            <div className="font-rb" id="main">
                <div className="progress-container">
                    <div>
                        <h2><i>Approximate protocol duration: {duration} seconds</i></h2>
                    </div>

                    <div id="progress">
                        <div id="progress-bar" style={{ width: `${progress}%`, backgroundColor: statusStrat?.getColor() }}></div>
                    </div>
                </div>

                <div className="footer">
                    <div id="comment">
                        {/* {statusStrat.getMessage()} */}
                        Active protocol: {activeProto?.protocol.name} <br/>
                        Progress: {activeProgress} <br/>
                        Protocol status: {activeStatus} <br/>
                        Progress local state: {progress} <br/>

                        {statusStrat?.getMessage()}
                    </div> 

                    <div className="btn-panel">
                        <button onClick={() => dispatch(error(index))} id="stop-btn">Toggle fake error</button>
                        {/* <button onClick={() => dispatch(error(index))} id="fake-error"
                            style={{ visibility: activeProto.status == Status.Ongoing ? "hidden" : "visible" }}>Toggle fake error</button> */}
                        <button onClick={() => dispatch(resume(index))} id="resume-btn"
                            style={{ visibility: activeProto?.status == Status.Error ? "visible" : "hidden" }}>Resume</button>
                    </div>
                </div>
            </div>
        </>
    );
}