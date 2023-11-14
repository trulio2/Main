const arr = [3, 5, 1]
console.log(arr, arr.sort(), arr) // changes the original array

const arr2 = [3, 5, 1]
console.log(arr2, [...arr2].sort(), arr2) // does not change the original array

const books = [
  {
    title: 'Book C',
    author: 'Author C',
  },
  {
    title: 'Book A',
    author: 'Author A',
  },
  {
    title: 'Book B',
    author: 'Author B',
  },
]

console.log(books)
books.sort((a, b) => {
  // changes the original array
  const lastNameA = a.author.split(' ').pop()
  const lastNameB = b.author.split(' ').pop()
  return lastNameA > lastNameB ? 1 : -1
})
console.log(books)
