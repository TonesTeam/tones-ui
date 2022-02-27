function CenteringFlexBox(props) {
    const { className, ...other } = props;
    return (
        <div className={`centering-flex-box ${className}`} {...other} >
            {props.children}
        </div>
    );
}

function NavBarItem(props) {
    let id = props.isSelected ? "selected-navbar-item" : undefined;
    return (
        <a id={id} href="#">
            <div className="nav-item">
                <div><span className={`fas fa-${props.icon}`}></span></div>
                <div className="nav-item-txt-box">{props.text}</div>
            </div>
        </a>
    );
}

function NavigationBar() {
    return (
        <div id="navbar" className="sidenav">
            <CenteringFlexBox className="openbtn" onClick={openNav}>
                &#9776;
            </CenteringFlexBox>
            <div id="openbtn-buffer"></div>
            <div id="upper-nav">
                <div className="side">
                    <button className="closebtn" onClick={closeNav} >&times;</button>
                </div>
            </div>
            <div className="user-prof">
                <span className="fas fa-user"></span>
                <div>Test Username</div>
            </div>

            <div id="navbar-menu">
                <NavBarItem isSelected icon="list" text="Protocol List" />
                <NavBarItem icon="edit" text="Create Protocol" />
                <NavBarItem icon="history" text="History" />
                <NavBarItem icon="user-cog" text="Profile Settings" />
                <NavBarItem icon="cogs" text="System Settings" />
                <NavBarItem icon="file" text="Reports" />
                <NavBarItem icon="sign-out-alt" text="Log out" />
            </div>
        </div>
    )
}
const domContainer = document.querySelector('#nav');
ReactDOM.render(NavigationBar(), domContainer);


const width = getComputedStyle(document.documentElement).getPropertyValue('--navbar-width');
const fontSize = getComputedStyle(document.documentElement).getPropertyValue('--navbar-font-size');
const linkPadding = $("#navbar-menu a").css("padding");
const linkJustify = $("#navbar-menu a").css("justify-content");
const navbarTopPadding = $("#navbar").css("padding-top")
const openbtnHeight = $(".openbtn").height()

//Navigation bar opening-closing
function openNav() {
    $(".openbtn").hide()
    $(".closebtn").show()

    $("#navbar").css("font-size", fontSize);
    $("#navbar-menu a").width(width).css("padding", linkPadding).css("justify-content", linkJustify);
    $("#navbar-menu a").get().forEach(el => $(el).css("width", "100%"));
    $("#navbar-menu a .nav-item").get().forEach(el => $(el).width("auto"));
    $(".user-prof").show();
    $(".nav-item>div:nth-child(2").show();

    $("#navbar").css("padding-top", navbarTopPadding)
    $("#openbtn-buffer").height(0)
    document.getElementById("navbar").style.width = width;
    document.getElementById("main").style.marginLeft = width;
}

function closeNav() {
    const btnh = $("#navbar .openbtn").outerHeight()
    const bufh = ($("#navbar").outerHeight() - $("#navbar-menu").outerHeight() - btnh) / 2 - btnh

    $("#navbar").css("padding-top", "0")
    $("#openbtn-buffer").height(bufh)

    $(".openbtn").show()
    $(".closebtn").hide()
    $("#navbar").css("font-size", "1.5em");
    $(".user-prof").hide(500);
    $(".nav-item>div:nth-child(2").hide(500);
    $("#navbar-menu a").width(75).css("padding", "0").css("justify-content", "center");
    $("#navbar-menu a .nav-item").width($("#navbar-menu a .nav-item span").width())
    $("#navbar .openbtn").width($("#navbar-menu a").width())
    $("#navbar .openbtn").height(openbtnHeight)
    $(".openbtn").show()


    document.getElementById("navbar").style.width = "75px";
    document.getElementById("main").style.marginLeft = "75px";
}
openNav()