import NavigationBar from "NavigationBar/NavigationBar";
import { useEffect, useState } from 'react';
import './Constructor_2side.css'
import { WorkBlock, BlockProps, BlockType, StepBlock } from './Block';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

// function WorkBlock(type: BlockType){
//     return(
//         <Block type={type}></Block>
//     )
// }

const getStyle = (isDragging: boolean, draggableStyle: any) => ({
    margin: `0 0 10px 0`,
    border: isDragging ? `1px solid #333` : `none`,
    ...draggableStyle
})

export default function WorkspaceReorg() {
    const [blocks, setBlocks] = useState<BlockProps[]>([]);
    const [workBlock, setWorkBlock] = useState<BlockType>();

    const addBlock = (type: BlockType) => {
        let id = blocks.length == 0 ? 0 : Number(blocks[blocks.length - 1].id + 1);
        setBlocks([...blocks, { type: type, id: id, other: 'test' }])
    }

    const removeBlock = (id: number) => {
        setBlocks((current) =>
            current.filter((block) => block.id !== id)
        )
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return
        const steps = Array.from(blocks)
        const [newSteps] = steps.splice(source.index, 1)
        steps.splice(destination.index, 0, newSteps)

        setBlocks(steps)
    }

    useEffect(() => {
        //console.log("Blocks/Steps!")
        //console.log(blocks);
        setWorkBlock(undefined); // Nullifying working block when added to timeline
    }, [blocks]);

    // useEffect(() => {
    //     console.log("Work Block!")
    //     console.log(workBlock);
    // }, [workBlock]);

    return (
        <>
            <NavigationBar />
            <div className="font-rb" id="main">
                <div id='container'>
                    <div id="workspace">
                        <div className="options">
                            <button className="construct-btn" id="cb-washing" onClick={() => setWorkBlock(BlockType.Washing)}><span className="fas fa-water"></span></button>
                            <button className="construct-btn" id="cb-reagent" onClick={() => setWorkBlock(BlockType.Reagent)}><span className="fas fa-flask"></span></button>
                            <button className="construct-btn" id="cb-temperat" onClick={() => setWorkBlock(BlockType.Temperature)}><span className="fas fa-temperature-low"></span></button>
                            {/* <button className="construct-btn" id="cb-delete"><span className="fas fa-trash"></span></button> */}
                        </div>
                        <div id="block-edit">
                            {workBlock != undefined &&
                                <WorkBlock type={workBlock} addBlock={addBlock}></WorkBlock>
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
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="item">
                                {(provided) => (
                                    <div id="steps" {...provided.droppableProps} ref={provided.innerRef}>
                                        {
                                            // blocks.map(function (block, index) {
                                            //     return <StepBlock key={index} type={block.type} id={block.id} removeBlock={removeBlock}></StepBlock>
                                            // })
                                            blocks.map(({id, type}, index) =>{
                                                return (
                                                    <Draggable key={String(id)} draggableId={String(id)} index={index}>
                                                        {(provided, snapshot)=>(
                                                            <div ref={provided.innerRef} 
                                                                {...provided.dragHandleProps} 
                                                                {...provided.draggableProps} 
                                                                style={getStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                                <StepBlock  key={index} type={type} id={id} removeBlock={removeBlock}></StepBlock>
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