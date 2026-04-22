import { useEffect, useRef, useState } from 'react';
import '../index.css';

const Commands = {
    CLEAR: 'clear',
    LIST: 'ls',
    OPEN: 'open', 
    HELP: '--help',
    CONTACT: '--contact'
} as const

export default function Terminal() {
    const [terminalVal, setTerminalVal] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);

    const addHistory = (message : string) => {
        setHistory((prev) => [...prev, message]);
    }

    const executeCommand = (command: string) => {
        addHistory(command); 
        setTerminalVal("");

        switch(command){
            case Commands.CLEAR:
                setHistory([]);
                break;
            case Commands.CONTACT:
                addHistory("Email me at: ryandherber@gmail.com");
                break;
            case Commands.HELP:
                addHistory("List of commands:")
                addHistory("'clear' - Clears the terminal.")
                addHistory("'ls' - Lists available directories.")
                addHistory("'open [file]' - Open a file in this directory.")
                addHistory("'--contact' - Find out how to contact me.")
                break;
            default:
                addHistory("'" + command + "' is not recognized as a command. Use --help to see a list of commands.");
        }
    }

    const handleSubmit = (event: { key: string; }) => {
        if (event.key == 'Enter') {
            executeCommand(terminalVal);
        }
    }

    const hasRun = useRef(false);

    useEffect(() => {
        const loadMessages = [
            "Initializing hands-on experience...",
            "Fetching programming capabilities...",
            "Loading personal projects...",
            "Hint: Try --help for commands",
            "Entering live environment..."
        ]
        if (hasRun.current) return;
        hasRun.current = true;

        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        const load = async () => {
            for (const message of loadMessages) {
                addHistory(message);
                await sleep(1);
            }
            setHistory([]);
        }

        load();

    }, [])

    return (
        <>
            <div className="terminalBorder">
                <div className='terminalBg'>
                    <div className='terminalText history'>
                        {history.map((value, index) => {
                            return (
                                <div className='historyEntry' key={index}>
                                    {'[rherber@portfolio ~]' + value}
                                </div>
                            )
                        })}
                    </div>
                    <div className="terminalLine">
                        <span className='terminalText'>
                            {'[rherber@portfolio ~]'}
                        </span>
                        <input
                            className='terminalText terminalInput'
                            value={terminalVal}
                            onChange={(e) => setTerminalVal(e.target.value)}
                            onKeyDown={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}