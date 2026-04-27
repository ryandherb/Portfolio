import { useCallback, useEffect, useRef, useState} from 'react';
import FileSystem from '../features/FileSystem';
import '../index.css';

const Commands = {
    CLEAR: 'clear',
    LIST: 'ls',
    CD: 'cd',
    OPEN: 'open',
    HELP: '--help',
    CONTACT: '--contact',
    EXIT: 'exit'
} as const

export default function Terminal() {
    const [terminalVal, setTerminalVal] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [terminalIndex, setTerminalIndex] = useState<number>(0);

    const [directory, setDirectory] = useState<string>("home");

    const fsRef = useRef<FileSystem>(new FileSystem());
    const fs = fsRef.current;

    const addHistory = useCallback((message: string) => {
        setHistory((prev) => [...prev, '[rherber@portfolio ' + directory + ' ~]' + message]);
        setTerminalIndex(terminalIndex + 1);
    }, [terminalIndex, directory]);

    const executeCommand = (command: string) => {
        addHistory(command);
        setTerminalVal("");
        const commandList = command.split(" ");

        try {
            switch (commandList[0]) {
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
                case Commands.LIST:
                    for (const child of Object.values(fs.dir.children)) {
                        addHistory(child.label);
                    }
                    break;
                case Commands.OPEN:
                        if(!fs.open(commandList[1])){
                            addHistory("File '" + commandList[1] + "' not found.")
                        }
                        break;
                case Commands.CD:
                    {
                        const res = fs.cd(commandList[1]);
                        if (!res) {
                            addHistory("Directory '" + commandList[1] + "' not found.");
                            break;
                        }
                        if (res === "home") {
                            setDirectory(res);
                            break;
                        }
                        setDirectory((prev) => prev + res);
                        break;
                    }
                case Commands.EXIT:
                    {
                        break;
                    }
                default:
                    addHistory("'" + command + "' is not recognized as a command. Use --help to see a list of commands.");
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleKeyPress = (event: { key: string; }) => {
        if (event.key == 'Enter') {
            executeCommand(terminalVal);
            setTerminalIndex(history.length);
        } else if (event.key == 'ArrowUp') {
            if (terminalIndex >= 0 && history.length > 0) {
                const newTerminalValue = history[terminalIndex].substring(19 + directory.length + 3);
                setTerminalVal(newTerminalValue);
                setTerminalIndex(terminalIndex - 2);
            }
        } else if (event.key == 'ArrowDown') {
            if (terminalIndex < history.length - 4) {
                const newTerminalValue = history[terminalIndex + 4].substring(19 + directory.length + 3);
                setTerminalVal(newTerminalValue);
                setTerminalIndex(terminalIndex + 2);
            } else {
                setTerminalVal("");
            }
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
                await sleep(2000);
            }
            setHistory([]);
        }

        load();
        setTerminalIndex(0);
    }, [addHistory])

    return (
        <>
            <div className="terminalBorder">
                <span className='terminalHeader'>
                    &gt;Ryan Herber's Portfolio
                </span>
                <div className='terminalBg'>
                    <div className='terminalText history'>
                        {history.map((value, index) => {
                            return (
                                <div className='historyEntry' key={index}>
                                    {value}
                                </div>
                            )
                        })}
                    </div>
                    <div className="terminalLine">
                        <span className='terminalText'>
                            {'[rherber@portfolio ' + directory + ' ~]'}
                        </span>
                        <input
                            className='terminalText terminalInput'
                            value={terminalVal}
                            onChange={(e) => setTerminalVal(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}