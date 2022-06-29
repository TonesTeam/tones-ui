import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import "./LaunchPage.css";
import "common/style.css";
import { ClassicElement, useEffect, useState } from "react";

/* var someError = false;
var forceStopped = false;
var finished = false; */

interface Status {
    getColor(): string;
    getMessage(): JSX.Element;
}

class Ongoing implements Status {
    getMessage(): JSX.Element {
        return (
            <div></div>
        );
    }
    getColor(): string {
        return "#6191ae";
    }
}

class ForceStopped implements Status {
    getMessage(): JSX.Element {
        return (
            <div className="comment-body">
                <h4 id="comment-header">Protocol have been force-stopped. It cannot be resumed, but you can launch it again.</h4>
                <button id="toList-btn"><a href="/list">Go to Protocol List</a></button>
            </div>
        );
    }
    getColor(): string {
        return "#ddd";
    }
}
class SysError implements Status {
    getMessage(): JSX.Element {
        return (
            <div className="comment-body">
                <h4 id="comment-header">Some error occured! Please follow the guide below to detect and fix the error.</h4>
                <ol id="error-guide">
                    <li>Check if any slots are displaced. If any - fix the placing.</li>
                    <li>Make sure that sealing slots cover is closed.</li>
                    <li>Here will be a more precise fixing guide based on the type of error.</li>
                    <li>Or not. In that case, pretend like this is not your fault and act casual.</li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia sunt eaque.</li>
                </ol>
            </div>
        );
    }
    getColor(): string {
        return "#ae616a";
    }
}
class Finished implements Status {
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

var i = 0;
var width = 1;
enum ProtocolState {
    ONGOING,
    FORCE_STOPPED,
    ERROR,
    FINISHED
}

const launchStatus: Map<ProtocolState, Status> = new Map([
    [ProtocolState.FINISHED, new Finished()],
    [ProtocolState.ERROR, new SysError()],
    [ProtocolState.FORCE_STOPPED, new ForceStopped()],
    [ProtocolState.ONGOING, new Ongoing()]
]);

export default function LaunchPage() {
    const secondsForBar = 25;
    const incrementWidthPerSecond = 100 / secondsForBar;

    const [ps, setProtocolState] = useState(ProtocolState.ONGOING);
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (progress == 100) {
            setProtocolState(ProtocolState.FINISHED);
            return;
        }
        if (ps == ProtocolState.ONGOING) {
            const timeout = setTimeout(() => setProgress(progress + incrementWidthPerSecond), 1000);
            return () => clearTimeout(timeout)
        }
    })

    return (
        <>
            <NavigationBar />
            <div id="main">
                <div className="progress-container">
                    <div>
                        <h2><i>Approximate protocol duration: 4 minutes</i></h2>
                    </div>

                    <div id="progress">
                        <div id="progress-bar" style={{ width: `${progress}%`, backgroundColor: launchStatus.get(ps)!.getColor() }}></div>
                    </div>
                </div>

                <div className="footer">
                    <div id="comment">
                        {launchStatus.get(ps)!.getMessage()}
                    </div> {/* to be filled according to current status */}

                    <div className="btn-panel">
                        <button onClick={() => setProtocolState(ProtocolState.FORCE_STOPPED)} id="stop-btn">Force stop</button>
                        <button onClick={() => setProtocolState(ProtocolState.ERROR)} id="fake-error"
                            style={{ visibility: ps == ProtocolState.ERROR ? "hidden" : "visible" }}>Toggle fake error</button>
                        <button onClick={() => setProtocolState(ProtocolState.ONGOING)} id="resume-btn"
                            style={{ visibility: ps == ProtocolState.ERROR ? "visible" : "hidden" }}>Resume</button>
                    </div>
                </div>
            </div>
        </>
    );
}