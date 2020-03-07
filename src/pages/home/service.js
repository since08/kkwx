import Request,{get} from '../../utils/request';
import api from '../../config/api'

export function getOneBuysList(params,resolve,reject){
  get(api.one_yuan_buys,params,ret=>{
    resolve && resolve(ret)
  },err=>{
    reject && reject(err)
  })
}

export const demo = (data) => {
  return Request({
    url: api.shopCategories,
    method: 'get',
    data,
  });
};
