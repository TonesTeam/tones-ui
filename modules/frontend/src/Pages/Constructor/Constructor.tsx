import NavigationBar from "NavigationBar/NavigationBar";
import 'NavigationBar/NavigationBar.css'
import { useEffect, useState } from 'react';
import './Constructor.css'
//import { WorkBlock, BlockProps, BlockType, StepBlock } from './Block';
import { StepBlock, WorkBlock } from './Block';
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from 'sharedlib/dto/step.dto';
import { StepType } from 'sharedlib/dto/stepType';
import { DragDropContext, Draggable, DraggableStateSnapshot, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd'

const defTemp = 25; //default tempretaure for the system


const getStyle = (isDragging: boolean, active: boolean, draggableStyle: any) => ({
    margin: `0 0 10px 0`,
    border: active ? `5px solid #ff4c4f` : `none`,
    ...draggableStyle
})

export default function Constructor() {
    const [blocks, setBlocks] = useState<StepDTO[]>([]);
    const [workBlock, setWorkBlock] = useState<StepDTO>();
    const [currentTemp, setCurrentTemp] = useState(defTemp);

    const showWorkBlock = (block: StepDTO) =>{

        //toggle active class of element on button panel by block type
        let button = document.getElementById("cb-"+block.type);

        //remove active class from other buttons
        let buttons : NodeListOf<HTMLElement>  = document.querySelectorAll('button.construct-btn');
        buttons.forEach(b=>{
            b.classList.remove("active")
        })

        //add class to current
        button?.classList.toggle("active")

        // if(workBlock!=undefined && block.id==-1){
        //     //changing type of new block (e.g. this is not editing, but new block)
        //     block.id=workBlock.id
        //     editBlock({type:block.type, id:workBlock.id, params:{}} as StepDTO)
        //     let newWorkBlock = workBlock
        //     newWorkBlock.type = block.type
        //     newWorkBlock.params = {} 
        //     setWorkBlock(newWorkBlock)
        // }
        // else{
        //     //editing
        //     setWorkBlock(block)
        // }
        setWorkBlock(block);
    } 

    const addBlock = (blockToAdd: StepDTO) => {

        console.log("This is block to add: ", blockToAdd)
        //new ID = maxID+1
        let id = blocks.length == 0 ? 0 : ((blocks.reduce(function(prev, current) {
            return (prev.id > current.id) ? prev : current
        })).id +1) // reduce() returns object
        
        //setBlocks([...blocks, { type: props.type, id: props.id == -1? id : props.id, other: 'test', params:props.params }])
        const finalBlocks = updateTempParam([...blocks,{ type: blockToAdd.type, id: blockToAdd.id == -1? id : blockToAdd.id, params:{...blockToAdd.params, temperature: currentTemp} } as StepDTO ])
        setBlocks(finalBlocks)
        
        setWorkBlock(undefined)

        if(blockToAdd.type == StepType.Temperature){
            let newTemp = (blockToAdd.params as TemperatureStep).target;
            setCurrentTemp(newTemp)//props.params.find(i=>i.name=='targetTemp')?.value)
        }

        //Remove active class from buttons
        let buttons : NodeListOf<HTMLElement>  = document.querySelectorAll('button.construct-btn');
        buttons.forEach(b=>{
            b.classList.remove("active")
        })
    }

    const removeBlock = (id: number) => {
        setBlocks((current) =>
            current.filter((block) => block.id !== id)
        )
    }

    const editBlock = (block:StepDTO) =>{
        let index = blocks.findIndex(x=>x.id==block.id);
        let newBlocks = [...blocks]

        if(block.type == StepType.Temperature){
            let newTemp = (block.params as TemperatureStep).target as number
            setCurrentTemp(newTemp)//props.params.find(i=>i.name=='targetTemp')?.value)
        }

        let editedBlock = {...newBlocks[index]}
        editedBlock.params=block.params;
        editedBlock.type=block.type;

        newBlocks[index] = editedBlock;
        let refactoredBlocks = updateTempParam(newBlocks)
        setBlocks([...refactoredBlocks])
        setWorkBlock(undefined);

    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result

        if (!destination) return

        const steps = Array.from(blocks)
        const [newSteps] = steps.splice(source.index, 1)
        steps.splice(destination.index, 0, newSteps)

        const refactored = refactorTemperature(steps)
        const updatedTemp = updateTempParam(refactored)
        setBlocks(updatedTemp)

        let temps = updatedTemp.filter((block) => {
            return block.type == StepType.Temperature;
        });

        if(temps.length!=0){
            let lastTemp = (temps[temps.length-1].params as TemperatureStep).target as number
            setCurrentTemp(lastTemp)
        }

    }

    function refactorTemperature(blocks: StepDTO[]){
        let refactBlocks = [...blocks]
        let current = defTemp;

        for (let i=0; i<refactBlocks.length; i++){
            if(refactBlocks[i].type==StepType.Temperature){
                let temp_params = refactBlocks[i].params as TemperatureStep
                const fromTemp = temp_params.source;
                const target = temp_params.target;
                let editedBlock = {...refactBlocks[i]} as StepDTO
                (editedBlock.params as TemperatureStep).source = current;
                (editedBlock.params as TemperatureStep).target = target;
                
                //filter redundant blocks later
                if((editedBlock.params as TemperatureStep).source == (editedBlock.params as TemperatureStep).target){
                    editedBlock.id=-1
                }
                refactBlocks[i] = editedBlock;

                current=target as number
            }
        }

        const result = refactBlocks.filter((block) => {
            return block.id != -1;
        });

        return result
    }

    function updateTempParam(blocks: StepDTO[]){
        let refactBlocks = [...blocks]
        let currentTemp = defTemp
        for (let i=0; i<refactBlocks.length; i++){
            if(refactBlocks[i].type==StepType.Temperature){
                currentTemp = (refactBlocks[i].params as TemperatureStep).target as number
                //filter redundant blocks later
                if((refactBlocks[i].params as TemperatureStep).source == (refactBlocks[i].params as TemperatureStep).target){
                    refactBlocks[i].id=-1
                }
            }
            else{
                (refactBlocks[i].params as WashStep | ReagentStep).temperature=currentTemp;
            } 
        }   
        const result = refactBlocks.filter((block) => {
            return block.id != -1;
        });

        return result
    }

    return (
        <>
            <NavigationBar selectedItem='Create Protocol'/>
            <div id="main" className="global-constructor">
                <div id="protocol-meta">
                    <h2>Protocol Constructor</h2>
                    <div id="name">
                        <p>Protocol Name:</p>
                        <input type="text"/>
                    </div>
                    <button>Save Protocol</button>
                </div>
                <div id='container'>
                    <div id="workspace">
                        <div className="options">
                            <button className="construct-btn" id="cb-washing" onClick={() => showWorkBlock(({type:StepType.Washing, id:-1, params:{} as WashStep} as StepDTO))}>
                                <div><span className="fas fa-water"></span></div>
                                <p>WASHING</p>
                            </button>

                            <button className="construct-btn" id="cb-reagent" onClick={() => showWorkBlock(({type:StepType.Reagent, id:-1, params:{} as ReagentStep} as StepDTO))}>
                                <div><span className="fas fa-flask"></span></div>
                                <p>REAGENT</p>
                            </button>

                            <button className="construct-btn" id="cb-temperature" onClick={() => showWorkBlock(({type:StepType.Temperature, id:-1, params:{source:currentTemp, target: -1} as TemperatureStep} as StepDTO))}>
                                <div><span className="fas fa-temperature-low"></span></div>
                                <p>TEMPTERATURE</p>
                            </button>
                        </div>
                        <div id="block-edit">
                            {workBlock != undefined &&
                                <WorkBlock block={workBlock} addBlock={addBlock} editBlock={editBlock}></WorkBlock>
                            }
                        </div>
                    </div>
                    <div id="timeline">
                        <h3>Protocol timeline</h3>
                        
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="item">
                                {(provided) => (
                                    <div id="steps" {...provided.droppableProps} ref={provided.innerRef}>
                                        {
                                            blocks.map((block, index) =>{
                                                let active = block.id==workBlock?.id? true : false
                                                return (
                                                    <div key={index}>
                                                    <Draggable key={String(block.id)} draggableId={String(block.id)} index={index} 
                                                    >
                                                        {(provided, snapshot)=>(
                                                            <div ref={provided.innerRef} 
                                                                {...provided.dragHandleProps} 
                                                                {...provided.draggableProps} 
                                                                onClick={() => showWorkBlock(block)}
                                                                style={getStyle(snapshot.isDragging, active, provided.draggableProps.style)}>
                                                                
                                                                <StepBlock  key={index} block={block} removeBlock={removeBlock}></StepBlock>
                                                                
                                                            </div>
                                                        )}
                                                    </Draggable> 
                                                    </div>
                                                )
                                            })
                                        }
                                        {provided.placeholder}
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