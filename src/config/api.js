/**
 *作者：lorne
 *时间：2018/12/3
 *功能：
 */
//test分支用来发布版本
let test=  'http://test.kkapi.deshpro.com/v1/'
//production 用来发布正式生产环境
let production = 'https://kkapi.deshpro.com/v1/'

export default  {
  noConsole:false,
  baseUrl:production,
  shopCategories:'shop/categories',
  one_yuan_buys:'shop/one_yuan_buys',
  shop_product:'shop/products',
  user_login:'weixin/miniprogram/login',
  bind_mobile:'weixin/miniprogram/bind_mobile',
  v_code:'account/v_codes',
  shop_order:'shop/orders',
  new_shop_order:'shop/orders/new',
  mall_list:'shop/products/discounts'

}


function getBaseUrl(type) {
   return type === 'test'?test:production
}

