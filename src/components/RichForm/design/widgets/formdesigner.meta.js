/**
 * formdesigner widget 元数据
 */

export default {
    schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "textarea属性",
        description: "widget property",
        type: "object",
        properties: {
            size: {
                type: "string",
                widget: "buttongroup",
                title: "尺寸",
                default: "medium",
                enumDict: [{
                    value: "large",
                    text: "大"
                },
                {
                    value: "medium",
                    text: "中"
                },
                {
                    value: "small",
                    text: "小"
                }]
            },
            labelWidth: {
                type: "string",
                widget: "inputnumber",
                title: "标签宽度",
                step: 10,
                min: 0,
                max: 500,
                default: 0
            },
            width: {
                type: "string",
                widget: "inputnumber",
                title: "宽度",
                step: 10,
                min: 0,
                max: 500,
                default: 0
            },
            labelAlign: {
                type: "string",
                widget: "buttongroup",
                title: "标签对齐",
                default: "medium",
                enumDict: [{
                    value: "left",
                    text: "左"
                },
                {
                    value: "center",
                    text: "中"
                },
                {
                    value: "right",
                    text: "右"
                }]
            },
            border: {
                type: "boolean",
                title: "显示边框",
                widget: "switch",
                default: true
            },
            viewOnly: {
                type: "boolean",
                title: "只读",
                widget: "switch",
                default: false
            },
            labelSuffix: {
                type: "boolean",
                title: "显示标签:提示符",
                widget: "switch",
                default: true
            },
            grid: {
                type: "boolean",
                title: "网格",
                widget: "switch",
                default: false
            },
            inline: {
                type: "boolean",
                title: "水平表单",
                widget: "switch",
                default: false
            },
            labelInline: {
                type: "boolean",
                title: "标签与字段同行",
                widget: "switch",
                default: false
            },
            validator: {
                type: "string",
                title: "触发验证",
                widget: "select",
                enumDict: [
                    {
                        value: "input",
                        text: "输入时"
                    },
                    {
                        value: "submit",
                        text: "提交时"
                    },
                    {
                        value: "change",
                        text: "改变时"
                    },
                ]

            }
        }
    },
    values: {

    },
    form: {
        name: "", // 表单英文名称
        size: "medium",
        border: true, // 显示边框
        viewOnly: false,
        fit: false, // 自动充满容器
        grid: false,
        showStop: false, // 滑块显示断点
        showInput: false, // 滑块显示输入框
        showRange: false, // 滑块显示范围
        readOnly: false, // 只读状态，不允许提交
        labelSuffix: true, // 字段标题后缀内容，默认' : '
        inline: false, // 字段标题显示位置, 默认true左侧left,false显示在top上方
        advanced: false,
        labelWidth: "80", // 标签宽度,可选px值
        labelAlign: "right", // 标签对齐, 默认左对齐, 可选右对齐
        labelInline: true,
        compact: true, // 紧凑模式，字段之间的距离更小些,表头更小些等
        method: "post", // 提交方法,get,post
        validator: {
            //什么时候对字段值进行验证，
            // input-在输入时马上验证，submit-当提交时进行验证,change=改变时
            on: "input"
        },
        layout: [
            {
                name: "size"
            },
            {
                name: "labelAlign"
            },
            {
                name: "validator"
            },
            {
                name: "labelWidth"
            },
            {
                widget: "group",
                inline: true,
                fields: [{
                    name: "border"
                },
                {
                    name: "viewOnly"
                },]
            },
            {
                widget: "group",
                inline: true,
                fields: [{
                    name: "labelSuffix"
                },
                {
                    name: "grid"
                },]
            },
            {
                widget: "group",
                inline: true,
                fields: [{
                    name: "labelInline"
                }, {
                    name: "inline"
                }]
            },
        ]
    }
}
