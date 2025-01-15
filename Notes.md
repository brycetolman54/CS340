# Contents

1. January 8: [TypeScript Fundamentals](#typescript-fundamentals)
2. January 13: [TypeScript Fundamentals Continued](#typescript-fundamentals-continued)


## Typescript Fundamentals
<!--{-->

- JavaScript doesn't have explicit types and tries to convert as needed.
    - This is very error prone
- TypeScript has explicit types and so catches these errors early
    - You don't actually have to explicitly say the type though, you can make the compiler infer it from the assignment

- Other values:
    - <i>null</i> is a type of object that is not initialized
    - <i>undefined</i> is a value (like int or boolean) that is declared but not assigned

- We can declare something to be multiple types with the `|`
    - i.e. `let myThing: Type1 | Type2 | null = null`

- With numbers:
    - <i>number</i> is all types of numbers
        - We can use `_` to separate big numbers into chunks to help with readability
    - <i>bigint</i> is a bigger number
        - i.e. `let big: bigint = 123456789n`

- <i>enum</i> gives certain values only
    - Each value (regardless of type) gets a value (0, 1, 2,...) with which to be referred

- For objects:
    - We don't need to declare a class
    - We can just declare an object:
        - i.e. `let stock = {sym: 'AAPL', price: 137.23}`
            - The types are inferred here
    - We can always add new variables to the object too
    - If we assign `stock` a different value later, it will only be happy if the same number of values and of the same type are used
        - If we want one value (property) to be optional, we just include `?` after the type name. This means we have to declare the type explicitly

- Aliases:
    - We can use aliases to assign types to keep things compact:

```ts
type Age = number
type Person = {
    name: string
    age: Age
}
let driver: Person {
    name: "James"
    age: 55
}
```

- We can make two types of types:
    - Union: `type OneOrTwoOrBoth = TypeOne | TypeTwo`
        - We can be of TypeOne, of TypeTwo, or Both of them
    - Intersect: `type OneAndTwo = TypeOne & TypeTwo`
        - We have to have something with all attributes from both (except the optionals)
- Tuples:
    - We have to be explicit here, if we aren't, the thing is inferred as an array
        - i.e. `let a: [number, number] = [2, 4]`
    - These are arrays that are a fixed size

- Any (type is `any`):
    - This is to tell TypeScript to back off, that you've got it
    - This is helpful if you are doing something with a library or something that doesn't have TypeScript types
    - Other than something like that, you probably shouldn't use `any` as a type

- Unknown (type is `unknown`):
    - This won't let you do anything until you assign the thing a type
    - Here's how you use it:
        - i.e. `if (typeof value === 'number') {let n = (value as number);}`

- Object (type is `object`):
    - This is not like the JavaScript `Object`, it is just anything that is non-primitive:
        - Object
        - Array
        - etc.

<!--}-->

## TypeScript Fundamentals Continued
<!--{-->

- Different function declarations:
    - `function greet1(param: type, param: type): returnType {function block;}`
    - `let greet2 = function(param: type, param: type): returnType {function block;}`
    - `let greet3 = (param: type, param: type): returnType => {function code;}`
    - `let greet4 = (param: type, param: type): returnType => function code` -> If there is only one line of code, you can do it here without a return or {}
- All of these are called the same way: `greet#(val, val)`

- We can use optional parameters: (at any place in the function declaration)
    - i.e. `function(param1: type, param2?: type, param3: type)`
- We can use default parameters: (only at the end of the declaration)
    - i.e. `function(param1: type, param2: type, param3: type = value)`

- Rest parameters examples:
```ts
# pass in a whole list of things at once
function sumNumbers(...numbers: numbers[]): number {
    return numbers.reduce((total, n) => total + n, 0)
}

# make some things fixed in size, and then take the rest
function buildName(first: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ")
}
```

- Function Types are pretty much the function declaration over again, but just of the types this time
    - i.e. for `function greet(name: string, value: string): string {return 'hello ' + name + ', the number is ' + value}`, the type is `(name: string, value: string) => string`
- 

<!--}-->

## Default
<!--{-->

- 

<!--}-->
