import * as ShopDetailApi from './service';
import { logMsg } from '../../utils/utils';

export default {
  namespace: 'ShopDetail',
  state: {
    shopDetail: {}
  },

  effects: {
    * detail(_, { call, put }) {
      logMsg('商品详情参数', _)
      const { data, statusCode } = yield call(ShopDetailApi.detail, _.param);
      if (statusCode === 200 && data){
        yield put({
          type: 'save',
          payload: {
            shopDetail: data.data,
          }
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
