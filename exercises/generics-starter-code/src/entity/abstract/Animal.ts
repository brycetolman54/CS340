export abstract class Animal {
    name: string;
    trainingPriority: number;

    constructor(name: string, trainingPriority: number) {
        this.trainingPriority = trainingPriority;
        this.name = name;
    }

    static getAnimalsSorted<T extends Animal>(animalList: T[]) {
        return animalList.sort((animal1: T, animal2: T) =>
            animal1.trainingPriority < animal2.trainingPriority ? -1 : 1
        );
    }

    static getAnimalsTrainingPriorityList<T extends Animal>(
        animalList: T[]
    ): string {
        return animalList
            .map(
                (animal) =>
                    animal.name +
                    "'s training priority: " +
                    animal.trainingPriority +
                    "\n"
            )
            .join("");
    }
}
