import './Block.css'

interface BlockFields {
    getContent(): JSX.Element;
    getStepContent(): JSX.Element;
    getClass(): string;
}

class Washing implements BlockFields {
    getContent(): JSX.Element {
        return (
            <>
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
            </>
        );
    }

    getStepContent():JSX.Element {
        return (
            <>
                <h3>Washing</h3>
                <div>
                    <p>With 111</p>
                    <p>for 111 minutes</p>
                </div>
            </>
    )}

    getClass(): string {
        return "block-washing";
    }
}

class Reagent implements BlockFields {
    getContent(): JSX.Element {
        return (
            <>
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
            </>
        );
    }

    getStepContent():JSX.Element {
        return (
            <>
                <h3>Reagent</h3>
                <div>
                    <p>With 111</p>
                    <p>for 111 minutes</p>
                </div>
            </>
    )}

    getClass(): string {
        return "block-reagent";
    }
}

class Temperature implements BlockFields {
    getContent(): JSX.Element {
        return (
            <>
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
            </>
        );
    }

    getStepContent():JSX.Element {
        return (
            <>
                <h3>Temperature</h3>
                <div>
                    <p>From 111</p>
                    <p>To 222</p>
                </div>
            </>
    )}

    getClass(): string {
        return "block-temperat";
    }
}

export enum BlockType {
    Reagent = "reagent",
    Washing = "washing",
    Temperature = "temperat"
}

export interface BlockProps {
    type: BlockType,
    id:number,
    other?: string
}


export interface WorkBlockProps{
    type: BlockType,
    addBlock: (type: BlockType)=>void
}
export const WorkBlock: React.FC<WorkBlockProps> = ({type, addBlock}) => {

    //console.log("Passed props:");
    //console.log(props.type);
    const blockClass: Map<BlockType, BlockFields> = new Map([
        [BlockType.Reagent, new Reagent()],
        [BlockType.Washing, new Washing()],
        [BlockType.Temperature, new Temperature()]
    ]);
    const block = blockClass.get(type);

    return (
        <div>
            <div className={`${block?.getClass()}`}>
                {block?.getContent()}
            </div>
            <div>
                    <button onClick={()=>addBlock(type)}>Save</button>
            </div>
        </div>
    )
}

export interface StepBlockProps{
    type: BlockType,
    id: number,
    removeBlock: (id: number)=>void
}
export const StepBlock:React.FC<StepBlockProps> = ({type, id, removeBlock}) => {

    const blockClass: Map<BlockType, BlockFields> = new Map([
        [BlockType.Reagent, new Reagent()],
        [BlockType.Washing, new Washing()],
        [BlockType.Temperature, new Temperature()]
    ]);
    const block = blockClass.get(type);
    return (
        <div className={`step ${block?.getClass()}`}>
            {block?.getStepContent()}
            <button onClick={()=>removeBlock(id)}><span className="fas fa-trash">{id}</span></button>
        </div>
    )
}