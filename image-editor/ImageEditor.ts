// imports
import { argv, exit } from 'node:process'
import { readFileSync, writeFileSync } from 'node:fs';


// create classes
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

class Image {
    private pixels: Color[][]

    constructor(width: number, height: number) {
        this.pixels = Array.from({length: width}, () => Array.from({length: height}, () => new Color()))
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



// create functions
let usage = () => {
    console.log('USAGE: npm run start <inputFile> <outputFile> <grayscale|invert|emboss|motionblur> {motion-blur-length}')
    exit()
}

let read = (filePath: string): Image => {
    
    // read file into an array
    const stringData: string = readFileSync(filePath, "utf8")
    const data: string[] = stringData.split(/\s+/)
    
    // create Image object
    let width: number = Number(data[1])
    let height: number = Number(data[2])
    if(Number.isNaN(width) || Number.isNaN(height)) {
        console.log("ERROR: file format is incorrect")
        exit()
    }
    let image: Image = new Image(width, height)

    // get the actual pixel values
    let numData: number[] = []
    for(let x = 0; x < 3 * height * width; ++x) {
        let num: number = Number(data[4 + x])
        if(Number.isNaN(num)) {
            console.log("ERROR: file format is incorrect")
            exit()
        }
        numData.push(num)
    }

    // Fill in the image array
    for(let y = 0; y < height; ++y) {
        for(let x = 0; x < width; ++x) {
            let color: Color = new Color()
            color.red = numData[3 * (x + y * height)]
            color.green = numData[3 * (x + y * height) + 1]
            color.blue = numData[3 * (x + y * height) + 2]
            image.set(x, y, color)
        }
    }

    return image
}

let write = (image: Image, filePath: string) => {
    let height = image.getHeight()
    let width = image.getWidth()

    // construct the output data
    let outputData: string = ""
    outputData += "P3\r\n" + String(width) + " " + String(height) + "\r\n255\r\n"
    for(let y = 0; y < height; ++y) {
        for(let x = 0; x < width; ++x) {
            let color: Color = image.get(x, y)
            outputData += (x == 0 ? "" : " ") + String(color.red) + " " + String(color.green) + " " + String(color.blue)
        }
        outputData += "\r\n"
    }

    writeFileSync(filePath, outputData, "utf8")
}

let grayscale = (image: Image) => {
    for(let x = 0; x < image.getWidth(); ++x) {
        for(let y = 0; y < image.getHeight(); ++y) {
            let curColor: Color = image.get(x, y)

            let grayLevel: number = Math.floor((curColor.red + curColor.green + curColor.blue) / 3)
            grayLevel = Math.max(0, Math.min(grayLevel, 255))

            curColor.red = grayLevel
            curColor.green = grayLevel
            curColor.blue = grayLevel
        }
    }
}

let invert = (image: Image) => {
    for(let x = 0; x < image.getWidth(); ++x) {
        for(let y = 0; y < image.getHeight(); ++y) {
            let curColor: Color = image.get(x, y)

            curColor.red = 255 - curColor.red
            curColor.green = 255 - curColor.green
            curColor.blue = 255 - curColor.blue
        }
    }
}

let emboss = (image: Image) => {
    for(let x = 0; x < image.getWidth(); ++x) {
        for(let y = 0; y< image.getHeight(); ++y) {
            let curColor: Color = image.get(x, y)

            let diff: number = 0
            if(x > 0 && y > 0) {
                let upLeftColor: Color = image.get(x - 1, y - 1)
                if(Math.abs(curColor.red - upLeftColor.red) > Math.abs(diff)) {
                    diff = curColor.red - upLeftColor.red
                }
                if(Math.abs(curColor.green - upLeftColor.green) > Math.abs(diff)) {
                    diff = curColor.green - upLeftColor.green
                }
                if(Math.abs(curColor.blue = upLeftColor.blue) > Math.abs(diff)) {
                    diff = curColor.blue - upLeftColor.blue
                }

                let grayLevel: number = 128 + diff
                grayLevel = Math.max(0, Math.min(grayLevel, 255))

                curColor.red = grayLevel
                curColor.green = grayLevel
                curColor.blue = grayLevel
            }
        }
    }
}

let motionblur = (image: Image, length: number) => {
    if(length < 1) {
        return
    }
    for(let x = 0; x < image.getWidth(); ++x) {
        for(let y = 0; y < image.getHeight(); ++y) {
            let curColor: Color = image.get(x, y)

            let maxX: number = Math.min(image.getWidth() - 1, x + length - 1)
            for(let i = x + 1; i <= maxX; ++i) {
                let tmpColor: Color = image.get(i, y);
                curColor.red += tmpColor.red
                curColor.green += tmpColor.green
                curColor.blue += tmpColor.blue
            }

            let delta: number = maxX - x + 1
            curColor.red = Math.floor(curColor.red / delta)
            curColor.green = Math.floor(curColor.green / delta)
            curColor.blue = Math.floor(curColor.blue / delta)
        }
    }
}




// run the program
let args: string[] = argv.slice(2)
if(args.length < 3) {
    usage()
}
let inputFile: string = args[0]
let outputFile: string = args[1]
let filter: string = args[2]

let image: Image = read(inputFile)

if(filter === "grayscale") {
    if(args.length != 3) {
        usage()
    }
    grayscale(image)
}
else if(filter === "invert") {
    if(args.length != 3) {
        usage()
    }
    invert(image)
}
else if(filter === "emboss") {
    if(args.length != 3) {
        usage()
    }
    emboss(image)
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

    motionblur(image, length)
}
else {
    usage()
}

write(image, outputFile)









