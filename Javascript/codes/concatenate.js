const mergeArrays = (arr1, arr2) => {
  // modify the original array
  arr1.push(...arr2)
  return arr1
}
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const result = mergeArrays(arr1, arr2)
console.log(arr1, arr2, result)

const concatArrays = (arr1, arr2) => {
  // create a new array
  return arr1.concat(arr2)
}
const arr3 = [7, 8, 9]
const arr4 = [10, 11, 12]
const result2 = concatArrays(arr3, arr4)
console.log(arr3, arr4, result2)

const spreadArrays = (arr1, arr2) => {
  // create a new array
  return [...arr1, ...arr2]
}
const arr5 = [13, 14, 15]
const arr6 = [16, 17, 18]
const result3 = spreadArrays(arr5, arr6)
console.log(arr5, arr6, result3)
