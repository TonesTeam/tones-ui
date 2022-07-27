import './NavigationBar.css'
import { useEffect, useState } from 'react';
import { CenteringFlexBox } from 'common/components'
import type { RootState } from '../state/store'
import { useAppSelector, useAppDispatch } from 'state/hooks'


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
    if(open){
        document.getElementById("user-prof")!.style.opacity = "1";
        document.getElementById("user-prof")!.style.visibility = "visible";
        document.getElementById("user-prof")!.style.width = "auto"
    }
    else{
        document.getElementById("user-prof")!.style.opacity = "0";
        document.getElementById("user-prof")!.style.visibility = "hidden";
        document.getElementById("user-prof")!.style.width = "0";
    }
}




export default function NavigationBar(props: { selectedItem?: string }) {
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
                {isOpen &&
                    <>
                        {count > 0
                            ?
                            <span>
                                {activeProtocols.map((p) => {
                                    return (
                                        <div className='protocol-progress-body'>
                                            <div id="bliking-led"></div>
                                            <a href={`/start/${p.protocol.id}`}><p>{p.protocol.name} : {p.progress}%</p></a>
                                        </div>
                                    )
                                })}
                            </span>
                            :
                            <span>
                                <div>No active protocols</div>
                            </span>
                        }
                    </>
                }
            </div>
            <div></div>



        </div>
    )
}

