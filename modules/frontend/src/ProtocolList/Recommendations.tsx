import { useEffect, useState } from "react";
import "common/style.css";
import NavigationBar from "navbar/NavigationBar";
import "navbar/NavigationBar.css";
import "./Recommendations.css";
import { ProtocolDto, UsedProtocolLiquid } from 'sharedlib/dto/protocol.dto';
import { getRequest } from 'common/util';
import { p1 } from "ProtocolList/ProtocolList";

const liquids = p1.usedLiquids;

function loadTableData(liquidsToIns: UsedProtocolLiquid[]) {
    const table = document.getElementById("recoms")! as HTMLTableElement;


    liquidsToIns.forEach(liquid => {
        let row = table.insertRow();
        let date = row.insertCell(0);
        date.innerHTML = liquid.liquidName;
        let name = row.insertCell(0);
        name.innerHTML = liquid.amount.toString();
    });

    $(document).ready(function () {
        $("td:empty").text("Was empty").css('background', 'rgb(255,220,200)');

    });
}

function createTable() {
    let headers = ['A', 'B', 'C', 'D', 'E', 'F'];
    let tableLiquids = liquids;
    let finalTable = document.createElement('table');
    finalTable.setAttribute("id", "#test-table");
    let tableTest = document.createElement('table');
    let headerRow = document.createElement('tr');

    /* adding header row */
    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });

    tableTest.appendChild(headerRow);

    /* adding body */
    let body = document.createElement('tbody');

    let iter = 0; /* iterator for liquid array */

    for (let i = 0; i < 6; i++) { /* each row */
        let row = document.createElement('tr');

        for (let j = 0; j < 6; j++) { /* each column */
            let cell = document.createElement('td');
            let textNode;

            /* adding text to cell */
            if (iter <= tableLiquids.length) {
                if (tableLiquids[iter]) {
                    let text = Object.values(tableLiquids[iter]).toString();
                    textNode = document.createTextNode(text);
                }
                else {
                    textNode = document.createTextNode('Undefined');
                }

            }
            else {
                textNode = document.createTextNode('Test' + j.toString());
            }
            cell.appendChild(textNode);
            row.appendChild(cell);
            iter++;
        }
        body.appendChild(row);
    }
    tableTest.appendChild(body);

    /* Adding table to finalTable, adding final table to existing container */
    finalTable.appendChild(tableTest);

    let container = document.querySelector('#test-container');
    container!.appendChild(finalTable);
}

export default function Recommendations() {

    /* loadTableData(liquids);  */
    /* createTable(); */

    useEffect(() => {
        createTable();
    }, []);

    return (
        <>
            <NavigationBar />
            <div id="main">
                <div className="open-menu-btn"></div>

                <div className="tableContainer">
                    <h4><i>Fill in tubes and place them according to the configuration table:</i></h4>
                    <table id="recom-table">
                        <thead>
                            <tr>
                                <td id="horizontal-thead"></td>
                                <td>A</td>
                                <td>B</td>
                                <td>C</td>
                                <td>D</td>
                                <td>E</td>
                                <td>F</td>
                            </tr>
                        </thead>

                        <tbody id="recoms">
                            <tr>
                                <td id="horizontal-thead">1</td>
                                <td className="liquid" id="A1">A1</td>
                                <td className="liquid" id="B1">B1</td>
                                <td className="liquid" id="C1">C1</td>
                                <td className="liquid" id="D1">D1</td>
                                <td className="liquid" id="E1">E1</td>
                                <td className="liquid" id="F1">F1</td>
                            </tr>
                            <tr>
                                <td id="horizontal-thead">2</td>
                                <td className="liquid" id="A2">A2</td>
                                <td className="liquid" id="B2">B2</td>
                                <td className="liquid" id="C2">C2</td>
                                <td className="liquid" id="D2">D2</td>
                                <td className="liquid" id="E2">E2</td>
                                <td className="liquid" id="F2">F2</td>
                            </tr>
                            <tr>
                                <td id="horizontal-thead">3</td>
                                <td className="liquid" id="A3">A3</td>
                                <td className="liquid" id="B3">B3</td>
                                <td className="liquid" id="C3">C3</td>
                                <td className="liquid" id="D3">D3</td>
                                <td className="liquid" id="E3">E3</td>
                                <td className="liquid" id="F3">F3</td>
                            </tr>
                            <tr>
                                <td id="horizontal-thead">4</td>
                                <td className="liquid" id="A4">A4</td>
                                <td className="liquid" id="B4">B4</td>
                                <td className="liquid" id="C4">C4</td>
                                <td className="liquid" id="D4">D4</td>
                                <td className="liquid" id="E4">E4</td>
                                <td className="liquid" id="F4">F4</td>
                            </tr>
                            <tr>
                                <td id="horizontal-thead">5</td>
                                <td className="liquid" id="A5">A5</td>
                                <td className="liquid" id="B5">B5</td>
                                <td className="liquid" id="C5">C5</td>
                                <td className="liquid" id="D5">D5</td>
                                <td className="liquid" id="E5">E5</td>
                                <td className="liquid" id="F5">F5</td>
                            </tr>
                            <tr>
                                <td id="horizontal-thead">6</td>
                                <td className="liquid" id="A6">A6</td>
                                <td className="liquid" id="B6">B6</td>
                                <td className="liquid" id="C6">C6</td>
                                <td className="liquid" id="D6">D6</td>
                                <td className="liquid" id="E6">E6</td>
                                <td className="liquid" id="F6">F6</td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div id="test-container"></div>
                {/* <div id="test-table"></div> */}
            </div></>
    )
}