import CmdLink from './CmdLink';
import { profile } from '../content/profile';


const ASCII = String.raw` ____  _   _
|  _ \| | | |
| |_) | |_| |
|  _ <|  _  |
|_| \_\_| |_|`;

const startTime = Date.now();

function uptime() {
    const s = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(s / 60);
    return m ? `${m} min, ${s % 60} sec` : `${s} sec`;
}

export function Neofetch() {
    const header = `${profile.user}@portfolio`;
    return (
        <div className="neofetch">
            <pre className="neofetchArt">{ASCII}</pre>
            <div className="neofetchInfo">
                <div className="accent">{header}</div>
                <div className="dim">{'-'.repeat(header.length)}</div>
                <div><span className="accent">OS</span>: Portfolio Linux (React 19)</div>
                {profile.neofetch.map((row) => (
                    <div key={row.label}>
                        <span className="accent">{row.label}</span>: {row.value}
                    </div>
                ))}
                <div><span className="accent">Uptime</span>: {uptime()}</div>
            </div>
        </div>
    );
}

export function Welcome() {
    return (
        <>
            <Neofetch />
            <div className="dim">
                {'\n'}New here? Click or type: <CmdLink cmd="help" /> · <CmdLink cmd="ls" /> ·{' '}
                <CmdLink cmd="open about.txt" /> · <CmdLink cmd="resume" />
            </div>
        </>
    );
}

export function Contact() {
    return (
        <div>
            email{'    '}<a className="termAnchor" href={`mailto:${profile.email}`}>{profile.email}</a>
            {profile.links.map((l) => (
                <div key={l.label}>
                    {l.label.padEnd(9)}
                    <a className="termAnchor" href={l.url} target="_blank" rel="noreferrer">{l.url}</a>
                </div>
            ))}
        </div>
    );
}
