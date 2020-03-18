/**
 * slider widget 元数据
 */

import baseWidgetSchema from "./baseWidgetSchema"
import baseWidgetValues from "./baseWidgetValues"
import baseWidgetForm from "./baseWidgetForm"

export default {
    schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "slider.",
        description: "widget property",
        type: "object",
        properties: {
            ...baseWidgetSchema,
            step: {
                type: "number",
                title: "步长",
                widget: "inputnumber",
                step: 1,
                min: 0,
                max: 500,
            },
            minimum: {
                type: "number",
                title: "最小值",
                widget: "inputnumber",
                step: 1,
                min: 0,
                max: 100,
                default: 20
            },
            maximum: {
                type: "number",
                title: "最大值",
                widget: "inputnumber",
                step: 1,
                min: 0,
                max: 200,
            },
            readOnly: {
                type: "boolean",
                title: "只读",
                widget: "switch",
                default: false
            },
            startInput: {
                type: "boolean",
                title: "显示输入",
                widget: "switch",
                default: false
            },
            showStop: {
                type: "boolean",
                title: "滑块显示断点",
                widget: "switch",
                default: false
            },
            showInput: {
                type: "boolean",
                title: "滑块显示输入框",
                widget: "switch",
                default: true
            },
            showRange: {
                type: "boolean",
                title: "滑块显示范围",
                widget: "switch",
                default: false
            },
        }
    },
    values: {
        ...baseWidgetValues,
        step: 10, // 步长
        minimum: 0, // 最小值
        maximum: 100, // 最大值
        readOnly: false,
        startInput: false
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
        labelWidth: "78px", // 标签宽度,可选px值
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
            ...baseWidgetForm,
            {
                name: "step"
            },
            {
                name: "minimum"
            },
            {
                name: "maximum"
            },
            {
                widget: "group",
                inline: true,
                fields: [{
                    name: "readOnly"
                },
                {
                    name: "startInput"
                },]
            },
            {
                widget: "group",
                inline: true,
                fields: [{
                    name: "showStop"
                }, {
                    name: "showInput"
                }]
            },
            {
                name: "showRange"
            }
        ]
    }
}
