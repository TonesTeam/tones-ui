// import "./App.css";
import SaveIcon from '@mui/icons-material/Save';
import { Fab } from "@mui/material";
import { CenteringFlexBox } from 'common/components';
import { getRequest, makeRequest } from 'common/util';
import NavigationBar from "NavigationBar/NavigationBar";
import MainKeyboard from 'ProtocolList/MainKeyboard';
import { useEffect, useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import { Audio } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import format from "xml-formatter";
import "./Blockly.css";
import "./Library";
import { GenerateAll } from "./LibraryCodeGen";
import Blockly from 'blockly';



GenerateAll();

function saveProtocol(xml: string) {
    makeRequest<number>('POST', "/blockly/protocol", xml)
        .then(resp => {
            if (resp.status === 200) {
                alert("Success save")
                location.assign(`/edit/protocol/${resp.data}`)
            } else {
                alert(`Error:${resp.data}`);
            }
        })
}

function updateProtocol(id: string, xml: string) {
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
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        Array.from(document.getElementsByClassName('blocklyEditableText')).forEach(element => {
            if (!element.getElementsByClassName('blocklyDropdownText')[0]){ //should not show for dropdowns
                element.addEventListener('pointerdown', (ev) => {
                    setShowKeyboard(true);
                    setValue(value + 1); // forces a rerender which updates keyboards input value
                    ev.preventDefault();
                })
            }
            
        });
    })
    
    useEffect(() => {
        if (!params.id) {
            return;
        }
        getRequest<string>(`/protocol/${params.id}/xml`).then(resp => {
            setXml(wrapXml(resp.data));
        });
    }, [])
    useEffect(() =>{
        if(!showKeyboard){
            Array.from(document.getElementsByClassName('blocklyHtmlInput') as HTMLCollectionOf<HTMLElement>).forEach(element => {
                if(!element.classList.contains('blocklyInvalidInput')) element.style.display = 'none';
            });
        }
    });
    if (params.id !== undefined && xml == initialXml) {
        return (
            <CenteringFlexBox style={{ height: "80vh" }}>
                <Audio height="100" width="100" color='grey' ariaLabel='loading' />
            </CenteringFlexBox>
        )
    }
    return (
        <>
            <NavigationBar selectedItem={params.id ?? "Create Protocol"} />
            <div id="main">
                <Fab style={{ position: "fixed", float: "right", right: 30, top: 20 }} variant="extended"
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
                        zoom: {
                            controls: true,
                            wheel: true,
                            startScale: 2.0,
                            maxScale: 3,
                            minScale: 0.7,
                            pinch: true
                        },
                    }}
                    onXmlChange={setXml}
                    onImportXmlError={(er) => console.error("XML IMPORT ERROR:", er)}
                />
            </div>
            <MainKeyboard
                inputValue={(document.getElementsByClassName('blocklyHtmlInput')[0] as HTMLInputElement)?.value}
                show={showKeyboard} showSetter={setShowKeyboard} inputSetter={(inp) => {
                    const input = document.getElementsByClassName('blocklyHtmlInput')[0] as HTMLInputElement;
                    input.value = inp;
                    input.dispatchEvent(new Event('input'));
                }} />
        </>
    );
}