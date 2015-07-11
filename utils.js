'use strict';

var fs = require('fs'),
    request = require('request'),
    config = require('./config.js'),
    Q = require('q');

function loadPageReturnString(path) {
    var dfd = Q.defer();

    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            dfd.reject(err);
        }

        dfd.resolve(data);
    });

    return dfd.promise;
}

function requestPage(formData) {

    if(typeof formData === 'undefined' || formData === null) {
        formData = {};
    }

    var options = {
            url: config.SITE_PATH,
            method: 'POST',
            // пока оставим так, вряд ли есть проверки
            headers: {
                'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language':'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2,fr;q=0.2,sk;q=0.2',
                'Cache-Control':'max-age=0',
                'Connection':'keep-alive',
                'Content-Type':'application/x-www-form-urlencoded',
                'Origin':'http://mindortrans.donland.ru',
                'Referer':'http://mindortrans.donland.ru/Default.aspx?pageid=103322',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36'
            },
            formData: formData
        },
        dfd = Q.defer();

    // console.log(options);

    request(options, function(error, response, body) {
        if(error) {
            dfd.reject(error);
        }

        dfd.resolve(body);
    });

    return dfd.promise;
}

function createPages(string, step, count) {
    var results = [];

    // хитрые пляски со строкой ;)
    var splitArr = string.split('$'),
        endStr = splitArr[splitArr.length-1],
        lStr = 'ctl',
        index = parseInt(endStr.split('ctl')[1], 10),
        startStr;

    splitArr.splice(splitArr.length-1, 1);
    startStr = splitArr.join('$');

    if(endStr.length === 0) {
        return results;
    }

    if(index === 'NaN') {
        return results;
    }

    for(var i=1; i<count+1; i++) {
        var nIndex = index + i*step;

        // нужно добавить 0 перед числом, если оно меньеше 10
        if(nIndex < 10) {
            nIndex = '0' + nIndex.toString();
        }

        results.push(startStr + '$' + lStr + nIndex);
    }

    return results;
}

module.exports = {
    loadPageReturnString: loadPageReturnString,
    requestPage: requestPage,
    createPages: createPages
};

requestPage()
    .then(function(body) {
        var formData = parseHiddenFormData(body);

        formData['__EVENTTARGET'] = 'ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl07';

        //console.log(formData);

        requestPage(formData)
            .then(function(body) {
                console.log(body);
            });
    });



