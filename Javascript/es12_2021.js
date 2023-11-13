const test = "Hello"
console.log(test.replace("e", "a"))
console.log(test.replaceAll("l", "r"))

///==============================================================

console.log("=== Numeric Separators ===")

const n = 100_000_000
console.log(n)

///==============================================================

console.log("=== Logical Operators ===")

const a = 1
const b = 0

console.log(a && b)
console.log(a || b)
console.log(!a, !b)

function say(message) {
  message ??= "Hello"
  message && console.log(message)
}

say()
say("Hi")

let first = 1
let second = 2
let third = null
console.log(first, second, third)
third ||= 3
console.log(first, second, third)

///==============================================================

console.log("=== WeakRef ===")

let obj = new WeakRef({ a: 1 })
console.log(obj, obj.deref())

///==============================================================

console.log("=== Promises ===")

const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 1")
  }, 1000)
})

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 2")
  }, 1000)
})

const p = Promise.all([promise1, promise2]).then((res) => res)

console.log("p", p)
p.then((res) => console.log("all", res))

///==============================================================

console.log("=== Promise.any ===")

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Promise 1")
  }, 2000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 2")
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 3")
  }, 1000)
})

const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 4")
  }, 2000)
})

const pAny = Promise.any([p1, p2, p3, p4]).then((res) => res)

pAny.then((res) => console.log("any", res))
