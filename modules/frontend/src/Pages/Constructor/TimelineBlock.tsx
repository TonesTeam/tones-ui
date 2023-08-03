import { SVG_Icon } from "common/components";
import { getRequest } from "common/util";
import { useState, useEffect } from "react";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import { stepTypeClass } from "./Constructor";
import "./Block.css";

export interface TimelineBlockProps {
  block: StepDTO;
  removeBlock: (block: StepDTO) => void;
  editToggle: (block: StepDTO) => void;
  removeAuto: (block: StepDTO) => void;
}
export const TimelineBlock: React.FC<TimelineBlockProps> = ({
  block,
  removeBlock,
  editToggle,
  removeAuto,
}) => {
  const handleRemoveAutoWash = (block: StepDTO) => {
    block.params = { ...block.params, autoWash: false } as ReagentStep;
    removeAuto(block);
  };

  const handleEditToggle = (block: StepDTO, target: HTMLElement) => {
    editToggle(block);
    let activeStepElem = target.closest("div.step") as HTMLElement;
    activeStepElem.classList.add("editing");
  };
  return (
    <div className={`step ${stepTypeClass.get(block.type)}`}>
      <div className="step-header">
        <h3>{block.type}</h3>
        <div>
          <button
            className="step-btn"
            onClick={(e) => handleEditToggle(block, e.target as HTMLButtonElement)}
          >
            <SVG_Icon
              size_x={15}
              size_y={15}
              path="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
            />
            Edit
          </button>
          <button className="step-btn" onClick={() => removeBlock(block)}>
            <SVG_Icon
              size_x={15}
              size_y={15}
              path="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
            />
            Delete
          </button>
        </div>
      </div>
      <div className="step-params">
        {block.type == StepType.WASHING && (
          <>
            <div className="param-row">
              <div className="param-cell">
                <span>With:</span>
                <p>{(block.params as WashStep).liquid.name}</p>
              </div>
              <div className="param-cell">
                <span>At:</span>
                <p>{(block.params as WashStep).temperature}°C</p>
              </div>
            </div>

            <div className="param-row">
              <div className="param-cell">
                <span>For:</span>
                <p>{(block.params as WashStep).iters} times</p>
              </div>
              <div className="param-cell">
                <span>For:</span>
                <p>{(block.params as WashStep).incubation} seconds</p>
              </div>
            </div>
          </>
        )}

        {block.type == StepType.LIQUID_APPL && (
          <>
            <div className="param-row">
              <div className="param-cell">
                <span>With:</span>
                <p>{(block.params as ReagentStep).liquid.name}</p>
              </div>
              <div className="param-cell">
                <span>At:</span>
                <p>{(block.params as ReagentStep).temperature}°C</p>
              </div>
            </div>

            <div className="param-row">
              <div className="param-cell">
                <span>For:</span>
                <p>{(block.params as ReagentStep).incubation} seconds</p>
              </div>
              <div className="param-cell">
                <span>AutoWash:</span>
                <p>{(block.params as ReagentStep).autoWash == false ? "No" : "Yes"}</p>
              </div>
            </div>
            {(block.params as ReagentStep).autoWash == true && (
              <div className="param-row extra">
                <div className="auto-wash-mark">
                  <SVG_Icon
                    size_x={25}
                    size_y={25}
                    path="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"
                  />
                  <p>Auto Wash: 3X10</p>
                  <h3 onClick={() => handleRemoveAutoWash(block)} style={{ cursor: "pointer" }}>
                    &#x2716;
                  </h3>
                </div>
                <div></div>
              </div>
            )}
          </>
        )}

        {block.type == StepType.TEMP_CHANGE && (
          <>
            <div className="param-row">
              <div className="param-cell">
                <span>Change from:</span>
                <p>{(block.params as TemperatureStep).source}°C</p>
              </div>
              <div className="param-cell">
                <span>To:</span>
                <p>{(block.params as TemperatureStep).target}°C</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
