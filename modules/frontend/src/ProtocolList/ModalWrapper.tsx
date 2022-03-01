import React from "react";
import Modal from "./Modal";
import './ModalStyle.css';

interface ModalWrapperProps {
    isVisible: boolean;
    onBackdropClick: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({onBackdropClick, isVisible}) => {
    if(!isVisible){
        return null
    }

    return(<Modal onBackdropClick={onBackdropClick}>
        <div id="popup">
            Header
        </div>
        </Modal>);
}

export default ModalWrapper