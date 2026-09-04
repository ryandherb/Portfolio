import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"

export default function DocViewer() {
    const { state } = useLocation();
    const { title, content } = state || {};

    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if ((event.ctrlKey && event.key === 'c') || event.key === 'Escape') {
                event.preventDefault();
                navigate("/"); 
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    return (
        <div className="terminalBorder docText">
            <div className="terminalFringe">
                &gt;rherb_portfolio.sh
            </div>
            <div className="terminalBg terminalText">
                <div className="terminalTitle">
                    &gt;{title}
                </div>
                {content}
            </div>

            <span className="terminalFringe">
                Press <b>Ctrl+C</b> or <b>Esc</b> to return to the terminal.
            </span>
        </div>
    )
}