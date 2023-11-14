/*
    Currying is a technique of evaluating function with multiple arguments,
    into sequence of function with single argument.
*/

const multiply = (a, b) => a * b
console.log(multiply(1, 3)) // 3

const cr = (num1) => {
  return (num2) => {
    return num1 * num2
  }
}
console.log(cr(2)(3)) // 6

const curriedMultiply = (a) => (b) => a * b
console.log(curriedMultiply(3)(3)) // 9

const multiplyBy5 = curriedMultiply(4)
console.log(multiplyBy5(3)) // 12

// Currying with multiple arguments

const curry = function (fn) {
  const arity = fn.length
  return function f1(...args) {
    if (args.length >= arity) {
      return fn(...args)
    } else {
      return function f2(...moreArgs) {
        const newArgs = [...args, ...moreArgs]
        return f1(...newArgs)
      }
    }
  }
}
const curriedSum = curry((a, b, c) => a + b + c)
console.log(curriedSum(6, 6, 3)) // 15

const partial = curriedSum(7) // create a function that already has the first argument
console.log(partial(8, 3)) // 18

console.log(curriedSum(9)(9)(3)) // 21

const get = curry((prop, obj) => obj[prop])
const getId = get('id')
const map = curry((fn, arr) => arr.map(fn))

console.log(map(getId, [{ id: 1 }, { id: 2 }, { id: 3 }])) // [1, 2, 3]

const getIds = map(getId)
console.log(getIds([{ id: 4 }, { id: 5 }, { id: 6 }])) // [1, 2, 3]
