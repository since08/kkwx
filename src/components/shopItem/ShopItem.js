import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import './index.scss';
import { AtCountDown } from 'taro-ui'
import { logMsg, dateFormat, urlEncode } from '../../utils/utils';


export default class ShopItem extends Component {

  goDetailPage(product_id, e) {
    logMsg(e, product_id)
    let url = e.currentTarget.dataset.url + `?${urlEncode({ product_id })}`
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

  render() {
    let curDate = new Date()
    let curTimes = Math.round(curDate.getTime() / 1000)

    const { icon, title, original_price, price,
      product_id, returnable, saleable_num, sales_volume,
      end_time, begin_time } = this.props.item;
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
        canBuyStr = `距离结束`
      } else {//小于开始时间
        canBuyStr = `距离开始`
        diff = Math.abs(diff1)
      }
    }
    logMsg("当前时间", diff)
    return (<View className="item" data-url="/pages/ShopDetail/index" onClick={this.goDetailPage.bind(this, product_id)}>
      <View className="content">
        <View className="tag_count_down">
          <Text style={"color:#fff;"}>{canBuyStr}</Text>
          <AtCountDown
            style={"color:#fff;"}
            isShowDay
            seconds={diff} />
        </View>

        {/* <View className="tag_shop">
              <Text className="txt">抢购中</Text>
            </View> */}

        <Image className="cover"
          mode="widthFix"
          src={icon} />

        <Text className="title">{title}</Text>

        <View className="line" />
        <View className="info">
          <Text className="price">{`¥ ${price}`}</Text>
          <Text className="price2">{`市价:¥${original_price}`}</Text>
          <View className="space" />
          <Text>{`销售量：${sales_volume}`}</Text>
        </View>
      </View>
    </View>)
  }
}