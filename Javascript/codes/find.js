const users = [
  {
    id: 1,
    name: 'Name 1',
    active: true,
    age: 4,
  },
  {
    id: 2,
    name: 'Name 2',
    active: false,
    age: 3,
  },
  {
    id: 3,
    name: 'Name 3',
    active: true,
    age: 2,
  },
  {
    id: 4,
    name: 'Name 4',
    active: false,
    age: 1,
  },
]

const checkIfNameExists = (arr, name) => arr.some((item) => item.name === name)
console.log(checkIfNameExists(users, 'Name 1')) // true

const returnIfNameExists = (arr, name) => arr.find((item) => item.name === name)
console.log(returnIfNameExists(users, 'Name 1')) // element or undefined if not found

const findIndexByName = (arr, name) =>
  arr.findIndex((item) => item.name === name)
console.log(findIndexByName(users, 'Name 1')) // index number or -1 if not found
