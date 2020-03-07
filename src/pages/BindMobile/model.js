import * as BindMobileApi from './service';

export default {
  namespace: 'BindMobile',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { statusCode, data } = yield call(BindMobileApi.demo, {});
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
