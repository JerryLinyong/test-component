export default {
    name: {
        type: "string",
        title: "绑定数据",
        widget: "treeselect",
        inline: false,
        checkType: "radio",
        isHighlight: true,
        treeSource: [],
        treeKey: "name"
    },
    title: {
        type: "string",
        title: "标题",
        widget: "textbox",
    },
    visible: {
        // type: "string", // 未定义返回原值
        title: "可见性",
        widget: "relyon",
        descriptionTitle: "", // 所描述对象的title
        treeSource: [], // 树的源数据
        treeKey: "name",// 树的key值
    },
    enabled: {
        title: "使能状态",
        widget: "relyon",
        descriptionTitle: "", // 所描述对象的title
        treeSource: [], // 树的源数据
        treeKey: "name",// 树的key值
    },
    readyOnly: { // 只读
        type: "boolean",
        title: "只读",
        widget: "switch",
        default: false
    },
    showLabel: { // 是否显示标题
        type: "boolean",
        title: "显示标题",
        widget: "switch",
        default: true
    },
    labelWidth: {
        type: "number",
        title: "标签宽度",
        widget: "inputnumber",
        step: 5,
        min: 0,
        max: 1000,
        default: 0
    },
    // width: {
    //     type: "number",
    //     title: "宽度",
    //     widget: "inputnumber",
    //     step: 5,
    //     min: 0,
    //     max: 1000,
    //     default: 0
    // },
    grow: {// 参考flex-grow，用来实现同一个分组内如何分配宽度或高度
        type: "number",
        title: "宽度比例",
        widget: "inputnumber",
        default: 1,
        showHelp: true,
        description: "放置到栅栏布局且栅栏布局为一行有效"
    }
}