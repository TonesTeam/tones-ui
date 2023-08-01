import "./Block.css";
import { getRequest } from "common/util";
import React, { useEffect, useState } from "react";
import { SVG_Icon, CustomSelect, ToggleInput, SelectListProp } from "common/components";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { stepTypeClass } from "./Constructor";
import Select from 'react-select';
import { getCategoriesList, getCategoryIDByLiquid, getFilteredLiquidList } from "./constructor_utils";

interface BlockInputsProps {
  stepData: StepDTO;
  change: (arg0: WashStep | ReagentStep | TemperatureStep) => void;
  liquids?: LiquidDTO[];
}

function WashInputs(props: BlockInputsProps) {
  const initialParams = props.stepData.params as WashStep;
  const [washParams, setWashParams] = useState(initialParams);
  const liquidsList = getFilteredLiquidList(props.liquids!, 2)
  const [selectedLiquid, setSelectedLiquid] = useState()

  useEffect(() => {
    props.change(washParams);
  }, [washParams]);

  const handleChange = (target: HTMLInputElement | HTMLSelectElement) => {
    if (target) {
      setWashParams((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  };

  return (
    <>
      <div className="block-body">
        <div className="block-body-row">
          <div className="block-inp">
            <label>Reagent:</label>
            {/* <CustomSelect
              options={liquidsList}
              opt_name={"liquidId"}
              inputChange={handleChange}
              selected={washParams.liquidId || null}
            ></CustomSelect> */}
            <Select 
            getOptionLabel={(liq: LiquidDTO) => liq.name}
            getOptionValue={(liq: LiquidDTO) => liq.name}
            options={liquidsList} value={props.liquids?.find(liq=> liq.id==washParams.liquid.id) || null} />
          </div>
        </div>

        <div className="block-body-row col">
          <div className="block-inp">
            <label htmlFor="wash-inp-iters">Iterations:</label>
            <input
              id="wash-inp-iters"
              type="number"
              name="iters"
              value={washParams.iters || ""}
              onChange={(e) => handleChange(e.target as HTMLInputElement)}
            />
          </div>

          <div className="block-inp">
            <label htmlFor="wash-inp-time">Incubation time{initialParams.incubation}: </label>
            <input
              id="wash-inp-time"
              type="number"
              name="incubation"
              value={washParams.incubation || ""}
              onChange={(e) => handleChange(e.target as HTMLInputElement)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ReagentInputs(props: BlockInputsProps) {
  const initialParams = props.stepData.params as ReagentStep;
  const [reagParams, setReagParams] = useState(initialParams);
  const [liquidList, setLiquidList] = useState<LiquidDTO[]>([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState<number>(
    getCategoryIDByLiquid(props.liquids!, initialParams.liquid.id)
  )

  const categories = getCategoriesList(props.liquids!)

  useEffect(() => {
    const filteredLiquids = getFilteredLiquidList(props.liquids!, selectedCategoryID);
    setLiquidList(filteredLiquids);
  }, [selectedCategoryID]);

  useEffect(() => {
    props.change(reagParams);
  }, [reagParams]);

  const handleChange = (target: HTMLInputElement | HTMLSelectElement) => {
    if (target) {
      setReagParams((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  };

  const handleCategoryChange = (target: HTMLInputElement | HTMLSelectElement) => {
    if (target) setSelectedCategoryID(Number(target.value));
  };

  return (
    <>
      <div className="block-body">
        <div className="block-body-row">
          <div className="block-inp">
            <label>Category:</label>
            <CustomSelect
              options={categories}
              opt_name={"reag-sel-cat"}
              inputChange={handleCategoryChange}
              selected={selectedCategoryID}
            ></CustomSelect>
          </div>
        </div>

        <div className="block-body-row">
          <div className="block-inp">
            <label>Reagent:</label>
            <CustomSelect
              options={liquidList}
              opt_name={"liquidId"}
              inputChange={handleChange}
              selected={reagParams.liquid.id || null}
            />
          </div>
        </div>

        <div className="block-body-row">
          <div className="block-inp">
            <label htmlFor="reag-inp-min">Incubation time:</label>
            <input
              id="reag-inp-min"
              type="number"
              name="incubation"
              value={reagParams.incubation || ""}
              onChange={(e) => handleChange(e.target as HTMLInputElement)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function TemperatureInputs(props: BlockInputsProps) {
  const initialParams = props.stepData.params as TemperatureStep;
  const [temperParams, setTemperParams] = useState<TemperatureStep>(initialParams);

  const handleChange = (target: HTMLInputElement | HTMLSelectElement) => {
    setTemperParams((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };

  useEffect(() => {
    props.change(temperParams);
  }, [temperParams]);

  return (
    <>
      <div className="block-body">
        <div className="block-body-row">
          <div className="block-inp">
            <label>From: </label>
            <input
              id="temper-inp-source"
              type="number"
              value={temperParams.source}
              name="source"
              disabled
            />
          </div>
        </div>
        <div className="block-body-row">
          <div className="block-inp">
            <label htmlFor="temper-inp-target">Target temperature:</label>
            <input
              id="temper-inp-target"
              type="number"
              name="target"
              value={temperParams.target == -1 ? "" : temperParams.target}
              onChange={(e) => handleChange(e.target)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export interface WorkBlockProps {
  block: StepDTO;
  addBlock: (block: StepDTO) => void;
  editBlock: (block: StepDTO) => void;
  toggleAutoWash: (val: boolean) => void;
  currentAutoWash: boolean;
}

export const WorkBlock: React.FC<WorkBlockProps> = (props: WorkBlockProps) => {
  const [params, setParams] = useState<{ [key: string]: any }>({});
  const [settings, setSettings] = useState(false);
  const [liquids, setLiquids] = useState<LiquidDTO[]>([]);

  const block = props.block

  useEffect(() => {
    getLiquids();
  }, []);

  async function getLiquids() {
    const liquidList = (await getRequest<LiquidDTO[]>("/liquids")).data;
    setLiquids(liquidList);
  }

  const updateParams = (step_params: any) => {
    setParams((params) => ({
      ...params,
      ...step_params,
    }));
  };

  const addBlockToParent = () => {
    block.params = params as typeof block.params;
    block.id == -1 ? props.addBlock(block) : props.editBlock(block);
  };

  const handleAutoWash = (val: boolean) => {
    props.toggleAutoWash(val);
  };

  return (
    <>
      <div className="inputs">
        {block.type == StepType.WASHING && (
          <WashInputs stepData={block} change={updateParams} liquids={liquids}></WashInputs>
        )}
        {block.type == StepType.LIQUID_APPL && (
          <ReagentInputs stepData={block} change={updateParams} liquids={liquids}></ReagentInputs>
        )}
        {block.type == StepType.TEMP_CHANGE && (
          <TemperatureInputs stepData={block} change={updateParams}></TemperatureInputs>
        )}
      </div>
      <div className="block-footer">
        <button id="constr-settings" onClick={() => setSettings(true)}>
          <div>
            <SVG_Icon
              size_x={20}
              size_y={20}
              path="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
            ></SVG_Icon>
            <p>Workspace Settings</p>
          </div>
          <SVG_Icon
            size_x={20}
            size_y={20}
            path="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
          ></SVG_Icon>
        </button>
      </div>
      <div className="workspace-footer">
        <button id="info-btn">
          <SVG_Icon
            size_x={20}
            size_y={20}
            path="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
          ></SVG_Icon>
        </button>
        <button
          className={`save-btn ${stepTypeClass.get(block.type)}`}
          onClick={() => addBlockToParent()}
        >
          Add Step
        </button>
      </div>

      <div className="modal" style={{ display: settings ? "grid" : "none" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Workspace Settings</h3>
            <h2 onClick={() => setSettings(false)} style={{ cursor: "pointer" }}>
              &#x2716;
            </h2>
          </div>
          <div className="modal-toggle">
            {/* <input type='checkbox' onChange={(e)=>handleAutoWash(e.target)} checked={currentAutoWash? true:false}/> */}
            <label>Automatic washing step insert</label>
            <ToggleInput
              val1={"OFF"}
              val2={"ON"}
              handleChange={handleAutoWash}
              checked={props.currentAutoWash ? true : false}
            />
          </div>

          <div className="modal-toggle">
            <label>Change default time units</label>
            <ToggleInput val1={"Seconds"} val2={"Minutes"} />
          </div>

          <div className="modal-inp">
            <label>Add protocol-specific reagent</label>
            <select>
              <option>123</option>
              <option>abc</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};