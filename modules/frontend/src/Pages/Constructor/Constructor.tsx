import NavigationBar from "NavigationBar/NavigationBar";
import "NavigationBar/NavigationBar.css";
import "./Constructor.css";
import { useEffect, useState } from "react";
import { WorkBlock } from "./Block";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { SVG_Icon } from "common/components";
import { useParams } from "react-router-dom";
import { TimelineBlock } from "./TimelineBlock";
import { calcDuration, updateTemperature } from "./constructor_utils";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { ProtocolWithStepsDTO } from "sharedlib/dto/protocol.dto";
import { getRequest } from "common/util";

export const DEFAULT_TEMEPRATURE = 25; //default tempretaure for the system
export const LIQUID_INJECT_TIME: number = 10; //default time to inject liduid into slot chip

export const stepTypeClass = new Map<StepType, string>([
  [StepType.WASHING, "washing"],
  [StepType.LIQUID_APPL, "reagent"],
  [StepType.TEMP_CHANGE, "temperature"],
]);

const getStyle = (isDragging: boolean, active: boolean, draggableStyle: any) => ({
  margin: `0 0 10px 0`,
  boxShadow: active ? `10px 10px 30px -23px rgba(0,0,0,0.85)` : `none`,
  // borderRadius: `9px`,
  width: isDragging ? `105%` : `100%`,
  color: active ? "black" : "white",
  ...draggableStyle,
});

