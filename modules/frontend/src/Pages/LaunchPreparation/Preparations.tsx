import "common/style.css";
import { getRequest } from 'common/util';
import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProtocolDto } from "sharedlib/dto/protocol.dto";
import "./Preparations.css";


const protocolsInDB = (await getRequest<ProtocolDto[]>("/protocol/all")).data

const maxSlots = 5;


export default function Preparation() {
    const params = useParams()
    const id = params.id!;
    const newProto = protocolsInDB.find(e => e.id.toString() === params.id);
    const [slots, setSlots] = useState<number>(0);
    const [stage, setStage] = useState<number>(0);

    return (
        <>
            <NavigationBar />
            <div id="main" className="preparation-wrapper"> 
                <div id="header">
                    <div id="stage-bar">
                        <div className="stage active" id="s1"><p>Step 1</p></div>
                        
                        <div className={`stage ${stage>=1 ? 'active' : ''}`} id="s2">
                            <div id="step1" className="pseudo"></div>
                            <p>Step 2</p>
                        </div>
                        
                        <div className={`stage ${stage>=2 ? 'active' : ''} `} id="s3">
                            <div id="step2" className="pseudo"></div>
                            <p>Step 3</p>
                        </div>
                    </div>

                    <div>
                        {stage==0 &&
                        <div id="slot-inp">
                            <p>Choose quantity of slots used for current deployment</p>
                            <div className="number-toggle">
                                <div className="btn minus" onClick={()=>{setSlots(slots-1)}} style={{pointerEvents: `${slots==0 ? "none" : "all"}`}}>-</div>
                                <div id="slot-val">{slots}</div>
                                <div className="btn plus" onClick={()=>{setSlots(slots+1)}} style={{pointerEvents: `${slots==maxSlots ? "none" : "all"}`}}>+</div>
                            </div>
                        </div>
                        }
                    </div>
                </div>

                <div id="body">
                    Body content
                </div>

                <div id="footer">
                    {/* Will be replaced by "Discard" and "Launch" */}
                    <button id="back" onClick={()=>{setStage(stage-1)}} disabled={stage==0? true : false}>Back</button>
                    <button id="next" onClick={()=>{setStage(stage+1)}} disabled={stage==2? true : false}>Next</button>
                </div>
                
            </div>
        </>
    )
}