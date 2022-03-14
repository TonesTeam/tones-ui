import NavigationBar from "navbar/NavigationBar";
import './History.css'
import { LiquidUseInstance } from 'sharedlib'
import { getComparator } from 'common/util'

const testData: LiquidUseInstance[] = [
    { name: "Triclosan", amount: "50ml", slotNum: 3 },
    { name: "Phthalates", amount: "10ml", slotNum: 1 },
    { name: "Hydrogen peroxide", amount: "50ml", slotNum: 2 },
]

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
                        <ProtocolExecution>
                            <ProtocolExecutionDetails slots={[1, 2, 3, 4]} liquids={testData} />
                            <ProtocolSteps>
                                <ProtocolStep />
                            </ProtocolSteps>
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
    return (
        <div>
            {props.children}
        </div>
    )
}

function PrototypeStep(props: any) {
    const step = props.step
    return (
        <div>
            - 
        </div>
    )
}

function ProtocolExecutionDetails(props: any) {
    const slots: number[] = props.slots
    const liquids: LiquidUseInstance[] = props.liquids
    const slotRange: string = `${Math.min(...slots)} - ${Math.max(...slots)}`
    return (
        <>
            <div>Used sample slots: <b>{slotRange}</b></div>
            <div>Used Liquid slots:</div>
            <div>
                {liquids.sort(getComparator(o => o.slotNum)).map(protocolLiquidConfigEntry)}
            </div>
        </>
    )
}
function ProtocolSteps(props: any) {
    return (<div>{props.children}</div>)
}

function protocolLiquidConfigEntry(l: LiquidUseInstance) {
    return <div>{l.slotNum} - {l.name} - {l.amount}</div>
}