export default function Constructor() {
  const params = useParams();
  const protoID = params.id;

  const [blocks, setBlocks] = useState<StepDTO[]>([]);
  const [workBlock, setWorkBlock] = useState<StepDTO>();
  const [currentTemp, setCurrentTemp] = useState(DEFAULT_TEMEPRATURE);
  const [settingAutoWash, setSettingAutoWash] = useState(true);
  const [preSaveModal, showPreSaveModal] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>([]);
  const [liquidsList, setLiquidList] = useState<LiquidDTO[]>([]);

  useEffect(() => {
    getLiquids();
  }, []);

  async function getLiquids() {
    const liquidList = (await getRequest<LiquidDTO[]>("/liquids")).data;
    setLiquidList(liquidList.filter((liq) => liq.type.id == 2));
  }

  useEffect(() => {
    setDuration(calcDuration(blocks));
  }, [blocks]);

  const showWorkBlock = (block: StepDTO) => {
    //1. remove "editing" class from block in timeline
    let blockInTL = document.querySelector("div.editing");
    blockInTL?.classList.remove("editing");

    //2. remove "active" class from all block-type buttons
    let buttons: NodeListOf<HTMLElement> = document.querySelectorAll("button.construct-btn");
    buttons.forEach((b) => {
      b.classList.remove("active");
    });

    //3. toggle "active" class of element on button panel by block type
    let button = document.getElementById("cb-" + stepTypeClass.get(block.type));
    button?.classList.toggle("active");

    setWorkBlock(block);
  };

  const addBlock = (blockToAdd: StepDTO) => {
    console.log("This is block to add: ", blockToAdd);
    let id =
      blocks.length == 0
        ? 0
        : blocks.reduce(function (prev, current) {
            return prev.id > current.id ? prev : current;
          }).id + 1; // reduce() returns object

    const finalBlocks = updateTemperature([
      ...blocks,
      {
        type: blockToAdd.type,
        id: blockToAdd.id == -1 ? id : blockToAdd.id,
        params: { ...blockToAdd.params, temperature: currentTemp },
      } as StepDTO,
    ]);
    setBlocks(finalBlocks);

    setWorkBlock(undefined); //remove working block from workspace

    if (blockToAdd.type == StepType.TEMP_CHANGE) {
      let newTemp = (blockToAdd.params as TemperatureStep).target;
      setCurrentTemp(newTemp); //update current temperature for next steps
    }

    //Remove active class from buttons
    let buttons: NodeListOf<HTMLElement> = document.querySelectorAll("button.construct-btn");
    buttons.forEach((b) => {
      b.classList.remove("active");
    });
  };

  const removeBlock = (toRemove: StepDTO) => {
    if (toRemove.type == StepType.TEMP_CHANGE) {
      let temps = blocks.filter((block) => {
        return block.type == StepType.TEMP_CHANGE;
      });

      if (temps.length != 0) {
        setCurrentTemp(DEFAULT_TEMEPRATURE); //if no temperatures blocks left after deletion -> settings current as default
      }
    }

    const newBlocs = blocks.filter((block) => block.id !== toRemove.id);
    setBlocks(updateTemperature(newBlocs));
  };

  const editBlock = (block: StepDTO) => {
    console.log("In Edit: ", block);

    //remove "editing" class from block in timeline
    let blockInTL = document.querySelector("div.editing");
    blockInTL?.classList.remove("editing");

    let index = blocks.findIndex((x) => x.id == block.id);
    let newBlocks = [...blocks];

    if (block.type == StepType.TEMP_CHANGE) {
      let newTemp = (block.params as TemperatureStep).target as number;
      setCurrentTemp(newTemp); //props.params.find(i=>i.name=='targetTemp')?.value)
    }

    let editedBlock = { ...newBlocks[index] };
    editedBlock.params = block.params;
    editedBlock.type = block.type;

    newBlocks[index] = editedBlock;
    let refactoredBlocks = updateTemperature(newBlocks);
    setBlocks([...refactoredBlocks]);
    setWorkBlock(undefined);

    //Remove active class from buttons
    let buttons: NodeListOf<HTMLElement> = document.querySelectorAll("button.construct-btn");
    buttons.forEach((b) => {
      b.classList.remove("active");
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const steps = Array.from(blocks);
    const [newSteps] = steps.splice(source.index, 1);
    steps.splice(destination.index, 0, newSteps);

    const updatedTemp = updateTemperature(steps);
    setBlocks(updatedTemp);

    //Set current temperature for next blocks are "target" of the last temperature block
    let temps = updatedTemp.filter((block) => {
      return block.type == StepType.TEMP_CHANGE;
    });

    if (temps.length != 0) {
      let lastTemp = (temps[temps.length - 1].params as TemperatureStep).target as number;
      setCurrentTemp(lastTemp);
    }
  };

  function testSave(blocks: StepDTO[]) {
    const description = (
      document.querySelector("textarea#proto-description")! as HTMLTextAreaElement
    ).value;

    const name = (document.querySelector("input#proto_name")! as HTMLInputElement).value;

    //proto_name

    let defWashLiquid = liquidsList.find((liq) => liq.type.id == 2);

    let new_protocol = {
      id: 0,
      name: name,
      customLiquids: customLiquids,
      description: description,
      steps: blocks,
      creationDate: new Date(),
      defaultWash: {
        iters: 3,
        incubation: 10,
        temperature: null,
        liquid: defWashLiquid!,
      } as WashStep,
      author: null,
    } as ProtocolWithStepsDTO;

    console.log(new_protocol);

    //save(new_protocol) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }

  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(1000);
    }
  };
  return (
    <>
      <NavigationBar selectedItem="Create Protocol" />
      <div id="main" className="global-constructor">
        <div id="protocol-meta">
          <h2>Protocol Constructor</h2>
          <button onClick={() => showPreSaveModal(true)}>Save Protocol</button>
        </div>
        <div id="container">
          <div id="workspace">
            <div className="options">
              <button
                className="construct-btn"
                id="cb-washing"
                onClick={() =>
                  showWorkBlock({
                    type: StepType.WASHING,
                    id: -1,
                    params: {} as WashStep,
                  } as StepDTO)
                }
              >
                <div>
                  <SVG_Icon
                    size_x={25}
                    size_y={25}
                    path="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"
                  />
                </div>
                <p>WASHING</p>
              </button>

              <button
                className="construct-btn"
                id="cb-reagent"
                onClick={() =>
                  showWorkBlock({
                    type: StepType.LIQUID_APPL,
                    id: -1,
                    params: {} as ReagentStep,
                  } as StepDTO)
                }
              >
                <div>
                  <SVG_Icon
                    size_x={25}
                    size_y={25}
                    path="M288 0H160 128C110.3 0 96 14.3 96 32s14.3 32 32 32V196.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512H378.6c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H288zM192 196.8V64h64V196.8c0 23.7 6.6 46.9 19 67.1L309.5 320h-171L173 263.9c12.4-20.2 19-43.4 19-67.1z"
                  />
                </div>
                <p>REAGENT</p>
              </button>

              <button
                className="construct-btn"
                id="cb-temperature"
                onClick={() =>
                  showWorkBlock({
                    type: StepType.TEMP_CHANGE,
                    id: -1,
                    params: {
                      source: currentTemp,
                      target: -1,
                    } as TemperatureStep,
                  } as StepDTO)
                }
              >
                <div>
                  <SVG_Icon
                    size_x={25}
                    size_y={25}
                    path="M448 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM320 96a96 96 0 1 1 192 0A96 96 0 1 1 320 96zM144 64c-26.5 0-48 21.5-48 48V276.5c0 17.3-7.1 31.9-15.3 42.5C70.2 332.6 64 349.5 64 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48zM32 112C32 50.2 82.1 0 144 0s112 50.1 112 112V276.5c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S0 447.5 0 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6V112zM192 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V272c0-8.8 7.2-16 16-16s16 7.2 16 16v50.7c18.6 6.6 32 24.4 32 45.3z"
                  />
                </div>
                <p>TEMPTERATURE</p>
              </button>
            </div>
            <div id="block-edit">
              {workBlock != undefined && (
                <WorkBlock
                  block={workBlock}
                  addBlock={addBlock}
                  editBlock={editBlock}
                  toggleAutoWash={setSettingAutoWash}
                  currentAutoWash={settingAutoWash}
                  addCustomLiquid={(newLiquid: LiquidDTO) =>
                    setCustomLiquids([...customLiquids, newLiquid])
                  }
                  customLiquids={customLiquids}
                ></WorkBlock>
              )}
            </div>
          </div>
          <div id="timeline">
            <div className="header">
              <h3>Protocol timeline</h3>
              <h4 id="duration">Approximate duration: {duration} sec.</h4>
            </div>

            <DragDropContext onDragEnd={onDragEnd} onDragStart={handleDragStart}>
              <Droppable droppableId="item">
                {(provided) => (
                  <div id="steps" {...provided.droppableProps} ref={provided.innerRef}>
                    {blocks.map((block, index) => {
                      let active = block.id == workBlock?.id ? true : false;
                      return (
                        <div key={index}>
                          <Draggable
                            key={String(block.id)}
                            draggableId={String(block.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                style={getStyle(
                                  snapshot.isDragging,
                                  active,
                                  provided.draggableProps.style
                                )}
                              >
                                <TimelineBlock
                                  key={index}
                                  block={block}
                                  removeBlock={removeBlock}
                                  editToggle={showWorkBlock}
                                  removeAuto={editBlock}
                                />
                              </div>
                            )}
                          </Draggable>
                        </div>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      <div id="pre-save-wrapper" style={{ display: preSaveModal ? "flex" : "none" }}>
        <div className="pre-save-content">
          <div className="header">
            <div>
              Protocol name: <input type="text" id="proto_name" placeholder="My First Protocol" />
            </div>
            <div>Duration: _________</div>
            <h2 onClick={() => showPreSaveModal(false)} style={{ cursor: "pointer" }}>
              &#x2716;
            </h2>
          </div>

          <div className="body">
            <table className="step-table">
              <thead>
                <tr>
                  <th>Step #</th>
                  <th>Type</th>
                  <th>Reagent</th>
                  <th>Temperature</th>
                  <th>Incubation</th>
                  <th>Iterations</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ position: "relative" }}>
                        <span className={`label ${block.type}`}> </span>
                        <p>
                          {index + 1} id={block.id}
                        </p>
                      </td>
                      <td>
                        <p>{block.type}</p>
                      </td>
                      <td>
                        {block.type != StepType.TEMP_CHANGE && (
                          <p>{(block.params as WashStep | ReagentStep).liquid.name}</p>
                        )}
                        {block.type == StepType.TEMP_CHANGE && <p>-</p>}
                      </td>
                      <td>
                        {block.type != StepType.TEMP_CHANGE && (
                          <p>
                            {(block.params as WashStep | ReagentStep).temperature}
                            °C
                          </p>
                        )}
                        {block.type == StepType.TEMP_CHANGE && (
                          <p>{(block.params as TemperatureStep).target}°C</p>
                        )}
                      </td>
                      <td>
                        {block.type != StepType.TEMP_CHANGE && (
                          <p>{(block.params as WashStep | ReagentStep).incubation}</p>
                        )}
                        {block.type == StepType.TEMP_CHANGE && <p>-</p>}
                      </td>
                      <td>
                        {block.type == StepType.WASHING && (
                          <p>{(block.params as WashStep).iters}</p>
                        )}
                        {block.type != StepType.WASHING && <p>-</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="body-footer">
              <p>Enter protocol description:</p>
              <textarea id="proto-description" placeholder="Protocol description ..." />
            </div>
          </div>

          <div className="pre-save-footer">
            <button id="save-prt" onClick={() => testSave(blocks)}>
              Save
            </button>
            <button id="edit-prt" onClick={() => showPreSaveModal(false)}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
