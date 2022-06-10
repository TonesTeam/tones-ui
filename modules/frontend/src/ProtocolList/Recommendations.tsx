import { useEffect } from "react";
import "common/style.css";
import NavigationBar from "navbar/NavigationBar";
import "navbar/NavigationBar.css";
import "./Recommendations.css";
import { ProtocolDto, UsedProtocolLiquid } from 'sharedlib/dto/protocol.dto';
import { getRequest } from 'common/util';
import { p1 } from "ProtocolList/ProtocolList";
import { CheckboxProps } from "@mui/material";

/* const liquids = p1.usedLiquids;  <- TEST DTO*/
const protocol = (await getRequest<ProtocolDto[]>("/protocol/all")).data[0]
const liquids = protocol.usedLiquids;

function createTable() {
    let headers = ['A', 'B', 'C', 'D', 'E', 'F'];
    let tableLiquids = liquids;
    let finalTable = document.querySelector('.tableContainer');
    let recomTable = document.createElement('table');
    recomTable.setAttribute("id", "recom-table");


    /*   adding test colgroup  */
    /* -------------COMMENT TO RETURN TO UNGROUPED TABLE COLOURS ---------- */
    let colgroup = document.createElement('colgroup');

    let colSm = document.createElement('col');
    colSm.setAttribute('class', 'small');
    colSm.setAttribute('span', '5'); 
    colgroup.appendChild(colSm);

    let colMd = document.createElement('col');
    colMd.setAttribute('class', 'medium'); 
    colgroup.appendChild(colMd);

    let colLg = document.createElement('col');
    colLg.setAttribute('class', 'large'); 
    colgroup.appendChild(colLg);

    recomTable.appendChild(colgroup);
    /*-------------------------------------------------------------------*/

    /* adding header row */
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let tempCell = document.createElement('td');
    tempCell.setAttribute("id", "horizontal-thead");
    headerRow.appendChild(tempCell);
    
    headers.forEach(headerText => {
        let headerCell = document.createElement('td');
        let textNode = document.createTextNode(headerText);
        headerCell.appendChild(textNode);
        headerRow.appendChild(headerCell);
    });

    thead.appendChild(headerRow);
    recomTable.appendChild(thead);



    /* adding body */
    let body = document.createElement('tbody');

    let iter = 0; /* iterator for liquid array */

    for (let i = 0; i < 6; i++) { /* each row */
        let row = document.createElement('tr');

        /* Horizontal thead:  row numbers */
        let horizThead = document.createElement('td');
        horizThead.setAttribute("id", "horizontal-thead");
        horizThead.appendChild(document.createTextNode((i+1).toString()));
        row.appendChild(horizThead);

        for (let j = 0; j < 6; j++) { /* each column */
            let cell = document.createElement('td');
            let cellContent = document.createElement('div');

            /* adding text to cell */
            if (tableLiquids[iter]) {
                let nameDiv = document.createElement('div');
                nameDiv.setAttribute("class", "liqName");
                let textName = document.createTextNode(Object(tableLiquids[iter].liquidName));
                nameDiv.appendChild(textName);

                let amountDiv = document.createElement('div');
                amountDiv.setAttribute("class", "liqAmount");
                let textAmount = document.createTextNode(Object(tableLiquids[iter].amount) + ' ml');
                amountDiv.appendChild(textAmount);

                cellContent.appendChild(nameDiv);
                cellContent.appendChild(amountDiv);

                cell.setAttribute("class", "liquidCell");
            }
            else {
                let text = document.createTextNode('Empty ');
                cellContent.appendChild(text);
                cell.setAttribute("class", "emptyCell");
            }

            if (j==5 && i>3){
                cell.setAttribute('class', cell.getAttribute('class')+' washing');
            }
            
            cell.appendChild(cellContent);
            row.appendChild(cell);
            iter++;
        }
        body.appendChild(row);
    }

    recomTable.appendChild(body);

    finalTable!.appendChild(recomTable);
}

/* const showBtn = (event: React.MouseEvent<HTMLInputElement>, check:CheckboxProps) => {
    var btn = document.getElementById("launchBtn");

    if(check.checked){
       btn?.setAttribute("style", "visibility: visible");
    }
    else{
       btn?.setAttribute("style", "visibility: hidden");
    }
} */



export default function Recommendations() {

    useEffect(() => {
        createTable();
    }, []);

    return (
        <>
            <NavigationBar />
            <div id="main">
                <div className="open-menu-btn"></div>
                <div className="body">
                    
                </div>
                <div className="tableContainer">
                    <h4><i>Fill in tubes and place them according to the configuration table:</i></h4>
                    
                </div>
                <div className="launchContainer">
                    <div className="confirm">
                            <input type="checkbox" name="confirm" id="confirmCheck"></input> {/* onClick = {showBtn(this)} */}
                            <p></p>
                    </div>
                    <div id="launchBtn" style={{visibility: "hidden"}}>
                            <a href="#">START</a>
                    </div>
                </div>
            </div></>
    )
}