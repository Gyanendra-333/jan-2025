

const promiseOne = new Promise(function (resolve, reject) {
    setTimeout(function () {
        console.log("Promise called")
    }, 1000);
    resolve();
})

promiseOne.then(function () {
    console.log("resolve method called")
})