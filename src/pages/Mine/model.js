import * as MineApi from './service';
import { logMsg, setLoginUser } from '../../utils/utils';
import { setToken } from '../../utils/request'
import Taro from '@tarojs/taro';
import { shopOrderList } from '../../service/Mall';

export default {
  namespace: 'Mine',
  state: {
    loginUser: {},
    paidList: []
  },

  effects: {
    * effectsUser(_, { call, put }) {
      logMsg('用户数据', _.loginUser)
      setToken(_.loginUser.access_token)
      setLoginUser(_.loginUser)
      Taro.setStorageSync('loginUser', _.loginUser)
      

      yield put({type:'getPaid'})
      
      yield put({
        type: 'save',
        payload: {
          loginUser: _.loginUser,
        }
      });
    },
    * getPaid(_, { call, put }) {

      let param = {
        status: 'undelivered',
        page: 1,
        page_size: 10
      }
      const {data} = yield call(MineApi.getPaids,param)
      if(data && data.code ===0){
        yield put({
          type: 'save',
          payload: {
            paidList: data.data.items,
          }
        });
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
