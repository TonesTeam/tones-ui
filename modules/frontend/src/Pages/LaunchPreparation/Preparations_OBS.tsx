import classNames from 'classnames';
import 'common/style.css';
import { getRequest } from 'common/util';
import NavigationBar from 'NavigationBar/NavigationBar';
import 'NavigationBar/NavigationBar.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toMap } from 'sharedlib/collection.util';
import { DeploymentLiquidConfiguration } from 'sharedlib/dto/legacy/liquidconfiguration.dto';
import { ProtocolDto } from 'sharedlib/dto/protocol.dto';
import { useAppDispatch } from 'state/hooks';
import { addAndRun, finish, moveProgress, Status } from 'state/progress';
import { store } from 'state/store';
import './Preparations.css';

const protocolsInDB = (await getRequest<ProtocolDto[]>('/protocol/all')).data;
// const dispatch = useAppDispatch();

function showBtn() {
    const checkbox = document.getElementById(
        'confirmCheck',
    ) as HTMLInputElement | null;
    if (checkbox?.checked) {
        document
            .getElementById('launchBtn')!
            .setAttribute('style', 'visibility: visible');
    } else {
        document
            .getElementById('launchBtn')!
            .setAttribute('style', 'visibility: hidden');
    }
}

function resolveCell(
    cid: number,
    rid: number,
    configMap: Map<number, DeploymentLiquidConfiguration>,
) {
    const id = cid * 6 + rid + 1;
    const liq = configMap.get(id);
    const washing = cid == 5 && rid > 3;
    if (id === 34) {
        return <td key={cid} className="blank-cell"></td>;
    }
    if (liq !== undefined) {
        return (
            <td key={cid} className={classNames('liquidCell', { washing })}>
                <div className="liqName">{liq.liquid?.name}</div>
                <div className="liqAmount">{liq.liquidAmount} ml</div>
            </td>
        );
    }
    return (
        <td key={cid} className={classNames('emptyCell', { washing })}>
            <span className="emptyCell">Empty </span>
        </td>
    );
}

const duration = 23;

function incProtocol() {
    const st = store.getState();
    const activePr = st.protocols.filter((e) => {
        return e.status === Status.Ongoing;
    })!;
    for (let i = 0; i < st.protocols.length; i++) {
        const pr = st.protocols[i];
        if (pr.progress >= 100) {
            store.dispatch(finish(i));
            continue;
        }
        if (pr.status != Status.Ongoing) {
            continue;
        }
        store.dispatch(
            moveProgress({ protocolIndexToMove: i, progressToAdd: 1 }),
        );
    }
    setTimeout(incProtocol, duration * 10);
}
setTimeout(incProtocol, duration * 10);

export default function Preparation_OBS() {
    const headers = ['A', 'B', 'C', 'D', 'E', 'F'];
    const rows = 6;
    const columns = 6;
    const [liquidConfig, setLiquidConfig] = useState<
        DeploymentLiquidConfiguration[]
    >([]);
    const configMap = toMap(liquidConfig, (i) => i.liquidSlotNumber);
    const params = useParams();
    const id = params.id!;
    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const newProto = protocolsInDB.find((e) => e.id.toString() === params.id);

    function startProtocol() {
        getRequest(`/protocol/start/${id}`);
        dispatch(addAndRun(newProto!));
        navigate(`/start/${id}`);
    }

    useEffect(() => {
        getRequest<DeploymentLiquidConfiguration[]>(
            `/protocol/configuration/${id}`,
        ).then((resp) => setLiquidConfig(resp.data));
    }, []);

    return (
        <>
            <NavigationBar />
            <div className="font-rb" id="main">
                <div className="open-menu-btn"></div>
                <div className="body"></div>
                <div className="tableContainer">
                    <h3>
                        Fill in tubes and place them according to the
                        configuration table:
                    </h3>
                    <table id="recom-table">
                        <colgroup>
                            <col className="small" span={5} />
                            <col className="medium" />
                            <col className="large" />
                        </colgroup>
                        <thead>
                            <tr>
                                <td className="horizontal-thead"></td>
                                {headers.map((h) => (
                                    <td key={h}>{h}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(rows).keys()].map((rid) => (
                                <tr key={rid}>
                                    <td className="horizontal-thead">
                                        {rid + 1}
                                    </td>
                                    {[...Array(columns).keys()].map((cid) =>
                                        resolveCell(cid, rid, configMap),
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="launchContainer">
                    <div className="confirm">
                        <input
                            type="checkbox"
                            name="confirm"
                            id="confirmCheck"
                            onClick={() => showBtn()}
                        ></input>
                        <p></p>
                    </div>
                    <div id="launchBtn" style={{ visibility: 'hidden' }}>
                        <button
                            onClick={() => {
                                startProtocol();
                            }}
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
