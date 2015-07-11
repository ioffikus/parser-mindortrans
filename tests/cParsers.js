'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sinonChai = require('sinon-chai'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    Q = require('q'),

    firstPagePath = './tests/firstPage.html',
    utils = require('./../utils.js'),
    cParsers = require('./../cParsers.js');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Тест cParsers', function() {
    describe('Тест разбора скрытых полей', function() {
        var htmlStr,
            formData;

        beforeEach(function(done) {
            utils.loadPageReturnString(firstPagePath)
                .then(function(results) {
                    htmlStr = results;

                    formData = cParsers.parseHiddenFormData(htmlStr);

                    done();
                });
        });

        it('Проверяем параметр __EVENTTARGET', function() {
            expect(formData['__EVENTTARGET']).to.eq('');
        });

        it('Проверяем параметр __EVENTTARGET', function() {
            expect(formData['__VIEWSTATE']).to.eq('/wEPDwUKMjA1OTAyNzk1MQ9kFgJmD2QWAgIDD2QWFAIBDxYCHg9TaXRlTWFwUHJvdmlkZXIFCW1vam9zaXRlM2QCDQ9kFgICAQ8P');
        });
    });

    describe('Тест разбора скрытых полей, не верный параметр', function() {
        var formData = cParsers.parseHiddenFormData('');

        it('Проверяем параметр __EVENTTARGET', function() {
            expect(formData['__EVENTTARGET']).to.be.undefined;
        });

        it('Проверяем на пустой объект', function() {
            expect(formData).to.eql({});
        });
    });

    describe('Тест разбора полей таблицы', function() {
        var htmlStr,
            array;

        beforeEach(function(done) {
            utils.loadPageReturnString(firstPagePath)
                .then(function(results) {
                    htmlStr = results;

                    array = cParsers.parseData(htmlStr);

                    done();
                });
        });

        it('Проверяем первый элемент', function() {
            expect(array[0][0]).to.be.eq("1");
            expect(array[0][1]).to.be.eq("000001 (аннулировано 30.08.2012)");
        });

        it('Проверяем второй элемент', function() {
            expect(array[1][0]).to.be.eq("2");
            expect(array[1][1]).to.be.eq("000002 (аннулировано 04.12.2013)");
        });

        it('Проверяем треий элемент', function() {
            expect(array[2][0]).to.be.eq("3");
            expect(array[2][1]).to.be.eq("000003 (аннулировано 04.12.2013)");
        });
    });
});