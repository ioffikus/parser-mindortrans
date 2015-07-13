'use strict';

// методы для работы с html

var cheerio = require('cheerio');

/**
 * Сохраняем hidden поля для следующих запросов
 * __EVENTTARGET - отвечает за отображаемую страницу
 * формат страниц:
 *  1 - ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl05
 *  2 - ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl07
 *  3 - ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl09
 *  4 - ... меняется цифра в конце, начиная с 5, нечетные
 * @param htmlStr
 * @returns {Object}
 */
function parseHiddenFormData(htmlStr) {
    var hFormData = {},
        $;

    if(typeof htmlStr === 'undefined' || htmlStr === null || htmlStr.length === 0) {
        return hFormData;
    }

    $ = cheerio.load(htmlStr);

    var hInput = $('form#aspnetForm').find('input[type="hidden"]');

    hInput.each(function(i, elem) {
        var name = $(elem).attr('name'),
            value = $(elem).attr('value');

        if(name.length > 0) {
            hFormData[name] = value || "";
        }
    });

    return hFormData;
}

/**
 * Парсим основные данные таблицы
 * @param htmlStr
 * @returns {Array}
 */
function parseData(htmlStr) {
    var result = [],
        $;

    $ = cheerio.load(htmlStr);

    var trs = $('table.rgMasterTable > tbody').find('tr');

    trs.each(function(i, elem) {
        var tds = $(elem).find('td'),
            tdArr = [];

        tds.each(function(i, tdElem) {
            var text = $(tdElem).text();

            tdArr.push(text);
        });

        result.push(tdArr);
    });

    return result;
}

/**
 * Парсим заголовки
 * @param htmlStr
 * @returns {Array}
 */
function parseHeaders(htmlStr) {
    var results = [],
        $;

    $ = cheerio.load(htmlStr);

    var ths = $('table.rgMasterTable').find('th.rgHeader'),
        thArr = [];

    ths.each(function(i, thElem) {
        var text = $(thElem).text();

        thArr.push(text);
    });

    results.push(thArr);

    return results;
}

module.exports = {
    parseHiddenFormData: parseHiddenFormData,
    parseData: parseData,
    parseHeaders: parseHeaders
}