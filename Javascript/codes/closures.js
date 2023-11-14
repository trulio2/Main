/*
    Closure are functions that have access to the outer function's variables
*/

const privateCounter = () => {
  let count = 0

  return {
    increment: (val = 1) => {
      count += val
    },
    getValue: () => {
      return count
    },
  }
}

const counter1 = privateCounter()
const counter2 = privateCounter()

counter1.increment()
counter1.increment()

console.log(counter1.getValue()) // 2
console.log(counter2.getValue()) // 0

const privateSecret = () => {
  const secret = 'secret'

  return () => secret
}

const getSecret = privateSecret()
console.log(getSecret()) // secret
