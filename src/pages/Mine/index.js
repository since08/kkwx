import Taro, { Component } from '@tarojs/taro';
import { View, Button, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { logMsg, urlEncode, isObjEmpty, reLogin, setLoginWxCode } from '../../utils/utils';
import right_img from '../../images/mine/right.png'
import img_all from '../../images/mine/all.png'
import img_dgh from '../../images/mine/dgh.png'
import img_dsh from '../../images/mine/dsh.png'
import img_dzf from '../../images/mine/dzf.png'
import OrderItem from '../../components/order/OrderItem'
import { userLogin } from '../../service/accountDao';
import { shopOrderList } from '../../service/Mall';

@connect(({ Mine }) => ({
  ...Mine,
}))
export default class Mine extends Component {


  config = {
    navigationBarTitleText: '我的',
    enablePullDownRefresh: true
  };

  componentDidMount = () => {
    Taro.login({
      success: (res)=> {
        this.code = res.code
      }
    })
  };

  onPullDownRefresh = () => {
    this.props.dispatch({type:'Mine/getPaid'})
  }

  onUserInfo(e) {
     reLogin(e,this.props.dispatch,'mine',this.code)
  }

  onGoOrderList(initTab, e) {
    let url = e.currentTarget.dataset.url + `?${urlEncode({ initTab })}`
    Taro.navigateTo({ url })
  }

  render() {
    const { loginUser, paidList } = this.props
    return (
      <ScrollView scrollY>
        <View className="Mine-page">

          {isObjEmpty(loginUser) ? <Button
            className="mine_top_view"
            openType='getUserInfo'
            onGetUserInfo={this.onUserInfo.bind(this)}>
            <Image
              className="per_image"
              src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
            />
            <Text className="top_name">登录</Text>
            <View style='display:flex;flex:1' />
            <Image
              className="right_image"
              src={right_img}
            />
          </Button> : <Button
            className="mine_top_view"
          >
              <Image
                className="per_image"
                src={loginUser.user && loginUser.user.avatar}
              />
              <Text className="top_name">{loginUser.user && loginUser.user.nick_name}</Text>

            </Button>}


          <View className="mine_orders_view">
            <Text className="order_text">我的订单</Text>
            <View style='display:flex;flex:1' />
            <Text
              data-url='/pages/OrderList/index'
              onClick={this.onGoOrderList.bind(this, 3)}
              className="allOrder_text">查看全部</Text>
            <Image
              className="right_image"
              style="width:10px;height:15px"
              src="../../images/mine/right.png"
            />
          </View>

          <View className="orders_view">
            <View data-url='/pages/OrderList/index'
              onClick={this.onGoOrderList.bind(this, 0)}
              className="order_btn_view" style="margin-left:25px">
              <Image
                className="btn_img"
                src={img_dzf}
              />
              <Text className="btn_text">待付款</Text>
            </View>
            <View
              data-url='/pages/OrderList/index'
              onClick={this.onGoOrderList.bind(this, 1)}
              className="order_btn_view">
              <Image
                className="btn_img"
                src={img_dgh}
              />
              <Text className="btn_text">待使用</Text>
            </View>
            <View
              data-url='/pages/OrderList/index'
              onClick={this.onGoOrderList.bind(this, 2)}
              className="order_btn_view">
              <Image
                className="btn_img"
                src={img_dsh}
              />
              <Text className="btn_text">已完成</Text>
            </View>
            <View
              data-url='/pages/OrderList/index'
              onClick={this.onGoOrderList.bind(this, 3)}
              className="order_btn_view" style="margin-right:25px">
              <Image
                className="btn_img"
                src={img_all}
              />
              <Text className="btn_text">全部订单</Text>
            </View>
          </View>

          <View className="unused_view">
            <Text className="order_text">待使用订单</Text>
          </View>

          {paidList && paidList.map((item, index) => {
            return <OrderItem style="width:100%"
              key={`paid_${index}`}
              item={item} />
          })}
        </View>
      </ScrollView>

    )
  }

  onPay = (e) => {

  }
}
