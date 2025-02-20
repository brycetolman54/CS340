// 1. What design principle(s) does this code violate?
//		This violates the Single Responsibility Principle and the idea of Depending on Abstractions, not Concrete Variables. This code for the course goes itself to access the database and change it. It would be better if there were some interface that it interated with in order to do these things, something that kept the need for a specific database from being hardcoded into the course class.
//
// 2. Explain how you would refactor this code to improve its design.
// 		I would crate a new DAO class and make an interface for this Course class that the DAO would need to implement in order that I may use any data base without having to change this Course code.

export class Course {
    name: string;
    credits: number;

    constructor(name: string, credits: number) {
        this.name = name;
        this.credits = credits;
    }

    static async create(name: string, credits: number): Promise<Course> {
        // ... Code to insert a new Course object into the database ...
    }

    static async find(name: string): Promise<Course | undefined> {
        // ... Code to find a Course object in the database ...
    }

    async update(): Promise<void> {
        // ... Code to update a Course object in the database ...
    }
}
