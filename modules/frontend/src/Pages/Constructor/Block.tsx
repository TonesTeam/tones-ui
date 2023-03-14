import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import './Block.css'

interface BlockFields {
    getContent(): JSX.Element;
    getClass(): string;
}

class Washing implements BlockFields {
    getContent(): JSX.Element {
        return (
            <div className="block">
                <p className="block-header">Washing step</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>Category:</label>
                        <select>
                            <option value="0">Select washing liquid</option>
                            <option value="1">Liquid 1</option>
                            <option value="2">lqd 2</option>
                            <option value="3">random option</option>
                            <option value="4">relatively short list</option>
                            <option value="5">but names are quite long aekwjfnaiwef</option>
                            <option value="6">Liquid 3</option>
                        </select>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="inp-times">Times:</label>
                        <input id="inp-times" type="number" />
                    </div>
                </div>
                <div><button>Save</button></div>

            </div>
        );
    }
    getClass(): string {
        return "block-washing";
    }
}

class Reagent implements BlockFields {
    getContent(): JSX.Element {
        return (
            <div className="block">
                <p className="block-header">Reagent step</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>Category:</label>
                        <select>
                            <option value="a">Liquid 1</option>
                            <option value="b">aasd 2</option>
                            <option value="c">Liquid 3</option>
                        </select>
                    </div>
                    <div className="block-inp">
                        <label>Liquid:</label>
                        <select>
                            <option value="a">Liquid 1</option>
                            <option value="b">aasd 2</option>
                            <option value="c">Liquid 3</option>
                        </select>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="reag-min">Minutes</label>
                        <input id="reag-min" type="number" />
                    </div>

                </div>
                <div>
                    <button>Save</button>
                </div>
            </div>
        );
    }
    getClass(): string {
        return "block-reagent";
    }
}

class Temperature implements BlockFields {
    getContent(): JSX.Element {
        return (
            <div className="block">
                <p className="block-header">Temperature change</p>
                <div className="block-body">
                <div className="block-inp">
                        <label>From: </label>
                        <p>25'</p>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="reag-min">To:</label>
                        <input id="reag-min" type="number" />
                    </div>
                </div>
                <div>
                    <button>Save</button>
                </div>
            </div>
        );
    }
    getClass(): string {
        return "block-temperat";
    }
}

export const enum BlockType {
    Reagent = "reagent",
    Washing = "washing",
    Temperature = "temperat"
}

export interface DragBlockProps {
    type: BlockType,
    other?: string
}

export const DragBlock = (props: any) => {

    const blockClass: Map<BlockType, BlockFields> = new Map([
        [BlockType.Reagent, new Reagent()],
        [BlockType.Washing, new Washing()],
        [BlockType.Temperature, new Temperature()]
    ]);

    const block = blockClass.get(props.type);
    const nodeRef = useRef(null);
    const [currentZIndex, setCurrentZIndex] = useState(30);

    useEffect(() => {
        console.log("Current Z: " + currentZIndex);
    }, [currentZIndex])

    const setActive = (elem: HTMLElement) => {
        let block = elem.closest('.handle') as HTMLElement;
        console.log(block);
        console.log("Current Z: " + currentZIndex);
        block!.style.zIndex = currentZIndex.toString();
        //setCurrentZIndex((state) => state + 1);
    };

    const setNotActive = (elem: HTMLElement) => {
        let block = elem.closest('.handle') as HTMLElement;
        //block!.style.zIndex = currentZIndex.toString();
        setCurrentZIndex((state) => state + 1);
    };


    return (
        <Draggable
            nodeRef={nodeRef}
            axis="both"
            handle=".handle"
            defaultPosition={{ x: 30, y: 30 }}
            grid={[180, 180]}
            scale={1}
            disabled={true}
            onStart={(e) => { setActive(e.target as HTMLElement) }}
            onStop={(e) => { setNotActive(e.target as HTMLElement) }}
        >
            <div ref={nodeRef} className={`handle ${block?.getClass()}`}>
                {block?.getContent()}
            </div>
        </Draggable>
    )
}