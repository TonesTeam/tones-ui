import React from "react";
import ModalWrapper from "./ModalWrapper";



interface ProtocolInputs{
    slots: string;
    time: string;
    name: string;
}

export type SetupFunction = (args: ProtocolInputs) => Promise<void>;


interface ProtocolSetupProps {
    onBackdropClick: () => void;
    isVisible: boolean;
    someError?: string; /*error message. Probably will need more*/
    onSetupRequest: SetupFunction; /*calling validation service*/
}

const ProtocolSetup: React.FC<ProtocolSetupProps> = ({onBackdropClick, isVisible, someError, onSetupRequest}) => {
    return(
        <ModalWrapper 
        onBackdropClick={onBackdropClick}
        isVisible={isVisible}
        header="Setup"
        message="Enter info for ?/2 protocols"
        content={
            <>
            <input />
            <input />
            <input />
            <button>Cancel</button>
            <button>Finish</button>
            </>
        } />
    );
}

export default ProtocolSetup