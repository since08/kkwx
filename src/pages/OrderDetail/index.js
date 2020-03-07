import Taro, { Component } from '@tarojs/taro';
import { View, Canvas, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import OrderItem from '../../components/order/OrderItem'
import { shopOrderDetail, shopWxPay } from '../../service/Mall';
import { logMsg, convertDate, utcDate, DESHMOBILE } from '../../utils/utils';
import drawQrcode from 'weapp-qrcode'
import Merchant from '../ShopDetail/Merchant';
import { AtButton } from 'taro-ui'

@connect(({ OrderDetail }) => ({
  ...OrderDetail,
}))
export default class Orderdetail extends Component {
  config = {
    navigationBarTitleText: '订单详情',
  };

  state = {
    orderDetail: {}
  }

  componentDidMount = () => {
    let param = this.$router.params
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'OrderQrcode',
      text: `{order_number:${param.order_number}}`
    })
    this.refresh()
  }

  refresh = () => {
    let param = this.$router.params
    shopOrderDetail(param.order_number, ret => {
      logMsg('订单详情', ret);
      this.setState({
        orderDetail: ret
      })
    }, err => {
      logMsg('订单详情', err)
    })
  }

  pay_status = (pay_status) => {
    if (pay_status === 'paid') {
      return '待使用';
    } else if (pay_status === 'unpaid') {
      return '待付款';
    } else if (pay_status === 'compeleted') {
      return '已完成';
    } else if (pay_status === 'cancel') {
      return '已完成';
    } else {
      return pay_status
    }
  }

  onCustomer = () => {
    Taro.makePhoneCall({ phoneNumber: DESHMOBILE })
  }

  pay = () => {
    const { orderDetail } = this.state;
    shopWxPay(orderDetail.order_number, ret => {
      this.refresh()
    })
  }

  render() {
    const { orderDetail } = this.state;
    const { created_at, final_price, order_number, pay_status, address, status, total_price, order_items } = orderDetail;


    let showMerchant = order_items && order_items.length > 0 && order_items[0].merchant
    return (
      <View className="OrderDetail-page">
        <ScrollView scrollY>

          {status === 'paid' ? <View className="erweima_view">
            <Text className="text1">商家扫码</Text>
            <Canvas style="width: 200px; height: 200px;" canvas-id="OrderQrcode"></Canvas>
          </View> : null}

          {showMerchant ? <View className="detail_top_view" style="margin-top:10px;margin-bottom:1px;">
            <Text className="top_text">商家信息</Text>
          </View> : null}
          {showMerchant ? <Merchant merchant={order_items[0].merchant}
            style='width:100%;' /> : null}

          <View className="detail_top_view" style="margin-top:10px;">
            <Text className="top_text">商品信息</Text>
          </View>

          <OrderItem item={orderDetail} unclick={true} />

          <View className="detail_top_view" style="margin-top:10px;">
            <Text className="top_text">订单信息</Text>
          </View>
          <View className="detail_list_view">
            <Text className="detail_text1">订单编号：{order_number}</Text>
            <Text className="detail_text1">下单时间：{utcDate(created_at, 'YYYY年MM月DD日 MM:ss')}</Text>
            <Text className="detail_text1">下单人名：{address.name}</Text>
            <Text className="detail_text1">电话号码：{address.mobile}</Text>
            <Text className="detail_text1">商品金额：¥{total_price}</Text>
            <Text className="detail_text1">实际付款：¥{final_price}</Text>
            <View className="last_detail_view">
              <Text className="detail_text3">使用状态：</Text>
              <Text className="detail_text2">{this.pay_status(pay_status)}</Text>
            </View>
          </View>


          <View style="height:120px;" />
        </ScrollView>


        <View className="btn_view">

          <AtButton className="btn_kf"
            size='small'
            type='primary' onClick={this.onCustomer}>联系客服</AtButton>

          {status === 'unpaid' ? <AtButton size='small'
            className="pay" onClick={this.pay}>微信支付</AtButton> : null}

        </View>
      </View>
    )
  }
}
