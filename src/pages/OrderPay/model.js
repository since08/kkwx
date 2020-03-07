import * as OrderPayApi from './service';

export default {
  namespace: 'OrderPay',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { statusCode, data } = yield call(OrderPayApi.demo, {});
      yield put({ type: 'save',
          payload: {
            topData: data,
          } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
