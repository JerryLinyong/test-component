export default [
    {
        name: "title", // 对应的schema键值,必选,唯一
    },
    {
        name: "visible",
    },
    {
        name: "enabled",
    },
    {
        widget: "group",
        inline: true,
        fields: [{
            name: "readyOnly",
        },
        {
            name: "showLabel",
        },]
    },
    {
        name: "labelWidth",
    },
    {
        name: "grow",
    },
    {
        name: "name"
    },
]