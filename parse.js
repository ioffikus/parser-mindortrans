'use strict';

var Q = require('q'),
    utils = require('./utils.js'),
    htmlParsers = require('./htmlParsers.js'),
    config = require('./config');

function logError(err) {
    console.log('Ошибка:', err);
}

function parse() {
    // получаем первую страницу, извлекаем из нее данные
    utils.requestPage({})
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
            pages = utils.createPages(config.PAGE_STR, 2, 10);

            // парсим данные первой страницы
            firstPageData = htmlParsers.parseData(htmlStr);
            result = result.concat(firstPageData);

            for(var i = 0; i<pages.length; i++) {
                formData[config.PAGE_STR_PR] = pages[i];

                pagesPromises.push(utils.requestPage(formData));
            }

            Q.allSettled(pagesPromises)
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

                    console.log(result);
                })
                .catch(logError);
        })
        .catch(logError);

// делаем запросы

// добавляем результаты в данные, логируем ошибки при запросе

// сохраняем массив массивов в csv
}

parse();
