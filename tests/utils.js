'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sinonChai = require('sinon-chai'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    Q = require('q'),
    utils = require('./../utils.js'),

    firstPagePath = './tests/firstPage.html',
    nullPath = '',
    pageStr = 'ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl05',

    goodArray = [
        'ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl07',
        'ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl09',
        'ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl11'
    ];

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Тест utils', function() {

    describe('Тест загрузки файла', function() {
        it('Тестируем загрузку не верного пути', function() {
            return utils.loadPageReturnString(nullPath)
                .catch(function(err) {
                    expect(err.code).to.eq('ENOENT');
                });
        });

        it('Тестируем загрузку верного пути', function() {
            return utils.loadPageReturnString(firstPagePath)
                .then(function(result) {
                    expect(result).to.not.be.null;
                })
                .catch(function(err) {
                    expect(err).to.be.null;
                });
        });
    });

    describe('Тест формирования номеров страниц', function() {
        it('Проверяем первый результат', function() {
            var result = utils.createPages(pageStr, 2, 1);

            expect(result[0]).to.eq(goodArray[0]);
        });

        it('Проверяем три результата', function() {
            var result = utils.createPages(pageStr, 2, 3);

            expect(result[0]).to.eq(goodArray[0]);
            expect(result[1]).to.eq(goodArray[1]);
            expect(result[2]).to.eq(goodArray[2]);
        });
    });
});