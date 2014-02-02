

module("fieldEmptyCheck", {
    setup: function(){
        checkValRes = {
            "A":"", "B":" ", "":" "
        }
    }
});
test("正常系", function() {
    deepEqual(devnomiHotel.fieldEmptyCheck("A"), false, '""(empty)の場合はfalse');
    deepEqual(devnomiHotel.fieldEmptyCheck("B"), true, '" "(ブランク)の場合はtrue');
});

test("異常系", function() {
    deepEqual(devnomiHotel.fieldEmptyCheck("C"), false, '存在しないパラメータを指定した場合はfalse');
    deepEqual(devnomiHotel.fieldEmptyCheck(""), true, 'パラメータが""(empty)で、値が" "(ブランク)の場合はtrue');
    deepEqual(devnomiHotel.fieldEmptyCheck(), true, 'パラメータを指定しない場合はtrue');
});


module("decimalCheck", {
    setup: function() {
        checkValRes = {
            "0": 0,
            "9999": 9999,
            "-1": -1,
            "a": "a",
            "あ": "あ",
            "０": "０",
            "【": "【",
            "-": "-",
            "": "",
            "null": null,
            "undefined": undefined,
            "true": true,
            "false": false,
        };
    }
});

test("正常系", function(){
    deepEqual(devnomiHotel.decimalCheck("0", "9999", "-1"), true);
});

test("異常系", function(){
    deepEqual(devnomiHotel.decimalCheck("a"), false);
    deepEqual(devnomiHotel.decimalCheck("あ"), false);
    deepEqual(devnomiHotel.decimalCheck("０"), false);
    deepEqual(devnomiHotel.decimalCheck("【"), false);
    deepEqual(devnomiHotel.decimalCheck("-"), false);
    deepEqual(devnomiHotel.decimalCheck(""), false);
    deepEqual(devnomiHotel.decimalCheck("null"), false);
    deepEqual(devnomiHotel.decimalCheck("undefined"), false);
    deepEqual(devnomiHotel.decimalCheck("true"), false);
    deepEqual(devnomiHotel.decimalCheck("false"), false);
    deepEqual(devnomiHotel.fieldEmptyCheck(), true, 'パラメータを指定しない場合はtrue');
});

module("calcTotalBilling", {
    setup: function() {
        checkValRes = {
            "reserve_y": "",
            "reserve_m": "8",
            "reserve_d": "",
            "reserve_t": "1",
            "hc": "5",
            "bf_viking": "on", // real data, until here.
            "test_data_zenkaku_char": "あ",
            "test_data_zenkaku_number": "８",
            "test_data_zenkaku_symbol": "【",
            "test_data_zero": 0,
            "test_data_normalNum": 10,
            "test_data_minusOne": -1,
            "test_data_char": "a",
            "test_data_symbol": "-",
            "test_data_null": null,
            "test_data_nullstring": "",
            "test_data_undefined": undefined,
            "test_data_true": true,
            "test_data_false": false,
        };
    }
});

test("calcTotalBilling", function(){
    /* 
    designed by 2-pair testing

    single_ns:  0,1,9
    single_s:   0,1
    double_ns:  0,1,9
    double_s:   0,1
    date:   workday,holiday,fourteenDaysAfter,thirteenDaysAfter
    bf_viking:  "on","off"
    planA:  "on","off"
    planB:  "on","off"
    term:   1,6,7
    */

    var workday = new Date("2014/1/6");
    var holiday = new Date("2014/1/11");//Satday
    var fourteenDaysAfter = new Date("2014/1/15");
    var thirteenDaysAfter = new Date("2014/1/14");

    deepEqual(devnomiHotel.calcTotalBilling(1,1,9,0,thirteenDaysAfter,"off","off","on",1), (7000*2 + 12000*9) - 10000 + 1000*11 );
    deepEqual(devnomiHotel.calcTotalBilling(1,0,1,1,fourteenDaysAfter,"on","on","off",6), ((7000 + 12000*2)*6 + (7000 + 12000*2)*2*0.25)*0.95 + 1000*5*6 + 1000*3 );
    deepEqual(devnomiHotel.calcTotalBilling(1,1,0,1,workday,"off","on","on",7), (7000*2 + 12000)*7 + (7000*2 + 12000)*2*0.25 - 1000*7 + 2000*3 );
    deepEqual(devnomiHotel.calcTotalBilling(1,0,0,0,holiday,"on","off","off",7), (7000*7 + 7000*2*0.25) - 1000*7 + 1000*1*7 );
    deepEqual(devnomiHotel.calcTotalBilling(9,1,1,1,fourteenDaysAfter,"off","off","on",7), ((7000*10 + 12000*2)*7 + (7000*10 + 12000*2)*2*0.25)*0.95 +1000*12 );
    deepEqual(devnomiHotel.calcTotalBilling(9,0,9,0,fourteenDaysAfter,"off","on","off",6), ((7000*9 + 12000*9)*6 + (7000*9 + 12000*9)*2*0.25)*0.95 + 1000*18 );
    deepEqual(devnomiHotel.calcTotalBilling(0,0,9,1,fourteenDaysAfter,"on","on","on",1), (12000*10) - 10000 + 1000*20 + 2000*10 );
    deepEqual(devnomiHotel.calcTotalBilling(9,1,1,0,workday,"on","off","off",1), (7000*10 + 12000*1) - 10000 + 1000*12);
    deepEqual(devnomiHotel.calcTotalBilling(0,1,0,1,thirteenDaysAfter,"on","off","off",6), (7000 + 12000)*6 + (7000 + 12000)*2*0.25 + 1000*3*6);
    deepEqual(devnomiHotel.calcTotalBilling(9,1,9,1,holiday,"off","on","on",6), (7000*10 + 12000*10)*6 + (7000*10 + 12000*10)*2*0.25 - 10000 + 2000*20);
    deepEqual(devnomiHotel.calcTotalBilling(0,0,1,0,holiday,"off","off","on",1), (12000)*1.25 + 1000);
    deepEqual(devnomiHotel.calcTotalBilling(9,0,0,1,fourteenDaysAfter,"on","on","on",1), (7000*9 + 12000) - 10000 + 1000*11 + 2000*10);
    deepEqual(devnomiHotel.calcTotalBilling(1,1,9,0,holiday,"on","off","off",7), (7000*2 + 12000*9)*7 + (7000*2 + 12000*9)*2*0.25 - 10000 + 1000*20*7);
    deepEqual(devnomiHotel.calcTotalBilling(0,0,9,1,workday,"on","off","off",6), (12000*10)*6 + (12000*10)*0.25 - 10000 + 1000*20*6);
    deepEqual(devnomiHotel.calcTotalBilling(9,0,1,1,thirteenDaysAfter,"off","on","on",7), (7000*9 + 12000*2)*7 + (7000*9 + 12000*2)*2*0.25 - 10000 + 2000*11);
});