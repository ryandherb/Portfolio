import { useEffect, type ReactNode } from "react";
import "../index.css"
import { Windows95Notepad } from "react-old-icons";

interface DocViewProps {
    toggleDocView: (textElement: ReactNode) => void;
    textElement: ReactNode;
    docTitle: string;
}

export default function DocView({ toggleDocView, textElement, docTitle }: DocViewProps) {

    const handleClose = () => {
        toggleDocView(null);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isExitShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c';

            if (isExitShortcut) {
                toggleDocView(null);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown); 
    }, [toggleDocView]);


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
                        Viewing Document: {docTitle}
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