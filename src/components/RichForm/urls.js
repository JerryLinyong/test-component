/**
 *
 *  与设备相关的url
 *
 *   getApiUrl("/devices/{sn}").params(sn)
 *
 */

// import { getApiUrl } from '@/utils/api'
// import store from '@/store'

// 上传设备图片的url
export function uploadImgUrl(resourcetype = "", deviceSn = "") {
  // return getApiUrl(
  //   `/statics/images/resource/${resourcetype}/${deviceSn}/upload`
  // );
}

// 获取设备图片的url,不缓存，用于设备图片的更新
export function getImgUrl(type = "", deviceSn = "", randomNum = 0) {
  // return `/${store.getters.app.name}/images/resource/${type}/${deviceSn}.png?randomId=${randomNum}`
}

// 获取设备图片的url,缓存
export function getcachedImgUrl(type = "", deviceSn = "") {
  // return `${process.env.VUE_APP_SERVER_IP}/${store.getters.app.name}/images/resource/${type}/${deviceSn}.png`
}
