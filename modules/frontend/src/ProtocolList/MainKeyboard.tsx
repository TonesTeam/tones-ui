import { useState } from "react";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';


const layoutMap = new Map<string, string>([
    ["default", "shift"],
    ["shift", "default"],
]);

export default function MainKeyboard(props: { show: boolean, showSetter: (s: boolean) => void, inputSetter: (inp: string) => void }) {
    const showKeyboard = props.show;
    const [keyboardLayout, setKeyboardLayout] = useState("default")

    const onChange = (inp: string) => props.inputSetter(inp)
    const onKeyPress = (k: string) => {
        if (k == "{enter}") props.showSetter(false);
        if (k == "{shift}" || k == "{lock}") setKeyboardLayout(layoutMap.get(keyboardLayout)!)
    };
    return <>
        <div className={showKeyboard ? "visible" : "hidden"} style={{
            position: "absolute",
            zIndex: 20,
            width: "100vw",
            bottom: 0,
        }}>
            <style>
                {`.hg-theme-default .hg-button {height: 10vh}`}
            </style>
            <Keyboard
                layoutName={keyboardLayout}
                onChange={onChange}
                onKeyPress={onKeyPress}
                mergeDisplay={true} display={{
                    "{enter}": "Enter ↵",
                    "{escape}": "esc ⎋",
                    "{tab}": "tab ⇥",
                    "{bksp}": "⌫",
                    "{lock}": "caps ⇪",
                    "{shift}": "⇧",
                }} />
        </div>
    </>
}