import { useLocation } from "react-router-dom"

export default function DocViewer() {
    const { state } = useLocation();
    const { title, content } = state || {};

    return (
        <div className="terminalBorder">
            {title}
            <div className="terminalBg terminalText">
                {content}
            </div>
        </div>
    )
}