import Taro, { Component } from '@tarojs/taro';
import { View, Button, FunctionalPageNavigator } from '@tarojs/components';
import './index.scss';
import { urlEncode, strNotNull, logMsg } from '../../utils/utils';

export default class OrderItem extends Component {

  goOrderDetail(item, e) {
    const { unclick} = this.props;
    if(unclick){
      return;
    }else{
      let url = `/pages/OrderDetail/index?${urlEncode(item)}`
      Taro.navigateTo({ url })
    }
  }

  pay_status=(status)=>{
    if(status === 'unpaid'){
      return '待付款'
    }else if(status === 'paid'){
      return '已付款'
    }else if(status === 'canceled'){
      return '已取消'
    }else if(status === 'completed'){
      return '已完成'
    }
  }

  render() {
    const { item,unclick } = this.props;
    const { created_at, final_price, order_items, order_number, pay_status, refunded_price, shipping_price } = item;

    let item_list = order_items && order_items.map((product, index) => {
      return (
        <View className="list_view" key={index}>
          <Image
            className="list_btn_img"
            src={product.image}
          />
          <View className="list_view_right">
            <View style="flex:1;">
              <Text className="intro_text">{product.title}</Text>
            </View>

            <View className="right_view_middle">
              <Text className="price_text">{`¥${product.price}`}</Text>
              <Text className="origin_price_text">{`¥${product.original_price}`}</Text>
              <View style="display:flex;flex:1;" />
              <Text className="count_text"><Text className="count_text1">X</Text>{product.number}</Text>
            </View>
            <View className="right_view_middle">
              {strNotNull(product.return_status_text) ? <View className="use_btn_view">
                <Text className="use_text">{product.return_status_text}</Text>
              </View> : null}
              <Text className="freight_text">运费：¥{refunded_price}</Text>
            </View>
          </View>

        </View>
      )
    })

    return (<View className="order_list_view"
      onClick={this.goOrderDetail.bind(this, item)}>
      <View className="item_top_view">
        <Text className="text3" style="margin-left:10px;">订单编号：{order_number}</Text>
        <View style="display:flex;flex:1" />
        <Text className="text4" style="margin-right:10px;">{this.pay_status(pay_status)}</Text>
      </View>
      {item_list}

    </View>)
  }

}