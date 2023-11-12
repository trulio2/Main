# Object-Oriented Programming (OOP) in TypeScript

Object-Oriented Programming (OOP) in TypeScript is a programming paradigm that uses "objects" and their interactions to design and program applications. TypeScript, being a superset of JavaScript, enhances the OOP capabilities by adding static typing and other features. Let's delve into the key OOP concepts in TypeScript:

## Classes

A class in TypeScript is a blueprint for creating objects. A class encapsulates data for the object and methods to manipulate that data.

```typescript
class Car {
    constructor(public make: string, public model: string) {}
}
```

Here, Car is a class with a constructor that initializes the make and model properties.

Objects: An instance of a class is called an object. It's created using the new keyword.

```typescript
let myCar = new Car('Toyota', 'Corolla');
```

myCar is an object of the Car class.

## Encapsulation

This principle of OOP is about bundling the data and the methods that operate on the data within one unit, i.e., class. It also restricts direct access to some of an object's components, which is a means of preventing accidental interference and misuse of the methods and data.

TypeScript supports encapsulation by using access modifiers: public, private, and protected.

```typescript
class Employee {
    private salary: number;

    constructor(salary: number) { 
        this.salary = salary;
    }
}
```

Here, salary is a private property, not accessible outside of its class.

## Inheritance

This is a mechanism where a new class is derived from an existing class. The new class (derived class) inherits the properties and behavior of the existing class (base class) and can have additional characteristics.

```typescript
class Vehicle {
    constructor(public make: string) {}
}

class Bike extends Vehicle {
    constructor(make: string, public type: string) {
        super(make);
    }
}
```

Here, Bike is derived from Vehicle and includes all properties and methods of Vehicle, along with its own properties.

## Polymorphism

Polymorphism allows objects of different classes to be treated as objects of a common superclass. The most common use of polymorphism in OOP occurs when a parent class reference is used to refer to a child class object.

```typescript
class Animal {
    makeSound() {}
}

class Dog extends Animal {
    makeSound() {
        console.log('Bark');
    }
}
```

Here, Dog overrides the makeSound method of Animal.

## Abstraction

This concept involves hiding complex implementation details and showing only the necessary features of the object. In TypeScript, abstraction can be achieved using abstract classes and interfaces.

```typescript
abstract class Shape {
    abstract draw(): void;
}

class Circle extends Shape {
    draw() {
        console.log('Drawing a circle');
    }
}
```

Shape is an abstract class that provides a base for Circle to build upon.

## Interfaces

Interfaces in TypeScript are used to define the structure of objects without implementing the details. They are often used for type-checking and defining contracts within your code.

```typescript
interface IShape {
    draw(): void;
}

class Rectangle implements IShape {
    draw() {
        console.log('Drawing a rectangle');
    }
}
```

Here, Rectangle implements the IShape interface.

## Composition

This is an alternative to inheritance. Composition involves constructing complex objects by combining simpler, smaller objects, potentially of different types.

```typescript
class Engine {
    start() {}
}

class Car {
    private engine: Engine;

    constructor() {
        this.engine = new Engine();
    }
}
```

In this example, Car is composed of an Engine.

These concepts are foundational in TypeScript's approach to OOP, allowing developers to write more structured, maintainable, and reusable code. Understanding these concepts is crucial for effective programming in TypeScript, especially in large-scale applications.

## Interfaces and Abstract Classes

In TypeScript, interfaces and abstract classes are two fundamental concepts used to define the structure and behavior of objects.

### Interface

An interface in TypeScript is a way to define the structure of an object. It can include properties an method signatures, but not their implementations.

Usage

- Interfaces are primarily used to type-check whether an object fits a certain structure.
- They are used to define custom types without creating classes.

Features

- Interfaces can be extended by other interfaces.
- They can describe function types and indexable types (like dictionaries).
- TypeScript interfaces are purely a compile-time construct and don't exist at runtime.

```typescript
interface Person {
  name: string;
  age: number;
  greet(phrase: string): void;
}
```

### Abstract Classes

An abstract class in TypeScript is a base class from which other classes can be derived. Unlike interfaces, they can contain implementation details for its members.

Usage

- Abstract classes are used when you want to provide a common base for multiple derived classes.
- They are ideal when you have shared code that should not be instantiated independently.

Features

- Can include details of methods, constructors, and fields.
- Abstract classes can be extended by other classes.
- They can contain both complete (concrete) and incomplete (abstract) methods.

```typescript
abstract class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract makeSound(): void;
}
```

### Differences between Interfaces and Abstract Classes

Nature

- Interfaces are purely for declarations and cannot contain any implementation.
- Abstract classes can contain implementation details.

Extension vs. Implementation

- An interface is implemented by a class, and a class can implement multiple interfaces.
- A class can extend only one abstract class, but it can extend multiple interfaces.

Constructors

- Interfaces cannot have constructors, whereas abstract classes can have constructors.

Runtime vs. Compile-time

- Interfaces don’t exist in the compiled JavaScript; they are only used by TypeScript at compile-time.
- Abstract classes exist in the compiled JavaScript and can have runtime behavior.

### Choosing between Interfaces and Abstract Classes

Use Interfaces when

- You need to define the shape of an object for type-checking.
- You want to achieve loose coupling.
- You want to describe the structure of APIs or libraries.

Use Abstract Classes when

- You need to provide a common base class with shared code.
- You need to enforce certain class shapes including constructor signatures.
- You want to maintain some internal state or have a more rigid structure.

## Array Methods

### map()

The .map() method creates a new array populated with the results of calling a provided function on every element in the calling array.

```typescript
let newArray = arr.map(callback(currentValue[, index[, array]])[, thisArg]);
```

callback: Function that produces an element of the new Array, taking three arguments:

- currentValue: The current element being processed in the array.
- index (optional): The index of the current element being processed in the array.
- array (optional): The array map was called upon.

thisArg (optional): Value to use as this when executing callback.

```typescript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // Output: [2, 4, 6, 8]
```

### forEach()

The .forEach() method executes a provided function once for each array element.

```typescript
arr.forEach(callback(currentValue [, index [, array]])[, thisArg]);
```

callback: Function to execute on each element, taking three arguments:

- currentValue: The current element being processed in the array.
- index (optional): The index of the current element being processed in the array.
- array (optional): The array forEach was called upon.

thisArg (optional): Value to use as this when executing callback.

```typescript
const numbers = [1, 2, 3, 4];
numbers.forEach(num => console.log(num * 2));
// Output: 2, 4, 6, 8 (each number logged individually)
```

### reduce()

The .reduce() method executes a reducer function on each element of the array, resulting in a single output value.

```typescript
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue]);
```

callback: A function to execute on each element in the array (except for the first, if no initialValue is supplied), taking four arguments:

- accumulator: The accumulator accumulates the callback's return values.
- currentValue: The current element being processed in the array.
- index (optional): The index of the current element being processed in the array.
- array (optional): The array reduce was called upon.

initialValue (optional): A value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used.

```typescript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // Output: 10
```

In this example, the reduce method is used to calculate the sum of all numbers in the array, starting from an initial accumulator value of 0.
