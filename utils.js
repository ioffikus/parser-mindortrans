'use strict';

var fs = require('fs'),
    request = require('request'),
    config = require('./config.js'),
    csv = require('fast-csv'),
    Q = require('q');

/**
 * Загружаем страницу (локально)
 * @param {String}
 * @return {Promise}
 **/
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

/**
 * Делаем запрос на сервер
 * @param {Object}
 * @return {Promise}
 **/
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

    request(options, function(error, response, body) {
        if(error) {
            dfd.reject(error);
        }

        dfd.resolve(body);
    });

    return dfd.promise;
}

/**
 * Создаем массив страниц, которые нужно получить
 * @param string
 * @param step
 * @param count
 * @return {Array}
 */
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

/**
 * Сохраняем файл
 * @param array
 * @param filePath
 * @return {*}
 */
function saveToCSVArrayOfArrays(array, filePath) {
    var path = filePath || config.OUT_FILE_NAME,
        dfd = Q.defer(),
        ws = fs.createWriteStream(path, {encoding: 'utf8'});

    csv.write(array, {headers: true})
        .pipe(ws);

    ws.on('finish', function() {
        dfd.resolve('Файл ' + path + ' создан.');
    });

    return dfd.promise;
}

module.exports = {
    loadPageReturnString: loadPageReturnString,
    requestPage: requestPage,
    createPages: createPages,
    saveToCSVArrayOfArrays: saveToCSVArrayOfArrays
};



