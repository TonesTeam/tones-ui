import { useState } from "react";
import Keyboard, { SimpleKeyboard } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';


const layoutMap = new Map<string, string>([
    ["default", "shift"],
    ["shift", "default"],
]);

let keyboard: SimpleKeyboard | undefined = undefined;

export default function MainKeyboard(props: { inputValue?: string, show: boolean, showSetter: (s: boolean) => void, inputSetter: (inp: string) => void }) {
    if (props.inputValue != undefined) {
        keyboard?.setInput(props.inputValue);
    }
    const showKeyboard = props.show;
    const [keyboardLayout, setKeyboardLayout] = useState("default")

    const onChange = (inp: string) => props.inputSetter(inp);
    const onKeyPress = (k: string) => {
        if (k == "{enter}") props.showSetter(false);
        if (k == "{shift}" || k == "{lock}") setKeyboardLayout(layoutMap.get(keyboardLayout)!)
    };
    return <>
        <div className={showKeyboard ? "visible" : "hidden"} style={{
            position: "fixed",
            zIndex: 20,
            width: "100%",
            bottom: 0,
        }}>
            <style>
                {`.hg-theme-default .hg-button {height: 10vh}`}
            </style>
            <Keyboard
                onInit={(inst) => keyboard = inst}
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