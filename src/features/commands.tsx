import type { ReactNode } from 'react';
import CmdLink from '../components/CmdLink';
import type FileSystem from './FileSystem';
import type { DirNode, FsNode } from './FileSystem';
import { profile } from '../content/profile';
import { Neofetch, Contact } from '../components/Neofetch';

export type Tone = 'dim' | 'error' | 'accent';

export interface Ctx {
    fs: FileSystem;
    print: (content: ReactNode, tone?: Tone) => void;
    clear: () => void;
    navigate: (to: string) => void;
    sleep: (ms: number) => Promise<void>;
    powerOff: () => void;
    cmdHistory: string[];
}

export interface Command {
    name: string;
    aliases?: string[];
    usage?: string;
    description: string;
    hidden?: boolean;

    completes?: 'path' | 'dir';
    run: (args: string[], ctx: Ctx) => void | Promise<void>;
}

const joinPath = (base: string, label: string) =>
    base === '' || base === '.' ? label : base.replace(/\/$/, '') + '/' + label;

const shade = (n: number) => n === 0 ? '·' : n > 3 ? '░' : n < 6 ? '▒' : n < 10 ? '▓' : '█';

function treeLines(dir: DirNode, prefix = ''): string[] {
    const visible = dir.children.filter((c) => !c.hidden);
    return visible.flatMap((child, i) => {
        const last = i === visible.length - 1;
        const line = prefix + (last ? '└── ' : '├── ') + child.label + (child.type === 'directory' ? '/' : '');
        return child.type === 'directory'
            ? [line, ...treeLines(child, prefix + (last ? '    ' : '│   '))]
            : [line];
    });
}

function levenshtein(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
        }
    }
    return dp[a.length][b.length];
}

function openPath(path: string | undefined, ctx: Ctx, cmd: string) {
    if (!path) return ctx.print(`${cmd}: missing file operand. Try '${cmd} about.txt'`, 'error');
    const res = ctx.fs.resolve(path);
    if (!res) return ctx.print(`${cmd}: ${path}: No such file or directory`, 'error');
    const { node, parts } = res;
    if (node.type === 'directory') {
        return ctx.print(<>{cmd}: {path}: Is a directory. Try <CmdLink cmd={`cd ${path}`} /></>, 'error');
    }
    if (node.href) {
        window.open(node.href, '_blank', 'noopener');
        return ctx.print(`Opening ${node.label} in a new tab...`, 'dim');
    }
    if (cmd === 'cat' && node.content) {
        ctx.print(node.content.title, 'accent');
        ctx.print(node.content.content.trim());
        return;
    }
    ctx.navigate('/view/' + parts.join('/'));
}

