import { CenteringFlexBox } from 'common/components';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'state/hooks';
import { ProtocolState, Status } from 'state/progress';
import './NavigationBar.css';


function NavBarItem(props: any | { route: String }) {
    let id = props.itemData.selectedItem === props.text ? "selected-navbar-item" : undefined;
    const isOpen = props.itemData.isOpen

    let route = { href: props.route }
    return (
        <a id={id} {...route} className={`nav-item-link ${isOpen ? 'nav-item-link-open' : 'nav-item-link-closed'}`}>
            <div className="nav-item">
                <div><span className={`fas fa-${props.icon}`}></span></div>
                <div className="nav-item-txt-box">
                    {props.text}
                </div>
            </div>
        </a>
    );
}


const setMainMargin = (mgl: String) => {
    // @ts-ignore
    document.getElementById("main").style.marginLeft = mgl;
}

const setOpacityMain = (opct: String) => {
    // @ts-ignore
    document.getElementById("main").style.filter = "blur(" + opct + ")";

}

const setOpacityUserProf = (open: Boolean) => {
    if (open) {
        document.getElementById("user-prof")!.style.opacity = "1";
        document.getElementById("user-prof")!.style.visibility = "visible";
        document.getElementById("user-prof")!.style.width = "auto"
    }
    else {
        document.getElementById("user-prof")!.style.opacity = "0";
        document.getElementById("user-prof")!.style.visibility = "hidden";
        document.getElementById("user-prof")!.style.width = "0";
    }
}

const progressIconStyle = (actProtocols: ProtocolState[]) => {
    if(document.getElementById("progress-icon")){
        let blinkIcon = document.getElementById("progress-icon")!
        if (actProtocols.find((p) => { return (p.status == Status.Error) })) {
            blinkIcon.className = "fa fa-flask ERROR";
        }
        else if (actProtocols.find((p) => { return (p.status == Status.Finished) })) {
            blinkIcon.className = "fa fa-flask FINISHED";
        }
        else blinkIcon.className = "fa fa-flask ONGOING";
    }

}

export default function NavigationBarOld(props: { selectedItem?: string }) {
    const [isOpen, setOpen] = useState(false)
    const itemData: { selectedItem: string, isOpen: boolean } = {
        selectedItem: props.selectedItem ?? "",
        isOpen
    };

    const count = useAppSelector((state) => state.protocols.length);
    const activeProtocols = useAppSelector((state) => state.protocols);
    //const status = useAppSelector((state) => state.isRunning);


    useEffect(() => {
        const op = '3px';
        if (!isOpen) {
            setOpacityMain("0");
        }
        else setOpacityMain(op);
        setOpacityUserProf(isOpen);
        progressIconStyle(activeProtocols);
    })
    return (
        <div id="navbar" className={`sidenav ${isOpen ? 'sidenav-open' : 'sidenav-closed'} font-rb`}>

            {!isOpen &&
                <>
                    <CenteringFlexBox className="openbtn" onClick={() => setOpen(true)}>
                        &#9776;
                    </CenteringFlexBox>
                    <CenteringFlexBox id="user-prof">
                        <span className="fas fa-user-circle"></span>
                        <div>Test Username</div>
                    </CenteringFlexBox>
                </>
            }
            {isOpen && <>

                <button className="closebtn" onClick={() => setOpen(false)} >&times;</button>

                <CenteringFlexBox id="user-prof">
                    <span className="fas fa-user-circle"></span>
                    <div>Test Username</div>
                </CenteringFlexBox>
            </>}
            <div id="navbar-menu" className={`${isOpen ? 'navbar-menu-open' : 'navbar-menu-closed'}`}>
                {/* <div style={{ flexGrow: 1 }}></div> */}
                <NavBarItem itemData={itemData} icon="list" text="Protocol List" route="/list" />
                <NavBarItem itemData={itemData} icon="edit" text="Create Protocol" route="/create/protocol" />
                <NavBarItem itemData={itemData} icon="history" text="History" />
                {/* <NavBarItem itemData={itemData} icon="user-cog" text="Profile Settings" /> */}
                <NavBarItem itemData={itemData} icon="cogs" text="Settings" />
                {/* <NavBarItem itemData={itemData} icon="file" text="Reports" /> */}
                <NavBarItem itemData={itemData} icon="sign-out-alt" text="Log out" route="/" />

                {/* <span>Active protocols: {count}</span> */}
            </div>

            <div id="progress-track">
                {count > 0
                    ?
                    <>
                        {isOpen
                            ?
                            <span>
                                {activeProtocols.map((p) => {
                                    return (
                                        <a className="progress-link" href={`/start/${p.protocol.id}`}>
                                            <div className="progress-item">
                                                <div className={`bliking-led ${p.status}`}></div>
                                                <div className="progress">
                                                    <p>{p.protocol.name} :</p>
                                                    <p>{p.progress}%</p>
                                                </div>

                                            </div>
                                        </a>
                                    )
                                })}
                            </span>
                            :
                            <span>
                                <i id='progress-icon' className="fa fa-flask"></i>
                            </span>


                        }
                    </>
                    :
                    <>
                        {isOpen ?
                            <span>
                                <div>No active protocols</div>
                            </span>
                            :
                            <></>
                        }

                    </>

                }



            </div>
            <div></div>



        </div>
    )
}

