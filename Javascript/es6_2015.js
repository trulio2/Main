//==============================================================

console.log("=== Let and Const variables ===")

function testVar() {
  var a = 30
  if (true) {
    var a = 50
    console.log(a) // 50
  }
  console.log(a) // 50
}
testVar()

function testLet() {
  let a = 30
  if (true) {
    let a = 50
    console.log(a) // 50
  }
  console.log(a) // 30
}
testLet()

for (var i = 0; i < 10; i++) {
  console.log(i)
}
console.log(i) // 10

for (let j = 0; j < 10; j++) {
  console.log(j)
}
//console.log(j) // ReferenceError: j is not defined

const colors = []
colors.push("red")
colors.push("blue")

//colors = "green" // TypeError: Assignment to constant variable.

console.log(colors)

//==============================================================

console.log("=== Destructuring assignment ===")

let [a, b] = [1, 2]
let { c, d } = { c: 1, d: 2 }

//==============================================================

console.log("=== Classes and inheritance ===")

class User {
  constructor(username, email, password) {
    this.username = username
    this.email = email
    this.password = password
  }
  register() {
    console.log(this.username + " is now registered")
  }
}

let user1 = new User("user1", "user1@email.com", 123)

user1.register()

class Member extends User {
  constructor(username, email, password, memberPackage) {
    super(username, email, password)
    this.package = memberPackage
  }
  getPackage() {
    console.log(
      this.username + " is subscribed to the " + this.package + " package"
    )
  }
}
let member1 = new Member("member1", "a@a.com", 123, "Standard")

member1.getPackage()
member1.register()

//==============================================================

console.log("=== Template literals ===")

function toUpperCase(str) {
  return str.toUpperCase()
}
let templateName = "Name"
let template = `<h1>Template literal
</h1><p>This is a template literal ${templateName} ${toUpperCase(
  templateName
)}</p>`

console.log(template)

//==============================================================

console.log("=== String features ===")

let newString = "This is a new string"

console.log(newString.startsWith("This"))
console.log(newString.endsWith("string"))
console.log(newString.includes("is"))

//==============================================================

console.log("=== Math & number features ===")

// Hex
console.log(0x1f) // 31

// Binary
console.log(0b11111) // 31

// Octal
console.log(0o37) // 31

console.log(Number.isFinite(3)) // true
console.log(Number.isFinite(Infinity)) // false
console.log(Number.isNaN(NaN)) // true
console.log(Number.isNaN("string")) // false
console.log(Number.isInteger(3)) // true

//==============================================================

console.log("=== Default Params ===")

function greet($greeting = "Hello world") {
  console.log($greeting)
}

greet()

//==============================================================

console.log("=== Spread operator ===")

let args1 = [1, 2, 3]
let args2 = [4, 5, 6]

function test() {
  console.log(args1 + "," + args2)
}
test(...args1, ...args2)

//==============================================================

console.log("=== New data structures ===")

let myArray = [11, 22, 33, 44, 55]
let mySet = new Set(myArray)

mySet.add("100")
mySet.add({ a: 1, b: 2 })
mySet.delete(22)

console.log(mySet, mySet.size)

mySet.forEach(function (val) {
  console.log(val)
})

mySet.clear()
console.log(mySet)

let myMap = new Map([
  ["a1", "Hello"],
  ["b2", "Goodbye"],
])
myMap.set("c3", "Foo")
myMap.delete("a1")
console.log(myMap, myMap.size)

//==============================================================

console.log("=== Generators ===")

function* gen() {
  console.log("Hello")
  yield "Yield 1 Ran.."
  console.log("World")
  yield "Yield 2 Ran.."
  return "Returned.."
}

let g = gen()
let g2 = gen()
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())

for (let val of g2) {
  console.log(val)
}

//==============================================================

console.log("=== Arrow functions ===")

function Prefixer(prefix) {
  this.prefix = prefix
}
Prefixer.prototype.prefixArray = function (arr) {
  console.log(this)
  return arr.map((x) => {
    console.log(this.prefix + x)
  }, this)
}

let pre = new Prefixer("Hello ")
pre.prefixArray(["Name1", "Name2"])

let add = (a, b) => a + b
console.log(add(2, 2))

//==============================================================

console.log("=== Promises & async data ===")

var myPromise = Promise.resolve("myPromise => Foo")
myPromise.then((res) => {
  console.log(res)
})

var newPromise = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(4), 1000)
})

newPromise.then((res) => {
  res += 3
  console.log("newPromise =>", res)
})

function getData(method, url) {
  return new Promise(function (resolve, reject) {
    fetch(url, { method })
      .then((response) => {
        if (response.ok) {
          resolve(response.text())
        } else {
          reject({
            status: response.status,
            statusText: response.statusText,
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
getData("GET", "https://jsonplaceholder.typicode.com/posts")
  .then((data) => {
    let parsedData = JSON.parse(data)
    let output = []
    for (let item of parsedData.splice(0, 2)) {
      output.push(item)
    }
    console.log(output)
  })
  .catch((err) => {
    console.log(err)
  })
