import * as fs from "fs";

interface Array2D {
    set(row: number, col: number, value: number): void;
    get(row: number, col: number): number;
}

export class MyArray implements Array2D {
    private rows: number = 0;
    private cols: number = 0;
    private array: number[][] = [];

    public constructor(rows?: number, cols?: number, fileName?: string) {
        if (!!fileName) {
            this.load(fileName);
            this.rows = this.array.length;
            this.cols = this.array[0].length;
        } else {
            if (!!rows && !!cols) {
                for (let i = 0; i < rows; i++) {
                    this.array.push(new Array(cols));
                }
                this.rows = rows;
                this.cols = cols;
            }
        }
    }
    public save(fileName: string): void {
        let toWrite: string = JSON.stringify(this.array);
        fs.writeFileSync(fileName, toWrite);
    }

    private load(fileName: string): void {
        let fromRead: string = fs.readFileSync(fileName, "utf-8");
        this.array = JSON.parse(fromRead);
    }

    public get(row: number, col: number): number {
        if (row < this.rows && row >= 0 && col < this.cols && col >= 0) {
            return this.array[row][col];
        } else {
            console.log("ERROR: out of bounds");
            return -1;
        }
    }

    public set(row: number, col: number, value: number): void {
        if (row < this.rows && row >= 0 && col < this.cols && col >= 0) {
            this.array[row][col] = value;
        } else {
            console.log("ERROR: out of bounds");
        }
    }

    public toString(): string {
        let arrayString = "";

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arrayString += this.array[i][j];
                arrayString += " ";
            }
            arrayString += "\n";
        }

        return arrayString;
    }
}

export class MyProxy implements Array2D {
    private realArray: any;

    private fileName: string;

    private isLoaded = () => {
        if (!!!this.realArray) {
            this.load(this.fileName);
            console.log("loading");
        }
        return true;
    };

    public constructor(fileName: string) {
        this.fileName = fileName;
    }

    public save(fileName: string) {
        if (this.isLoaded()) {
            this.realArray.save(fileName);
        }
    }

    public load(fileName: string) {
        this.realArray = new MyArray(undefined, undefined, fileName);
    }

    public set(row: number, col: number, value: number): void {
        if (this.isLoaded()) {
            this.realArray.set(row, col, value);
        }
    }

    public get(row: number, col: number): number {
        if (this.isLoaded()) {
            return this.realArray.get(row, col);
        } else {
            return -1;
        }
    }

    public toString() {
        if (this.isLoaded()) {
            return this.realArray.toString();
        }
    }
}
