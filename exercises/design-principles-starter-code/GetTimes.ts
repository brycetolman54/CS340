// 1. What is the biggest design principle violation in the code below.
//		There is serious code duplication here. The same type of thing happens three times in a row, once for each of the props. This should not be. There should be a differnt function that is called in order to do this processing as to avoid the repetitive code.
//		There is also the problem that the errors are being thrown but not necessarily caught
//
// 2. Refactor the code to improve its design.

type Dictionary = {
    [index: string]: string;
};

type Times = {
    interval: number;
    duration: number;
    departure: number;
};

function getValue(
    valueString: string,
    prop: string,
    interval: number = 1
): number {
    if (!valueString) {
        throw new Error(`missing ${prop}`);
    }
    let value = parseInt(valueString);
    if (value <= 0) {
        throw new Error(`${prop} must be > 0`);
    }
    if (value % interval != 0) {
        throw new Error(`${prop} % interval != 0`);
    }
    return value;
}

function getTimes(props: Dictionary): Times {
    let interval = 0;
    let duration = 0;
    let departure = 0;

    try {
        interval = getValue(props["interval"], "interval");
        duration = getValue(props["duration"], "duration", interval);
        departure = getValue(props["departure"], "departure", interval);
    } catch (error) {
        console.log(`Error: ${error}`);
    }

    return { interval, duration, departure };
}
