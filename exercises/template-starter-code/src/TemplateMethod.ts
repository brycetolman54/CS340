import * as fs from "fs";
import * as path from "path";

export abstract class Template {
    protected recurse: boolean;
    protected dirName: string;
    protected fileRegExp: RegExp;
    protected totalCount: number;

    protected constructor(
        dirName: string,
        filePattern: string,
        recurse: boolean
    ) {
        this.recurse = recurse;
        this.dirName = dirName;
        this.fileRegExp = new RegExp(filePattern);
        this.totalCount = 0;
    }

    protected async processDirectory(filePath: string): Promise<void> {
        if (this.isDirectory(filePath)) {
            if (this.isReadable(filePath)) {
                const files = fs.readdirSync(filePath);

                for (let file of files) {
                    const fullPath = path.join(filePath, file);
                    if (this.isFile(fullPath)) {
                        if (this.isReadable(fullPath)) {
                            await this.processFile(fullPath);
                        } else {
                            this.unreadableFile(fullPath);
                        }
                    }
                }

                if (this.recurse) {
                    for (let file of files) {
                        const fullPath = path.join(filePath, file);
                        if (this.isDirectory(fullPath)) {
                            await this.processDirectory(fullPath);
                        }
                    }
                }
            } else {
                this.unreadableDirectory(filePath);
                return;
            }
        } else {
            this.nonDirectory(filePath);
            return;
        }
    }

    protected abstract processFile(filePath: string): void;

    private isDirectory(path: string): boolean {
        try {
            return fs.statSync(path).isDirectory();
        } catch (error) {
            return false;
        }
    }

    private isFile(path: string): boolean {
        try {
            return fs.statSync(path).isFile();
        } catch (error) {
            return false;
        }
    }

    private isReadable(path: string): boolean {
        try {
            fs.accessSync(path, fs.constants.R_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    private nonDirectory(dirName: string): void {
        console.log(`${dirName} is not a directory`);
    }

    private unreadableDirectory(dirName: string): void {
        console.log(`Directory ${dirName} is unreadable`);
    }

    protected unreadableFile(fileName: string): void {
        console.log(`File ${fileName} is unreadable`);
    }
}

export default Template;
