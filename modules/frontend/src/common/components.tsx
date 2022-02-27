

export function CenteringFlexBox(props: any) {
    const { className, ...other } = props;
    return (
        <div className={`centering-flex-box ${className}`} {...other} >
            {props.children}
        </div>
    );
}