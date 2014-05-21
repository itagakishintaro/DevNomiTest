'use strict';
var members;
var rest;
var order = 1;
var hitIndex;

$(document).ready(function() {
    $('#regist').click(function() {
        members = $.trim($('#members').val()).split('\n');
        if (members.length <= 1) {
            alert("2人以上じゃないと意味ないし。");
        } else {
            rest = $.extend(true, [], members);
            $('#regist').attr('disabled', true);
            $('#slot').attr('disabled', false);
        }
    });

    $('#slot').click(function() {
        slot();
        addHistory();
        pullFromRest();
    });

});

var slot = function() {
    $('#hit').text('');
    hitIndex = Math.floor(Math.random() * rest.length);
    $('#hit').append(rest[hitIndex]);
}

var addHistory = function() {
    $('#history').prepend(order + '番目 ' + getTime() + ' ' + rest[hitIndex] + '<br />');
    order = order + 1;
}

var pullFromRest = function() {
    rest.some(function(v, i) {
        if (v == rest[hitIndex]) rest.splice(i, 1);
    });
    if (rest.length === 0) {
        rest = $.extend(true, [], members);
    }
}