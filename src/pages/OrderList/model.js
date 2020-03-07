import * as OrderListApi from './service';

export default {
  namespace: 'OrderList',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { statusCode, data } = yield call(OrderListApi.demo, {});
      if (statusCode === 200 && data){
        yield put({ type: 'save',
        payload: {
          topData: data.data,
        } });
      }
     
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
