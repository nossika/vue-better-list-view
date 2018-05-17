# vue-better-list-view

vue长列表按需渲染，[DEMO](https://nossika.github.io/vue-better-list-view/dev/umd-example.html)

## 使用

提供npm版本和umd版本

npm 安装

    // install
    npm i vue-better-list-view --save-dev

    // in your project
    import listView from 'vue-better-list-view'
    
或 umd 引入

    <script src="list-view-umd.js"></script>
    <script>
        Vue.use(listView);
    </script>

用法示例：

    <section style="height: 400px;">
        <list-view
            @scroll="listScroll"
            :list="list"
            :item-height-getter="itemHeightGetter"
            :default-item-height="defaultItemHeight"
        >
            <div slot-scope="scope">
                <div>
                    NO: {{ scope.item.value }}, height: {{ scope.height }}px
                </div>
            </div>
        </list-view>
    </section>

调试：

    npm run dev
    
## API

### 属性

#### list：array

列表源数据

#### item-height-getter: function(item, index)

自定义逻辑计算每一行的高度，根据item（list中的列表项）和index（在list中的索引）返回height（number类型，单位px）。

> 此函数在组件生命周期内只会对每个列表项最多求值一次，之后都从缓存取值。在提供了default-item-height的情况下，组件会按需调用此函数，即对可视窗口以外的且未缓存的列表项使用default-item-height作为预估行高。因此建议提供default-item-height来提高性能。

#### default-item-height: number

列表每行item的默认高度值（px）。

> 没有item-height-getter的情况下此值会是所有行的行高；有item-height-getter的情况下，此值会被用于预估未缓存项的行高，详见item-height-getter说明。

### 事件

#### scroll({ topItemIndex, bottomItemIndex, listTotalHeight, scrollTop })

列表滚动时触发。参数：topItemIndex:number（可视列表第一项的index）；bottomItemIndex:number（可视列表最后项的index）；listTotalHeight:number（列表总高度）；scrollTop:number（滚动距离）

### scoped-slot

#### scope: {item, index, height, offset}
item（列表项）；index（列表项索引）；height（列表项高度）；offset（列表项底部距列表顶部距离）

### 方法

#### refreshView(config = {})

重新渲染列表。config.clearCache为true时清空item-height-getter的缓存值；config.resize为true时对可视列表DOM高度重新取值。

> clearCache一般在list发生改变的时候使用，除了push操作不需要（因为只是往数组末尾新增项的话之前缓存值是可以继续使用的）。resize一般在容器高度变化的时候使用。

> 例子：this.$refs['list-vue'].refreshView({ resize: true });

## 提示

item-height-getter和default-item-height二者必须提供其一，使用item-height-getter的同时提供default-item-height可得到更好的性能。

## 参考文章

[再谈前端虚拟列表的实现](https://zhuanlan.zhihu.com/p/34585166)
