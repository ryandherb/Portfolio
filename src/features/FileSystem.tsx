import Resume from '../documents/Newresume.pdf'


type FileSystemNode = File | Directory;

interface FileContents {
    title: string
    content: string
}

interface File {
    type: 'file';
    label: string;
    href?: string;
    content?: FileContents;
    contentType: string;
}

interface Directory {
    type: 'directory';
    label: string;
    children: FileSystemNode[];
}

export default class FileSystem {
    home: Directory = {
        type: 'directory',
        label: 'home',
        children: [
            { type: 'file', label: 'resume.txt', href: Resume, contentType: 'external' },
            { type: 'file', label: 'test.txt', content: {title: "Test", content: "String"}, contentType: 'native'},
            {
                type: 'directory', label: '/projects', children: [

                ]
            }
        ]
    }

    dir: Directory;

    constructor() {
        this.dir = this.home;
    }

    cd = (file: string): string | null => {
        if (file === "..") {
            this.dir = this.home;
            return "home";
        }

        for (const child of Object.values(this.dir.children)) {
            if (child.label === file && child.type === 'directory') {
                this.dir = child;
                console.log(this.dir);
                return file;
            }
        }
        return null;
    }

    fileExists = (file: string): File | null => {
        for (const child of Object.values(this.dir.children)) {
            if (child.label === file && child.type === 'file') {
                return child;
            }
        }
        return null;
    }

    open = (file: string): FileContents | boolean => {
        const target = this.fileExists(file);

        if (target) {
            if (target.contentType === 'external' ) {
                window.open(target.href);
                return true;
            } else {
                return target.content ? target.content : false;
            }
        }
        return false;
    }
}