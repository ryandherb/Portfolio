import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fs } from '../features/FileSystem';

const isTodo = (v?: string) => !v || v.startsWith('TODO');

export default function DocViewer() {
    const path = useParams()['*'] ?? '';
    const node = fs.resolve('~/' + path)?.node;
    const file = node?.type === 'file' ? node : null;
    const doc = file?.content;
    const navigate = useNavigate();

    useEffect(() => {
        document.title = file ? `${file.label} — rherber@portfolio` : 'rherber@portfolio:~';
        const handleKeyPress = (event: KeyboardEvent) => {
            if ((event.ctrlKey && event.key === 'c' && !window.getSelection()?.toString()) || event.key === 'Escape' || event.key === 'q') {
                event.preventDefault();
                navigate('/');
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            document.title = 'rherber@portfolio:~';
        };
    }, [navigate, file]);

    const meta = doc?.meta;
    const stack = meta?.stack?.filter(Boolean) ?? [];
    const links = meta?.links ?? [];

    return (
        <div className="terminalBorder docText">
            <div className="terminalFringe">&gt;rherb_portfolio.sh — less {path || '?'}</div>
            <div className="screen">
            <div className="terminalBg terminalText">
                {!file ? (
                    <>
                        <div className="terminalTitle">&gt;404</div>
                        <div className="error">less: {path || '(nothing)'}: No such file or directory</div>
                    </>
                ) : !doc ? (
                    <>
                        <div className="terminalTitle">&gt;{file.label}</div>
                        <div>
                            This one's a binary file.{' '}
                            {file.href && <a className="termAnchor" href={file.href} target="_blank" rel="noreferrer">Open it in a new tab</a>}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="terminalTitle">&gt;{doc.title}</div>
                        <div className="manSection">NAME</div>
                        <div className="manBody">
                            {file.label.replace(/\.\w+$/, '')}{doc.summary && !isTodo(doc.summary) ? ` - ${doc.summary}` : ''}
                        </div>
                        {(!isTodo(meta?.role) || !isTodo(meta?.date)) && (
                            <>
                                <div className="manSection">ROLE</div>
                                <div className="manBody">
                                    {[meta?.role, meta?.date].filter((v) => !isTodo(v)).join('  ·  ')}
                                </div>
                            </>
                        )}
                        {stack.length > 0 && (
                            <>
                                <div className="manSection">STACK</div>
                                <div className="manBody">{stack.join(', ')}</div>
                            </>
                        )}
                        {links.length > 0 && (
                            <>
                                <div className="manSection">LINKS</div>
                                <div className="manBody">
                                    {links.map((l) => (
                                        <div key={l.url}>
                                            {l.label.padEnd(10)}
                                            <a className="termAnchor" href={l.url} target="_blank" rel="noreferrer">{l.url}</a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="manSection">DESCRIPTION</div>
                        <div className="manBody">{doc.content.trim()}</div>
                    </>
                )}
            </div>
            </div>

            <div className="terminalFringe">
                Press <b>Ctrl+C</b>, <b>Esc</b> or <b>q</b> to return to the terminal.{' '}
                <button type="button" className="termLink" onClick={() => navigate('/')}>[q] back</button>
            </div>
        </div>
    );
}
