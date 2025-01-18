import { argv, exit } from 'node:process'
import { readFileSync } from 'node:fs';

class Image {
    private pixels: Color[][]

    constructor(width: number, height: number) {
        this.pixels = Color[width][height]
    }

    public getWidth(): number {
        return this.pixels.length
    }

    public getHeight(): number {
        return this.pixels[0].length
    }

    public set(x: number, y: number, c: Color) {
        this.pixels[x][y] = c
    }

    public get(x: number, y: number): Color {
        return this.pixels[x][y]
    }
}

class Color {
    public red: number
    public green: number
    public blue: number

    constructor() {
        this.red = 0
        this.green = 0
        this.blue = 0
    }
}

let usage = () => {
    console.log('USAGE: npm run start <inputFile> <outputFile> <grayscale|invert|emboss|motionblur> {motion-blur-length}')
    exit()
}

let grayscale = () => {console.log("grayscale")}
let invert = () => {console.log("invert")}
let emboss = () => {console.log("emboss")}
let motionblur = () => {console.log("motion blur")}

// Check the args
let args: String[] = argv.slice(2)
if(args.length < 3) {
    usage()
}
let inputFile: String = args[0]
let outputFile: String = args[1]
let filter: String = args[2]

// TODO: make the image

// Do the correct transformation
if(filter === "grayscale") {
    if(args.length != 3) {
        usage()
    }
    grayscale()
}
else if(filter === "invert") {
    if(args.length != 3) {
        usage()
    }
    invert()
}
else if(filter === "emboss") {
    if(args.length != 3) {
        usage()
    }
    emboss()
}
else if(filter === "motionblur") {
    if(args.length != 4) {
        usage()
    }

    let length: number = Number(args[3])
    if(Number.isNaN(length)) {
        usage()
    }

    if(length < 0) {
        usage()
    }

    motionblur()
}
else {
    usage()
}











