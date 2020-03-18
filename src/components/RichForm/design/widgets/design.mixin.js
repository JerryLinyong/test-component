export default {
    data() {
        return {
            designValid: true
        }
    },
    created() {
        this.$nextTick(() => {
            // this.onScrollToBottom();
        })
    },
    methods: {
        // 监听事件，滚动条滑动到最底部
        onScrollToBottom() {
            const ele = document.getElementById("form-design-center").parentNode;
            let scrollToBottomInterval;
            ele.onmouseenter = () => {
                scrollToBottomInterval = setInterval(function () {
                    //设置滚动条到最底部
                    if (ele.scrollHeight > ele.clientHeight) {
                        ele.scrollTop = ele.scrollHeight;
                    }
                }, 20);
            };
            ele.onmouseout = () => {
                clearInterval(scrollToBottomInterval);
            }
            window.addEventListener("mousewheel", () => {
                clearInterval(scrollToBottomInterval);
            }, false);
        },
        // 项目点击事件
        onClickedItem(item) {
            if (this.isDesignModel(item)) {
                this.$store.commit("formDesign/setClickedItem", item);
            }
        },
        // 操作仓库进行删除动作
        onDeleteItem(item) {
            if (this.isDesignModel(item)) {
                this.$store.commit("formDesign/setDeleteItemID", item.designId);
            }
        },
        // 复制
        onCopyItem(item) {
            if (this.isDesignModel(item)) {
                this.$store.commit("formDesign/onCopyItem", item);
            }
        },
        // 判断是否未设计模式的item
        isDesignModel(item) {
            return Object.keys(item).includes("designId") ? true : false;
        },
        // 拖拽参数配置
        getDragOptions() {
            return {
                group: "formdesign", // 两个draggable要相互拖拽必须相同
                sort: true, // 是否允许排序
                disabled: false,
                animation: 200, // 过度
                easing: "cubic-bezier(1, 0, 0, 1)", // 动画效果
                handle: ".design-handle-move", // 可拖拽类，用于限定区域
                ghostClass: "design-draggable-ghost",
                dragClass: "design-sortable-drag", // 排序背景显示
                emptyInsertThreshold: 600, // 首个拖进来占位
            }
        }
    }
}