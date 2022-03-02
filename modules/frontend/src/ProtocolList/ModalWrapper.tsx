import React, { ReactNode } from "react";
import Modal from "./Modal";
import './ModalStyle.css';

interface ModalWrapperProps {
    isVisible: boolean;
    onBackdropClick: () => void;
    header: string;
    message?: string;
    content?: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({onBackdropClick, isVisible, header, message, content}) => {
    if(!isVisible){
        return null
    }

    return(<Modal onBackdropClick={onBackdropClick}>
        <div id="popup">
            <div className="close-btn-pp" onClick={onBackdropClick}>
                <span className = "close">&times;</span>
            </div>
            {header}
            {message && <div id="message">{message}</div>}
            {content}
        </div>
        </Modal>);
}

export default ModalWrapper