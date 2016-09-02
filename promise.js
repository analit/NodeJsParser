var Promise = require('promise');

// var promise = new Promise(function (resolve, reject) {
//     // get('http://www.google.com', function (err, res) {
//     //     if (err) reject(err);
//     //     else resolve(res);
//     // });
//
//     setTimeout(function(){
//         resolve('resolve');
//         reject('reject');
//     }, 1000);
// }).then(function (obj) {
//     console.log(obj);
//     console.log('test')
//     return 'resolve2';
// }).then(function (obj) {
//     console.log(obj);
//     console.log('test2')
// });


var request = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
            console.log('time:' + time);
        }, time)
    })
}

// var prom = new Promise(function (resolve, reject) {
//     resolve('test');
// })
//     request(1000)
//     .then(function () {
//     return request(1000);
// }).then(function () {
//     return request(1000);
// }).then(function () {
//     console.log('result');
// })


// var pp;
// var prom = new Promise(function (resolve, reject) {
//     resolve();
// })
// for (var i = 0; i < 5; i++) {
//     prom= prom.then(function () {
//         return request(2000);
//     });
// }
// prom.then(function () {
//     console.log('result');
// })
//
// console.log('end');

Promise.all([request(2000),request(2000), request(2000)]).then(function () {
    console.log("result");
})