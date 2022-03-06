import NavigationBar from "navbar/NavigationBar";
import './History.css'
import { Liquid } from 'sharedlib'

export default function History() {
    return (
        <>
            <NavigationBar />
            <div id="main">
                <div className="page-header" id="sticker">
                    <div className="open-menu-btn">
                    </div>
                    <div className="search-bar-container">
                        <input type="text" className="search-bar" placeholder="Search history..."></input>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </div>
                </div>
                <div className="history-list">
                    <HistoryItem>
                        <ProtocolStart protocolName="Alpha" username="EdgeLord6969xxx" datetime="10 Jan, 08:00" />
                        <ProtocolExecution slots={[1, 2, 3, 4]}>
                            <ProtocolExecutionDetails></ProtocolExecutionDetails>
                            <ProtocolSteps></ProtocolSteps>
                        </ProtocolExecution>
                        <ProtocolEnd />
                    </HistoryItem>
                </div>
            </div>
        </>
    )
}

function HistoryItem(props: any) {
    return (
        <div className="history-item">
            {props.children}
        </div>
    )
}
function ProtocolStart(props: any) {
    return (
        <div>
            Protocol <b>{props.protocolName}</b> started by <b>{props.username}</b> at <b>{props.datetime}</b>
        </div>
    )
}
function ProtocolEnd() {
    return (<div></div>)
}
function ProtocolExecution(props: any) {
    const slots: number[] = props.slots
    const liquids: Liquid[] = props.liquids
    const slotRange: string = `${Math.min(...slots)} - ${Math.max(...slots)}`
    return (
        <div>
            <div>Used sample slots: <b>{slotRange}</b></div>
            <div>Used Liquid slots:</div>
            <ul>
                { }
            </ul>
        </div>
    )
}
function ProtocolExecutionDetails() {
    return (<div></div>)
}
function ProtocolSteps() {
    return (<div></div>)
}