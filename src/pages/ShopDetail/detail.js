import Taro, { Component } from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { logMsg, isObjEmpty, urlEncode, loginUser, toLoginPage, DESHMOBILE, showToast } from '../../utils/utils'
import classNames from 'classnames';
import default_img from '../../images/mine/default_img.png';
import empty_img from '../../images/mine/empty_ticket.png';
import close_img from '../../images/mine/close.png';
import wxParser from '../../components/wxParser/index'
import Merchant from './Merchant';

export default class Shopdetail extends Component {


      state = {
            index: 0,
            showMore: false,
            isOpened: false
      };

      handleTouchMove = e => {
            e.stopPropagation()
      }

      onPress1 = () => {
            this.setState({
                  isOpened: !this.state.isOpened
            })
      }
      onPress2 = () => {
            this.setState({
                  index: 1
            })
      }



      goOrderPay(title, variants, e) {
            if(this.props.buyStatus && this.props.buyStatus === 'going'){
                  logMsg('是打开肌肤', title, variants)
                  if (loginUser) {
                        if (isObjEmpty(variants)) {
                              showToast('商品录入不完整，缺少规格')
                              return
                        } else {
                              let select = variants[0]
                              select.title = title
                              let url = e.currentTarget.dataset.url + `?${urlEncode(select)}`
                              logMsg('预支付', url)
                              Taro.navigateTo({ url })
                        }
      
                  } else {
                        toLoginPage()
                  }
            }else{
                  showToast('本商品已结束购买')
            }

            

      }

      moreMessage = () => {
            this.setState({
                  showMore: !this.state.showMore
            })
      }

      goBack = () => {
            Taro.navigateBack({ delta: 1 })
      }

      onCustomer = () => {
            Taro.makePhoneCall({ phoneNumber: DESHMOBILE })
      }

      render() {
            const { shopDetail } = this.props;
            const { category_id, description, first_discounts, freight_fee, has_variants,
                  icon, id, images, intro, master, option_types, returnable, title, variants, merchant } = shopDetail.product
            const { original_price, price, stock } = master;

            wxParser.parse({
                  bind: 'richText',
                  html: description,
                  target: this.$scope,
                  enablePreviewImage: true, // 禁用图片预览功能
                  tapLink: (url) => { // 点击超链接时的回调函数
                        // url 就是 HTML 富文本中 a 标签的 href 属性值
                        // 这里可以自定义点击事件逻辑，比如页面跳转
                        wx.navigateTo({
                              url
                        });
                  }
            });

            let bannerViews = images && images.map((item, index) => (<SwiperItem key={`banner_${index}`}>
                  <View className="banner">
                        <Image className="banner"
                              src={item.large} />
                  </View>
            </SwiperItem>));

            let swiper_img = isObjEmpty(images) ? <View className="banner">
                  <Image className="banner"
                        mode='aspectFit'
                        src={empty_img} />
            </View> : <Swiper
                  className="banner"
                  indicatorColor='#999'
                  indicatorActiveColor='#333'
                  circular
                  indicatorDots
                  autoplay>
                        {bannerViews}
                  </Swiper>;



            let select_message = [{}, {}, {}].map((item, index) => {
                  <View className="name1_text_view">
                        <Text className="name1_text">免坐</Text>
                  </View>
            })

            return (
                  <View className="ShopDetail-page">
                        {swiper_img}
                        <View className="detail_view">
                              <Text className="detail_intro">{title}</Text>

                              <View className="info2_view">
                                    <View className="info1_view">
                                          <Text className="price_text">{`¥${price}`}</Text>
                                          <Text className="begin_price" style="margin-left:15px;">{`市价¥${original_price}`}</Text>
                                    </View>

                                    <Text className="saved_text">{`还剩：${stock}份`}</Text>
                              </View>
                        </View>

                        {/* <Text className="main_info">规格选择</Text>

                        <View className="spec_view">
                              <View className="spec1_view" style="margin-right:10px" onClick={this.onPress1}>
                                    <Text className="spec1_text">点击这里弹窗</Text>
                              </View>
                              <View className="spec1_view" onClick={this.onPress2}>
                                    <Text className="spec1_text">进阶版</Text>
                              </View>
                        </View> */}

                        {merchant ? <View className="main_info_view">
                              <Text className="main_info_text">商家信息</Text>
                        </View> : null}
                        {merchant ? <Merchant merchant={merchant}
                              style='width:100%;' /> : null}


                        <Text className="main_info">详细信息</Text>
                
                        <import src="../../components/wxParser/index.wxml" />
                        <view class="wxParser">
                              <template is="wxParser" data="{{wxParserData:richText.nodes}}" />
                        </view>

                        <View className="bottom_view">
                              <View
                                    onClick={this.goBack}
                                    className="btn_view">
                                    <Text className="btn_text">商城首页</Text>
                              </View>
                              <View className="btn_view"
                                    onClick={this.onCustomer}>
                                    <Text className="btn_text">咨询客服</Text>
                              </View>
                              <View data-url='/pages/OrderPay/index'
                                    onClick={this.goOrderPay.bind(this, title, variants)}
                                    className="btn_view  btn3_view">
                                    <Text className="btn_text1">立即购买</Text>
                              </View>
                        </View>

                        {this.state.isOpened ? <View className='at-action-sheet--active'
                              onTouchMove={this.handleTouchMove}>
                              <View onClick={this.onPress1} className='at-action-sheet__overlay' />
                              <View className='at-action-sheet__container'>
                                    <Image className="default_img" src={default_img} />
                                    <View className="top_right_view">
                                          <Text className="top_price_text">3125.0</Text>
                                          <Text className="kucun_text">库存15件</Text>
                                    </View>
                                    <Image onClick={this.onPress1} className="close_img" src={close_img} />
                                    <View style="width:100%;height:2px;background-color:#F3F3F3;margin-top:20px;" />
                                    <Text className="name1_text">阿尔法七座商务车</Text>
                                    <View className="name1_view">
                                          {select_message}
                                    </View>

                                    <View className="confirm_btn">
                                          <Text className="confirm_text">确认</Text>
                                    </View>
                              </View>
                        </View> : null}
                  </View>
            )
      }
}