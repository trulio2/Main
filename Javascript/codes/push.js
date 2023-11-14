const pushAppend = (arr, item) => {
  // modify the original array
  arr.push(item)
  return arr
}
const arr = [1, 2, 3]
const newArr = pushAppend(arr, 4)
console.log(arr, newArr)

const append = (arr, item) => {
  // create a new array
  return [...arr, item]
}
const arr2 = [5, 6, 7]
const newArr2 = append(arr2, 8)
console.log(arr2, newArr2)

const pushAppendObj = (obj, item) => {
  // modify the original object
  obj.c = item
  return obj
}
const obj = { a: 1, b: 2 }
const newObj = pushAppendObj(obj, 3)
console.log(obj, newObj)

const appendObj = (obj, item) => {
  // create a new object
  return { ...obj, c: item }
}
const obj2 = { a: 4, b: 5 }
const newObj2 = appendObj(obj2, 6)
console.log(obj2, newObj2)
