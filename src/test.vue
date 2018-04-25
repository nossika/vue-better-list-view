<template>
    <section class="container">
        <list-view
            ref="list-view"
            @scroll="listScroll"
            :list="list"
            :item-height-getter="itemHeightGetter"
            :default-item-height="defaultItemHeight"
        >
            <div slot-scope="scope" class="item">
                <div :style="{color: scope.item.color}">NO: {{ scope.item.no }}, height: {{ scope.height }}px, offset: {{scope.offset}}px</div>
            </div>
        </list-view>
    </section>
</template>
<script>
import listView from '../packages/list-view.vue';
export default {
    components: {
        listView,
    },
    data () {
        return {
            list: [],
            page: 0,
            itemHeightGetter (item, index) {
                if (item.no % 33 === 0) {
                    return 100;
                }
                return 20 + item.no % 10;
            },
            defaultItemHeight: 30,
        }
    },
    methods: {
        async listScroll (data) {
            if (!this._getting && data.bottomItemIndex >= this.list.length - 3) {
                this._getting = true;
                this.list.push(...(await this.getData()));
                this.page++;
                this._getting = false;
            }
        },
        getData () {
            return new Promise(resolve => {
                setTimeout(() => {
                    const baseIndex = this.page * 2000;
                    resolve(new Array(2000).fill(0).map((i, index) => {
                        return {
                            no: baseIndex + index,
                            color: ['#33d', '#3d3', '#d33', '#333'][Math.random() * 4 | 0],
                        };
                    }));
                }, 100);
            })
        },
    },
    async created () {
        this.list = await this.getData();
    },

}
</script>
<style scoped>
    .container {
        height: 400px;
        width: 500px;
        margin: 50px auto;
        border: 1px solid #eee;
    }
    .item {
        height: 100%;
        display: flex;
        align-items: center;
    }
</style>