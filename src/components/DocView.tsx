import "../index.css"
import { Windows95Notepad } from "react-old-icons";

export default function DocView() {

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
                        <button className="modalButton">
                            X
                        </button>
                    </div>
                </span>
                <div className="docContent">
                    This is the content of the document. This content would be displayed in the document. There wolud be cool formatting stuff with italics and whatnot. The main goal would be for this to be readable, as well as fitting the theme of the webpage.
                </div>
            </div >
        </div >
    );
}