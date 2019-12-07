import $ from 'jquery';

export function injectStyle(url) {
    $('<link />', {
        type: 'text/css',
        rel: 'stylesheet',
        href: url,
    }).appendTo('head');
}
