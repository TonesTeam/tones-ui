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

    function handleZIndex(){
        let selects = document.querySelectorAll("div.select");

        selects.forEach((select, index)=>{
            let inps = select.childNodes;
            inps.forEach((inp,index2)=>{
                (inp.lastChild as HTMLLabelElement).style.zIndex = String(100-index);
                if ((inp.firstChild as HTMLInputElement).checked){
                    (inp.lastChild as HTMLLabelElement).style.zIndex = String(100-(index*2)); //selected option stays on top
                }else{
                    (inp.lastChild as HTMLLabelElement).style.zIndex = String(99-(index*2));
                }
            })

        })
    }

    handleZIndex();

    function onChangeValue(target: any) {
        setSelected(selected+1); 
    }

    useEffect(() => {
        let onLoadParamPass = document.querySelectorAll("input[name="+props.opt_name+"]:checked");
        if(props.inputChange){
            props.inputChange(onLoadParamPass[0]);
        }
    }, [selected]);

    return (
        <>
            <div className="select" id={`sel-${props.opt_name}`} tabIndex={1} onChange={(e)=>{onChangeValue(e.target)}}>
                {options.map((opt, index) => {
                    return (
                        <div key={index}>
                        {index==0 &&
                        <>
                        {/* First is selected by default for now. TODO: take selected value as prop*/}
                            <input className="selectopt" name={props.opt_name} value={opt.name} type="radio" id={`opt${index}_${props.opt_name}`} defaultChecked/>
                            <label htmlFor={`opt${index}_${props.opt_name}`} className="option">{opt.name}</label>
                        </>
                        }
                        {index!=0 &&
                        <>
                            <input className="selectopt" name={props.opt_name} value={opt.name} type="radio" id={`opt${index}_${props.opt_name}`} />
                            <label htmlFor={`opt${index}_${props.opt_name}`} className="option">{opt.name}</label>
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
        viewBox='0 0 470 510'>
          <path d={props.path} />
      </svg>
    )
  };