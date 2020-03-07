import Request from '../../utils/request';
import api from '../../config/api'

export const getPaids = (data) => {
  return Request({
    url:api.shop_order,
    method: 'get',
    data,
  });
};
