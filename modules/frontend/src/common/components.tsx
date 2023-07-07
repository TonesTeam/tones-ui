import { number } from 'prop-types';
import { ChangeEvent, useState } from 'react';
import { LiquidDto } from 'sharedlib/dto/liquid.dto';
export function CenteringFlexBox(props: any) {
    const { className, ...other } = props;
    return (
        <div className={`centering-flex-box ${className}`} {...other} >
            {props.children}
        </div>
    );
}

export function CustomSelect(props: any) {
    let options: LiquidDto[] = props.options;

    function onChangeValue(target: any) {
        console.log(target.value);
        let inp: NodeListOf<HTMLInputElement>= document.querySelectorAll(`input[name="${props.opt_name}"]`);
        console.log(inp)
        let toPass : HTMLInputElement = inp[0];
        inp.forEach((i)=>{
            if(i.value == target.value) {
                toPass=i;
            }
        });
        console.log(toPass);
        props.inputChange(toPass);  
    }

    return (
        <>
            <div className="select" tabIndex={1} onChange={(e)=>{onChangeValue(e.target)}}>
                {options.map((opt, index) => {
                    return (
                        <div key={index}>
                        {index==1 &&
                        <>
                            <input className="selectopt" name={props.opt_name} value={opt.name} type="radio" id={`opt${index}`} defaultChecked/>
                            <label htmlFor={`opt${index}`} className="option">{opt.name}</label>
                        </>
                        }
                        {index!=1 &&
                        <>
                            <input className="selectopt" name={props.opt_name} value={opt.name} type="radio" id={`opt${index}`} />
                            <label htmlFor={`opt${index}`} className="option">{opt.name}</label>
                        </>
                        }
                        </div>
                    )
                })}
            </div>
        </>
    )
}


export function CustomSelect2() {
      
    return (
        <div className="select">
        <select>
            <option value="">Lorem.</option>
            <option value="">Sequi.</option>
            <option value="">Praesentium!</option>
            <option value="">Debitis.</option>
            <option value="">Sequi.</option>
            <option value="">Praesentium!</option>
            <option value="">Debitis.</option>
        </select>
        <div className="arrow"></div>
    </div>
    )
}


export default function SVG_Icon(props: any) {
    return (
      <svg
        className='svg_icon'
        xmlns="http://www.w3.org/2000/svg"
        width={props.size_x }
        height={props.size_y}
        viewBox='0 0 512 512'>
          <path d={props.path} />
      </svg>
    )
  };