//reserveApp.js 
//Billing calculation at hotel and utils for System Test Automation Conference 2013 hands on - #STAR.jp @snsk   
//JSHint Assume:Browser http://www.jshint.com/
//changed by @ItagakiShintaro for DevNomi
var getUrlVars = function() {
    "use strict";
    var vars = {};
    var param = location.search.substring(1).split('&');
    for (var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if (keySearch !== -1) {
            key = param[i].slice(0, keySearch);
        }
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if (key !== '') {
            vars[key] = decodeURI(val);
        }
    }
    return vars;
};

// field empty check /* could not using jQuery.query plugin, it was confuse return types*/
var checkValRes = getUrlVars();
var devnomiHotel = {

    fieldEmptyCheck: function() {
        "use strict";
        for (var i = 0; i < arguments.length; i++) {
            if (checkValRes[arguments[i]] === "" || checkValRes[arguments[i]] === undefined) {
                return false;
            }
        }
        return true;
    },
    decimalCheck: function() {
        "use strict";
        var numCheck = /[-]?[0-9]+(¥.[0-9]+)?$/;
        for (var i = 0; i < arguments.length; i++) {
            if (!numCheck.test(checkValRes[arguments[i]])) {
                return false;
            }
        }
        return true;
    },
    calcTotalBilling: function(single_ns, single_s, double_ns, double_s, date, bf_viking, planA, planB, term) {
        "use strict";
        var now = new Date('2014/01/01');
        date = new Date(date);
        var headCount = (single_ns + single_s + double_ns * 2 + double_s * 2);
        var roomBill = ((single_ns + single_s) * 7000) + ((double_ns + double_s) * 12000);
        var basicPrice = roomBill * term;
        var holidayChargePriceBill = privateFunction.addHolidayCharge(basicPrice, single_ns, single_s, double_ns, double_s, date, term);
        var discountedPriceBill = privateFunction.discount(holidayChargePriceBill, date, now, term, headCount);
/*
        console.log(basicPrice);
        console.log(holidayChargePriceBill);
        console.log(discountedPriceBill);
*/
        //FIX ME
        return privateFunction.addOptionCharge(discountedPriceBill, headCount, single_ns+single_s+double_ns+double_s, bf_viking, planA, planB, term);
        //return Math.floor( privateFunction.addOptionCharge(discountedPriceBill, headCount, single_ns+single_s+double_ns+double_s, bf_viking, planA, planB, term) );
    }
};

var privateFunction = {
    addHolidayCharge: function(price, single_ns, single_s, double_ns, double_s, date, term) {
        //FIX ME
        var loopDate = new Date(date);

        var dayCounter = date.getDay(); //scan holiday within term days.
        for (var i = 0; i < term; i++) {
            if (dayCounter === 0 || dayCounter === 6) {
                price += (single_ns + single_s) * 7000 * 0.25;
                price += (double_ns + double_s) * 12000 * 0.25;
            }
            dayCounter = (dayCounter + 1) % 7;
            //FIX ME
            
            if(HolidayHelper.isHoliday( loopDate )){
                price += (single_ns + single_s) * 7000 * 0.25;
                price += (double_ns + double_s) * 12000 * 0.25;
            }
            loopDate.setDate(loopDate.getDate() + 1);
            
        }
        return price;
    },
    discount: function(price, date, now, term, headCount) {
        var earlyDiscountPrice = price;
        if (date.getTime() >= now.getTime() + 14 * 24 * 3600 * 1000) {
            //FIX ME
            return price * 0.95;
            //earlyDiscountPrice = price * 0.95;
        }

        var groupDiscountPrice = price;
        if (headCount >= 10) {
            groupDiscountPrice = price - 10000;
        }

        var consecutiveStayDiscountPrice = price;
        if (term >= 7) {
            consecutiveStayDiscountPrice = price - 1000 * term;
        }

        return Math.min(earlyDiscountPrice, groupDiscountPrice, consecutiveStayDiscountPrice);
    },
    addOptionCharge: function(price, headCount, roomCount, bf_viking, planA, planB, term) {
        if (bf_viking === "on") {
            //FIX ME
            price += (1000 * term * roomCount);
            //price += (1000 * term * headCount);
        }
        if (planA === "on") {
            price += (1000 * roomCount);
        }
        if (planB === "on") {
            price += (1000 * roomCount);
        }
        return price;
    }
};
window.devnomiHotel = devnomiHotel;
