import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { logMsg, setLoginUser } from '../../utils/utils';
import ShopItem from '../../components/oneBuy';
import { getOneBuysList } from './service'
import { AtTabs, AtTabsPane } from 'taro-ui'

const baseUrl = 'https://cdn-upyun.deshpro.com/kk/uploads/'
const LOADMORE = "loadmore"
const REFRESH = "refresh"
@connect(({ home }) => ({
  ...home,
}))
export default class Home extends Component {
  config = {
    navigationBarTitleText: '1元购',
    enablePullDownRefresh: true,

  };

  state = {
    goingPage: 1,
    pastPage: 1,
    goingList: [],
    pastList: [],
    currentTab: 0,//going 0 进行中的列表，past 1 往期一元购列表
  }

  curTab = 0;

  banners = [
    {
      src: baseUrl + 'banner/a427450bfd8d9c1aec3147abf07e3ce5.png'
    },
    {
      src: baseUrl + 'banner/59167dc4ba75bac58a393634da809e9e.png'
    },
    {
      src: baseUrl + 'banner/43abd55b90359e10435f943e8a2de67a.png'
    }, {
      src: baseUrl + 'banner/2a614a4f08f35e5468030423267e0b8f.png'
    }, {
      src: baseUrl + 'banner/efa0769a1f697e0bf037bb2971fffe43.png'
    }
  ]

  componentDidMount = () => {
    this.refreshLoad(REFRESH)
    try {
      let loginUser = Taro.getStorageSync('loginUser')
      setLoginUser(loginUser)
      logMsg('登录用户', loginUser)
      if (loginUser && loginUser.user) {
        this.props.dispatch({type:'Mine/effectsUser',loginUser})
      }else{
        Taro.navigateTo({url:'/pages/Login/index'})
      }
    } catch (error) {
    }
  };


  refreshLoad = (pullType) => {

    let { goingPage, goingList, pastList, pastPage } = this.state
    let listType = this.curTab === 1 ? "past" : "going"
    let params = { page: 1, page_size: 20, type: listType }
    if (pullType === LOADMORE) {
      if (listType === 'past') {
        params.page = pastPage
      } else if (listType === "going") {
        params.page = goingPage
      }
    }
    getOneBuysList(params, data => {
      logMsg('一元购数据', data)
      Taro.stopPullDownRefresh()
      if(data && data.items && data.items.length<=0)
      return

      if (params.type === 'going') {
        goingPage++
        let list = data.items
        if (pullType === LOADMORE)
          list = goingList.concat(data.items)
        logMsg('正在进行List', list)
        this.setState({
          goingPage,
          goingList: list
        })
      } else {
        pastPage++
        let list = data.items
        if (pullType === LOADMORE)
          list = pastList.concat(data.items)
        logMsg('往期回顾List', list)
        this.setState({
          pastPage,
          pastList: list
        })
      }
    }, err => {
      logMsg('一元购数据错误', err)
    })
  }



  onPullDownRefresh = () => {
    logMsg('下拉刷新')
    this.refreshLoad(REFRESH)
  }

  onReachBottom = () => {
    logMsg('底部刷新')
    this.refreshLoad(LOADMORE)
  }
  handleClick(stateName, value) {

    this.curTab = value
    this.setState({
      [stateName]: value
    })
    if (this.state.pastList.length === 0)
      this.refreshLoad(REFRESH)
  }

  render() {

    const { currentTab, goingList, pastList } = this.state;
    const tabList = [{ title: '正在进行' }, { title: '往期回顾' }]
    let bannerViews = this.banners.map((item, index) => (<SwiperItem key={`banner_${index}`}>
      <View className="banner">
        <Image className="banner"
          src={item.src} />
      </View>
    </SwiperItem>))
    return (
      <ScrollView
        scrollY
        lowerThreshold={10}
      >
        <View className="home-page">
          {/* <Swiper
            className="banner"
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay>
            {bannerViews}
          </Swiper> */}


          <AtTabs swipeable={false}
            current={currentTab}
            tabList={tabList}
            style="width:100%;"
            onClick={this.handleClick.bind(this, 'currentTab')}>
            <AtTabsPane current={currentTab} index={0} >
              {goingList.length > 0 && goingList.map((item, index) =>
                (<ShopItem
                  style="width:100%;"
                  key={`shop_${index}`}
                  item={item} />))}
            </AtTabsPane>
            <AtTabsPane current={currentTab} index={1}>
              {pastList.length > 0 && pastList.map((item, index) =>
                (<ShopItem
                  style="width:100%;"
                  key={`shop_${index}`}
                  item={item} />))}
            </AtTabsPane>
          </AtTabs>


          <View style="margin-bottom:20px;"></View>
        </View>
      </ScrollView>
    )
  }


}
