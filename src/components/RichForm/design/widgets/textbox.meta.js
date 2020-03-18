/**
 * textbox widget 元数据
 */

import baseWidgetSchema from "./baseWidgetSchema"
import baseWidgetValues from "./baseWidgetValues"
import baseWidgetForm from "./baseWidgetForm"

export default {
    schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "textarea属性",
        description: "widget property",
        type: "object",
        properties: {
            ...baseWidgetSchema,
            placeholder: {
                type: "string",
                title: "引导语",
                widget: "textbox",
            },
            // width: {// 作用于value组件的宽度，如果没有指定会自动充满
            //     type: "string",
            //     title: "值宽度",
            //     widget: "textbox",
            //     default: "80%"
            // },
        }
    },
    values: {
        ...baseWidgetValues,
        placeholder: "请输入",
        // width: "80%",
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
                name: "placeholder", // 对应的schema键值,必选,唯一
            },
            // {
            //     name: "width",
            // },
        ]
    }
}
