import { MyProxy } from "./array";
// import { MyArray } from "./array";

let rows = 7;
let cols = 4;

// let myArray: MyArray = new MyArray(rows, cols);

// for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < cols; j++) {
//         myArray.set(i, j, parseInt(j.toString() + i.toString()));
//     }
// }

// myArray.save("savedArray2.txt");

// console.log(myArray.toString());

let myArray: MyProxy = new MyProxy("savedArray.txt");

console.log(myArray.toString());

let myArray2: MyProxy = new MyProxy("savedArray2.txt");

myArray2.set(1, 3, 2000);

console.log(myArray2.toString());
