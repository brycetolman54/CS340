// 1. Explain why/how this program violates the Single Responsibility Principle
//      This program violates the SRP as it contains logic for both processing the data that it is given an also outputting that data to the console. Therefore, it has two responsibilities, and it should not.

// 2. Explain how you would refactor the program to improve its design.
// 		I would create another class that I could import here and which would deal with the actual printing of the data from this class rather than including all these console.log statements that I have currently in the code.

export class CsvWriter {
    public write(lines: string[][]) {
        for (let i = 0; i < lines.length; i++) this.writeLine(lines[i]);
    }

    private writeLine(fields: string[]) {
        if (fields.length == 0) console.log();
        else {
            this.writeField(fields[0]);

            for (let i = 1; i < fields.length; i++) {
                console.log(",");
                this.writeField(fields[i]);
            }
            console.log();
        }
    }

    private writeField(field: string) {
        if (field.indexOf(",") != -1 || field.indexOf('"') != -1)
            this.writeQuoted(field);
        else console.log(field);
    }

    private writeQuoted(field: string) {
        console.log('"');
        for (let i = 0; i < field.length; i++) {
            let c: string = field.charAt(i);
            if (c == '"') console.log('""');
            else console.log(c);
        }
        console.log('"');
    }
}
