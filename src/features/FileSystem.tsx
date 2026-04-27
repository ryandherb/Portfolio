import type { ReactNode } from "react";

import Resume from '../documents/Newresume.pdf'


type FileSystemNode = File | Directory;

interface File {
    type: 'file';
    label: string;
    content: string;
}

interface Directory {
    type: 'directory',
    label: string;
    children: FileSystemNode[];
}

export default class FileSystem {
    home: Directory = {
        type: 'directory',
        label: 'home',
        children: [
            { type: 'file', label: 'resume.txt', content: Resume },
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

    open = (file: string): Window | null => {
        const target = this.fileExists(file); 

        if(target){
            return window.open(target.content)
        }
        return null;
    }
}