import NavigationBar from "NavigationBar/NavigationBar";
import MainKeyboard from "common/MainKeyboard";
import { useEffect, useRef, useState } from 'react';
import './Workspace.css'
import { DragBlock, BlockType, DragBlockProps } from './Block';

export default function Workspace() {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [testInput, setTestInput] = useState("");
    const nodeRef = useRef(null);
    const [currentZIndex, setCurrentZIndex] = useState(31);
    const [blocks, setBlocks] = useState<DragBlockProps[]>([]);

    const handleZindex = (elem: HTMLElement) => {
        elem.parentElement!.style.zIndex = currentZIndex.toString();
        setCurrentZIndex((state) => state + 1);
    };

    const addBlock = (type: BlockType) => {
        //console.log((e.target as HTMLSelectElement).value);
        //setSelected((e.target as HTMLSelectElement).value);
        setBlocks(blocks.concat(<DragBlock key={Math.random()} type={type} />))
    }

    // useEffect(()=>{
    //     let inputs = document.querySelectorAll('input');
    //     console.log(inputs.length);
    //     inputs.forEach((inp)=>{
    //         inp.addEventListener("focus", () => {
    //             console.log("focus event!");
    //         });
    //         inp.addEventListener("click", () => {
    //         console.log("click event!");
    //         });
    //     })
    // }, [])



    return (
        <>
            <NavigationBar />
            <div className="font-rb" id="main">
                <div id='constructor'>
                    <div id='control-panel'>
                        <div className="btn-group">
                            <button className="construct-btn" id="cb-washing" onClick={() => addBlock(BlockType.Washing)}><span className="fas fa-water"></span></button>
                            <button className="construct-btn" id="cb-reagent" onClick={() => addBlock(BlockType.Reagent)}><span className="fas fa-flask"></span></button>
                            <button className="construct-btn" id="cb-temperat" onClick={() => addBlock(BlockType.Temperature)}><span className="fas fa-temperature-low"></span></button>
                        </div>

                        <div className="btn-group">
                            <button className="construct-btn" id="cb-delete"><span className="fas fa-trash"></span></button>
                        </div>

                        <div className="btn-group">
                            <button className="construct-btn" id="cb-save"><span className="fas fa-download"></span></button>
                            <button className="construct-btn" id="cb-settings"><span className="fas fa-wrench"></span></button>
                            <button className="construct-btn" id="cb-info"><span className="fas fa-info"></span></button>
                        </div>
                    </div>
                    <div id="workspace">
                        {blocks}
                    </div>
                    <div id="timeline">
                        <div id="info-panel">
                            <p>Protocol [SomeName]</p>
                            <p>Duration: 00 min 00 sec</p>
                        </div>
                        <div id="steps">
                            {[...Array.from(Array(20).keys())].map((num, i) =>
                                <div key={i} id={`step` + i} className="tl-step">test</div>
                            )}

                            {/* {blocks.map(function(block){
                                <div className="tl-step">{block.type}</div>
                            })} */}
                        </div>

                    </div>
                </div>
            </div>
            <MainKeyboard show={showKeyboard} layout={"numpad"} showSetter={setShowKeyboard} inputSetter={setTestInput} />
        </>
    )
}