export const commands: Command[] = [
    {
        name: 'help',
        aliases: ['--help'],
        description: 'Show this list.',
        run: (_args, ctx) => {
            const visible = commands.filter((c) => !c.hidden);
            const width = Math.max(...visible.map((c) => (c.usage ?? c.name).length)) + 2;
            ctx.print('Available commands (click any of them):');
            for (const c of visible) {
                const usage = c.usage ?? c.name;
                ctx.print(
                    <>
                        {'  '}<CmdLink cmd={c.name}>{usage}</CmdLink>
                        {' '.repeat(width - usage.length)}<span className="dim">{c.description}</span>
                    </>,
                );
            }
            ctx.print('Tip: Tab autocompletes, ↑/↓ scrolls history. There may be a few hidden ones too.', 'dim');
        },
    },
    {
        name: 'ls',
        usage: 'ls [-a] [path]',
        description: 'List files in a folder.',
        completes: 'dir',
        run: (args, ctx) => {
            const all = args.includes('-a');
            const target = args.find((a) => !a.startsWith('-')) ?? '';
            const res = ctx.fs.resolve(target || '.');
            if (!res) return ctx.print(`ls: cannot access '${target}': No such file or directory`, 'error');
            if (res.node.type === 'file') return ctx.print(res.node.label);
            const entries = res.node.children.filter((c: FsNode) => all || !c.hidden);
            ctx.print(
                <div className="lsRow">
                    {all && <span className="dir">./</span>}
                    {all && <span className="dir">../</span>}
                    {entries.map((c) => {
                        const p = joinPath(target, c.label);
                        return c.type === 'directory' ? (
                            <CmdLink key={c.label} cmd={`cd ${p}`} className="dir">{c.label}/</CmdLink>
                        ) : (
                            <CmdLink key={c.label} cmd={`open ${p}`}>{c.label}</CmdLink>
                        );
                    })}
                </div>,
            );
        },
    },
    {
        name: 'cd',
        usage: 'cd [path]',
        description: 'Change folder. "cd .." goes up, "cd" goes home.',
        completes: 'dir',
        run: (args, ctx) => {
            const err = ctx.fs.cd(args[0]);
            if (err) ctx.print(err, 'error');
        },
    },
    {
        name: 'open',
        usage: 'open [file]',
        description: 'Open a file in the viewer.',
        completes: 'path',
        run: (args, ctx) => openPath(args[0], ctx, 'open'),
    },
    {
        name: 'cat',
        usage: 'cat [file]',
        description: 'Print a file right here in the terminal.',
        completes: 'path',
        run: (args, ctx) => openPath(args[0], ctx, 'cat'),
    },
    {
        name: 'tree',
        description: 'Show every file at once.',
        run: (_args, ctx) => {
            ctx.print('~');
            ctx.print(treeLines(ctx.fs.root).join('\n'));
        },
    },
    {
        name: 'projects',
        description: 'Jump straight to my projects.',
        run: (_args, ctx) => {
            ctx.fs.cd('~/projects');
            commands.find((c) => c.name === 'ls')!.run([], ctx);
        },
    },
    {
        name: 'resume',
        description: 'Open my resume (PDF).',
        run: (_args, ctx) => openPath('~/resume.pdf', ctx, 'open'),
    },
    {
        name: 'contact',
        aliases: ['--contact'],
        description: 'How to reach me.',
        run: (_args, ctx) => ctx.print(<Contact />),
    },
    {
        name: 'neofetch',
        description: 'System info. Well, me info.',
        run: (_args, ctx) => ctx.print(<Neofetch />),
    },
    {
        name: 'whoami',
        description: 'Who am I?',
        run: (_args, ctx) => ctx.print(`${profile.name}: ${profile.tagline}`),
    },
    {
        name: 'sudo',
        usage: 'sudo hire-me',
        description: 'You know you want to.',
        run: async (args, ctx) => {
            if (args.join(' ') !== 'hire-me') {
                return ctx.print(`${profile.user} is not in the sudoers file. This incident will be reported.`, 'error');
            }
            ctx.print('[sudo] password for recruiter: ', 'dim');
            await ctx.sleep(900);
            ctx.print('********', 'dim');
            await ctx.sleep(700);
            ctx.print('Verifying credentials...', 'dim');
            await ctx.sleep(1000);
            ctx.print('Access granted. Excellent decision. Here\'s how to reach me:', 'accent');
            ctx.print(<Contact />);
        },
    },
    {
        name: 'gh',
        aliases: ['github'],
        description: 'Check out the lawn',
        run: async (_args, ctx) => {
            ctx.print('Mowing the lawn...', 'dim');
            let cal;
            try {
                const res = await fetch('/api/contributions');
                cal = await res.json();
                if (!res.ok || !cal.weeks) throw new Error(cal.error ?? `HTTP ${res.status}`);
            } catch (e) {
                return ctx.print(`gh: couldn't reach GitHub (${(e as Error).message})`, 'error');
            }
            const rows = Array.from({ length: 7 }, (_, d) =>
                cal.weeks.map((w: any) => shade(w.contributionDays[d]?.contributionCount ?? 0)).join(''));

            ctx.print(rows.join('\n'));
            ctx.print(`${cal.totalContributions} contributions in the last year`, 'accent'); 
        }
    },
    {
        name: 'clear',
        description: 'Clear the screen (or Ctrl+L).',
        run: (_args, ctx) => ctx.clear(),
    },
    {
        name: 'exit',
        description: 'Power off.',
        run: (_args, ctx) => ctx.powerOff(),
    },

    { name: 'pwd', hidden: true, description: '', run: (_a, ctx) => ctx.print(ctx.fs.pwd()) },
    { name: 'echo', hidden: true, description: '', run: (a, ctx) => ctx.print(a.join(' ')) },
    { name: 'date', hidden: true, description: '', run: (_a, ctx) => ctx.print(new Date().toString()) },
    {
        name: 'history',
        hidden: true,
        description: '',
        run: (_a, ctx) =>
            ctx.print(ctx.cmdHistory.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`).join('\n')),
    },
    {
        name: 'rm',
        hidden: true,
        description: '',
        run: (a, ctx) =>
            ctx.print(a.some((x) => x.includes('r') && x.includes('f')) ? 'Nice try.' : 'rm: Permission denied', 'error'),
    },
    {
        name: 'vim',
        aliases: ['vi', 'nano', 'emacs'],
        hidden: true,
        description: '',
        run: (_a, ctx) => ctx.print("You're in the editor now. Good luck getting out. (hint: :q)", 'dim'),
    },
    {
        name: ':q',
        aliases: [':q!', ':wq', ':x'],
        hidden: true,
        description: '',
        run: (_a, ctx) => ctx.print('You escaped vim. Most people never make it this far.', 'accent'),
    },
];

export function findCommand(name: string): Command | undefined {
    return commands.find((c) => c.name === name || c.aliases?.includes(name));
}

export function suggest(name: string): string | null {
    let best: string | null = null;
    let bestDist = 3;
    for (const c of commands) {
        if (c.hidden) continue;
        const d = levenshtein(name, c.name);
        if (d < bestDist) {
            bestDist = d;
            best = c.name;
        }
    }
    return best;
}
