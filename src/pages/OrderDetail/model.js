import * as OrderDetailApi from './service';

export default {
  namespace: 'OrderDetail',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { statusCode, data } = yield call(OrderDetailApi.demo, {});
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
