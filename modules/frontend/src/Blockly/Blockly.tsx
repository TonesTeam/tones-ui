// import "./App.css";
import "./Library"
import React, { useState } from "react";
import { BlocklyWorkspace, ToolboxDefinition } from "react-blockly";
import Blockly from "blockly";
import "./Blockly.css"

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
                { kind: "block", type: "apply_liquid" },
                { kind: "block", type: "apply_washing_liquid" },
                { kind: "block", type: "apply_parafinization_liquid" },
                // {kind: "block", type: "set_normal_temp"},
                { kind: "block", type: "wait" },
                { kind: "block", type: "repeat" },
                { kind: "block", type: "set_temperature" },
                { kind: "block", type: "normalize_temperature" },
            ]
    };

    function workspaceDidChange(workspace: any) {
        const code = (Blockly as any).Python.workspaceToCode(workspace);
        setJavascriptCode(code);
    }

    return (
        <>
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
            <pre id="generated-xml" style={{fontSize: "0.5em"}}>{xml}</pre>
            <textarea
                id="code"
                style={{ height: "100px", width: "200px" }}
                value={javascriptCode}
                readOnly
            >
            </textarea>
        </>
    );
}