// import "./App.css";
import SaveIcon from '@mui/icons-material/Save';
import { Fab } from "@mui/material";
import Blockly from "blockly";
import { postRequest } from 'common/util';
import NavigationBar from "navbar/NavigationBar";
import React, { useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import format from "xml-formatter";
import "./Blockly.css";
import "./Library";
import { GenerateAll } from "./LibraryCodeGen";


GenerateAll();

function saveProtocol(xml: string) {
    postRequest("/protocol", xml)
        .then(resp => {
            if (resp.status === 200) {
                alert("Success")
            } else {
                alert(`Error:${resp.data}`);
            }
        })
}

export default function BlocklyPage() {
    const [xml, setXml] = useState("");
    const [javascriptCode, setJavascriptCode] = useState("");

    // const initialXml =
    // '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';
    const initialXml =
        '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="begin_protocol" x="240" y="30"></block></xml>';
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

    function workspaceDidChange(workspace: any) {
        const code = (Blockly as any).Python.workspaceToCode(workspace);
        setJavascriptCode(code);
    }

    return (
        <>
            <NavigationBar />
            <div id="main">
                <Fab style={{ position: "fixed", float: "right", right: 10, top: 10 }} variant="extended"
                    onClick={() => saveProtocol(xml)} >
                    <SaveIcon />
                    Save
                </Fab>


                <BlocklyWorkspace
                    toolboxConfiguration={toolboxCategories}
                    initialXml={initialXml}
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
                    onWorkspaceChange={workspaceDidChange}
                    onXmlChange={setXml}
                />
                <pre id="generated-xml" style={{ fontSize: "0.5em" }}>{format(`<root>${xml}</root>`, { collapseContent: true })}</pre>
                <textarea
                    id="code"
                    style={{ height: "100px", width: "200px" }}
                    value={javascriptCode}
                    readOnly
                >
                </textarea>
            </div>
        </>
    );
}