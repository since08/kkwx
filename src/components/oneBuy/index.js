import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import './index.scss';
import CountDown from '../../components/countdown'
import { logMsg, dateFormat, urlEncode } from '../../utils/utils';
import classnames from 'classnames'

export default class OneBuy extends Component {

      goDetailPage(product_id, one_yuan_buy_status, e) {
            let url = e.currentTarget.dataset.url + `?${urlEncode({product_id,buyStatus:one_yuan_buy_status })}`
            Taro.navigateTo({ url })
      }

      dayHour = (millis) => {
            let minute = 60;
            let hour = minute * 60;
            let day = hour * 24;
            if (millis < 0)
                  return

            let dayC = millis / day
            let hourC = millis / hour
            let minC = millis / minute

            logMsg(`${dayC} 天 ${hour} 时 ${minC} 分`)
      }

      oneBuyStatus = (status) => {

            let str = ''
            switch (status) {
                  case 'unbegin':
                        str = '距离开始'
                        break;
                  case 'end':
                        str = '已结束'
                        break;
                  case 'sell_out':
                        str = '已售罄'
                        break;
                  case 'going':
                        str = '进行中'
                        break;
            }

            return str
      }

      oneBuyStatusBtn = (status) => {

            let str = ''
            switch (status) {
                  case 'unbegin':
                        str = '即将到来'
                        break;
                  case 'end':
                        str = '已结束'
                        break;
                  case 'sell_out':
                        str = '已售罄'
                        break;
                  case 'going':
                        str = '马上抢'
                        break;
            }

            return str
      }

      render() {
            let curDate = new Date()
            let curTimes = Math.round(curDate.getTime() / 1000)

            const { icon, title, original_price, price,
                  product_id, returnable, saleable_num, sales_volume,
                  end_time, begin_time, one_yuan_buy_status } = this.props.item;
            logMsg(`begin_time ${dateFormat(begin_time)}`)
            logMsg(`end_time ${dateFormat(end_time)}`)
            let diff = curTimes - end_time
            let diff1 = curTimes - begin_time

            let canBuyStr = "距离开始"
            if (diff > 0) {//大于结束时间
                  canBuyStr = `已结束`

            } else {//小于结束时间
                  if (diff1 > 0) {//大于开始时间
                        diff = Math.abs(diff)
                        canBuyStr = `进行中`
                  } else {//小于开始时间
                        canBuyStr = `距离开始`
                        diff = Math.abs(diff1)
                  }
            }
            logMsg("当前时间", diff)

            let isRedStyle = one_yuan_buy_status === 'going'

            return (<View className='one-buy'
                  data-url="/pages/ShopDetail/index"
                  onClick={this.goDetailPage.bind(this, product_id, one_yuan_buy_status)}>
                  <Image className="cover"
                        mode="widthFix"
                        src={icon} />

                  <View className="content">
                        <Text className='title'>{title}</Text>

                        {one_yuan_buy_status === 'unbegin' || one_yuan_buy_status === 'going' ?
                              <View className='count-down'>
                                    <Text className='txt1'>{this.oneBuyStatus(one_yuan_buy_status)}</Text>
                                    <CountDown
                                          isShowDay
                                          seconds={diff} />
                              </View> : null}


                        <View style='display:flex;flex:1;' />
                        <View className='price'>
                              <Text className='price1'>{`¥${price}`}</Text>
                              <Text className='price2'>{`市价:¥${original_price}`}</Text>
                              <View style='display:flex;flex:1;' />
                              <View className={isRedStyle?'btn1':'btn2'}>
                                    <Text className={isRedStyle?'btn1-name':'btn2-name'}>{this.oneBuyStatusBtn(one_yuan_buy_status)}</Text>
                              </View>

                        </View>

                  </View>
            </View>)
      }

}