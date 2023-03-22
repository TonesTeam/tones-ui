import './Block.css'

interface BlockFields {
    getContent(params:Insertable[]): JSX.Element;
    getStepContent(params:Insertable[]): JSX.Element;
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
    getContent(params:Insertable[]): JSX.Element {
        const liquid = (params.find(i=>i.name=='liquid'))?.value
        const times = (params.find(i=>i.name=='times'))?.value
        return (
            <>
                <p className="block-header">Washing step</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>Category:</label>
                        <select id="wash-sel-liquid">
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
                        <label htmlFor="wash-inp-times">Times: {times}</label>
                        <input id="wash-inp-times" type="number" />
                    </div>
                </div>
            </>
        );
    }

    getStepContent(params: Insertable[]): JSX.Element {
        const liquid = (params.find(i=>i.name=='liquid'))?.value
        const times = (params.find(i=>i.name=='times'))?.value
        return (
            <>
                <h3>Washing</h3>
                <div>
                    <p>With {liquid}</p>
                    <p>for {times} times</p>
                </div>
            </>
        )
    }

    getClass(): string {
        return "block-washing";
    }
}

class Reagent implements BlockFields {
    getContent(params:Insertable[]): JSX.Element {
        return (
            <>
                <p className="block-header">Reagent step</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>Category:</label>
                        <select id='reag-sel-categ'>
                            <option value="a">Liquid 1</option>
                            <option value="b">aasd 2</option>
                            <option value="c">Liquid 3</option>
                        </select>
                    </div>
                    <div className="block-inp">
                        <label>Liquid:</label>
                        <select id='reag-sel-liquid'>
                            <option value="a">Liquid 1</option>
                            <option value="b">aasd 2</option>
                            <option value="c">Liquid 3</option>
                        </select>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="reag-inp-min">Minutes</label>
                        <input id="reag-inp-min" type="number"/>
                    </div>
                </div>
            </>
        );
    }

    getStepContent(params: Insertable[]): JSX.Element {
        const liquid = (params.find(i=>i.name=='liquid'))?.value
        const time = (params.find(i=>i.name=='time'))?.value
        return (
            <>
                <h3>Reagent</h3>
                <div>
                    <p>With {liquid}</p>
                    <p>for {time} minutes</p>
                </div>
            </>
        )
    }

    getClass(): string {
        return "block-reagent";
    }
}

class Temperature implements BlockFields {
    getContent(params:Insertable[]): JSX.Element {
        return (
            <>
                <p className="block-header">Temperature change</p>
                <div className="block-body">
                    <div className="block-inp">
                        <label>From: </label>
                        <p>25'</p>
                    </div>
                    <div className="block-inp">
                        <label htmlFor="temper-inp-min">To:</label>
                        <input id="temper-inp-min" type="number" />
                    </div>
                </div>
            </>
        );
    }

    getStepContent(params: Insertable[]): JSX.Element {
        const temperat = (params.find(i=>i.name=='temperature'))?.value
        return (
            <>
                <h3>Temperature</h3>
                <div>
                    <p>From 111</p>
                    <p>To {temperat}</p>
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

    console.log(block);

    const addBlockToParent = () =>{
        let params = [] as Insertable[];
        switch(block.type){
            case BlockType.Washing:{
                let liquid = (document.querySelector('#wash-sel-liquid') as HTMLSelectElement).value;
                let times = (document.querySelector('#wash-inp-times') as HTMLInputElement).value;
                params=([{name:"liquid", value:liquid},{name:"times", value:times}] as Insertable[])//]

            }break;
            case BlockType.Reagent:{
                //let category = (document.querySelector('#reag-sel-categ') as HTMLSelectElement).value;
                let liquid = (document.querySelector('#reag-sel-liquid') as HTMLSelectElement).value;
                let time = (document.querySelector('#reag-inp-min') as HTMLInputElement).value;
                params = [{name:"liquid", value:liquid}, {name:"time", value:time}] as Insertable[]

            }break;
            case BlockType.Temperature:{
                let temper = (document.querySelector('#temper-inp-min') as HTMLInputElement).value;
                params = [{name:"temperature", value:temper}] as Insertable[];
            }
        }


        block.id==-1 ? addBlock({type: block.type, id:block.id, params: params} as BlockProps) : editBlock({type: block.type, id:block.id, params: params} as BlockProps)
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