import $ from 'jquery';
import Vue from 'vue';
import devToolbar from './components/devToolbar.vue';

export function initialize() {
    // Insert toolbar vue
    $('<div></div>')
        .attr('id', 'devToolbarVue')
        .insertAfter('#topBar');

    // Fix .main top margin
    $('.main').css('margin-top', 0);

    new Vue({
        render: (h) => h(devToolbar),
    }).$mount('#devToolbarVue');
}
