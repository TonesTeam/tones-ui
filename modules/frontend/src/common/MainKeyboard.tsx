import { useState } from "react";
import Keyboard, { SimpleKeyboard } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import useSound from 'use-sound';
import keypress from "/static/key_press.wav";
import backpress from '/static/backspace_press.wav';


// const keypress = require("..static/key_press.wav");


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
    const [playRegularPress] = useSound(keypress);
    const [playBackPress] = useSound(backpress);

    const onChange = (inp: string) => props.inputSetter(inp);
    const onKeyPress = (k: string) => {
        if (k == "{enter}"){
            props.showSetter(false);
        } 
        else if (k == "{bksp}") playBackPress();
        else{
            playRegularPress();
        }
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
                layout={{
                    default: [
                        "1 2 3 4 5 6 7 8 9 0 _ - {bksp}",
                        "q w e r t y u i o p \\",
                        "{lock} a s d f g h j k l {enter}",
                        ". z x c v b n m , /",
                        "{space}"
                    ],
                    shift: [
                        "1 2 3 4 5 6 7 8 9 0 _ - {bksp}",
                        "Q W E R T Y U I O P \\",
                        "{lock} A S D F G H J K L {enter}",
                        ". Z X C V B N M , /",
                        "{space}"
                    ]
                }}
                onChange={onChange}
                onKeyPress={onKeyPress}
                mergeDisplay={true} display={{
                    "{enter}": "Enter ↵",
                    "{escape}": "esc ⎋",
                    "{tab}": "tab ⇥",
                    "{bksp}": "⌫",
                    "{lock}": "caps ⇪",
                    "{shift}": "⇧",
                    "{space}": "space"
                }} />
        </div>
    </>
}