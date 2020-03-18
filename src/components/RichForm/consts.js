
export const FormStatus={
    //----------------- 表单准备阶段-----------------
    inital:0,
    schemaLoading:1,                // 正在加载表单，如加载schema,form等
    formLoading:2,
    valuesLoading:3,                
    loadError:9,                    // 加载出错
    //------------表单提交阶段----------------------
    ready:10,               // 当所有数据均已准备就绪时
    validating:11,          //正在校验中
    submiting:12,           //正在提交中
    error:99,
}