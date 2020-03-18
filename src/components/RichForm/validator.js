import Ajv from 'ajv'
import ajvI18n from 'ajv-i18n'
// import store from '@/store'

// 将语言名称统一处理
const langMap = {
  'zh-cn': 'zh'
}

export const localize = function(errors) {
  // let curLang = (store.getters.my.language || 'en').toLowerCase()
  let curLang = 'en'
  // 由于ajv的语言名称与全局语言模块所使用的名称略有差别，因此需要做一下更名处理
  if (curLang in langMap) curLang = langMap[curLang]
  try {
    return ajvI18n[curLang](errors)
  } catch (e) {
    return ajvI18n.en(errors)
  }
}


//创建AJV实例
let ajv = new Ajv({ 
    useDefaults: true,//校验时会自动填入缺省值
    coerceTypes: true,//强制类型转换，如type="boolean"，而value="其他类型"，会被转换为boolean，
    allErrors:true
})
//本地化处理，使得ajv进行校验时可以提供本地化错误信息
ajv.localize=localize


export default ajv