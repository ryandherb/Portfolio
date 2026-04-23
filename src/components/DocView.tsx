import type { ReactNode } from "react";
import "../index.css"
import { Windows95Notepad } from "react-old-icons";

interface DocViewProps {
    toggleDocView: (textElement : ReactNode) => void;
    textElement :ReactNode;
}

export default function DocView({toggleDocView, textElement} : DocViewProps) {

    const handleClose = () => {
        toggleDocView(null); 
    }

    return (
        <div className="modal">
            <div className="modalContent">
                <span className="modalHeader">
                    <div style={{
                        borderWidth: '0px 3px 0px 0px',
                        borderColor: 'black',
                        borderStyle: 'solid',
                        padding: '3px',
                    }}>
                        <div className='modalButton'>
                            <Windows95Notepad size={25} />
                        </div>
                    </div>
                    <div className="docName modalH1">
                        Viewing Document: PLACEHOLDER
                    </div>
                    <div style={{
                        borderWidth: '0px 0px 0px 3px',
                        borderColor: 'black',
                        borderStyle: 'solid',
                        padding: '3px',

                    }}>
                        <button className="modalButton" onClick={handleClose}>
                            X
                        </button>
                    </div>
                </span>
                <div className="modalText">
                    {textElement}
                </div>
            </div >
        </div >
    );
}