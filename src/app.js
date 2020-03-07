import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import Home from './pages/mall'
import dva from './config/dva'
import models from './models'
import { Provider } from '@tarojs/redux'

import './styles/base.scss'
import { black } from 'ansi-colors';
import withLogin from './service/WithLogin';
import { logMsg, setSystemInfo } from './utils/utils';
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();
class App extends Component {

  config = {
    pages: [
      'pages/mall/index',
      'pages/home/index',
      'pages/ShopDetail/index',
      'pages/Mine/index',
      'pages/OrderPay/index',
      'pages/OrderList/index',
      'pages/OrderDetail/index',
      'pages/BindMobile/index',
      'pages/Login/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '澳门旅行',
      navigationBarTextStyle: 'black',
      backgroundColor: "#eeeeee",
      backgroundTextStyle: "dark"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/mall/index",
          text: "折扣",
          iconPath: "./images/tab/home.png",
          selectedIconPath: "./images/tab/home-active.png"
        },
        {
          pagePath: "pages/home/index",
          text: "1元",
          iconPath: "./images/tab/cart.png",
          selectedIconPath: "./images/tab/cart-active.png"
        }, {
          pagePath: "pages/Mine/index",
          text: "我的",
          iconPath: "./images/tab/user.png",
          selectedIconPath: "./images/tab/user-active.png"
        }
      ]
    }
  }

  componentDidMount() {
    logMsg('当前环境', Taro.getEnv())
    Taro.getSystemInfo({success:info=>{
      setSystemInfo(info)
    }})
   
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (<Provider store={store}>
      <Home />
    </Provider>);
  }
}

Taro.render(<App />, document.getElementById('app'))
