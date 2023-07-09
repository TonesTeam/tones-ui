import { useEffect, useState } from 'react';
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
    const [selected, setSelected] = useState(1); //mock

    function onChangeValue(target: any) {
        // let inps: NodeListOf<HTMLInputElement>= document.querySelectorAll(`input[name="${props.opt_name}"]`); //list of all inputs (radios)
        // let toPass : HTMLInputElement = inps[0]; //initial selected (mock)
        // inps.forEach((i)=>{
        //     if(i.value == target.value) {
        //         toPass=i; //target value somehow contains value of all selected radios that is selected
        //     }
        // });

        //let res = {[props.opt_name]: toPass.value};
        //let res = {[props.opt_name]: target.value};
        //props.inputChange(target); //parent's onChange call 
        setSelected(selected+1); 
    }

    useEffect(() => {
        let onLoadParamPass = document.querySelectorAll("input[name="+props.opt_name+"]:checked");
        console.log(onLoadParamPass[0])
        if(props.inputChange){
            props.inputChange(onLoadParamPass[0]);
        }

    }, [selected]);

    return (
        <>
            <div className="select" tabIndex={1} onChange={(e)=>{onChangeValue(e.target)}}>
                {options.map((opt, index) => {
                    return (
                        <div key={index}>
                        {index==1 &&
                        <>
                        {/* First is selected by default for now. TODO: take selected value as prop*/}
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