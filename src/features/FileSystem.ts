import Resume from '../documents/resume1027.pdf';
import { about, experience, degreeAuditPlus, flingboar, nextMove, secret } from '../content/projects';

export interface FileMeta {
    role?: string;
    date?: string;
    stack?: string[];
    links?: { label: string; url: string }[];
    status?: string;
}

export interface FileContents {
    title: string;
    summary?: string;
    content: string;
    meta?: FileMeta;
}

export interface FileNode {
    type: 'file';
    label: string;
    href?: string;
    content?: FileContents;
    hidden?: boolean;
}

export interface DirNode {
    type: 'directory';
    label: string;
    children: FsNode[];
    hidden?: boolean;
}

export type FsNode = FileNode | DirNode;

export interface Resolved {
    node: FsNode;
    parts: string[];
}

export const HOME_PATH = '/home/rherber';

const home: DirNode = {
    type: 'directory',
    label: '~',
    children: [
        { type: 'file', label: 'about.txt', content: about },
        { type: 'file', label: 'experience.txt', content: experience },
        { type: 'file', label: 'resume.pdf', href: Resume },
        {
            type: 'directory',
            label: 'projects',
            children: [
                { type: 'file', label: 'flingboar.txt', content: flingboar },
                { type: 'file', label: 'nisd_hacks.txt', content: degreeAuditPlus },
                { type: 'file', label: 'hoop_finder.txt', content: nextMove },
            ],
        },
        { type: 'file', label: '.secret', content: secret, hidden: true },
    ],
};

export default class FileSystem {
    root: DirNode = home;
    cwd: string[] = [];

    /** Turns a path into its parts, relative to cwd unless it starts with ~ or /. */
    normalize = (path = ''): string[] => {
        const parts = path.startsWith('~') || path.startsWith('/') ? [] : [...this.cwd];
        for (const seg of path.split('/')) {
            if (seg === '' || seg === '.' || seg === '~') continue;
            if (seg === '..') parts.pop();
            else parts.push(seg);
        }
        return parts;
    };

    nodeAt = (parts: string[]): FsNode | null => {
        let node: FsNode = this.root;
        for (const part of parts) {
            if (node.type !== 'directory') return null;
            const next: FsNode | undefined = node.children.find((c) => c.label === part);
            if (!next) return null;
            node = next;
        }
        return node;
    };

    resolve = (path?: string): Resolved | null => {
        const parts = this.normalize(path);
        const node = this.nodeAt(parts);
        return node ? { node, parts } : null;
    };

    /** Returns an error message, or null on success. */
    cd = (path?: string): string | null => {
        const res = this.resolve(path ?? '~');
        if (!res) return `cd: no such file or directory: ${path}`;
        if (res.node.type !== 'directory') return `cd: not a directory: ${path}`;
        this.cwd = res.parts;
        return null;
    };

    cwdLabel = (): string => (this.cwd.length ? '~/' + this.cwd.join('/') : '~');

    pwd = (): string => HOME_PATH + (this.cwd.length ? '/' + this.cwd.join('/') : '');

    /** Tab-completion candidates for a partial path. Directories end in "/". */
    complete = (partial: string, dirsOnly = false): string[] => {
        const slash = partial.lastIndexOf('/');
        const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : '';
        const base = slash >= 0 ? partial.slice(slash + 1) : partial;
        const dir = this.resolve(dirPart || '.');
        if (!dir || dir.node.type !== 'directory') return [];
        return dir.node.children
            .filter((c) => c.label.startsWith(base))
            .filter((c) => !c.hidden || base.startsWith('.'))
            .filter((c) => !dirsOnly || c.type === 'directory')
            .map((c) => dirPart + c.label + (c.type === 'directory' ? '/' : ''));
    };
}

/** Shared instance so the cwd survives trips to the document viewer. */
export const fs = new FileSystem();
