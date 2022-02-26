
function PageHeader(props) {
    return (
        <div className="page-header">
            {props.children}
        </div>
    )
}

function SearchBar() {
    return (
        <CenteringFlexBox className="search-bar-container">
            <input type={"text"} className="search-bar" placeholder="Search protocol history..."></input>
            <button type="submit"><i class="fa fa-search"></i></button>
        </CenteringFlexBox>
    )
}

function LogList(props) {
    return (
        <div>
            List:
            {props.children}
        </div>
    )
}

function LogItem(props) {
    return (
        <div>Log Item</div>
    )
}

function LogsPageContent() {
    return (
        <div>
            <PageHeader>
                <SearchBar />
            </PageHeader>
            <LogList>
                <LogItem />
                <LogItem />
            </LogList>
        </div>
    )
}

const logDomContainer = document.querySelector('#main');
ReactDOM.render(LogsPageContent(), logDomContainer);