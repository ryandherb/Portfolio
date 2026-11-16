import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { fs } from '../features/FileSystem';
import { commands, findCommand, suggest, type Ctx, type Tone } from '../features/commands';
import { Welcome } from './Neofetch';
import { RunContext } from '../features/runContext';
import CmdLink from './CmdLink';
import '../index.css';

type Entry =
    | { id: number; kind: 'input'; cwd: string; text: string }
    | { id: number; kind: 'output'; content: ReactNode; tone?: Tone };

const session = {
    history: [] as Entry[],
    cmdHistory: [] as string[],
    nextId: 0,
    started: false,
};

const welcomeEntry = (): Entry => ({ id: session.nextId++, kind: 'output', content: <Welcome /> });

const BOOT_KEY = 'rherb_booted';
const BOOT_MESSAGES = [
    'Initializing hands-on experience...',
    'Fetching programming capabilities...',
    'Loading personal projects...',
    'Hint: Try help for commands',
    'Entering live environment...',
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function Prompt({ cwd }: { cwd: string }) {
    return <span className="prompt">{`[rherber@portfolio ${cwd}]$`}</span>;
}

function commonPrefix(items: string[]): string {
    if (!items.length) return '';
    let prefix = items[0];
    for (const s of items) while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
    return prefix;
}

export default function Terminal() {
    const [booting, setBooting] = useState(() => !sessionStorage.getItem(BOOT_KEY));
    const [history, setHistory] = useState<Entry[]>(() =>
        booting || session.started ? session.history : [welcomeEntry()],
    );
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState(fs.cwdLabel());
    const [histIndex, setHistIndex] = useState<number | null>(null);
    const [poweredOff, setPoweredOff] = useState(false);
    const [crtOn] = useState(() => !session.started);
    const [busy, setBusy] = useState(false);
    const [lastTab, setLastTab] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const screenRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        session.history = history;
        if (!booting) session.started = true;
    }, [history, booting]);

    useEffect(() => {
        const el = screenRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [history, booting]);

    const print = useCallback((content: ReactNode, tone?: Tone) => {
        setHistory((prev) => [...prev, { id: session.nextId++, kind: 'output', content, tone }]);
    }, []);

    const clear = useCallback(() => setHistory([]), []);

    useEffect(() => {
        if (!booting) return;
        let cancelled = false;
        const finish = () => {
            if (cancelled) return;
            cancelled = true;
            sessionStorage.setItem(BOOT_KEY, '1');
            setHistory([welcomeEntry()]);
            setBooting(false);
        };
        const skip = (e: Event) => {
            if (e instanceof globalThis.KeyboardEvent && (e.ctrlKey || e.metaKey || e.altKey)) return;
            finish();
        };
        window.addEventListener('keydown', skip);
        window.addEventListener('pointerdown', skip);

        (async () => {
            await sleep(300);
            for (const msg of BOOT_MESSAGES) {
                if (cancelled) return;
                print(msg);
                await sleep(1200);
            }
            finish();
        })();

        return () => {
            cancelled = true;
            window.removeEventListener('keydown', skip);
            window.removeEventListener('pointerdown', skip);
        };
    }, [booting, print]);

    useEffect(() => {
        if (!poweredOff) return;
        const reboot = () => {
            sessionStorage.removeItem(BOOT_KEY);
            session.cmdHistory = [];
            fs.cd('~');
            setCwd(fs.cwdLabel());
            setHistory([]);
            setPoweredOff(false);
            setBooting(true);
        };

        const t = setTimeout(() => {
            window.addEventListener('keydown', reboot, { once: true });
            window.addEventListener('pointerdown', reboot, { once: true });
        }, 800);
        return () => {
            clearTimeout(t);
            window.removeEventListener('keydown', reboot);
            window.removeEventListener('pointerdown', reboot);
        };
    }, [poweredOff]);

    useEffect(() => {
        if (!booting && !poweredOff && !busy) inputRef.current?.focus();
    }, [booting, poweredOff, busy]);

    const execute = async (raw: string) => {
        const text = raw.trim();
        const here = fs.cwdLabel();
        setHistory((prev) => [...prev, { id: session.nextId++, kind: 'input', cwd: here, text: raw }]);
        setInput('');
        setHistIndex(null);
        setLastTab('');
        if (!text) return;

        session.cmdHistory = [...session.cmdHistory, text];
        const [name, ...args] = text.split(/\s+/);
        const command = findCommand(name);

        if (!command) {
            const guess = suggest(name);
            print(
                <>
                    {`${name}: command not found.`}
                    {guess ? <> Did you mean <CmdLink cmd={guess} />?</> : <> Try <CmdLink cmd="help" />.</>}
                </>,
                'error',
            );
            return;
        }

        const ctx: Ctx = {
            fs,
            print,
            clear,
            navigate,
            sleep,
            powerOff: () => setPoweredOff(true),
            cmdHistory: session.cmdHistory,
        };

        try {
            const result = command.run(args, ctx);
            if (result instanceof Promise) {
                setBusy(true);
                await result;
            }
        } catch (err) {
            console.error(err);
            print(`${name}: something went wrong`, 'error');
        } finally {
            setBusy(false);
            setCwd(fs.cwdLabel());
        }
    };

    const runFromClick = (cmd: string) => {
        if (busy || booting || poweredOff) return;
        execute(cmd);
        inputRef.current?.focus();
    };

    const complete = () => {
        const endsWithSpace = /\s$/.test(input);
        const tokens = input.split(/\s+/);
        if (endsWithSpace) tokens.push('');
        const partial = tokens[tokens.length - 1];

        let matches: string[];
        if (tokens.length === 1) {
            matches = commands.filter((c) => !c.hidden && c.name.startsWith(partial)).map((c) => c.name + ' ');
        } else {
            const cmd = findCommand(tokens[0]);
            if (!cmd?.completes) return;
            matches = fs.complete(partial, cmd.completes === 'dir').map((m) => (m.endsWith('/') ? m : m + ' '));
        }
        if (!matches.length) return;

        const before = tokens.slice(0, -1).join(' ') + (tokens.length > 1 ? ' ' : '');
        if (matches.length === 1) {
            setInput(before + matches[0]);
            setLastTab('');
            return;
        }
        const prefix = commonPrefix(matches);
        if (prefix.length > partial.length) {
            setInput(before + prefix);
        } else if (lastTab === input) {
            const here = fs.cwdLabel();
            setHistory((prev) => [...prev, { id: session.nextId++, kind: 'input', cwd: here, text: input }]);
            print(matches.map((m) => m.trim().split('/').filter(Boolean).pop() + (m.endsWith('/') ? '/' : '')).join('   '));
        }
        setLastTab(input);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const cmds = session.cmdHistory;
        if (e.key === 'Enter') {
            execute(input);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!cmds.length) return;
            const next = histIndex === null ? cmds.length - 1 : Math.max(0, histIndex - 1);
            setHistIndex(next);
            setInput(cmds[next]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIndex === null) return;
            const next = histIndex + 1;
            if (next >= cmds.length) {
                setHistIndex(null);
                setInput('');
            } else {
                setHistIndex(next);
                setInput(cmds[next]);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            complete();
        } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            clear();
        } else if (e.ctrlKey && e.key.toLowerCase() === 'c' && !window.getSelection()?.toString()) {
            e.preventDefault();
            const here = fs.cwdLabel();
            setHistory((prev) => [...prev, { id: session.nextId++, kind: 'input', cwd: here, text: input + '^C' }]);
            setInput('');
            setHistIndex(null);
        }
    };

    const focusInput = () => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
    };

    return (
        <RunContext.Provider value={runFromClick}>
            <div className={'terminalBorder' + (crtOn ? ' crtOn' : '') + (poweredOff ? ' crtOff' : '')}>
                <span className="terminalFringe">&gt;rherb_portfolio.sh</span>
                <div className="screen">
                <div className="terminalBg" ref={screenRef} onClick={focusInput}>
                    <div className="terminalText history">
                        {history.map((entry) =>
                            entry.kind === 'input' ? (
                                <div className="historyEntry" key={entry.id}>
                                    <Prompt cwd={entry.cwd} /> {entry.text}
                                </div>
                            ) : (
                                <div className={'historyEntry ' + (entry.tone ?? '')} key={entry.id}>
                                    {entry.content}
                                </div>
                            ),
                        )}
                    </div>
                    {booting ? (
                        <div className="terminalText dim bootSkip">press any key to skip<span className="blink">_</span></div>
                    ) : (
                        <div className="terminalLine" style={{ visibility: busy ? 'hidden' : 'visible' }}>
                            <span className="terminalText">
                                <Prompt cwd={cwd} />
                            </span>
                            <input
                                ref={inputRef}
                                className="terminalText terminalInput"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={busy || poweredOff}
                                aria-label="Terminal input"
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                autoFocus
                            />
                        </div>
                    )}
                </div>
                </div>
                <div className="terminalFringe quickBar">
                    <span className="dim">quick:</span>
                    {['help', 'ls', 'projects', 'resume', 'contact'].map((c) => (
                        <CmdLink key={c} cmd={c}>[{c}]</CmdLink>
                    ))}
                </div>
            </div>
            {poweredOff && <div className="rebootHint terminalText">press any key to reboot</div>}
        </RunContext.Provider>
    );
}
