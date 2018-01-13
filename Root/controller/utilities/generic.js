var uuidv1 = require('uuid/v1');

module.exports.getUUId = function(){
    return uuidv1();
}

module.exports.getUniqueNumber = function () {

    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    var id = components.join("");
    return id;
}
