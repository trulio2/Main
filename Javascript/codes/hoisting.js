/* 
    Hoisting: Move variable declaration to the top of the scope
    but not the assignment. Only works with var, not let or const.
    The variable is still undefined.
*/

console.log(foo) // undefined
var foo = 'bar'

bar = 'foo'
console.log(bar) // foo
var bar // hoisted to the top of the scope
