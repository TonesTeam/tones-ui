import { LiquidDto } from 'sharedlib/dto/liquid.dto';
import './Block.css'
import { getRequest } from 'common/util';

const liquids = (await getRequest<LiquidDto[]>("/blockly/liquids")).data;
//console.log(liquids)

interface BlockFields {
    getContent(params: Insertable[]): JSX.Element;
    getStepContent(params: Insertable[]): JSX.Element;
    getClass(): string;
}

export enum BlockType {
    Reagent = "reagent",
    Washing = "washing",
    Temperature = "temperat"
}

export interface BlockProps {
    type: BlockType,
    id: number,
    other?: string,
    params: Insertable[]
}

export type Insertable = {
    name: string;
    value: string | number;
}

class Washing implements BlockFields {
    getContent(params: Insertable[]): JSX.Element {
        const liquid = (params.find(i => i.name == 'liquid'))?.value
        const iters = (params.find(i => i.name == 'iters'))?.value
        const time = (params.find(i => i.name == 'time'))?.value
        return (
            <>
                <p className="block-header">Washing step</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>Category:</label>
                        <select id="wash-sel-liquid" defaultValue={liquid}>
                            {liquids.map((liq, index) => {
                                return (
                                    <option value={liq.name} key={index}>{liq.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="wash-inp-iters">Iterations:</label>
                        <input id="wash-inp-iters" type="number" defaultValue={iters} />
                        <label htmlFor="wash-inp-time">Inc. time: </label>
                        <input id="wash-inp-time" type="number" defaultValue={time} />
                    </div>
                </div>
            </>
        );
    }

    getStepContent(params: Insertable[]): JSX.Element {
        const liquid = (params.find(i => i.name == 'liquid'))?.value
        const iters = (params.find(i => i.name == 'iters'))?.value
        const time = (params.find(i => i.name == 'time'))?.value
        const temp = (params.find(i => i.name == 'temp'))?.value
        return (
            <>
                <h3>Washing</h3>
                <div>
                    <p>With {liquid}</p>
                    <p>for {iters} times </p>
                    <p>x {time} minutes</p>
                    <p>at {temp} degrees</p>
                </div>
            </>
        )
    }

    getClass(): string {
        return "block-washing";
    }
}

class Reagent implements BlockFields {
    getContent(params: Insertable[]): JSX.Element {
        const liquid = (params.find(i => i.name == 'liquid'))?.value
        const time = (params.find(i => i.name == 'time'))?.value
        return (
            <>
                <p className="block-header">Reagent step</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>Category:</label>
                        <select id='reag-sel-categ'>
                            <option value="a">Category 1</option>
                            <option value="b">Category 2</option>
                            <option value="c">Category 3</option>
                        </select>
                    </div>
                    <div className="block-inp">
                        <label>Liquid:</label>
                        <select id='reag-sel-liquid' defaultValue={liquid}>
                            {liquids.map((liq, index) => {
                                return (
                                    <option value={liq.name} key={index}>{liq.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="reag-inp-min">Inc. time:</label>
                        <input id="reag-inp-min" type="number" defaultValue={time} />
                    </div>
                </div>
            </>
        );
    }

    getStepContent(params: Insertable[]): JSX.Element {
        const liquid = (params.find(i => i.name == 'liquid'))?.value
        const time = (params.find(i => i.name == 'time'))?.value
        const temp = (params.find(i => i.name == 'temp'))?.value
        return (
            <>
                <h3>Reagent</h3>
                <div>
                    <p>With {liquid}</p>
                    <p>for {time} minutes</p>
                    <p>at {temp} degrees</p>
                </div>
            </>
        )
    }

    getClass(): string {
        return "block-reagent";
    }
}

class Temperature implements BlockFields {
    getContent(params: Insertable[]): JSX.Element {
        const fromTemp = (params.find(i => i.name == 'from'))?.value
        const target = (params.find(i => i.name == 'targetTemp'))?.value

        return (
            <>
                <p className="block-header">Temperature change</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>From: </label>
                        <p id="fromTemp">{fromTemp}</p>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="temper-inp-target">To:</label>
                        <input id="temper-inp-target" type="number" defaultValue={target} />
                    </div>
                </div>
            </>
        );
    }

    getStepContent(params: Insertable[]): JSX.Element {
        const fromTemp = (params.find(i => i.name == 'from'))?.value
        const target = (params.find(i => i.name == 'targetTemp'))?.value
        return (
            <>
                <h3>Temperature</h3>
                <div>
                    <p>From {fromTemp}</p>
                    <p>To {target}</p>
                </div>
            </>
        )
    }

    getClass(): string {
        return "block-temperat";
    }
}

export interface WorkBlockProps {
    block: BlockProps
    addBlock: (block: BlockProps) => void
    editBlock: (block: BlockProps) => void
}
export const WorkBlock: React.FC<WorkBlockProps> = ({ block, addBlock, editBlock }) => {

    const blockClass: Map<BlockType, BlockFields> = new Map([
        [BlockType.Reagent, new Reagent()],
        [BlockType.Washing, new Washing()],
        [BlockType.Temperature, new Temperature()]
    ]);
    const wBlock = blockClass.get(block.type);

    const addBlockToParent = () => {
        let params = [] as Insertable[];
        switch (block.type) {
            case BlockType.Washing: {
                let liquid = (document.querySelector('#wash-sel-liquid') as HTMLSelectElement).value;
                let iters = (document.querySelector('#wash-inp-iters') as HTMLInputElement).value;
                let time = (document.querySelector('#wash-inp-time') as HTMLInputElement).value;
                params = [
                        { name: "liquid", value: liquid },
                        { name: "iters", value: iters },
                        { name: "time", value: time },
                        { name: "temp", value: 0} 
                        ] as Insertable[]

            } break;
            case BlockType.Reagent: {
                //let category = (document.querySelector('#reag-sel-categ') as HTMLSelectElement).value;
                let liquid = (document.querySelector('#reag-sel-liquid') as HTMLSelectElement).value;
                let time = (document.querySelector('#reag-inp-min') as HTMLInputElement).value;
                params = [
                        { name: "liquid", value: liquid },
                        { name: "time", value: time },
                        { name: "temp", value: 0} 
                        ] as Insertable[]

            } break;
            case BlockType.Temperature: {
                let from = (document.querySelector('#fromTemp') as HTMLInputElement).textContent;
                let target = (document.querySelector('#temper-inp-target') as HTMLInputElement).value;
                params = [
                        { name: "from", value: from },
                        { name: "targetTemp", value: target }
                    ] as Insertable[];
            }
        }

        block.id == -1 ? addBlock({ type: block.type, id: block.id, params: params } as BlockProps) : editBlock({ type: block.type, id: block.id, params: params } as BlockProps)
    }

    return (
        <div>
            <div className={`${wBlock?.getClass()}`}>
                {wBlock?.getContent(block.params)}

            </div>
            <div>
                <button onClick={() => addBlockToParent()}>Save</button>
            </div>
        </div>
    )
}

export interface StepBlockProps {
    type: BlockType,
    id: number,
    params: Insertable[],
    removeBlock: (id: number) => void
}
export const StepBlock: React.FC<StepBlockProps> = ({ type, id, params, removeBlock }) => {

    const blockClass: Map<BlockType, BlockFields> = new Map([
        [BlockType.Reagent, new Reagent()],
        [BlockType.Washing, new Washing()],
        [BlockType.Temperature, new Temperature()]
    ]);
    const block = blockClass.get(type);
    return (

        <div className={`step ${block?.getClass()}`}>
            {block?.getStepContent(params)}
            <button onClick={() => removeBlock(id)}><span className="fas fa-trash"></span></button>
        </div>
    )
}