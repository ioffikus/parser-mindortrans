'use strict';

module.exports = {
    SITE_PATH: 'http://mindortrans.donland.ru/Default.aspx?pageid=103322',
    PAGES: 10,
    // первая страница
    // TODO: надо добавить проверку, что при загрузке "первой страницы" все хорошо и параметр еще актуален
    PAGE_STR: 'ctl01$mainContent$ctl00$carryPermissionsList$RadGrid1$ctl00$ctl03$ctl01$ctl05',
    PAGE_STR_PR: '__EVENTTARGET',
    OUT_FILE_NAME: 'rostov-2015.csv'
};