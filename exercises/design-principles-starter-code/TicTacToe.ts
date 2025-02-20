// This program violates the principles of High-Quality Abstraction, Primitive Obsession, and Information Hiding.
//
// 1. Explain why/how this program violates the above principles.
//		High-Quality Abstraction: The places in the board could be represented individually from the board. Furthermore, the players and winner and such could be represented by their own class, to abstract further.
//		Primitive Obsession: this program uses strings to represent practically everything, which is alright but not great. They could use more classes to represent the different pieces of the game.
//		Information hiding: the methods in the Game class are not given modifiers, and so are visible to any one. They are letting their information be accessed by anything that wants it.
//
// 2. Explain how you would refactor the code to improve its design.
//		High-Quality Abstraction: I would create new classes to represent the board, positions on the board, and players that each have their own functionality associated with the game
//		Primitive obsession: I would create the above classes, moving away from strings being used for everything.
//		Information hiding: I would add qualifiers to the methods and variables of the Game class in order to keep them from being accessible to any code

export class Game {
    board: string[];

    constructor(board: string[], position: number = -1, player: string = "") {
        this.board = [...board];

        if (position >= 0 && player !== "") {
            this.board[position] = player;
        }
    }

    move(player: string): number {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] == "-") {
                let game = this.play(i, player);
                if (game.winner() == player) {
                    return i;
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            if (this.board[i] == "-") {
                return i;
            }
        }
        return -1;
    }

    play(position: number, player: string): Game {
        return new Game(this.board, position, player);
    }

    winner(): string {
        if (
            this.board[0] != "-" &&
            this.board[0] == this.board[1] &&
            this.board[1] == this.board[2]
        ) {
            return this.board[0];
        }
        if (
            this.board[3] != "-" &&
            this.board[3] == this.board[4] &&
            this.board[4] == this.board[5]
        ) {
            return this.board[3];
        }
        if (
            this.board[6] != "-" &&
            this.board[6] == this.board[7] &&
            this.board[7] == this.board[8]
        ) {
            return this.board[6];
        }

        return "-";
    }
}

export class GameTest {
    testDefaultMove() {
        let game = new Game(this.stringToCharArray("XOXOX-OXO"));
        this.assertEquals(5, game.move("X"));

        game = new Game(this.stringToCharArray("XOXOXOOX-"));
        this.assertEquals(8, game.move("O"));

        game = new Game(this.stringToCharArray("---------"));
        this.assertEquals(0, game.move("X"));

        game = new Game(this.stringToCharArray("XXXXXXXXX"));
        this.assertEquals(-1, game.move("X"));
    }

    testFindWinningMove() {
        let game = new Game(this.stringToCharArray("XO-XX-OOX"));
        this.assertEquals(5, game.move("X"));
    }

    testWinConditions() {
        let game = new Game(this.stringToCharArray("---XXX---"));
        this.assertEquals("X", game.winner());
    }

    private assertEquals(expected: string | number, actual: string | number) {
        if (expected !== actual) {
            console.error(`${expected} != ${actual}`);
        }
    }

    private stringToCharArray(str: string): string[] {
        let result: string[] = [];
        for (const char of str) {
            result.push(char);
        }
        return result;
    }
}

// Test Driver

let gameTest = new GameTest();
gameTest.testDefaultMove();
gameTest.testFindWinningMove();
gameTest.testWinConditions();
