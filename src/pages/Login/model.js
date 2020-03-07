import * as LoginApi from './service';

export default {
  namespace: 'Login',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { statusCode, data } = yield call(LoginApi.demo, {});
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
