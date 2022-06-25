import classNames from "classnames";
import "common/style.css";
import { getRequest } from 'common/util';
import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toMap } from "sharedlib/collection.util";
import { DeploymentLiquidConfiguration } from 'sharedlib/dto/liquidconfiguration.dto';
import "./Recommendations.css";


function showBtn() {
    const checkbox = document.getElementById('confirmCheck') as HTMLInputElement | null;
    if (checkbox?.checked) {
        document.getElementById("launchBtn")!.setAttribute("style", "visibility: visible");
    } else {
        document.getElementById("launchBtn")!.setAttribute("style", "visibility: hidden");
    }
}

function resolveCell(cid: number, rid: number, configMap: Map<number, DeploymentLiquidConfiguration>) {
    const id = cid * 6 + rid + 1
    const liq = configMap.get(id)
    const washing = cid == 5 && rid > 3;
    if (liq !== undefined) {
        return (
            <td key={cid} className={classNames('liquidCell', { washing })}>
                <div className="liqName">
                    {liq.liquid?.name}
                </div>
                <div className="liqAmount">
                    {liq.liquidAmount} ml
                </div>
            </td>
        )
    }
    return <td key={cid} className={classNames('emptyCell', { washing })}><span className="emptyCell">Empty </span></td>
}


export default function Recommendations() {
    const headers = ['A', 'B', 'C', 'D', 'E', 'F'];
    const rows = 6;
    const columns = 6;
    const [liquidConfig, setLiquidConfig] = useState<DeploymentLiquidConfiguration[]>([])
    const configMap = toMap(liquidConfig, i => i.liquidSlotNumber);
    const params = useParams()

    useEffect(() => {
        let id = params.id!;
        console.log(id);
        getRequest<DeploymentLiquidConfiguration[]>(`/protocol/configuration/${id}`)
            .then(resp => setLiquidConfig(resp.data))
    }, [])


    return (
        <>
            <NavigationBar />
            <div id="main">
                <div className="open-menu-btn"></div>
                <div className="body">

                </div>
                <div className="tableContainer">
                    <h4><i>Fill in tubes and place them according to the configuration table:</i></h4>
                    <table id="recom-table">
                        <colgroup>
                            <col className="small" span={5} />
                            <col className="medium" />
                            <col className="large" />
                        </colgroup>
                        <thead>
                            <tr>
                                <td className="horizontal-thead"></td>
                                {headers.map(h =>
                                    <td key={h}>{h}</td>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(rows).keys()].map((rid) =>
                                <tr key={rid}>
                                    <td className="horizontal-thead">{rid + 1}</td>
                                    {[...Array(columns).keys()].map(cid =>
                                        resolveCell(cid, rid, configMap)
                                    )}
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
                <div className="launchContainer">
                    <div className="confirm">
                        <input type="checkbox" name="confirm" id="confirmCheck"
                            onClick={() => showBtn()}></input>
                        <p></p>
                    </div>
                    <div id="launchBtn" style={{ visibility: "hidden" }}>
                        <a href={`/start/`}>START</a>
                    </div>
                </div>
            </div></>
    )
}