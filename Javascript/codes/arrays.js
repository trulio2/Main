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

const names = users.map((user) => user.name)

const activeUsers = users.filter((user) => user.active).map((user) => user.name)

const sortedUsers = users
  .filter((user) => user.active)
  .sort((a, b) => a.age - b.age)
  .map((user) => user.name)

console.log(names, activeUsers, sortedUsers)
