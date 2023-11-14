const uniqueArray = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index)
}

const uniqueSet = (arr) => {
  return [...new Set(arr)]
}

const uniqueReduce = (arr) => {
  return arr.reduce((acc, item) => {
    return acc.includes(item) ? acc : [...acc, item]
  }, [])
}
const arr = [1, 2, 3, 1]

console.log('filter', arr, uniqueArray(arr))
console.log('set', arr, uniqueSet(arr))
console.log('reduce', arr, uniqueReduce(arr))
