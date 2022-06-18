// import "./App.css";
import SaveIcon from '@mui/icons-material/Save';
import { Fab } from "@mui/material";
import Blockly from "blockly";
import { getRequest, makeRequest } from 'common/util';
import NavigationBar from "navbar/NavigationBar";
import { useEffect, useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import { useParams } from 'react-router-dom';
import format from "xml-formatter";
import "./Blockly.css";
import "./Library";
import { GenerateAll } from "./LibraryCodeGen";
import { Audio } from 'react-loader-spinner'
import { CenteringFlexBox } from 'common/components';



GenerateAll();

function saveProtocol(xml: string) {
    makeRequest('POST', "/blockly/protocol", xml)
        .then(resp => {
            if (resp.status === 200) {
                alert("Success save")
            } else {
                alert(`Error:${resp.data}`);
            }
        })
}

function updateProtocol(id: number, xml: string) {
    makeRequest('PUT', `/blockly/protocol/${id}`, xml)
        .then(resp => {
            if (resp.status === 200) {
                alert("Success update")
            } else {
                alert(`Error:${resp.data}`);
            }
        });
}

const toolboxCategories: any =
{
    contents:
        [
            {
                kind: "category",
                name: "Functions",
                contents: [
                    { kind: "block", type: "function_block" },
                    { kind: "block", type: "function_call" },
                    { kind: "block", type: "reagent_type" },
                    { kind: "block", type: "math_number" },
                ]
            },
            {
                kind: "category",
                name: "Liquid Application",
                contents: [
                    { kind: "block", type: "apply_reagent" },
                    { kind: "block", type: "apply_antigen_liquid" },
                    { kind: "block", type: "apply_blocking_liquid" },
                    { kind: "block", type: "apply_parafinization_liquid" },
                    { kind: "block", type: "apply_washing_liquid" },
                    {
                        kind: "block", type: "apply_reagent_3", inputs: {
                            times: { kind: "block", block: { "type": "math_number", fields: { NUM: 10 } } },
                            degree: { kind: "block", block: { "type": "math_number", fields: { NUM: 10 } } },
                            reagent: { kind: "block", block: { "type": "reagent_type", fields: { reagent: "reagent_1" } } },
                        }
                    },
                ]
            },
            {
                kind: "category",
                name: "Other",
                contents: [
                    { kind: "block", type: "wait" },
                    { kind: "block", type: "repeat" },
                    { kind: "block", type: "set_temperature" },
                ]
            },
        ]
};
function wrapXml(xml: string) {
    return `<xml xmlns="http://www.w3.org/1999/xhtml">${xml}</xml>`;
}

// const initialXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="begin_protocol" x="240" y="30"></block></xml>';
const initialXml = wrapXml('<block type="begin_protocol" x="240" y="30"></block>');


export default function BlocklyPage() {
    const [xml, setXml] = useState(initialXml);
    const params = useParams()
    const saveFunction = params.id ? ((xml: string) => updateProtocol(params.id!, xml)) : ((xml: string) => saveProtocol(xml));
    useEffect(() => {
        if (!params.id) {
            return;
        }
        getRequest<string>(`/protocol/${params.id}/xml`).then(resp => {
            setXml(wrapXml(resp.data));
        });
    }, [])
    if (params.id !== undefined && xml == initialXml) {
        return (
            <CenteringFlexBox style={{ height: "80vh" }}>
                <Audio height="100" width="100" color='grey' ariaLabel='loading' />
            </CenteringFlexBox>
        )
    }
    return (
        <>
            <NavigationBar />
            <div id="main">
                <Fab style={{ position: "fixed", float: "right", right: 10, top: 10 }} variant="extended"
                    onClick={() => saveFunction(xml)} >
                    <SaveIcon />
                    Save
                </Fab>


                <BlocklyWorkspace
                    toolboxConfiguration={toolboxCategories}
                    initialXml={xml}
                    className="fill-height"
                    workspaceConfiguration={{
                        trashcan: true,
                        grid: {
                            spacing: 20,
                            length: 3,
                            colour: "#ccc",
                            snap: true,
                        },
                    }}
                    onXmlChange={setXml}
                    onImportXmlError={(er) => console.error("XML IMPORT ERROR:", er)}
                />
                <pre id="generated-xml" style={{ fontSize: "0.5em" }}>{format(`<root>${xml}</root>`, { collapseContent: true })}</pre>
            </div>
        </>
    );
}