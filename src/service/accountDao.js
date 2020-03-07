import { post, setToken } from '../utils/request'
import api from '../config/api'
import { logMsg } from '../utils/utils';
import Taro, { Component } from '@tarojs/taro';
import dva from '../config/dva'

export function userLogin(params, resolve, reject) {
      post(api.user_login, params, ret => {
            resolve(ret)
      }, reject)
}

export function bindMobile(params, resolve, reject,dispatch) {
      post(api.bind_mobile, params, ret => {
            logMsg('手机号绑定', ret)
            const { user_name, access_token,status} = ret;
            if (user_name && access_token) {
                  let login = {
                        status:'login_success',
                        access_token,
                        user:ret
                  }
                  dispatch({ type: 'Mine/effectsUser', loginUser: login })
            }else if( status === 'login_success'){
                  dispatch({ type: 'Mine/effectsUser', loginUser: ret })
            }
            resolve(ret)
      }, reject)
}

export function wxMobileBind(params, resolve, reject) {
      post(api.v_code, params, resolve, reject)
}