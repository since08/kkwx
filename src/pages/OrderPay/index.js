import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import right_img from '../../images/mine/right.png'
import { logMsg, mul } from '../../utils/utils';
import { AtInput, AtInputNumber, AtTextarea } from 'taro-ui'
import OrderItem from '../../components/preOrder'
import { createOrder, newOrder } from '../../service/Mall';

@connect(({ OrderPay }) => ({
  ...OrderPay,
}))
export default class Orderpay extends Component {
  config = {
    navigationBarTitleText: '订单付款',
  };
  constructor(props) {
    super(props)

    let product = this.$router.params
    logMsg('参数', product)

    const { price } = product
    this.state = {
      userName: '',
      mobile: '',
      product,
      selectNum: 1,
      truePrice: price,
      memo: ''
    }
  }



  handleNumberChange(stateName, value) {
    const { price } = this.state.product
    let truePrice = mul(value, price)
    this.setState({
      [stateName]: value,
      truePrice: truePrice
    })
  }

  componentDidMount = () => {

    // newOrder(this.getParam())
    try {
      let loginUser = Taro.getStorageSync('loginUser')
      logMsg('登录', loginUser)
      if (loginUser && loginUser.user) {
        let user = loginUser.user
        this.setState({
          userName: user.nick_name,
          mobile: user.mobile
        })
      }
    } catch (error) {

    }
  }

  getParam = ()=>{
    const { product, selectNum, userName, mobile, memo } = this.state
    let params = {
      variants: [
        {
          id: product.id,
          number: selectNum
        }],
      shipping_info: {
        name: userName,
        mobile,
        address:{
          province:'广东省',
          city: '深圳市',
          area: '福田区',
          detail: 'weapp-小程序订单'
        }
      },
      memo,
      deduction: false,
      deduction_numbers: 0
    }
    return params
  }

  onCreateOrder = () => {

    createOrder(this.getParam(), ret => {
      Taro.navigateBack({delta:3})
      Taro.switchTab({url:'/pages/Mine/index'})
      this.props.dispatch({type:'Mine/getPaid'})
    }, err => {
      logMsg("创建订单", err)
    })

  }
  areaMeno(e) {
    this.setState({
      memo: e.target.value
    })
  }

  render() {
    const { userName, mobile, truePrice, product, selectNum, meno } = this.state
    return (
      <View className="OrderPay-page">
        <View className="message_view_top">
          <Text className="left_name2">输入订单信息</Text>
        </View>
        <View className="order_top_view">

          <AtInput
            name='value1'
            title={`姓    名: `}
            type='text'
            placeholder={userName}
            border={true}
          />
          <View style="height:1px;" />
          <AtInput
            name='value2'
            title={`手机号码: `}
            type='number'
            placeholder={mobile}
          />

          <AtTextarea
            style="width:90%"
            className='textarea'
            maxLength={200}
            placeholder='备注...'
            height={'200'}
            onChange={this.areaMeno.bind(this)}
          />

        </View>
        <View className="message_view_top">
          <Text className="left_name2">商品信息</Text>
          <View style="flex:1;" />
          <View className='panel__content' style="margin-right:20px;">
            <View className='example-item'>
              <AtInputNumber size='lg'
                value={meno}
                min={0}
                max={parseInt(product.stock)}
                step={1}
                value={selectNum}
                onChange={this.handleNumberChange.bind(this, 'selectNum')} />
            </View>
          </View>
        </View>
        <OrderItem item={product} />


        <View className="bottom_view">
          <Text className="freight_text2">实付款：</Text>
          <Text className="price_text">{`¥${truePrice}`}</Text>
          <View style='display:flex;flex:1' />
          <View
            onClick={this.onCreateOrder}
            className="pay_view">
            <Text className="pay_text">微信支付</Text>
          </View>
        </View>

      </View>
    )
  }
}
