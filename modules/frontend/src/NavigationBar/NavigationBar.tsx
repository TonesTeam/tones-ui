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

const setOpacity = (opct: String) => {
    // @ts-ignore
    document.getElementById("main").style.filter = "blur(" + opct + ")";
}


export default function NavigationBar(props: { selectedItem?: string }) {
    const [isOpen, setOpen] = useState(false)
    const itemData: { selectedItem: string, isOpen: boolean } = {
        selectedItem: props.selectedItem ?? "",
        isOpen
    };

    const count = useAppSelector((state) => state.protocols.length)
    const status = useAppSelector((state) => state.isRunning)
    

    useEffect(() => {
        const op = '3px';
        if (!isOpen) setOpacity("0");
        else setOpacity(op);
    })
    return (
        //<Provider store={store}>


        <div id="navbar" className={`sidenav ${isOpen ? 'sidenav-open' : 'sidenav-closed'} font-rb`}>
            {!isOpen &&
                <>
                    <CenteringFlexBox className="openbtn" onClick={() => setOpen(true)}>
                        &#9776;
                    </CenteringFlexBox>
                    <div id="openbtn-buffer"></div>
                    <div className="user-prof"></div>
                </>
            }
            {isOpen && <>
                <div id="upper-nav">
                    <div className="side">
                        <button className="closebtn" onClick={() => setOpen(false)} >&times;</button>
                    </div>
                </div>
                <div className="user-prof">
                    <span className="fas fa-user-circle"></span>
                    <div>Test Username</div>
                </div>
            </>}
            <div id="navbar-menu" className={`${isOpen ? 'navbar-menu-open' : 'navbar-menu-closed'}`}>
                {/* <div style={{ flexGrow: 1 }}></div> */}
                <NavBarItem itemData={itemData} icon="list" text="Protocol List" route="/list" />
                <NavBarItem itemData={itemData} icon="edit" text="Create Protocol" route="/create/protocol" />
                <NavBarItem itemData={itemData} icon="history" text="History" route="/history" />
                <NavBarItem itemData={itemData} icon="user-cog" text="Profile Settings" />
                <NavBarItem itemData={itemData} icon="cogs" text="System Settings" />
                <NavBarItem itemData={itemData} icon="file" text="Reports" />
                <NavBarItem itemData={itemData} icon="sign-out-alt" text="Log out" route="/" />

                <span>How many protocols: {count}</span>
                <span>System status: {status}</span>
                
                {/* <div style={{ flexGrow: 2 }}></div> */}
            </div>
        </div>
        //</Provider>
    )
}

