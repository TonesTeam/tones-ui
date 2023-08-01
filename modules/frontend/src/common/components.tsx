import { useEffect, useState } from "react";

export function CenteringFlexBox(props: any) {
  const { className, ...other } = props;
  return (
    <div className={`centering-flex-box ${className}`} {...other}>
      {props.children}
    </div>
  );
}

export interface SelectListProp {
  label: string;
  value: string | number;
}
export function CustomSelect(props: any) {
  let options: SelectListProp[] = props.options;
  let selected = props.selected as String | null;
  const [choiceCount, setChoiceCount] = useState(1); //mock

  console.log("In CustomSelect. The passed Selected prop is: "+ String(selected) + ", for " + props.opt_name )

  function handleZIndex() {
    let selects = document.querySelectorAll("div.select");

    selects.forEach((select, index) => {
      let inps = select.childNodes;
      inps.forEach((inp, index2) => {
        (inp.lastChild as HTMLLabelElement).style.zIndex = String(100 - index);
        if ((inp.firstChild as HTMLInputElement).checked) {
          (inp.lastChild as HTMLLabelElement).style.zIndex = String(100 - index * 2); //selected option stays on top
        } else {
          (inp.lastChild as HTMLLabelElement).style.zIndex = String(99 - index * 2);
        }
      });
    });
  }

  handleZIndex();

  function onChangeValue(target: any) {
    setChoiceCount(choiceCount + 1);
  }

  useEffect(() => {
    let onLoadParamPass = document.querySelectorAll("input[name=" + props.opt_name + "]:checked");
    if (props.inputChange) {
      props.inputChange(onLoadParamPass[0]);
    }
  }, [choiceCount]);

  return (
    <>
      <div
        className="select"
        id={`sel-${props.opt_name}`}
        tabIndex={1}
        onChange={(e) => {
          onChangeValue(e.target);
        }}
      >
        {options.map((opt, index) => {
          return (
            <div key={index}>
              {((selected != null && selected == opt.value) || (selected == null && index == 0)) && (
                <>
                  {/* First is selected by default if no selected option is passed*/}
                  <input
                    className="selectopt"
                    name={props.opt_name}
                    value={opt.value}
                    type="radio"
                    id={`opt${index}_${props.opt_name}`}
                    defaultChecked
                  />
                  <label htmlFor={`opt${index}_${props.opt_name}`} className="option">
                    {opt.name}
                  </label>
                </>
              )}

              {((selected != null && selected != opt.value) || (selected == null && index != 0)) && (
                <>
                  <input
                    className="selectopt"
                    name={props.opt_name}
                    value={opt.value}
                    type="radio"
                    id={`opt${index}_${props.opt_name}`}
                  />
                  <label htmlFor={`opt${index}_${props.opt_name}`} className="option">
                    {opt.name}
                  </label>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function SVG_Icon(props: any) {
  return (
    <svg
      className="svg_icon"
      xmlns="http://www.w3.org/2000/svg"
      width={props.size_x}
      height={props.size_y}
      viewBox="0 0 600 600"
      style={{ textAlign: "center", transition: "all var(--animation-time)" }}
    >
      <path d={props.path} />
    </svg>
  );
}

export function ToggleInput(props: any) {
  const [val, setVal] = useState(props.checked);

  useEffect(() => {
    if (props.handleChange) {
      props.handleChange(val);
    }
  }, [val]);

  return (
    <div className="toggle-input">
      <p className={`toggle-val ${!val ? "active" : ""}`}>{props.val1}</p>
      <label className="switch">
        <input type="checkbox" onChange={() => setVal(!val)} checked={val ? true : false} />
        <span className="slider round"></span>
      </label>
      <p className={`toggle-val ${val ? "active" : ""}`}>{props.val2}</p>
    </div>
  );
}
