

function one() {
    let name = "Gyan"
    function two() {
        let lastName = "prakash"
        // console.log(name)
    }
    // console.log(lastName)
    two();
}
one();



//another function
console.log((oneFn(5)));
function oneFn(num) {
    return num + 1;
}


// function expression  and hoisting
const twoFn = function (n) {
    return n + 1;
}
console.log(twoFn(7));