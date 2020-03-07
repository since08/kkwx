import Taro, { Component, getSystemInfo } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtTabs, AtTabsPane, AtModal } from 'taro-ui'
import OrderItem from '../../components/order/OrderItem'
import { logMsg, getSysInfo, urlEncode } from '../../utils/utils';
import { shopOrderList } from '../../service/Mall';


@connect(({ OrderList }) => ({
  ...OrderList,
}))
export default class Orderlist extends Component {

  constructor(props) {
    super(props)
    let params = this.$router.params
    logMsg('参数', params)
    let initTab = parseInt(params.initTab)
    this.state = {
      dfkPage: 1,
      dsyPage: 1,
      ywcPage: 1,
      allPage: 1,
      dfkList: [],
      dsyList: [],
      ywcList: [],
      allList: [],
      currentTab: initTab ? initTab : 0,//代付款 0 待使用 1 已完成 2 全部订单 3
    }
  }

  config = {
    navigationBarTitleText: '订单列表',
  };


  componentDidMount = () => {
    const {currentTab} = this.state
    this.getOrderList(currentTab, 1)
  };

  handleClick(stateName, value) {
    this.setState({
      [stateName]: value
    })
    this.getOrderList(value, 1)
  }



  getOrderList = (tab, page) => {
    let status = 'unpaid'
    let pagekey = 'dfkPage'
    let listkey = 'dfkList'
    switch (tab) {
      case 0:
        status = 'unpaid'
        pagekey = 'dfkPage'
        listkey = 'dfkList'
        break;
      case 1:
        status = 'undelivered'
        pagekey = 'dsyPage'
        listkey = 'dsyList'
        break;
      case 2:
        status = 'completed'
        pagekey = 'ywcPage'
        listkey = 'ywcList'
        break;
      case 3:
        status = ''
        pagekey = 'allPage'
        listkey = 'allList'
        break;
    }
    let param = {
      status,
      page: page,
      page_size: 60
    }
    shopOrderList(param, ret => {
      if (ret && ret.items && ret.items.length > 0) {
       
        let list = []
        if(page>1){
          page++
          list = this.state[listkey].concat(this.state[listkey], ret.items)
        }else{
          list = ret.items
        }
       
        logMsg('订单列表'+listkey, list)
        this.setState({
          [listkey]: list,
          [pagekey]: page
        })
      }

    }, err => {
      logMsg('订单列表', err)
    })
  }

  render() {
    const { currentTab, dfkList, dsyList, ywcList, allList } = this.state;
    const tabList = [{ title: '待付款' }, { title: '待使用' }, { title: '已完成' }, { title: '全部订单' }]

    return (
      <View className="OrderList-page">
        <AtTabs
          current={currentTab}
          tabList={tabList}
          style="width:100%;"
          onClick={this.handleClick.bind(this, 'currentTab')}>
          <AtTabsPane
            current={currentTab}
            index={0} >
            <ScrollView
              scrollY
              style={`height:100vh;`}>
              {dfkList.map((item, index) =>
                (<OrderItem key={`dfk_${index}`}
                  item={item} />))}
              <View style='height:60px' />
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane
            current={currentTab}
            index={1}>
            <ScrollView
              scrollY
              style={`height:100vh;`}>
              {dsyList.map((item, index) =>
                (<OrderItem key={`dsy_${index}`}
                  item={item}  style="width:100%"/>))}

              <View style='height:60px' />
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={2}>
            <ScrollView
              scrollY
              style={`height:100vh;`}>
              {ywcList.map((item, index) =>
                (<OrderItem key={`ywc_${index}`}
                  item={item}  style="width:100%"/>))}

              <View style='height:60px' />
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane
            current={currentTab}
            index={3}>
            <ScrollView
              scrollY
              style={`height:100vh;`}>
              {allList.map((item, index) =>
                (<OrderItem key={`all_${index}`}
                  item={item}  style="width:100%"/>))}

              <View style='height:60px' />
            </ScrollView>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
