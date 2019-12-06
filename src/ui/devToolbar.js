import $ from 'jquery';
import Vue from 'vue';
import devToolbar from './components/devToolbar.vue';

export function initialize() {
    $('<div></div>')
        .attr('id', 'devToolbarVue')
        .insertAfter('#topBar');

    const test = new Vue({
        render: (h) => h(devToolbar),
    });

    test.$mount('#devToolbarVue');
}
