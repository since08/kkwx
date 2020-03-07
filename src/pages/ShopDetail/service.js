import Request from '../../utils/request';
import api from '../../config/api'

export const detail = (param) => {
  return Request({
    url: `${api.shop_product}/${param.product_id}`,
    method: 'get'
  });
};
