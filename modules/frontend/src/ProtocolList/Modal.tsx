import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
    onBackdropClick: () => void;
}

const Modal: React.FC<ModalProps> = ({onBackdropClick, children}) => {
    //children - rendered content
    //onBackdropClick - control over clicking on the area behind Modal (popup)
    return ReactDOM.createPortal(
        <div onClick={onBackdropClick} id="overlay">
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>

        </div>
    , document.getElementById('modal-root')!); //not a safe option, enforcing that modal-rooot exists
}

export default Modal