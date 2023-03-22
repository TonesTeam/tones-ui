import NavigationBar from "NavigationBar/NavigationBar";
import { useEffect, useState } from 'react';
import './Constructor_2side.css'
import { WorkBlock, BlockProps, BlockType, StepBlock, Insertable } from './Block';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { bool } from "prop-types";

//TODO: optimize getStyle()
const getStyle = (isDragging: boolean, active: boolean, draggableStyle: any) => ({
    margin: `0 0 10px 0`,
    border: active ? `5px solid #ff4c4f` : `none`,
    ...draggableStyle
})

export default function WorkspaceReorg() {
    const [blocks, setBlocks] = useState<BlockProps[]>([]);
    const [workBlock, setWorkBlock] = useState<BlockProps>();

    const addWorkBlock = (edit:boolean, block: BlockProps) =>{
        if(edit){
            setWorkBlock(block)
        }
        // else{
        //     setWorkBlock({type: block.type, id:-1, params:[] as Insertable[]})
        // }
    } 

    const addBlock = (props: BlockProps) => {
        console.log(props);
        let id = blocks.length == 0 ? 0 : Number(blocks[blocks.length - 1].id + 1);
        setBlocks([...blocks, { type: props.type, id: props.id == -1? id : props.id, other: 'test', params:props.params }])
    }

    const removeBlock = (id: number) => {
        setBlocks((current) =>
            current.filter((block) => block.id !== id)
        )
    }

    const editBlock = (block:BlockProps) =>{
        let index = blocks.findIndex(x=>x.id==block.id);
        let newBlocks = [...blocks]

        let editedBlock = {...newBlocks[index]}
        editedBlock.params=block.params;
        editedBlock.type=block.type;

        newBlocks[index] = editedBlock;
        setBlocks([...newBlocks])
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result

        if (!destination) return

        const steps = Array.from(blocks)
        const [newSteps] = steps.splice(source.index, 1)
        steps.splice(destination.index, 0, newSteps)

        setBlocks(steps)
    }

    const test = () =>{
        console.log(blocks);
    }

    useEffect(() => {
        setWorkBlock(undefined); // Nullifying working block when added to timeline
    }, [blocks]);


    return (
        <>
            <NavigationBar />
            <div className="font-rb" id="main">
                <div id='container'>
                    <div id="workspace">
                        <div className="options">
                            <button className="construct-btn" id="cb-washing" onClick={() => addWorkBlock(true, ({type:BlockType.Washing, id:-1, params:[]} as BlockProps))}><span className="fas fa-water"></span></button>
                            <button className="construct-btn" id="cb-reagent" onClick={() => addWorkBlock(true, ({type:BlockType.Reagent, id:-1, params:[]} as BlockProps))}><span className="fas fa-flask"></span></button>
                            <button className="construct-btn" id="cb-temperat" onClick={() => addWorkBlock(true, ({type:BlockType.Temperature, id:-1, params:[]} as BlockProps))}><span className="fas fa-temperature-low"></span></button>
                            {/* <button className="construct-btn" id="cb-delete"><span className="fas fa-trash"></span></button> */}
                        </div>
                        <div id="block-edit">
                            {workBlock != undefined &&
                                <WorkBlock block={workBlock} addBlock={addBlock} editBlock={editBlock}></WorkBlock>
                            }
                        </div>
                        <div className="options">
                            <button className="construct-btn" id="cb-save"><span className="fas fa-download"></span></button>
                            <button className="construct-btn" id="cb-settings"><span className="fas fa-wrench"></span></button>
                            <button className="construct-btn" id="cb-info"><span className="fas fa-info"></span></button>
                        </div>
                    </div>
                    <div id="timeline">
                        <div>Protocol name: <b>Test prt</b></div>
                        <DragDropContext onDragEnd={onDragEnd} onDragStart={test}>
                            <Droppable droppableId="item">
                                {(provided1) => (
                                    <div id="steps" {...provided1.droppableProps} ref={provided1.innerRef}>
                                        {
                                            // blocks.map(function (block, index) {
                                            //     return <StepBlock key={index} type={block.type} id={block.id} removeBlock={removeBlock}></StepBlock>
                                            // })
                                            blocks.map((block, index) =>{
                                                let active = block.id==workBlock?.id? true : false
                                                return (
                                                    <Draggable key={String(block.id)} draggableId={String(block.id)} index={index}>
                                                        {(provided, snapshot)=>(
                                                            <div ref={provided.innerRef} 
                                                                {...provided.dragHandleProps} 
                                                                {...provided.draggableProps} 
                                                                onClick={() => addWorkBlock(true, block)}
                                                                style={getStyle(snapshot.isDragging, active, provided.draggableProps.style)}>
                                                                <StepBlock  key={index} type={block.type} id={block.id} params={block.params} removeBlock={removeBlock} ></StepBlock>
                                                                {provided1.placeholder}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )

                                            })
                                        }
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </>
    )
}