import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { logMsg, strNotNull, urlEncode } from '../../utils/utils';
import { getMallList } from '../../service/Mall';
import default_img from '../../images/mine/empty_ticket.png';

const baseUrl = 'https://cdn-upyun.deshpro.com/kk/uploads/'
const LOADMORE = "loadmore"
const REFRESH = "refresh"
@connect(({ mall }) => ({
  ...mall,
}))
export default class mall extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mall_list: [],
      page: 1,
    }
  }

  config = {
    navigationBarTitleText: "折扣",
    enablePullDownRefresh: true
  };

  componentDidMount = () => {

    this.refreshLoad(REFRESH)
  }

  refreshLoad = (pullType) => {
    let { mall_list, page } = this.state

    page = pullType === REFRESH ? 1 : page
    let params = { page, page_size: 20 }

    getMallList(params, ret => {
      Taro.stopPullDownRefresh()
      if (ret && ret.items && ret.items.length > 0) {
        page++
        let list = ret.items
        if (pullType === LOADMORE)
          list = mall_list.concat(ret.items)
        logMsg("商品折扣列表：", list)

        this.setState({
          mall_list: list,
          page
        })
      }

    })
  }

  toLogin = () => {
    Taro.navigateTo({ url: '/pages/Login/index' })
  }

  onPullDownRefresh = () => {
    logMsg('下拉刷新')
    this.refreshLoad(REFRESH)
  }

  onReachBottom = () => {
    logMsg('底部刷新')
    this.refreshLoad(LOADMORE)
  }

  goDetailPage(product_id, e) {
    logMsg(e, product_id)
    let url = e.currentTarget.dataset.url + `?${urlEncode({ product_id,buyStatus:'going' })}`
    Taro.navigateTo({ url })
  }

  render() {
    const { mall_list } = this.state;
    return (
      <ScrollView
        scrollY
      >
        <View className="home-page">

          {mall_list.map((item, index) => {
            const { all_stock, category_id, sales_volume, icon, id, intro, original_price, price, returnable, title } = item;
            return (
              <View
                data-url="/pages/ShopDetail/index"
                onClick={this.goDetailPage.bind(this, id)}
                key={index}
                className="item">

                {/* <View className="tag_count_down">
              <Text className="txt">10:35:09</Text>
            </View> */}

                {returnable ? <View className="tag_shop">
                  <Text className="txt">抢购中</Text>
                </View> : <View />}

                <Image className="cover"
                  mode="widthFix"
                  src={strNotNull(icon) ? icon : default_img} />

                <Text className="title">{`${title}\n${intro}`}</Text>

                <View className="line" />
                <View className="info">
                  <Text className="price">¥ {price}</Text>
                  <Text className="price2">市价:¥{original_price}</Text>
                  <View className="space" />
                  {sales_volume?<Text style='font-size:14px;color:#666;'>已卖：{sales_volume}</Text>:null}
                  
                </View>
              </View>
            )
          })}

          <View style="margin-bottom:20px;"></View>
        </View>
      </ScrollView>
    )
  }


}
