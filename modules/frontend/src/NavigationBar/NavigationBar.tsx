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



export default function NavigationBar(props: any) {
    const [isOpen, setOpen] = useState(false);

    const count = useAppSelector((state) => state.protocols.length);
    const activeProtocols = useAppSelector((state) => state.protocols);

    const itemData: { selectedItem: string, isOpen: boolean } = {
        selectedItem: props.selectedItem ?? "",
        isOpen
    };

    // useEffect(() => {
    //     const op = '3px';
    //     if (!isOpen) {
    //         setOpacityMain("0");
    //     }
    //     else setOpacityMain(op);
    //     progressIconStyle(activeProtocols);
    // })

    return (
        <div id="navbar" className={`${isOpen ? 'sidenav-open' : 'sidenav-closed'}`}>

                <div id="nav-header">
                    {isOpen &&
                        <h3 id="nav-logo">💙TONES💙</h3>
                    }
                    <img className={`nav-btn ${isOpen ? 'open' : 'closed'}`} src="./static/navbar_icons/Open.png" onClick={() => setOpen(prevOpen => !prevOpen)}></img>
                </div>

            <div id="navbar-menu" className={`${isOpen ? 'navbar-menu-open' : 'navbar-menu-closed'}`}>
                <NavBarItem itemData={itemData} icon="list" text="Protocol List" route="/list" />
                <NavBarItem itemData={itemData} icon="edit" text="Create Protocol" route="/create/protocol/-1" />
                <NavBarItem itemData={itemData} icon="history" text="History" />
                <NavBarItem itemData={itemData} icon="cogs" text="Settings" route="/settings" />
                <NavBarItem itemData={itemData} icon="sign-out-alt" text="Log out" route="/" />
            </div>

            {!isOpen &&
            <div id="progress-track">
                <div className="progress-bar">
                    <progress style={{visibility:'hidden', height:0, width:0}}>75%</progress>
                </div>
            </div>
            }

            {isOpen &&
            <div id="progress-track-full">
                <div className="progress-bar" style={{textAlign:"center"}}>
                    <progress style={{visibility:'hidden', height:0, width:0}}>75%</progress>
                </div>
                <div>
                    <p>Proto Alpha</p>
                    <p>Sample text</p>
                </div>
            </div>
            }

            {!isOpen &&
                <div id="user-prof">
                </div>
            }   
            {isOpen &&
                <div id="user-prof">
                    <span className="fas fa-user-circle"></span>
                    <div>
                        <p id="name">Test Admin User</p>
                        <p id="role">Admin</p>
                    </div>
                </div>
            }   
        </div>
    )
}