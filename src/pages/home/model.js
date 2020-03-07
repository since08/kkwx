import * as homeApi from './service';
import { logMsg } from '../../utils/utils';

export default {
  namespace: 'home',
  state: {
    topData:{}
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(homeApi.demo, {page:1});
      logMsg('Home',data)
      yield put({ type: 'save',
      payload: {
        topData: data,
      } });
    },
  },

  reducers: {
    save(state, { payload }) {
      logMsg('reducers home',state,payload)
      return { ...state, ...payload };
    },
  },

};
