/**
 * 页面标签 
 */


export default {
    schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "textarea属性",
        description: "widget property",
        type: "object",
        properties: {
            tabs: {
                type: "array",
                widget: "draggablelist",
                title: "操作区域",
                showLabel: false,
                icon: "el-icon-circle-plus", // 添加图标
                showOperation: true, // 是否显示操作图标
                additionTemplate: { // 添加模板
                    label: "标签页一",
                    name: "1",
                    designId: new Date().getTime().toString(),
                    icon: "",
                    dragIcon: "el-icon-s-operation",
                    lastIcon: "el-icon-remove",
                    fields: []
                }
            },
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
            {
                name: "tabs",
                widget: "draggablelist"
            },
        ]
    }
}
