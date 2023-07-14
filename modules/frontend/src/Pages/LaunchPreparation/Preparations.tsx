import "common/style.css";
import { getRequest } from 'common/util';
import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProtocolDto } from "sharedlib/dto/protocol.dto";
import "./Preparations.css";


const protocolsInDB = (await getRequest<ProtocolDto[]>("/protocol/all")).data


export default function Preparation() {
    const params = useParams()
    const id = params.id!;
    const newProto = protocolsInDB.find(e => e.id.toString() === params.id);



    const [stage, setStage] = useState<number>(0)
    return (
        <>
            <NavigationBar />
            <div id="main"> 

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


                <button onClick={()=>{setStage(stage+1)}} disabled={stage==2? true : false}>Next</button>
                <button onClick={()=>{setStage(stage-1)}} disabled={stage==0? true : false}>Back</button>
            </div>
        </>
    )
}