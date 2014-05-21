'use strict';
var getTime = function() {
    var now = new Date();
    var hours = toDoubleDigits(now.getHours());
    var minutes = toDoubleDigits(now.getMinutes());
    var seconds = toDoubleDigits(now.getSeconds());
    return hours + ':' + minutes + ':' + seconds;
}

var toDoubleDigits = function(num) {
    num += '';
    if (num.length === 1) {
        num = '0' + num;
    }
    return num;
};