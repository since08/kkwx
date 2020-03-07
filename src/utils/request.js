/**
 *作者：lorne
 *时间：2018/12/3
 *功能：
 */
import Taro from '@tarojs/taro';
import Api from '../config/api';
import { logMsg,showToast, loginUser, toLoginPage } from './utils';

let Headers = {
  'Content-Type': 'application/json',
  'Accept': "*/*"
}

export function setToken(access_token){
  Headers['x-access-token'] = access_token
}

export function delToken(){
  if(Headers.hasOwnProperty("x-access-token")){
     delete Headers['x-access-token']
  }
}

export function get(url,data,resolve,reject) {
  let options = {url,data,resolve,reject,method: 'GET'}
  request(options)
}

export function post(url,data,resolve,reject) {
  let options = {url,data,resolve,reject,method: 'POST'}
  request(options)
}

export default function request (options = { method: 'GET', data: {} }) {
  if (!Api.noConsole) {
    console.log(`${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(options.data)}`);
  }
  return Taro.request({
    url: Api.baseUrl + options.url,
    data: options.data,
    header: Headers,
    method: options.method.toUpperCase(),
  }).then((res) => {

    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (!Api.noConsole) {
        console.log(`${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,res)
      }
      if (data.code === 0) {
        options.resolve && options.resolve(data.data)
      }else{
        logMsg(data.msg)
        Taro.showToast({
          title: `${data.msg}` || data.code,
          icon: 'none',
          duration: 2000
        });
        options.reject && options.reject(res)
      }
      return res;
    } else {
      if(statusCode ===401){
        toLoginPage()
      }
      options.reject && options.reject(res)
      // throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  }).catch(err=>{
    logMsg('请求失败'+process.env.NODE_ENV,err)
    showToast(JSON.stringify(err))
    options.reject && options.reject(err)
  })
}

