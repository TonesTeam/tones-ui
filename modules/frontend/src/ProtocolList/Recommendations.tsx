import { useEffect, useState } from "react";
import 'common/style.css';
import NavigationBar from 'navbar/NavigationBar';
import 'navbar/NavigationBar.css';
import "./Recommendations.css";


function RecomCell(props: any){
    return(
        <div className="recomCell">
            {/* <p>{props.cellName}</p> Could be hardcoded*/}
            <p>{props.liquidName}</p>
            <p>{props.liquidAmount}</p>
        </div>
    );
}


export default function Recommendations() {

    const [isVisible, setToVisible] = useState(false) 

    const onBackdropClick = () => {
        setToVisible(false)
    }

    return (
        <>
        {/* <NavigationBar/> */}
        <div className="main">
            <div className="recom-table">
                <table>
                    <tr>
                        <td>A1</td>
                        <td>B1</td>
                        <td>C1</td>
                        <td>D1</td>
                        <td>E1</td>
                        <td>F1</td>
                    </tr>
                    <tr>
                        <td>A2</td>
                        <td>B2</td>
                        <td>C2</td>
                        <td>D2</td>
                        <td>E2</td>
                        <td>F2</td>
                    </tr>
                    <tr>
                        <td>A3</td>
                        <td>B3</td>
                        <td>C3</td>
                        <td>D3</td>
                        <td>E3</td>
                        <td>F3</td>
                    </tr>
                    <tr>
                        <td>A4</td>
                        <td>B4</td>
                        <td>C4</td>
                        <td>D4</td>
                        <td>E4</td>
                        <td>F4</td>
                    </tr>
                    <tr>
                        <td>A5</td>
                        <td>B5</td>
                        <td>C5</td>
                        <td>D5</td>
                        <td>E5</td>
                        <td>F5</td>
                    </tr>
                    <tr>
                        <td>A6</td>
                        <td>B6</td>
                        <td>C6</td>
                        <td>D6</td>
                        <td>E6</td>
                        <td>F6</td>
                    </tr>
                </table>
            </div >
        </div></>
    )
}