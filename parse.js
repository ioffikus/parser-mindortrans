'use strict';

var Q = require('q'),
    utils = require('./utils.js'),
    htmlParsers = require('./htmlParsers.js'),
    config = require('./config');

/**
 * Можно сохранять в файл log.txt или другие варианты
 * пока выводим в консоль
 * @param err
 */
function logError(err) {
    console.log('Ошибка:', err);
}

/**
 * main
 */
function parse() {
    // получаем первую страницу, извлекаем из нее данные
    return utils.requestPage({})
        .then(function(htmlStr) {
            var pages,
                headers,
                formData,
                firstPageData,
                result = [],
                pagesPromises = [];

            // получаем заголовки страниц
            headers = htmlParsers.parseHeaders(htmlStr);
            result = result.concat(headers);

            // получаем параметры формы
            formData = htmlParsers.parseHiddenFormData(htmlStr);

            // строем список страниц
            // т.е. первая уже загружена, нужно получить 9
            pages = utils.createPages(config.PAGE_STR, 2, 9);

            // парсим данные первой страницы
            firstPageData = htmlParsers.parseData(htmlStr);
            result = result.concat(firstPageData);

            for(var i = 0; i<pages.length; i++) {
                formData[config.PAGE_STR_PR] = pages[i];

                pagesPromises.push(utils.requestPage(formData));
            }

            // дожидаемся выполнения всех запросв,
            // сохраняем результат
            return Q.allSettled(pagesPromises)
                .then(function(resArr) {

                    // добавляем данные в result
                    for(var j = 0; j<resArr.length; j++) {
                        var item = resArr[j],
                            itemData;

                        if(item.state === 'fulfilled') {
                            itemData = htmlParsers.parseData(item.value);
                            result = result.concat(itemData);
                        }
                        else {
                            logError('Ошибка:', item);
                        }
                    }

                    // сохраняем в csv
                    return utils.saveToCSVArrayOfArrays(result);
                });
        });
}

// время выполнения
var start = process.hrtime();

parse()
    .then(function(str) {
        console.log(str);
        console.log("Время работы: ", process.hrtime(start)[0] + "с.");
        process.exit();
    })
    .catch(logError);
