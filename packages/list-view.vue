<template>
    <div ref="wrapper" @scroll="refreshView()" style="width: 100%; height: 100%; overflow: auto; position: relative; margin: 0; padding: 0; border: none;">
        <div
            :style="{height: listTotalHeight + 'px'}"
            style="width: 100%; padding: 0; margin: 0;"
        ></div>
        <div
            ref="item-wrapper"
            style="position: absolute; top: 0; left: 0; width: 100%; padding: 0; margin: 0;"
        >
            <div
                v-for="(d, index) in listViewWithInfo"
                :key="d.index"
                :style="{height: d.height + 'px'}"
            >
                <slot :item="d.item" :height="d.height" :offset="d.offset" :index="d.index"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        list: Array, // 列表数据
        itemHeightGetter: Function, // 获取列表高度的函数
        defaultItemHeight: Number, // 默认item高度
    },
    data () {
        return {
            listView: [], // 可视列表数据
            listTotalHeight: 0, // 列表总高度
            itemOffsetCache: [], // item信息缓存
            topItemIndex: 0, // 可视窗口的第一项
        };
    },
    computed: {
        listViewWithInfo () { // 封装listView，提供index、height、offset数据
            return this.listView.map((item, viewIndex) => {
                const index = this.topItemIndex + viewIndex;
                const { height, offset } = this.getItemInfo(index);
                return {
                    index,
                    item,
                    height,
                    offset,
                }
            });
        }
    },
    watch: {
        list () {
            this.refreshView();
        },
    },
    methods: {
        // 重渲染可视列表（可供组件外部调用）
        refreshView (config) {
            if (config) {
                if (config.resize) { // 只有resize为true时对wrapper高度重新取值，减少DOM取值操作
                    this._viewHeight = this.$refs.wrapper.clientHeight;
                }
                if (config.clearCache) { // 清空缓存
                    this.itemOffsetCache = [];
                }
            }
            const scrollTop = this.$refs.wrapper.scrollTop; // 当前scrollTop
            const viewHeight = this._viewHeight; // 可视窗口高度
            const topItemIndex = this.findItemIndexByOffset(scrollTop); // 可视窗口的第一项
            const bottomItemIndex = this.findItemIndexByOffset(scrollTop + viewHeight); // 可视窗口的最后项
            this.topItemIndex = topItemIndex;
            this.listView = this.list.slice(topItemIndex, bottomItemIndex + 1); // 可视列表

            // 列表总高度
            // 若提供了默认item高度（defaultItemHeight），则高度 = 已计算item的高度总合 + 未计算item数 * 默认item高度；否则全部使用计算高度
            // 这里已计算过的item会缓存，所有item只会计算一次
            const listTotalHeight = this.defaultItemHeight
                ? this.getItemInfo(this.itemOffsetCache.length - 1).offset + (this.list.length - this.itemOffsetCache.length) * this.defaultItemHeight
                : this.getItemInfo(this.list.length - 1).offset;

            this.listTotalHeight = listTotalHeight;

            this.$refs['item-wrapper'].style.transform = `translateY(${this.getItemInfo(topItemIndex - 1).offset}px)`; // 控制translateY使可视列表位置保持在可视窗口

            // 对外抛出scroll事件
            this.$emit('scroll', {
                topItemIndex,
                bottomItemIndex,
                listTotalHeight,
                scrollTop
            });
        },
        // 根据offset获取item的在列表中的index
        findItemIndexByOffset (offset) {
            // 如果offset大于缓存数组的最后项，按序依次往后查找（调用getItemInfo的过程也会缓存数组）
            if (offset >= this.getItemInfo(this.itemOffsetCache.length - 1).offset) {
                for (let index = this.itemOffsetCache.length; index < this.list.length; index++) {
                    if (this.getItemInfo(index).offset > offset) {
                        return index;
                    }
                }
                return this.list.length - 1;
            } else { // 如果offset小于缓存数组的最后项，那么在缓存数组中二分法查找
                let begin = 0;
                let end = this.itemOffsetCache.length - 1;
                while (begin < end) {
                    let mid = (begin + end) / 2 | 0;
                    let midOffset = this.getItemInfo(mid).offset;
                    if (midOffset === offset) {
                        return mid;
                    } else if (midOffset > offset) {
                        end = mid - 1;
                    } else {
                        begin = mid + 1;
                    }
                }
                if (this.getItemInfo(begin).offset < offset && this.getItemInfo(begin + 1).offset > offset) {
                    begin = begin + 1;
                }
                return begin;
            }
        },
        // 获取item信息（有缓存则取缓存，无缓存则计算并缓存）
        getItemInfo (index) {
            // 超出取值范围，返回默认值
            if (index < 0 || index > this.list.length - 1) {
                return {
                    offset: 0,
                    height: 0,
                };
            }
            let cache = this.itemOffsetCache[index];
            // 如果没有缓存，进行计算并缓存结果
            if (!cache) {
                // 优先用itemHeightGetter计算高度，无itemHeightGetter则取defaultItemHeight作为高度
                let height = (this.itemHeightGetter ? this.itemHeightGetter(this.list[index], index) : this.defaultItemHeight);
                cache = this.itemOffsetCache[index] = {
                    height, // item高度
                    offset: this.getItemInfo(index - 1).offset + height, // 递归得出item的bottom距离列表顶部的距离，item的offset = 上个item的offset + 自己的height
                };
            }
            // 如果已有缓存，直接返回缓存的结果
            return cache;
        },
    },
    mounted () {
        this.refreshView({ resize: true });
    },
}
</script>

