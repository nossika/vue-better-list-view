import listViewComp from '../packages/list-view.vue';

const listView = {
    install (Vue) {
        Vue.component('list-view', listViewComp);
    },
};


if (window.Vue) {
    window.Vue.use(listView);
}

window.listView = listView;


